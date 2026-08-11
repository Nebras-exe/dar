-- Athathi — Phase 11B Manufacturing Row Level Security (§25/§26/§27).
-- The owning CUSTOMER may READ a customer-safe view of their own job (never write —
-- §25). A SUPPLIER MEMBER may READ and UPDATE ONLY jobs of their OWN supplier —
-- supplier A can never read or mutate supplier B's job (§26/§27). Events + QC
-- attempts are append-only (no update/delete → default deny), so a failed
-- inspection can never be overwritten (§17/§18). Quality-issue DESCRIPTIONS are
-- supplier-only (the app never selects them for a customer). Public: no access.

alter table manufacturing_jobs   enable row level security;
alter table manufacturing_events enable row level security;
alter table quality_checks       enable row level security;
alter table quality_issues       enable row level security;

-- Is the current user a member of the supplier that owns this job?
create or replace function is_manufacturing_supplier(p_job_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from manufacturing_jobs j
    join supplier_members m on m.supplier_id = j.supplier_id
    where j.id = p_job_id and m.user_id = auth.uid()
  );
$$;

-- ── manufacturing_jobs ────────────────────────────────────────────────────────
-- Customer: READ own only (no write — manufacturing is supplier-driven, §25).
create policy mfg_jobs_customer_read on manufacturing_jobs for select
  using (customer_id = auth.uid());

-- Supplier member: READ own supplier's jobs.
create policy mfg_jobs_supplier_read on manufacturing_jobs for select
  using (exists (
    select 1 from supplier_members m
    where m.supplier_id = manufacturing_jobs.supplier_id and m.user_id = auth.uid()
  ));

-- Supplier member: UPDATE only their own supplier's job (supplier_id pinned by check).
create policy mfg_jobs_supplier_update on manufacturing_jobs for update
  using (exists (
    select 1 from supplier_members m
    where m.supplier_id = manufacturing_jobs.supplier_id and m.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from supplier_members m
    where m.supplier_id = manufacturing_jobs.supplier_id and m.user_id = auth.uid()
  ));

-- Insert: only a member of the group's supplier may create the job; the
-- custom + ready trigger (0012) still gates it. Customers cannot insert (§25).
create policy mfg_jobs_supplier_insert on manufacturing_jobs for insert
  with check (exists (
    select 1 from supplier_members m
    where m.supplier_id = manufacturing_jobs.supplier_id and m.user_id = auth.uid()
  ));

-- ── manufacturing_events ─────────────────────────────────────────────────────
-- Read: anyone who may read the parent job (customer OR its supplier).
create policy mfg_events_read on manufacturing_events for select
  using (
    exists (select 1 from manufacturing_jobs j where j.id = manufacturing_events.job_id and j.customer_id = auth.uid())
    or is_manufacturing_supplier(manufacturing_events.job_id)
  );
-- Write: only the owning supplier's members append events (append-only — no update/delete).
create policy mfg_events_supplier_insert on manufacturing_events for insert
  with check (is_manufacturing_supplier(manufacturing_events.job_id));

-- ── quality_checks ───────────────────────────────────────────────────────────
-- Read: the owning customer sees the safe status/attempt (the app never selects
-- issue descriptions for a customer); the owning supplier sees everything.
create policy quality_checks_read on quality_checks for select
  using (
    exists (select 1 from manufacturing_jobs j where j.id = quality_checks.job_id and j.customer_id = auth.uid())
    or is_manufacturing_supplier(quality_checks.job_id)
  );
-- Insert + finalise-update by the owning supplier only. Append-only history:
-- a new attempt is a new row; a decided attempt keeps its record (unique attempt).
create policy quality_checks_supplier_insert on quality_checks for insert
  with check (is_manufacturing_supplier(quality_checks.job_id));
create policy quality_checks_supplier_update on quality_checks for update
  using (is_manufacturing_supplier(quality_checks.job_id))
  with check (is_manufacturing_supplier(quality_checks.job_id));

-- ── quality_issues (supplier-only technical detail) — §18 ────────────────────
-- Only the owning supplier may read/insert issue records; the customer never
-- reads issue descriptions (they see a safe status via the timeline instead).
create policy quality_issues_supplier_all on quality_issues for all
  using (exists (
    select 1 from quality_checks qc
    where qc.id = quality_issues.quality_check_id and is_manufacturing_supplier(qc.job_id)
  ))
  with check (exists (
    select 1 from quality_checks qc
    where qc.id = quality_issues.quality_check_id and is_manufacturing_supplier(qc.job_id)
  ));

-- No update/delete policy on manufacturing_events → append-only (no silent rewrite, §17).
