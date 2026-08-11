-- Athathi — Phase 09: Custom Furniture + RFQ schema.
-- The customer's custom request (the RFQ envelope), the suppliers it is addressed
-- to, and each supplier's quote. Money is numeric(12,3) OMR (§15/§33). Important
-- query/filter fields are structured columns; category-specific extras live in
-- spec_json (§14). No payment/manufacturing tables this phase (§12).

do $$ begin
  create type rfq_status   as enum ('draft','ready','submitted','quotes_received','customer_review','accepted','cancelled','expired');
  create type quote_status as enum ('draft','submitted','withdrawn','accepted','declined','expired');
exception when duplicate_object then null; end $$;

-- ── Supplier custom-furniture capabilities (extends the Phase 08 supplier) ────
create table if not exists supplier_capabilities (
  supplier_id       uuid primary key references suppliers(id) on delete cascade,
  accepts_custom    boolean not null default false,
  custom_categories text[] not null default '{}',   -- category slugs
  materials         text[] not null default '{}',    -- material ids
  service_regions   text[] not null default '{}',
  lead_time_days_min int not null default 10 check (lead_time_days_min > 0),
  lead_time_days_max int not null default 21 check (lead_time_days_max >= lead_time_days_min)
);

-- ── custom_requests (the RFQ) ─────────────────────────────────────────────────
create table if not exists custom_requests (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references auth.users(id) on delete cascade,
  category     text not null,
  -- Structured, frequently-queried fields as columns:
  quantity     int not null default 1 check (quantity > 0),
  budget       numeric(12,3) check (budget is null or budget >= 0),   -- OMR, optional
  -- Category-specific extras (style/color/material/dims/shape/…): JSON.
  spec_json    jsonb not null default '{}',
  status       rfq_status not null default 'draft',
  is_demo      boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_custom_requests_updated before update on custom_requests
  for each row execute function set_updated_at();
create index if not exists idx_custom_requests_customer on custom_requests(customer_id);
create index if not exists idx_custom_requests_status on custom_requests(status);

-- ── custom_request_images (private reference uploads; never public — §35) ─────
create table if not exists custom_request_images (
  id         uuid primary key default gen_random_uuid(),
  request_id uuid not null references custom_requests(id) on delete cascade,
  path       text not null,             -- private Supabase Storage object path
  created_at timestamptz not null default now()
);
create index if not exists idx_custom_request_images_request on custom_request_images(request_id);

-- ── rfq_recipients (which suppliers an RFQ was sent to) ───────────────────────
create table if not exists rfq_recipients (
  request_id    uuid not null references custom_requests(id) on delete cascade,
  supplier_id   uuid not null references suppliers(id) on delete cascade,
  -- Deterministic match reason codes (for transparent "why matched").
  match_reasons text[] not null default '{}',
  created_at    timestamptz not null default now(),
  primary key (request_id, supplier_id)
);
create index if not exists idx_rfq_recipients_supplier on rfq_recipients(supplier_id);

-- ── quotes (a supplier's commercial offer) ────────────────────────────────────
create table if not exists quotes (
  id                uuid primary key default gen_random_uuid(),
  request_id        uuid not null references custom_requests(id) on delete cascade,
  supplier_id       uuid not null references suppliers(id) on delete cascade,
  base_price        numeric(12,3) not null check (base_price >= 0),   -- OMR
  delivery_fee      numeric(12,3) not null default 0 check (delivery_fee >= 0),
  installation_fee  numeric(12,3) not null default 0 check (installation_fee >= 0),
  -- total is derived in app/db logic (base + delivery + installation); stored for query.
  total             numeric(12,3) not null check (total >= 0),
  currency          text not null default 'OMR' check (currency = 'OMR'),
  manufacturing_days int not null check (manufacturing_days > 0),
  warranty_text     text not null default '',
  notes             text not null default '',
  status            quote_status not null default 'draft',
  is_demo           boolean not null default false,
  valid_until       timestamptz,
  created_at        timestamptz not null default now(),
  -- A supplier submits at most one active quote per request.
  unique (request_id, supplier_id)
);
create index if not exists idx_quotes_request on quotes(request_id);
create index if not exists idx_quotes_supplier on quotes(supplier_id);

-- ── FUTURE (documented, NOT built — §12/§53): orders, order_items,
--    manufacturing_jobs, deliveries. Accepted quote → order creation is Phase 10.
