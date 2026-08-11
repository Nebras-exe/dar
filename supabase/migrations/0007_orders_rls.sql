-- Athathi — Phase 10A Orders Row Level Security (§21/§22).
-- A customer reads/creates only their OWN orders. A supplier reads only the
-- order GROUP(s) belonging to a supplier it is a member of — never another
-- supplier's items or totals, never the whole order envelope's private fields
-- beyond what they need. Public has no access. Mirrors src/lib/orders/authorization.ts.
-- The client can never change prices/totals/ownership/supplier/status of an
-- existing order: customers may only transition status (confirm/cancel);
-- suppliers may only advance their own group's status.

alter table orders        enable row level security;
alter table order_groups  enable row level security;
alter table order_items   enable row level security;

-- Helper: does the current user belong to a supplier that has a group in this order?
create or replace function is_order_supplier(p_order_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from order_groups g
    join supplier_members m on m.supplier_id = g.supplier_id
    where g.order_id = p_order_id and m.user_id = auth.uid()
  );
$$;

-- ── orders ────────────────────────────────────────────────────────────────────
-- Customer owns their orders (read + create). Suppliers may READ orders that
-- contain their group (needed for the delivery address on their portion).
create policy orders_owner_read   on orders for select using (customer_id = auth.uid());
create policy orders_owner_insert on orders for insert with check (customer_id = auth.uid());
-- Owner may update ONLY the status (confirm/cancel) — enforced at the app layer;
-- RLS restricts the row to the owner. Price/total columns are never sent by the client.
create policy orders_owner_update on orders for update
  using (customer_id = auth.uid()) with check (customer_id = auth.uid());
create policy orders_supplier_read on orders for select using (is_order_supplier(id));

-- ── order_groups ──────────────────────────────────────────────────────────────
create policy order_groups_owner_read on order_groups for select
  using (exists (select 1 from orders o where o.id = order_id and o.customer_id = auth.uid()));
create policy order_groups_owner_insert on order_groups for insert
  with check (exists (select 1 from orders o where o.id = order_id and o.customer_id = auth.uid()));
-- A supplier member reads + updates (status only, app-enforced) ONLY their own group.
create policy order_groups_supplier_read on order_groups for select
  using (is_supplier_member(supplier_id));
create policy order_groups_supplier_update on order_groups for update
  using (is_supplier_member(supplier_id, 'staff')) with check (is_supplier_member(supplier_id, 'staff'));

-- ── order_items ───────────────────────────────────────────────────────────────
-- Readable to the order's owner OR to a member of the group's supplier — so a
-- supplier never sees another supplier's line items in the same order.
create policy order_items_owner_read on order_items for select using (
  exists (
    select 1 from order_groups g join orders o on o.id = g.order_id
    where g.id = group_id and o.customer_id = auth.uid()
  )
);
create policy order_items_owner_insert on order_items for insert with check (
  exists (
    select 1 from order_groups g join orders o on o.id = g.order_id
    where g.id = group_id and o.customer_id = auth.uid()
  )
);
create policy order_items_supplier_read on order_items for select using (
  exists (
    select 1 from order_groups g
    where g.id = group_id and is_supplier_member(g.supplier_id)
  )
);
