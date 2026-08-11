-- Athathi — Phase 12: Delivery + Installation + Tracking.
-- Delivery is the operational continuation of the pipeline — a FIFTH SEPARATE
-- domain from order · payment · fulfillment · manufacturing status (§4). A
-- supplier group enters delivery only when genuinely ready (§5): a CUSTOM group
-- when its manufacturing job is `ready_for_delivery`, a READY-STOCK catalog group
-- when its fulfillment is `ready_for_next_stage` (ready-stock is never forced
-- through manufacturing). Each order_group has its OWN delivery (§9). The delivery
-- carries an IMMUTABLE SNAPSHOT of the order's delivery address (§10). Events +
-- attempts are append-only (§8/§19). NO real courier / GPS (§16/§28) — assignment
-- is a labelled demo team. This phase ends at `completed`.

do $$ begin
  create type delivery_status as enum
    ('awaiting_schedule','scheduled','assigned','out_for_delivery','delivered','delivery_failed','reschedule_required','cancelled','completed');
  create type installation_status as enum
    ('not_required','awaiting_schedule','scheduled','in_progress','completed','issue');
  create type delivery_slot_period as enum ('morning','afternoon','evening');
  create type delivery_event_type as enum
    ('delivery_ready','slot_selected','delivery_scheduled','assigned','out_for_delivery','delivery_attempt_failed','rescheduled','delivered','installation_scheduled','installation_started','installation_completed','installation_issue','handover_confirmed','completed','cancelled');
  create type delivery_actor_role as enum ('supplier','customer','system');
  create type delivery_failure_reason as enum
    ('customer_unavailable','incorrect_address','access_issue','vehicle_issue','item_issue','other');
  create type installation_issue_category as enum
    ('missing_component','damage_found','fit_issue','customer_request','other');
exception when duplicate_object then null; end $$;

-- ── deliveries (one per order_group; references the ready group + address snapshot)
create table if not exists deliveries (
  id                    uuid primary key default gen_random_uuid(),
  order_id              uuid not null references orders(id)        on delete cascade,
  order_group_id        uuid not null references order_groups(id)  on delete cascade,
  fulfillment_id        uuid not null references fulfillments(id)  on delete cascade,
  -- Present only for custom groups; catalog groups deliver straight off fulfillment.
  manufacturing_job_id  uuid references manufacturing_jobs(id)     on delete set null,
  supplier_id           uuid not null references suppliers(id),
  customer_id           uuid not null references auth.users(id)    on delete cascade,
  status                delivery_status not null default 'awaiting_schedule',
  -- IMMUTABLE address snapshot (§10) — never follows later account-address edits.
  address               jsonb not null,
  installation_required boolean not null default false,
  installation_status   installation_status not null default 'not_required',
  -- Chosen demo delivery window.
  slot_date             date,
  slot_period           delivery_slot_period,
  -- Clearly-labelled DEMO assignment (§15) — never a real driver identity.
  assignee_name         text,
  assignment_is_demo    boolean not null default true,
  delivered_at          timestamptz,
  completed_at          timestamptz,
  is_demo               boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (order_group_id)
);
create trigger trg_deliveries_updated before update on deliveries
  for each row execute function set_updated_at();
create index if not exists idx_deliveries_order    on deliveries(order_id);
create index if not exists idx_deliveries_supplier on deliveries(supplier_id);
create index if not exists idx_deliveries_customer on deliveries(customer_id);

-- Guard: a delivery may only be created for a group that is genuinely READY (§5).
-- Custom → its manufacturing job is ready_for_delivery; catalog → its fulfillment
-- is ready_for_next_stage. Defence in depth beyond the app layer.
create or replace function assert_delivery_eligible() returns trigger as $$
declare v_is_custom boolean;
begin
  select exists (
    select 1 from order_items oi where oi.group_id = new.order_group_id and oi.kind = 'custom'
  ) into v_is_custom;

  if v_is_custom then
    if not exists (
      select 1 from manufacturing_jobs j
      where j.order_group_id = new.order_group_id and j.status = 'ready_for_delivery'
    ) then
      raise exception 'custom delivery requires manufacturing ready_for_delivery (group=%)', new.order_group_id;
    end if;
  else
    if not exists (
      select 1 from fulfillments f
      where f.order_group_id = new.order_group_id and f.status = 'ready_for_next_stage'
    ) then
      raise exception 'catalog delivery requires fulfillment ready_for_next_stage (group=%)', new.order_group_id;
    end if;
  end if;
  return new;
end $$ language plpgsql;
create trigger trg_deliveries_eligible before insert on deliveries
  for each row execute function assert_delivery_eligible();

-- ── delivery_events (append-only audit history) — §8 ─────────────────────────
create table if not exists delivery_events (
  id           uuid primary key default gen_random_uuid(),
  delivery_id  uuid not null references deliveries(id) on delete cascade,
  type         delivery_event_type not null,
  actor_role   delivery_actor_role not null,
  actor_id     uuid,
  -- Safe note only (slot period / failure-reason key). Never a raw internal note.
  note         text,
  at           timestamptz not null default now()
);
create index if not exists idx_delivery_events_delivery on delivery_events(delivery_id);

-- ── delivery_attempts (preserved across reschedules; failed attempts kept) — §19
create table if not exists delivery_attempts (
  id           uuid primary key default gen_random_uuid(),
  delivery_id  uuid not null references deliveries(id) on delete cascade,
  outcome      text not null check (outcome in ('delivered','failed')),
  reason       delivery_failure_reason,
  at           timestamptz not null default now()
);
create index if not exists idx_delivery_attempts_delivery on delivery_attempts(delivery_id);

-- ── installations (lightweight — one row per delivery that requires it) — §21 ─
create table if not exists installations (
  id           uuid primary key default gen_random_uuid(),
  delivery_id  uuid not null references deliveries(id) on delete cascade,
  status       installation_status not null default 'awaiting_schedule',
  slot_date    date,
  slot_period  delivery_slot_period,
  scheduled_at timestamptz,
  started_at   timestamptz,
  completed_at timestamptz,
  unique (delivery_id)
);

-- ── installation_events / issues (supplier-only description text) — §23 ──────
create table if not exists installation_events (
  id              uuid primary key default gen_random_uuid(),
  installation_id uuid not null references installations(id) on delete cascade,
  category        installation_issue_category,
  -- Supplier/ops-only description — customers never read this (§23).
  description     text,
  at              timestamptz not null default now()
);
create index if not exists idx_installation_events_install on installation_events(installation_id);

-- ── FUTURE (documented, NOT built): real courier/logistics providers, driver
--    assignment, GPS tracking, delivery proof. `completed` is terminal here; a
--    real DeliveryProvider adapter + tracking is a later phase (§16/§28).
