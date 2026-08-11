-- Athathi — Phase 13: User Memory / Personalization.
-- Memory lets Athathi remember a user's DESIGN PREFERENCES with EXPLICIT CONSENT
-- (opt-in, §4). It stores ONLY useful product/design context — NEVER passwords,
-- card/payment data, tokens, secrets, or raw AI reasoning (§5). Every preference
-- carries a SOURCE (provenance) + confidence; a suggested preference is never
-- persisted without approval (§8/§9). Budget is a RANGE, not one arbitrary value
-- (§7). Typed tables — not a generic key/value blob (§10).

do $$ begin
  create type memory_source as enum
    ('explicit_user_choice','style_onboarding','approved_design','completed_purchase','room_project');
  create type memory_category as enum ('style','color','material');
exception when duplicate_object then null; end $$;

-- ── memory_consent (one row per user; opt-in switches) — §4 ──────────────────
create table if not exists memory_consent (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  enabled        boolean not null default false,
  use_in_design  boolean not null default false,
  updated_at     timestamptz not null default now()
);

-- ── user_memory_preferences (typed style/color/material values) — §6/§7 ──────
create table if not exists user_memory_preferences (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  category    memory_category not null,
  -- A real taxonomy value (StyleTag / ColorId / MaterialId) — validated in app.
  value       text not null,
  source      memory_source not null,
  created_at  timestamptz not null default now(),
  -- One row per (user, category, value) — dedupe (§7).
  unique (user_id, category, value)
);
create index if not exists idx_memory_prefs_user on user_memory_preferences(user_id);

-- ── user_memory_budget (a RANGE, one per user) — §7 ──────────────────────────
create table if not exists user_memory_budget (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  typical_min  numeric(12,3) not null check (typical_min >= 0),
  typical_max  numeric(12,3) not null check (typical_max >= 0),
  currency     text not null default 'OMR' check (currency = 'OMR'),
  source       memory_source not null,
  updated_at   timestamptz not null default now(),
  check (typical_min <= typical_max)
);

-- ── user_room_memories (saved room/design projects) — §19 ────────────────────
create table if not exists user_room_memories (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  name             text not null,
  room_type        text not null,
  style            text,
  budget           numeric(12,3),
  -- User-supplied dimensions only — never inferred/pretended exact (§19).
  width_cm         numeric(8,2),
  depth_cm         numeric(8,2),
  height_cm        numeric(8,2),
  kept_categories  text[] not null default '{}',
  design_id        uuid references saved_designs(id) on delete set null,
  source           memory_source not null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger trg_user_room_memories_updated before update on user_room_memories
  for each row execute function set_updated_at();
create index if not exists idx_room_memories_user on user_room_memories(user_id);

-- ── FUTURE (documented, NOT built): observed/suggested preferences are NOT
--    stored durably (§9) — they are transient proposals surfaced in the UI until
--    the user explicitly approves, at which point they insert as explicit rows.
