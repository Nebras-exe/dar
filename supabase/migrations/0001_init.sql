-- Athathi — Phase 08 core schema (Supabase/PostgreSQL).
-- Money: OMR is stored as numeric(12,3) — exact 3-decimal, never a float, never
-- a formatted string (§33). Machine identifiers (slugs, enum values) are stable.
-- Demo data is tagged is_demo = true and is never presented as real (§34).

create extension if not exists "pgcrypto";       -- gen_random_uuid()

-- ── Enums ────────────────────────────────────────────────────────────────────
do $$ begin
  create type user_role            as enum ('customer', 'supplier', 'admin');
  create type supplier_status      as enum ('pending', 'active', 'suspended');
  create type supplier_type        as enum ('showroom', 'factory', 'workshop', 'importer', 'studio');
  create type supplier_member_role as enum ('owner', 'manager', 'staff');
  create type product_status       as enum ('draft', 'active', 'archived');
  create type inventory_status     as enum ('in_stock', 'low_stock', 'out_of_stock', 'made_to_order');
  create type dimension_source     as enum ('supplier_verified', 'demo', 'unknown');
  create type customization_kind   as enum ('color', 'material', 'size', 'legs', 'fabric', 'wood', 'other');
  create type supplier_application_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

-- ── updated_at trigger helper ────────────────────────────────────────────────
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

-- ── profiles (1:1 with auth.users) ───────────────────────────────────────────
create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  email        text,
  locale       text not null default 'en' check (locale in ('en', 'ar')),
  role         user_role not null default 'customer',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- ── suppliers ────────────────────────────────────────────────────────────────
