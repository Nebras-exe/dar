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

## Future tables (documented, intentionally NOT built)

`payments`, `payment_intents`, `refunds` (Phase 10B — payment), plus
`manufacturing_jobs`, `deliveries`. A confirmed order → payment is the next seam.
The current schema is designed to extend cleanly.

## Secrets (§30/§47)

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public, client-safe (the anon key is RLS-protected by design).
- `SUPABASE_SERVICE_ROLE_KEY` — **server-only**, never imported by any client module, never in `.next/static`. Reserved for admin/service tasks (e.g. application review). Verified absent from the client bundle.
