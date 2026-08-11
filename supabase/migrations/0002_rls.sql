-- Athathi — Phase 08 Row Level Security (§28/§29).
-- Principle: the database enforces isolation; hiding buttons is never the only
-- defence. Public users read only ACTIVE products/suppliers. A user owns only
-- their own profile/favourites/rooms/designs. Supplier members manage ONLY their
-- own supplier's data — Supplier A can never touch Supplier B.

-- ── Helper: is the current user a member of a supplier (≥ a min role)? ────────
create or replace function is_supplier_member(p_supplier_id uuid, p_min_role supplier_member_role default 'staff')
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from supplier_members m
    where m.supplier_id = p_supplier_id
      and m.user_id = auth.uid()
      and (case m.role when 'owner' then 3 when 'manager' then 2 else 1 end)
          >= (case p_min_role when 'owner' then 3 when 'manager' then 2 else 1 end)
  );
$$;

-- ── Helper: does the current user manage the supplier that owns a product? ────
create or replace function can_manage_product(p_product_id uuid, p_min_role supplier_member_role default 'staff')
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from products p
    where p.id = p_product_id and is_supplier_member(p.supplier_id, p_min_role)
  );
$$;

-- ── Enable RLS everywhere ─────────────────────────────────────────────────────
alter table profiles                        enable row level security;
alter table suppliers                       enable row level security;
alter table supplier_members                enable row level security;
alter table supplier_applications           enable row level security;
alter table categories                      enable row level security;
alter table products                        enable row level security;
alter table product_images                  enable row level security;
alter table product_dimensions              enable row level security;
alter table product_colors                  enable row level security;
alter table product_materials               enable row level security;
alter table product_variants                enable row level security;
alter table inventory                       enable row level security;
alter table product_customization_options   enable row level security;
alter table favorites                       enable row level security;
alter table saved_rooms                     enable row level security;
alter table saved_designs                   enable row level security;
alter table saved_design_items              enable row level security;

-- ── profiles: own row only ────────────────────────────────────────────────────
create policy profiles_select_own on profiles for select using (id = auth.uid());
create policy profiles_insert_own on profiles for insert with check (id = auth.uid());
create policy profiles_update_own on profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- ── suppliers: public reads ACTIVE; members manage their supplier ────────────
create policy suppliers_public_read on suppliers for select using (status = 'active');
create policy suppliers_member_read on suppliers for select using (is_supplier_member(id));
create policy suppliers_member_update on suppliers for update
  using (is_supplier_member(id, 'manager')) with check (is_supplier_member(id, 'manager'));

-- ── supplier_members: a user sees memberships of suppliers they belong to ────
create policy members_read on supplier_members for select
  using (user_id = auth.uid() or is_supplier_member(supplier_id, 'manager'));
create policy members_manage on supplier_members for all
  using (is_supplier_member(supplier_id, 'owner')) with check (is_supplier_member(supplier_id, 'owner'));

-- ── supplier_applications: applicant inserts + reads own ─────────────────────
create policy apps_insert_own on supplier_applications for insert with check (applicant_id = auth.uid());
create policy apps_read_own    on supplier_applications for select using (applicant_id = auth.uid());
-- (Admin review happens via the service role, which bypasses RLS.)

-- ── categories: public read; writes via service role only ────────────────────
create policy categories_public_read on categories for select using (true);

-- ── products: public reads ACTIVE; members manage their supplier's products ──
create policy products_public_read on products for select using (status = 'active');
create policy products_member_read on products for select using (is_supplier_member(supplier_id));
create policy products_member_insert on products for insert with check (is_supplier_member(supplier_id, 'staff'));
create policy products_member_update on products for update
  using (is_supplier_member(supplier_id, 'staff')) with check (is_supplier_member(supplier_id, 'staff'));
create policy products_member_delete on products for delete using (is_supplier_member(supplier_id, 'manager'));

-- ── product child tables: public read when parent active; members manage ─────
do $$
declare t text;
begin
  foreach t in array array[
    'product_images','product_dimensions','product_colors',
    'product_materials','product_variants','inventory','product_customization_options'
  ] loop
    execute format($f$
      create policy %1$s_public_read on %1$I for select using (
        exists (select 1 from products p where p.id = %1$I.product_id and p.status = 'active')
      );
      create policy %1$s_member_all on %1$I for all
        using (can_manage_product(%1$I.product_id))
        with check (can_manage_product(%1$I.product_id));
    $f$, t);
  end loop;
end $$;

-- ── favorites / saved_rooms / saved_designs: owner-only ──────────────────────
create policy favorites_own on favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy saved_rooms_own on saved_rooms for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy saved_designs_own on saved_designs for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── saved_design_items: gated through the parent design's owner ──────────────
create policy design_items_own on saved_design_items for all
  using (exists (select 1 from saved_designs d where d.id = design_id and d.user_id = auth.uid()))
  with check (exists (select 1 from saved_designs d where d.id = design_id and d.user_id = auth.uid()));
