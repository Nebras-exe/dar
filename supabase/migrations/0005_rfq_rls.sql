-- Athathi — Phase 09 RFQ Row Level Security (§33/§34).
-- Customers own their requests + see quotes on them. Suppliers see only RFQs
-- ADDRESSED to a supplier they belong to, and quote only AS that supplier.
-- Supplier A can never read Supplier B's private request context or quote as B.
-- Public has no access to any RFQ/quote. Mirrors src/lib/rfq/authorization.ts.

alter table supplier_capabilities   enable row level security;
alter table custom_requests         enable row level security;
alter table custom_request_images   enable row level security;
alter table rfq_recipients          enable row level security;
alter table quotes                  enable row level security;

-- Helper: is the current user a recipient (member of an addressed supplier)?
create or replace function is_rfq_recipient(p_request_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from rfq_recipients r
    join supplier_members m on m.supplier_id = r.supplier_id
    where r.request_id = p_request_id and m.user_id = auth.uid()
  );
$$;

-- ── supplier_capabilities: public may read (drives matching); members manage ──
create policy caps_public_read on supplier_capabilities for select using (true);
create policy caps_member_manage on supplier_capabilities for all
  using (is_supplier_member(supplier_id, 'manager'))
  with check (is_supplier_member(supplier_id, 'manager'));

-- ── custom_requests: owner full; addressed supplier members read ──────────────
create policy requests_owner_all on custom_requests for all
  using (customer_id = auth.uid()) with check (customer_id = auth.uid());
create policy requests_recipient_read on custom_requests for select
  using (is_rfq_recipient(id));

-- ── custom_request_images: owner only (private references — §35) ──────────────
create policy request_images_owner on custom_request_images for all
  using (exists (select 1 from custom_requests r where r.id = request_id and r.customer_id = auth.uid()))
  with check (exists (select 1 from custom_requests r where r.id = request_id and r.customer_id = auth.uid()));
-- Addressed supplier members may READ reference images for their RFQ.
create policy request_images_recipient_read on custom_request_images for select
  using (is_rfq_recipient(request_id));

-- ── rfq_recipients: request owner manages; the supplier member sees its row ───
create policy recipients_owner on rfq_recipients for all
  using (exists (select 1 from custom_requests r where r.id = request_id and r.customer_id = auth.uid()))
  with check (exists (select 1 from custom_requests r where r.id = request_id and r.customer_id = auth.uid()));
create policy recipients_member_read on rfq_recipients for select
  using (is_supplier_member(supplier_id));

-- ── quotes ────────────────────────────────────────────────────────────────────
-- The request owner reads all quotes on their request.
create policy quotes_owner_read on quotes for select
  using (exists (select 1 from custom_requests r where r.id = request_id and r.customer_id = auth.uid()));
-- A supplier member reads/creates/updates only its OWN supplier's quote, and only
-- for a request that supplier was addressed. (Supplier A cannot quote as B.)
create policy quotes_member_read on quotes for select
  using (is_supplier_member(supplier_id));
create policy quotes_member_insert on quotes for insert
  with check (
    is_supplier_member(supplier_id, 'staff')
    and exists (select 1 from rfq_recipients r where r.request_id = quotes.request_id and r.supplier_id = quotes.supplier_id)
  );
-- Update allowed only while NOT accepted (accepted quotes are locked — §16).
create policy quotes_member_update on quotes for update
  using (is_supplier_member(supplier_id, 'staff') and status <> 'accepted')
  with check (is_supplier_member(supplier_id, 'staff'));
-- The request owner may accept/decline a quote (status transition), never edit price.
create policy quotes_owner_decide on quotes for update
  using (exists (select 1 from custom_requests r where r.id = request_id and r.customer_id = auth.uid()))
  with check (exists (select 1 from custom_requests r where r.id = request_id and r.customer_id = auth.uid()));
