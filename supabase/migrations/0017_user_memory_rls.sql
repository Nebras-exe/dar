-- Athathi — Phase 13 User Memory Row Level Security (§11/§39).
-- A USER may read/create/update/delete ONLY their own memory. A SUPPLIER has NO
-- access to private user memory. PUBLIC: no access. The Agent only ever reads
-- memory inside the user's own authenticated context (there is no supplier/agent
-- policy — memory is strictly the owning user's). Clearing memory touches ONLY
-- these tables — orders/payments/RFQs live elsewhere and are never affected (§38).

alter table memory_consent          enable row level security;
alter table user_memory_preferences enable row level security;
alter table user_memory_budget      enable row level security;
alter table user_room_memories      enable row level security;

-- ── memory_consent: owner only ───────────────────────────────────────────────
create policy memory_consent_owner_all on memory_consent for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── user_memory_preferences: owner only ──────────────────────────────────────
create policy memory_prefs_owner_all on user_memory_preferences for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── user_memory_budget: owner only ───────────────────────────────────────────
create policy memory_budget_owner_all on user_memory_budget for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── user_room_memories: owner only ───────────────────────────────────────────
create policy room_memories_owner_all on user_room_memories for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- No supplier or public policy on any memory table → default deny for everyone
-- but the owning user (§11). Suppliers can never read a customer's private memory.
