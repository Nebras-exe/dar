# Athathi — Database (Phase 08)

Athathi's backend is **Supabase (PostgreSQL + Auth + Storage + RLS)**, added as a
foundation in Phase 08. The app runs fully in **Demo Data Mode** with no backend;
these tables activate when credentials are provided. Migrations live in
`supabase/migrations/` (see `supabase/README.md` to apply them).

## Backend mode

`src/lib/backend/config.ts` → `backendMode()` returns:

- **`"supabase"`** when `NEXT_PUBLIC_SUPABASE_URL` **and** `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set.
- **`"demo"`** otherwise (default). The repository serves the Phase 03 TypeScript
  catalog + local/demo fallbacks (auth, saved designs, supplier workspace).

The **catalog repository** (`src/lib/repository/catalog.ts`) is the single seam:
`repoGetProducts` / `repoGetProductBySlug` / `repoSearchProducts` /
`repoGetProductsBySupplier`. In demo mode it adapts the pure catalog (so the AI
Designer/Agent/Visualization, which consume the pure catalog directly, are never
broken); in Supabase mode the same signatures resolve DB-backed **active**
products. No provider name or secret is ever sent to the client.

## Money (§33)

OMR is stored as **`numeric(12,3)`** (exact, 3-decimal) — never a float, never a
formatted string. In TypeScript prices stay numeric and are rounded with
`roundOmr`; formatted strings are always derived (`formatOmr`). Price deltas for
variants/customization are also `numeric(12,3)`, owned by business logic — never
by the AI.

## Core tables (`0001_init.sql`)

| Table | Purpose |
| --- | --- |
| `profiles` | 1:1 with `auth.users`; `display_name`, `locale`, `role` (customer/supplier/admin). |
| `suppliers` | Marketplace supplier; `status` (pending/active/suspended), `verified`, `is_demo`. New suppliers default `pending` + `verified=false` — never auto-activated. |
| `supplier_members` | Who may manage a supplier: `(supplier_id, user_id, role)` where role ∈ owner/manager/staff. |
| `supplier_applications` | Pending applications (`status` pending/approved/rejected). Never auto-approved. |
| `categories` | Stable slug taxonomy (mirrors Phase 03). |
| `products` | Supplier-owned; `status` (draft/active/archived), `base_price numeric(12,3)`, `style_tags[]`, `room_types[]`, `is_demo`. Only `active` is public. |
| `product_images` | Storage object paths + alt (en/ar) + position + `is_primary`. |
| `product_dimensions` | 1:1; positive `width/depth/height_cm`, optional seat/diameter, `source` (supplier_verified/demo/unknown). |
| `product_colors` / `product_materials` | Taxonomy join rows. |
| `product_variants` | color/material/size combos; `sku`, `price_delta`, `status`. |
| `inventory` | 1:1; `status` (in_stock/low_stock/out_of_stock/made_to_order), optional real `quantity`. No fake urgency. |
| `product_customization_options` | Basic selectable options; `kind`, bilingual label, `price_delta`. |
| `favorites` | `(user_id, product_id)` — owner only. |
| `saved_rooms` | User's room reference (Storage path, optional/consented — no raw bytes in the row). |
| `saved_designs` (+ `saved_design_items`) | A saved design: input + numeric budget snapshot + items (by slug + resolved product_id). Owner only. |

## Row Level Security (`0002_rls.sql`, §28/§29)

RLS is enabled on every table. The database — not the UI — enforces isolation:

- **public** reads only `active` products/suppliers (and their child rows via the parent's status).
- **profiles / favorites / saved_rooms / saved_designs**: a user reads/writes only their own rows (`= auth.uid()`).
- **suppliers / products / child tables**: managed only by `supplier_members` of that supplier, via the `security definer` helpers `is_supplier_member(supplier_id, min_role)` and `can_manage_product(product_id, min_role)`. Publishing/archiving requires ≥ manager. **Supplier A can never read a private draft or edit a product of Supplier B.**
- **supplier_applications**: an applicant inserts + reads only their own; admin review runs via the service role (which bypasses RLS).

The pure mirror of these rules (`src/lib/auth/authorization.ts`) is unit-tested so
the same logic guards demo-mode server actions.

## Seeding (`0003_seed_demo.sql`, §34)

Seeds the category taxonomy + the **three demo suppliers** + two representative
products — all tagged **`is_demo = true`**, `verified = false`. Nothing demo is
ever presented as a real business. To seed the full ~80-product Phase 03 catalog,
generate inserts from `src/lib/catalog/products.ts` (each row → `products` +
`product_dimensions` + `product_colors`/`product_materials` + `inventory`); Demo
Mode does not need this.

## Storage

Product images and (consented) room photos target Supabase Storage buckets;
`product_images.path` / `saved_rooms.image_path` hold object paths. In demo mode
products render the generated `ProductArt` (no external assets), and room photos
stay in the browser (Phase 07). Uploads validate type/size server-side.

## Phase 09 tables (`0004_custom_furniture_rfq.sql` + `0005_rfq_rls.sql`)

Custom furniture + RFQ (full detail in `docs/RFQ_WORKFLOW.md`): `supplier_capabilities`
(accepts_custom, custom_categories[], materials[], service_regions[], lead-time),
`custom_requests` (customer's RFQ — structured columns + `spec_json`, `budget
numeric(12,3)`, `rfq_status`), `custom_request_images` (private references),
`rfq_recipients` (addressed suppliers + match reasons), `quotes`
(`base/delivery/installation/total numeric(12,3)`, `manufacturing_days`,
`quote_status`, one per request+supplier). RLS (`0005`): customer owns their
request + quotes; a supplier reads/quotes only for RFQs addressed to a supplier it
belongs to (A can't quote as B); accepted quotes are locked; reference images are
owner-only (+ addressed-supplier read); public has no access.

## Phase 10A tables (`0006_orders.sql` + `0007_orders_rls.sql`)

Orders + checkout (full detail in `docs/phase-reports/PHASE_10A_REPORT.md`). ONE
architecture for TWO sources (`order_source` = cart | accepted_quote):
`orders` (envelope + delivery-address snapshot + money snapshot `numeric(12,3)` +
`order_status` [draft/confirmed/processing/cancelled/completed — no payment
states] + `is_demo`), `order_groups` (one per supplier: subtotals + delivery/
installation + `supplier_group_status`), `order_items` (immutable line snapshots —
catalog columns [name/price/dimensions/colour] OR custom columns [frozen
`spec_json` + accepted-quote terms]). RLS (`0007`): a customer reads/creates only
their own orders; a supplier reads only order groups belonging to a supplier it is
a member of (`is_order_supplier` helper), and `order_items` are visible only to
the owner OR that item's group's supplier — cross-supplier items are never
exposed. The client never sends prices/totals; they are recomputed server-side.

## Phase 10B tables (`0008_payments.sql` + `0009_payments_rls.sql`)

Payments (full detail in `docs/PAYMENT_ARCHITECTURE.md`). Payment status is
**separate** from order status. Enums `payment_status`
(`not_started/pending/requires_action/authorized/paid/failed/cancelled/expired`) +
`payment_method` (`demo/card/wallet/bank_transfer`). Tables:
`payment_intents` (`order_id` **unique** → one intent per order for idempotency;
`amount numeric(12,3)` snapshot derived from the order, never a client value;
**safe-only** `provider_reference` — never card data/token/CVV; `idempotency_key`;
`is_demo`), `payment_attempts` (safe refs + `failure_code` — no raw provider error),
`payment_events` (`unique(provider, event_id)` for webhook idempotent processing /
replay dedupe). RLS (`0009`): a customer has full access to **their own** intents; a
supplier may **read only the status** of intents for orders containing their group
(order-group match — never a failure reason, reference, method, or amount);
`payment_attempts` are owner-only; `payment_events` are **service-role only**
(default deny). `paid` is only ever set server-side via provider verification; the
client never sends a price/total/status. **Refunds** are documented, not built — a
refund must be a separate, auditable transition (the status machine keeps `paid`
terminal precisely for this).

## Phase 11A tables (`0010_fulfillment.sql` + `0011_fulfillment_rls.sql`)

Fulfillment (full detail in `docs/FULFILLMENT_WORKFLOW.md`). SEPARATE domain from
order status and payment status. Enums `fulfillment_status`
(`awaiting_supplier/accepted/preparing/ready_for_next_stage/declined/cancelled`),
`fulfillment_decline_reason`, `fulfillment_event_type`, `fulfillment_actor_role`.
Tables: `fulfillments` (**one per `order_group_id`** — references the immutable
snapshot, §8; `supplier_id`, `customer_id`, `order_source`; `accepted_at`/
`declined_at`/`decline_reason`; `decline_internal_note` — supplier/ops-only, never
shown to the customer, §12; `is_demo`) guarded by an `assert_order_paid` **insert
trigger** so a fulfillment can only exist for a PAID order (§4/§30);
`fulfillment_events` (append-only audit history, `unique(fulfillment_id, type)` for
event dedupe/idempotency, §9/§35). RLS (`0011`): the owning **customer** reads their
order's fulfillment (never writes — §28); a **supplier member** reads/updates/inserts
ONLY their own supplier's fulfillments (A can never touch B, §26); events are readable
to customer-or-supplier and appended by the owning supplier only; no event
update/delete (default deny — no silent rewrite). Each supplier group carries its OWN
state (multi-supplier safe, §6).

## Phase 11B tables (`0012_manufacturing.sql` + `0013_manufacturing_rls.sql`)

Custom manufacturing + quality check (full detail in
`docs/MANUFACTURING_WORKFLOW.md`). A FOURTH separate domain from order/payment/
fulfillment status, for CUSTOM furniture only. Enums `manufacturing_status`
(`not_started/manufacturing/manufacturing_completed/quality_check/qc_passed/qc_failed/
rework/ready_for_delivery`), `manufacturing_event_type`, `manufacturing_actor_role`,
`quality_check_status`, `quality_issue_category`, `quality_issue_severity`. Tables:
`manufacturing_jobs` (**one per `order_group_id`** — references order/order_group/
**fulfillment**/supplier, §7/§8; `estimate_days`; `milestones text[]`) guarded by an
`assert_custom_and_ready` **insert trigger** so a job can exist only for a CUSTOM item
whose fulfillment is `ready_for_next_stage` (§4/§22 — catalog groups bypass);
`manufacturing_events` (append-only audit, §9); `quality_checks` (numbered attempts,
`unique(job_id, attempt)` — no overwrite, §18) with a jsonb checklist; `quality_issues`
(structured category + severity + supplier-only description). RLS (`0013`): the owning
**customer** reads a safe view (never writes — §25); a **supplier member** reads/
updates/inserts ONLY their own supplier's jobs (A can never touch B, §26);
`manufacturing_events` have no update/delete policy (append-only — no silent rewrite,
§17); quality-issue descriptions are supplier-only. `ready_for_delivery` is terminal
(Phase 12 seam). Each custom group progresses independently (multi-item safe, §21).

## Future tables (documented, intentionally NOT built)

`refunds` (a documented, auditable transition off a `paid` intent), plus `deliveries`,
`installations`, `delivery_tracking` (Phase 12 — delivery + installation + tracking).
`ready_for_delivery` is the seam to Phase 12. The current schema is designed to extend
cleanly.

## Secrets (§30/§47)

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public, client-safe (the anon key is RLS-protected by design).
- `SUPABASE_SERVICE_ROLE_KEY` — **server-only**, never imported by any client module, never in `.next/static`. Reserved for admin/service tasks (e.g. application review). Verified absent from the client bundle.
