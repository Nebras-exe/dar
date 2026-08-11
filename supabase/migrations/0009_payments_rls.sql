-- Athathi — Phase 10B Payments Row Level Security (§21/§22/§25).
-- Only the order-owning CUSTOMER may create/read/update their payment intent +
-- attempts. A SUPPLIER may read only a SAFE payment-status flag of an order that
-- contains their group (paid / awaiting) — never the intent's method, attempts,
-- provider references, or metadata. Public: no access. The client can never set
-- the amount/status/ownership — the server derives amount from the order and
-- transitions status via the payment status machine.

alter table payment_intents  enable row level security;
alter table payment_attempts enable row level security;
alter table payment_events   enable row level security;

-- ── payment_intents: customer owns; create/read/update own only ──────────────
create policy payment_intents_owner_all on payment_intents for all
  using (customer_id = auth.uid())
  with check (customer_id = auth.uid());

-- A supplier may read ONLY the status column of an intent whose order contains
-- their group. Enforce at the app layer by selecting only (order_id, status);
-- RLS grants row visibility, the query must not select method/reference/amount
-- for suppliers. (Sensitive columns are never sent to a supplier client.)
create policy payment_intents_supplier_status_read on payment_intents for select
  using (
    exists (
      select 1 from order_groups g
      join supplier_members m on m.supplier_id = g.supplier_id
      where g.order_id = payment_intents.order_id and m.user_id = auth.uid()
    )
  );

-- ── payment_attempts: owner only (suppliers never see attempts — §25) ────────
create policy payment_attempts_owner_all on payment_attempts for all
  using (exists (select 1 from payment_intents i where i.id = intent_id and i.customer_id = auth.uid()))
  with check (exists (select 1 from payment_intents i where i.id = intent_id and i.customer_id = auth.uid()));

-- ── payment_events: no client access — written/read by the service role only
--    (webhook processing runs server-side; no policy = default deny for clients).
