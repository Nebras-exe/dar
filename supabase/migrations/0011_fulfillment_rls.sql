-- Athathi — Phase 11A Fulfillment Row Level Security (§26/§27/§28).
-- The owning CUSTOMER may READ their order's fulfillment (never write — §28). A
-- SUPPLIER MEMBER may READ and UPDATE ONLY fulfillments of their OWN supplier
-- groups — supplier A can never read or mutate supplier B's fulfillment (§26).
-- Events are visible to whoever may read the parent fulfillment; the internal
-- decline note column is never selected for a customer (app layer). Public: none.
-- The client can never set status/ownership arbitrarily — the server transitions
-- status via the fulfillment status machine, and inserts require a PAID order.

alter table fulfillments        enable row level security;
alter table fulfillment_events  enable row level security;

-- Is the current user a member of the supplier that owns this fulfillment?
create or replace function is_fulfillment_supplier(p_fulfillment_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from fulfillments f
    join supplier_members m on m.supplier_id = f.supplier_id
    where f.id = p_fulfillment_id and m.user_id = auth.uid()
  );
$$;

-- ── fulfillments ──────────────────────────────────────────────────────────────
-- Customer: READ own only (no write — fulfillment is supplier-driven, §28).
create policy fulfillments_customer_read on fulfillments for select
  using (customer_id = auth.uid());

-- Supplier member: READ own supplier's fulfillments.
create policy fulfillments_supplier_read on fulfillments for select
  using (exists (
    select 1 from supplier_members m
    where m.supplier_id = fulfillments.supplier_id and m.user_id = auth.uid()
  ));

-- Supplier member: UPDATE only their own supplier's fulfillment (accept/decline/
-- prepare/ready). The supplier_id itself may not be reassigned (with check pins it).
create policy fulfillments_supplier_update on fulfillments for update
  using (exists (
    select 1 from supplier_members m
    where m.supplier_id = fulfillments.supplier_id and m.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from supplier_members m
    where m.supplier_id = fulfillments.supplier_id and m.user_id = auth.uid()
  ));

-- Insert: only a member of the group's supplier may create the fulfillment, and
-- the paid-order trigger (0010) still gates it. Customers cannot insert (§28).
create policy fulfillments_supplier_insert on fulfillments for insert
  with check (exists (
    select 1 from supplier_members m
    where m.supplier_id = fulfillments.supplier_id and m.user_id = auth.uid()
  ));

-- ── fulfillment_events ───────────────────────────────────────────────────────
-- Read: anyone who may read the parent fulfillment (customer OR its supplier).
create policy fulfillment_events_read on fulfillment_events for select
  using (
    exists (select 1 from fulfillments f where f.id = fulfillment_events.fulfillment_id and f.customer_id = auth.uid())
    or is_fulfillment_supplier(fulfillment_events.fulfillment_id)
  );

-- Write: only the owning supplier's members append events (mirrors status writes).
create policy fulfillment_events_supplier_insert on fulfillment_events for insert
  with check (is_fulfillment_supplier(fulfillment_events.fulfillment_id));

-- Events are append-only: no update/delete policy → default deny (no silent rewrite, §9).
