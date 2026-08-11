-- Athathi — Phase 13 Notifications Row Level Security (§27/§39).
-- A user may READ and UPDATE (mark read / dismiss) ONLY their own notifications.
-- No cross-user access; no public access. Supplier notifications (audience =
-- 'supplier') still belong to a specific supplier-member user_id, so the same
-- owner rule applies — a supplier user reads only their OWN feed. Inserts are
-- performed by the server/service on behalf of a user; the allowlisted event map
-- + the (user, source, event) unique key prevent a client forging or duplicating
-- a high-priority system notification.

alter table notifications enable row level security;

-- Owner may read their own notifications.
create policy notifications_owner_read on notifications for select
  using (user_id = auth.uid());

-- Owner may update only their own (mark read / dismiss) — user_id pinned by check.
create policy notifications_owner_update on notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Owner may delete (dismiss) their own.
create policy notifications_owner_delete on notifications for delete
  using (user_id = auth.uid());

-- Insert: a user may only create rows addressed to themselves (server/service
-- typically writes these; a client cannot address another user, §39).
create policy notifications_owner_insert on notifications for insert
  with check (user_id = auth.uid());