create table if not exists suppliers (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  name_ar        text not null default '',
  description    text not null default '',
  description_ar text not null default '',
  location       text not null default '',
  location_ar    text not null default '',
  type           supplier_type not null default 'showroom',
  -- New suppliers are NEVER auto-activated or auto-verified (§7).
  status         supplier_status not null default 'pending',
  verified       boolean not null default false,
  logo_path      text,
  contact_email  text,
  contact_phone  text,
  is_demo        boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger trg_suppliers_updated before update on suppliers
  for each row execute function set_updated_at();
create index if not exists idx_suppliers_status on suppliers(status);

-- ── supplier_members (who can manage a supplier) ─────────────────────────────
create table if not exists supplier_members (
  supplier_id uuid not null references suppliers(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        supplier_member_role not null default 'staff',
  created_at  timestamptz not null default now(),
  primary key (supplier_id, user_id)
);
create index if not exists idx_supplier_members_user on supplier_members(user_id);

-- ── supplier applications (pending review; never auto-activated) ─────────────
create table if not exists supplier_applications (
  id             uuid primary key default gen_random_uuid(),
  applicant_id   uuid references auth.users(id) on delete set null,
  business_name  text not null,
  business_name_ar text not null default '',
  type           supplier_type not null default 'showroom',
  location       text not null default '',
  contact_email  text not null,
  contact_phone  text,
  description    text not null default '',
  status         supplier_application_status not null default 'pending',
  created_at     timestamptz not null default now()
);
create index if not exists idx_supplier_apps_status on supplier_applications(status);

-- ── categories (machine slug is the stable key) ──────────────────────────────
create table if not exists categories (
  slug        text primary key,
  name        text not null,
  name_ar     text not null default '',
  tagline     text not null default '',
  tagline_ar  text not null default '',
  position    int  not null default 0
);

-- ── products ─────────────────────────────────────────────────────────────────
create table if not exists products (
  id             uuid primary key default gen_random_uuid(),
  supplier_id    uuid not null references suppliers(id) on delete cascade,
  category_slug  text not null references categories(slug),
  slug           text not null unique,
  name           text not null,
  name_ar        text not null default '',
  description    text not null default '',
  description_ar text not null default '',
  base_price     numeric(12,3) not null check (base_price >= 0),   -- OMR, 3-decimal
  currency       text not null default 'OMR' check (currency = 'OMR'),
  status         product_status not null default 'draft',
  customizable   boolean not null default false,
  style_tags     text[] not null default '{}',
  room_types     text[] not null default '{}',
  is_demo        boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger trg_products_updated before update on products
  for each row execute function set_updated_at();
create index if not exists idx_products_supplier on products(supplier_id);
create index if not exists idx_products_status on products(status);
create index if not exists idx_products_category on products(category_slug);

-- ── product_images ───────────────────────────────────────────────────────────
create table if not exists product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  path        text not null,           -- Supabase Storage object path
  alt_en      text not null default '',
  alt_ar      text not null default '',
  position    int not null default 0,
  is_primary  boolean not null default false
);
create index if not exists idx_product_images_product on product_images(product_id);

-- ── product_dimensions (1:1) — trusted, structured; source is tracked (§11) ──
create table if not exists product_dimensions (
  product_id     uuid primary key references products(id) on delete cascade,
  width_cm       numeric(7,2) not null check (width_cm  > 0),
  depth_cm       numeric(7,2) not null check (depth_cm  > 0),
  height_cm      numeric(7,2) not null check (height_cm > 0),
  seat_height_cm numeric(7,2) check (seat_height_cm > 0),
  seat_depth_cm  numeric(7,2) check (seat_depth_cm  > 0),
  diameter_cm    numeric(7,2) check (diameter_cm  > 0),
  source         dimension_source not null default 'supplier_verified'
);

-- ── product_colors / product_materials (taxonomy join rows) ──────────────────
create table if not exists product_colors (
  product_id uuid not null references products(id) on delete cascade,
  color_id   text not null,
  primary key (product_id, color_id)
);
create table if not exists product_materials (
  product_id  uuid not null references products(id) on delete cascade,
  material_id text not null,
  primary key (product_id, material_id)
);

-- ── product_variants (color/material/size combinations) ──────────────────────
create table if not exists product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  sku         text unique,
  color_id    text,
  material_id text,
  size_label  text,
  -- Price delta relative to base_price (OMR). Business logic owns this (§25).
  price_delta numeric(12,3) not null default 0,
  status      product_status not null default 'active'
);
create index if not exists idx_variants_product on product_variants(product_id);

-- ── inventory (1:1 with a product for this phase) ────────────────────────────
create table if not exists inventory (
  product_id uuid primary key references products(id) on delete cascade,
  status     inventory_status not null default 'made_to_order',
  quantity   int check (quantity is null or quantity >= 0),  -- optional real count
  updated_at timestamptz not null default now()
);
create trigger trg_inventory_updated before update on inventory
  for each row execute function set_updated_at();

-- ── product_customization_options (basic selectable options) ─────────────────
create table if not exists product_customization_options (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  kind        customization_kind not null,
  label       text not null,
  label_ar    text not null default '',
  price_delta numeric(12,3) not null default 0,  -- OMR (§25)
  position    int not null default 0
);
create index if not exists idx_custom_opts_product on product_customization_options(product_id);

-- ── favorites (user ↔ product) ───────────────────────────────────────────────
create table if not exists favorites (
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ── saved_rooms (a user's room reference; NO raw image bytes stored) ─────────
create table if not exists saved_rooms (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  label      text not null default '',
  image_path text,                    -- Supabase Storage path (optional, consented)
  room_type  text,
  created_at timestamptz not null default now()
);
create index if not exists idx_saved_rooms_user on saved_rooms(user_id);

-- ── saved_designs (+ items) ──────────────────────────────────────────────────
create table if not exists saved_designs (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  label          text not null default '',
  room_type      text not null,
  budget         numeric(12,3) not null default 0,
  primary_style  text,
  secondary_style text,
  saved_room_id  uuid references saved_rooms(id) on delete set null,
  -- Denormalized numeric budget summary snapshot (OMR).
  new_furniture_total numeric(12,3) not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger trg_saved_designs_updated before update on saved_designs
  for each row execute function set_updated_at();
create index if not exists idx_saved_designs_user on saved_designs(user_id);

create table if not exists saved_design_items (
  id         uuid primary key default gen_random_uuid(),
  design_id  uuid not null references saved_designs(id) on delete cascade,
  -- Product reference by SLUG (stable across demo/DB) + resolved product_id when known.
  product_slug text not null,
  product_id uuid references products(id) on delete set null,
  color_id   text,
  quantity   int not null default 1 check (quantity > 0),
  position   int not null default 0
);
create index if not exists idx_saved_design_items_design on saved_design_items(design_id);

-- ── FUTURE (documented, intentionally NOT created this phase — §5) ───────────
--   orders, order_items, custom_requests, quotes, manufacturing_jobs, deliveries.
--   See docs/DATABASE.md § Future tables.
