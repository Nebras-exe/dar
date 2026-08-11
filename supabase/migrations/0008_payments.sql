-- Athathi — Phase 10B: Payment architecture.
-- Payment status is SEPARATE from order status (§6). A payment is created from a
-- confirmed order; the amount is a SERVER-SIDE SNAPSHOT of the order's grand
-- total (§8/§15) — the client never controls it. Athathi NEVER stores raw card
-- data / CVV / tokens / bank credentials (§3/§9) — only safe provider references.
-- No real gateway is configured → the Demo Payment provider runs. Refunds are
-- documented for the future but NOT implemented (§5).

do $$ begin
  create type payment_status as enum
    ('not_started','pending','requires_action','authorized','paid','failed','cancelled','expired');
  create type payment_method as enum ('demo','card','wallet','bank_transfer');
exception when duplicate_object then null; end $$;

-- ── payment_intents (one active intent per order; idempotent) ────────────────
create table if not exists payment_intents (
  id                 uuid primary key default gen_random_uuid(),
  order_id           uuid not null references orders(id) on delete cascade,
  customer_id        uuid not null references auth.users(id) on delete cascade,
  provider           text not null default 'demo',
  -- Safe provider reference only — never a token/secret/PAN.
  provider_reference text,
  -- Authoritative amount (OMR, 3-decimal) — snapshot of orders.grand_total.
  amount             numeric(12,3) not null check (amount >= 0),
  currency           text not null default 'OMR' check (currency = 'OMR'),
  status             payment_status not null default 'not_started',
  method             payment_method not null default 'demo',
  -- Idempotency: at most one non-terminal intent per order (§16).
  idempotency_key    text not null,
  is_demo            boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  -- Enforce one intent per order (retries reuse it; attempts capture retries).
  unique (order_id)
);
create trigger trg_payment_intents_updated before update on payment_intents
  for each row execute function set_updated_at();
create index if not exists idx_payment_intents_customer on payment_intents(customer_id);
create index if not exists idx_payment_intents_order on payment_intents(order_id);

-- ── payment_attempts (each retry = a new attempt; safe references only) ──────
create table if not exists payment_attempts (
  id                 uuid primary key default gen_random_uuid(),
  intent_id          uuid not null references payment_intents(id) on delete cascade,
  provider_reference text,
  status             payment_status not null,
  -- Stable, user-safe failure code — never a raw provider message.
  failure_code       text,
  created_at         timestamptz not null default now()
);
create index if not exists idx_payment_attempts_intent on payment_attempts(intent_id);

-- ── payment_events (webhook/idempotency foundation — §18) ────────────────────
-- Generic boundary for a future real provider's webhooks: dedupe by
-- (provider, event_id); replay/timestamp/signature checks happen in the route.
create table if not exists payment_events (
  id           uuid primary key default gen_random_uuid(),
  provider     text not null,
  event_id     text not null,
  intent_id    uuid references payment_intents(id) on delete set null,
  received_at  timestamptz not null default now(),
  processed    boolean not null default false,
  unique (provider, event_id)   -- event deduplication
);

-- ── FUTURE (documented, NOT built): refunds, payment_refunds, disputes.
--    A `paid` intent never regresses without a documented refund flow (§5/§19).
