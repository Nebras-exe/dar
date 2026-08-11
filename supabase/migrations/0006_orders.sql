-- Athathi — Phase 10A: Orders + Checkout schema.
-- ONE order architecture for TWO sources (cart, accepted_quote). An order is an
-- IMMUTABLE snapshot: items copy name/price/dimensions/quote-terms at order time
-- so later catalog/quote changes never alter history. Multi-supplier carts split
-- into order_groups (one per supplier). Money is numeric(12,3) OMR (§7). NO
-- payment tables/states this phase (§4/§15) — those arrive in Phase 10B.

do $$ begin
  create type order_source       as enum ('cart', 'accepted_quote');
  create type order_status        as enum ('draft', 'confirmed', 'processing', 'cancelled', 'completed');
  create type supplier_group_status as enum ('new', 'acknowledged', 'processing');
  create type order_item_kind     as enum ('catalog', 'custom');
exception when duplicate_object then null; end $$;

-- ── orders (the customer's order envelope + delivery snapshot) ───────────────
create table if not exists orders (
  id            uuid primary key default gen_random_uuid(),
  order_number  text not null unique,
  customer_id   uuid not null references auth.users(id) on delete cascade,
  source        order_source not null,
  status        order_status not null default 'draft',
  -- Delivery address snapshot (Oman-friendly; frozen at order time).
  full_name     text not null,
  phone         text not null,
  governorate   text not null,
  wilayat       text not null,
  area          text not null default '',
  building      text not null,
  notes         text not null default '',
  -- Whole-order money snapshot (OMR). Authoritative; recomputed server-side.
  goods_subtotal     numeric(12,3) not null check (goods_subtotal >= 0),
  delivery_total     numeric(12,3) not null default 0 check (delivery_total >= 0),
  installation_total numeric(12,3) not null default 0 check (installation_total >= 0),
  grand_total        numeric(12,3) not null check (grand_total >= 0),
  -- For accepted_quote source: the originating request/quote (validated).
  request_id    uuid references custom_requests(id) on delete set null,
  quote_id      uuid references quotes(id) on delete set null,
  is_demo       boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger trg_orders_updated before update on orders
  for each row execute function set_updated_at();
create index if not exists idx_orders_customer on orders(customer_id);
create index if not exists idx_orders_status on orders(status);

-- ── order_groups (per-supplier portion of an order) ──────────────────────────
create table if not exists order_groups (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references orders(id) on delete cascade,
  supplier_id    uuid not null references suppliers(id),
  -- Supplier name snapshot (immutable even if the supplier renames later).
  supplier_name  text not null,
  goods_subtotal   numeric(12,3) not null check (goods_subtotal >= 0),
  delivery_fee     numeric(12,3) not null default 0 check (delivery_fee >= 0),
  installation_fee numeric(12,3) not null default 0 check (installation_fee >= 0),
  group_total      numeric(12,3) not null check (group_total >= 0),
  status         supplier_group_status not null default 'new',
  created_at     timestamptz not null default now(),
  unique (order_id, supplier_id)
);
create index if not exists idx_order_groups_order on order_groups(order_id);
create index if not exists idx_order_groups_supplier on order_groups(supplier_id);

-- ── order_items (immutable purchase-line snapshots) ──────────────────────────
create table if not exists order_items (
  id             uuid primary key default gen_random_uuid(),
  group_id       uuid not null references order_groups(id) on delete cascade,
  kind           order_item_kind not null,
  -- Catalog snapshot fields (null for custom):
  product_id     uuid,
  product_slug   text,
  name           text,
  name_ar        text,
  category_slug  text,
  color_id       text,
  color_label    text,
  material_id    text,
  unit_price     numeric(12,3),           -- OMR
  dimensions     jsonb,                    -- {widthCm,depthCm,heightCm,...}
  -- Custom (RFQ) snapshot fields (null for catalog):
  request_id     uuid,
  quote_id       uuid,
  spec_json      jsonb,                    -- frozen CustomFurnitureSpec
  base_price     numeric(12,3),
  delivery_fee   numeric(12,3),
  installation_fee numeric(12,3),
  manufacturing_days int,
  warranty_text  text,
  -- Common:
  quantity       int not null default 1 check (quantity > 0),
  line_total     numeric(12,3) not null check (line_total >= 0),
  position       int not null default 0
);
create index if not exists idx_order_items_group on order_items(group_id);

-- ── FUTURE (Phase 10B — NOT built): payments, payment_intents, refunds,
--    manufacturing_jobs, deliveries. An order → payment is the next seam.
