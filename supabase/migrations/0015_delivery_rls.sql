-- Athathi — Phase 12 Delivery + Installation Row Level Security (§33/§34/§35).
-- The owning CUSTOMER may READ delivery/installation status for their own order
-- and may set only the delivery WINDOW (slot) on their own delivery — never the
-- operational status (§33). A SUPPLIER MEMBER may READ and UPDATE ONLY deliveries
-- of their OWN supplier group — supplier A can never read or mutate supplier B's
-- delivery, including the customer phone/address snapshot on it (§35). Events +
-- attempts are append-only (no update/delete → default deny). Installation issue
-- descriptions are supplier-only. Public: no access.

alter table deliveries          enable row level security;
alter table delivery_events     enable row level security;
alter table delivery_attempts   enable row level security;
alter table installations       enable row level security;
alter table installation_events enable row level security;

-- Is the current user a member of the supplier that owns this delivery?
create or replace function is_delivery_supplier(p_delivery_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from deliveries d
    join supplier_members m on m.supplier_id = d.supplier_id
    where d.id = p_delivery_id and m.user_id = auth.uid()
  );
$$;

-- ── deliveries ────────────────────────────────────────────────────────────────
-- Customer: READ own only.
create policy deliveries_customer_read on deliveries for select
  using (customer_id = auth.uid());

-- Customer: UPDATE own only, restricted to the slot columns at the app layer
-- (the customer picks a window; operational status stays supplier-driven, §33).
create policy deliveries_customer_slot_update on deliveries for update
  using (customer_id = auth.uid())
  with check (customer_id = auth.uid());

-- Supplier member: READ own supplier's deliveries (incl. the address snapshot).
create policy deliveries_supplier_read on deliveries for select
  using (exists (
    select 1 from supplier_members m
    where m.supplier_id = deliveries.supplier_id and m.user_id = auth.uid()
  ));

-- Supplier member: UPDATE + INSERT only their own supplier's delivery. The
-- eligibility trigger (0014) still gates inserts. supplier_id pinned by check.
create policy deliveries_supplier_update on deliveries for update
  using (exists (
    select 1 from supplier_members m
    where m.supplier_id = deliveries.supplier_id and m.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from supplier_members m
    where m.supplier_id = deliveries.supplier_id and m.user_id = auth.uid()
  ));
create policy deliveries_supplier_insert on deliveries for insert
  with check (exists (
    select 1 from supplier_members m
    where m.supplier_id = deliveries.supplier_id and m.user_id = auth.uid()
  ));

-- ── delivery_events / attempts (read = parent readers; write = owning supplier)
create policy delivery_events_read on delivery_events for select
  using (
    exists (select 1 from deliveries d where d.id = delivery_events.delivery_id and d.customer_id = auth.uid())
    or is_delivery_supplier(delivery_events.delivery_id)
  );
create policy delivery_events_supplier_insert on delivery_events for insert
  with check (is_delivery_supplier(delivery_events.delivery_id));

create policy delivery_attempts_read on delivery_attempts for select
  using (
    exists (select 1 from deliveries d where d.id = delivery_attempts.delivery_id and d.customer_id = auth.uid())
    or is_delivery_supplier(delivery_attempts.delivery_id)
  );
create policy delivery_attempts_supplier_insert on delivery_attempts for insert
  with check (is_delivery_supplier(delivery_attempts.delivery_id));

-- ── installations (read = parent readers; write = owning supplier) ───────────
create policy installations_read on installations for select
  using (
    exists (select 1 from deliveries d where d.id = installations.delivery_id and d.customer_id = auth.uid())
    or is_delivery_supplier(installations.delivery_id)
  );
create policy installations_supplier_write on installations for all
  using (is_delivery_supplier(installations.delivery_id))
  with check (is_delivery_supplier(installations.delivery_id));

-- ── installation_events (supplier-only: internal issue descriptions) — §23 ───
create policy installation_events_supplier_all on installation_events for all
  using (exists (
    select 1 from installations i where i.id = installation_events.installation_id and is_delivery_supplier(i.delivery_id)
  ))
  with check (exists (
    select 1 from installations i where i.id = installation_events.installation_id and is_delivery_supplier(i.delivery_id)
  ));

-- No update/delete policy on delivery_events / delivery_attempts → append-only
-- (tracking history is never silently overwritten, §8/§19).
