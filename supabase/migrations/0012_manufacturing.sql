-- Athathi — Phase 11B: Custom Manufacturing + Quality Check.
-- Manufacturing is the CUSTOM-furniture continuation of fulfillment (Phase 11A):
-- a job exists ONLY for a custom order_group whose fulfillment reached
-- `ready_for_next_stage` (§4/§22). Ready-stock catalog groups NEVER get a job. A
-- job manufactures from the ACCEPTED, immutable order-group snapshot — it
-- REFERENCES it (order_id + order_group_id + fulfillment_id) and never duplicates
-- or mutates the spec (§7/§8). Events + QC attempts are append-only; a failed
-- inspection is never overwritten (§17/§18). Phase 11B ends at
-- `ready_for_delivery` — no courier/tracking/installation (§19, Phase 12).

do $$ begin
  create type manufacturing_status as enum
    ('not_started','manufacturing','manufacturing_completed','quality_check','qc_passed','qc_failed','rework','ready_for_delivery');
  create type manufacturing_event_type as enum
    ('created','manufacturing_started','milestone_reached','manufacturing_completed','qc_started','qc_passed','qc_failed','rework_started','rework_completed','ready_for_delivery');
  create type manufacturing_actor_role as enum ('supplier','system');
  create type quality_check_status as enum ('pending','passed','failed');
  create type quality_issue_category as enum
    ('dimensions','material','colour','finish','construction','damage','missing_component','customization_mismatch','other');
  create type quality_issue_severity as enum ('minor','major');
exception when duplicate_object then null; end $$;

-- ── manufacturing_jobs (one per CUSTOM order_group; references the snapshot) ──
create table if not exists manufacturing_jobs (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references orders(id)        on delete cascade,
  order_group_id  uuid not null references order_groups(id)  on delete cascade,
  fulfillment_id  uuid not null references fulfillments(id)  on delete cascade,
  supplier_id     uuid not null references suppliers(id),
  customer_id     uuid not null references auth.users(id)    on delete cascade,
  status          manufacturing_status not null default 'not_started',
  -- Manufacturing estimate (days) copied from the accepted quote for display only.
  estimate_days   int,
  -- Supplier-entered production milestones (genuine, not a fake %). §12.
  milestones      text[] not null default '{}',
  is_demo         boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- One manufacturing job per supplier group.
  unique (order_group_id)
);
create trigger trg_manufacturing_jobs_updated before update on manufacturing_jobs
  for each row execute function set_updated_at();
create index if not exists idx_mfg_jobs_order    on manufacturing_jobs(order_id);
create index if not exists idx_mfg_jobs_supplier on manufacturing_jobs(supplier_id);
create index if not exists idx_mfg_jobs_customer on manufacturing_jobs(customer_id);

-- Guard: a job may only exist for a CUSTOM group whose fulfillment is
-- ready_for_next_stage (§4). Defence in depth beyond the app layer.
create or replace function assert_custom_and_ready() returns trigger as $$
begin
  if not exists (
    select 1 from fulfillments f
    join order_items oi on oi.group_id = f.order_group_id
    where f.id = new.fulfillment_id
      and f.order_group_id = new.order_group_id
      and f.status = 'ready_for_next_stage'
      and oi.kind = 'custom'
  ) then
    raise exception 'manufacturing job requires a custom, ready_for_next_stage fulfillment (group=%)', new.order_group_id;
  end if;
  return new;
end $$ language plpgsql;
create trigger trg_manufacturing_jobs_gate before insert on manufacturing_jobs
  for each row execute function assert_custom_and_ready();

-- ── manufacturing_events (append-only audit history) — §9 ────────────────────
create table if not exists manufacturing_events (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references manufacturing_jobs(id) on delete cascade,
  type        manufacturing_event_type not null,
  actor_role  manufacturing_actor_role not null,
  actor_id    uuid,
  -- Safe note only (e.g. a milestone key). Never a raw internal note.
  note        text,
  at          timestamptz not null default now()
);
create index if not exists idx_mfg_events_job on manufacturing_events(job_id);

-- ── quality_checks (append-only attempts; QC #1, QC #2, … preserved) — §18 ───
create table if not exists quality_checks (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references manufacturing_jobs(id) on delete cascade,
  attempt     int not null check (attempt >= 1),
  status      quality_check_status not null default 'pending',
  -- Which structured criteria the inspector confirmed (jsonb of criterion→bool).
  checklist   jsonb not null default '{}'::jsonb,
  by_role     manufacturing_actor_role not null,
  by_id       uuid,
  started_at  timestamptz not null default now(),
  decided_at  timestamptz,
  -- Each attempt number occurs at most once per job (dedupe / no overwrite).
  unique (job_id, attempt)
);
create index if not exists idx_quality_checks_job on quality_checks(job_id);

-- ── quality_issues (structured issues attached to a failed QC attempt) — §16 ──
create table if not exists quality_issues (
  id              uuid primary key default gen_random_uuid(),
  quality_check_id uuid not null references quality_checks(id) on delete cascade,
  category        quality_issue_category not null,
  severity        quality_issue_severity not null,
  -- Supplier-side technical description — the customer sees only a safe status (§18/§20).
  description     text not null,
  created_at      timestamptz not null default now()
);
create index if not exists idx_quality_issues_qc on quality_issues(quality_check_id);

-- ── FUTURE (documented, NOT built): deliveries, installations, tracking.
--    `ready_for_delivery` is the seam to Phase 12 — a terminal state here that
--    never regresses (§6/§19).
