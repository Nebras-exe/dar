-- Athathi — Phase 13: In-App Notifications.
-- A REAL in-app notification feed (NOT external messaging, §20). Domain events
-- (RFQ / quote / order / payment / fulfillment / manufacturing / QC / delivery /
-- installation, §21) become per-user notifications. Identity is
-- (user_id, source_type, source_id, event_key) so repeated ingestion never
-- duplicates (§25). The payload is STRUCTURED localization data (keys + jsonb
-- params), not a giant rendered string (§26). A deep link points at the relevant
-- order/design/request.

do $$ begin
  create type notification_audience as enum ('customer','supplier');
  create type notification_category as enum ('orders','designs','quotes','delivery');
  create type notification_priority as enum ('high','medium','low');
  create type notification_source_type as enum
    ('rfq','quote','order','payment','fulfillment','manufacturing','delivery');
exception when duplicate_object then null; end $$;

create table if not exists notifications (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  audience     notification_audience not null default 'customer',
  source_type  notification_source_type not null,
  source_id    text not null,
  -- Allowlisted event key (validated in app against the event map, §39).
  event_key    text not null,
  category     notification_category not null,
  priority     notification_priority not null,
  title_key    text not null,
  body_key     text not null,
  -- Safe interpolation params (e.g. {"orderNumber":"ATH-000001"}) — never secrets.
  params       jsonb not null default '{}'::jsonb,
  -- Deep-link target: {"kind":"order","id":"..."} or null.
  link         jsonb,
  read_at      timestamptz,
  created_at   timestamptz not null default now(),
  -- Deduplication (§25): one notification per event occurrence per user.
  unique (user_id, source_type, source_id, event_key)
);
create index if not exists idx_notifications_user on notifications(user_id);
create index if not exists idx_notifications_unread on notifications(user_id) where read_at is null;
