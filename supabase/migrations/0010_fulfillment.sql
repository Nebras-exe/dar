-- Athathi — Phase 11A: Order Fulfillment + Supplier Acceptance.
-- Fulfillment is a SEPARATE domain from order status (Phase 10A) and payment
-- status (Phase 10B) — the three never collapse into one field (§4). A PAID order
-- hands off to its suppliers; EACH order_group carries its OWN fulfillment (§6),
-- so a multi-supplier order can have supplier A `accepted` while B is still
-- `awaiting_supplier`. A fulfillment REFERENCES the immutable order_group snapshot
-- (order_group_id) — it never re-reads current catalog pricing (§8/§24). Every
-- change appends an auditable event (§9); status is never silently rewritten.
-- Detailed manufacturing / delivery is intentionally OUT of scope (Phase 11B).

do $$ begin
  create type fulfillment_status as enum
    ('awaiting_supplier','accepted','preparing','ready_for_next_stage','declined','cancelled');
  create type fulfillment_decline_reason as enum
    ('unable_to_fulfill','inventory_issue','capacity_issue','delivery_issue','other');
  create type fulfillment_event_type as enum
    ('order_paid','supplier_notified','accepted','declined','preparing_started','ready_for_next_stage','cancelled');
  create type fulfillment_actor_role as enum ('supplier','customer','system');
exception when duplicate_object then null; end $$;

-- ── fulfillments (one per order_group; paid-order handoff) ────────────────────
create table if not exists fulfillments (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references orders(id)       on delete cascade,
  -- The immutable snapshot the fulfillment is bound to (§8). One fulfillment/group.
  order_group_id      uuid not null references order_groups(id) on delete cascade,
  supplier_id         uuid not null references suppliers(id),
  customer_id         uuid not null references auth.users(id)   on delete cascade,
  order_source        order_source not null,
  status              fulfillment_status not null default 'awaiting_supplier',
  accepted_at         timestamptz,
  declined_at         timestamptz,
  decline_reason      fulfillment_decline_reason,
  -- Supplier/ops-only — NEVER shown to the customer (§12). Customer sees the reason enum.
  decline_internal_note text,
  is_demo             boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  -- One fulfillment per supplier group (idempotent creation).
  unique (order_group_id)
);
create trigger trg_fulfillments_updated before update on fulfillments
  for each row execute function set_updated_at();
create index if not exists idx_fulfillments_order    on fulfillments(order_id);
create index if not exists idx_fulfillments_supplier on fulfillments(supplier_id);
create index if not exists idx_fulfillments_customer on fulfillments(customer_id);

-- Guard: a fulfillment may only exist for a PAID order (§4/§30). Enforced in the
-- app layer + this constraint trigger (defence in depth; the client can't bypass).
create or replace function assert_order_paid() returns trigger as $$
begin
  if not exists (
    select 1 from payment_intents pi
    where pi.order_id = new.order_id and pi.status = 'paid'
  ) then
    raise exception 'fulfillment requires a paid order (order_id=%)', new.order_id;
  end if;
  return new;
end $$ language plpgsql;
create trigger trg_fulfillments_require_paid before insert on fulfillments
  for each row execute function assert_order_paid();

-- ── fulfillment_events (append-only audit history) — §9 ──────────────────────
create table if not exists fulfillment_events (
  id              uuid primary key default gen_random_uuid(),
  fulfillment_id  uuid not null references fulfillments(id) on delete cascade,
  type            fulfillment_event_type not null,
  actor_role      fulfillment_actor_role not null,
  actor_id        uuid,
  -- Safe note only (e.g. a decline-reason key). Never the internal decline note.
  note            text,
  at              timestamptz not null default now(),
  -- Each lifecycle event type occurs at most once per fulfillment (dedupe / idempotency, §35).
  unique (fulfillment_id, type)
);
create index if not exists idx_fulfillment_events_fulfillment on fulfillment_events(fulfillment_id);

-- ── FUTURE (documented, NOT built): manufacturing_jobs, quality_checks,
--    deliveries. `ready_for_next_stage` is the seam to Phase 11B — a terminal
--    state here that never regresses (§15/§16).
