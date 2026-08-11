# Athathi — Supplier Model (Phase 08)

How suppliers, membership, and the supplier workspace work, and the trust rules
that keep the marketplace honest.

## Entities

- **Supplier** — a furniture business (`showroom` / `factory` / `workshop` /
  `importer` / `studio`). Has a `status` (`pending` → `active` → `suspended`) and a
  `verified` flag. Demo suppliers are `is_demo = true`, `verified = false`, and
  always labelled **Sample / Demo**.
- **Supplier member** — a `(supplier_id, user_id, role)` link; role ∈ `owner` >
  `manager` > `staff`. Membership is what authorizes the dashboard — a `role` flag
  on the user alone is never trusted (§6).
- **Supplier application** — a business submits basic info via `/[locale]/suppliers/apply`.
  It is stored `pending`; **never auto-approved, never auto-verified** (§7/§18).

## Trust rules

- New suppliers are **not** active or verified by default.
- The **verified** badge shows only when `verified = true` — never fabricated (§35/§63).
- Demo suppliers/products are always labelled and never claimed as real (§34/§56).
- **No fake revenue, orders, ratings, reviews, or inventory urgency** anywhere in
  the dashboard. Analytics show only truthful counts; revenue/orders appear when
  checkout exists (§20).

## Authorization (§28/§29)

Two layers, always both:

1. **Server-side** — the `/[locale]/supplier` route resolves membership from the
   httpOnly session (never client input) and renders the workspace only for a
   member; a customer gets an honest "no workspace yet" guard, not a hidden-button
   dashboard. Pure checks live in `src/lib/auth/authorization.ts` (unit-tested):
   `canManageSupplier`, `canManageProduct`, `canPublishProduct` (≥ manager),
   `ownsResource`.
2. **Database (RLS)** — `supabase/migrations/0002_rls.sql` enforces the same rules
   in Postgres via `is_supplier_member` / `can_manage_product`. Supplier A can
   never read a draft or edit a product of Supplier B; the public sees only
   `active` products.

## The workspace (`/[locale]/supplier`)

Sections (§19): **Overview** (truthful product counts), **Products** (create /
edit / publish / unpublish / archive / delete + read-only catalog samples),
**Inventory** (honest status, no urgency), **Requests** (empty — future),
**Analytics** (truthful counts only), **Settings** (profile, verified state).

### Product management (§21–25)

The sectioned product form (`ProductForm`) covers Basic, Pricing, Images,
Dimensions, Materials & colours, Inventory, Customization, and a live **Preview**
that reuses the real catalog `ProductImage`/pricing (no duplicate UI). Everything
is validated with `validateProductInput` — the **same** validator the server
uses — so negative/huge prices, negative/zero dimensions, and unknown
category/colour/material are rejected. Slugs are generated safely and uniquely
(`uniqueSlug`), including for Arabic-only names, so a supplier can never overwrite
another's product by collision (§32). New products default to **draft** (not
public) until published.

Customization options carry a deterministic `price_delta` in OMR — **business
logic owns price changes, never the AI** (§25).

## Demo vs Supabase

- **Demo Mode** (default): the supplier's products live in a labelled local
  workspace (`localStorage`, scoped by supplier id); the demo user can open the
  demo supplier workspace to explore. Catalog samples are attributed by supplier
  name and shown read-only.
- **Supabase Mode**: the `products` table (RLS-scoped to the supplier) is the
  source of truth; the same dashboard UI is DB-backed. Real membership requires an
  approved application + an admin/service action — never a client toggle.

## Custom furniture / RFQ capabilities (Phase 09)

Suppliers gained `supplier_capabilities` (`accepts_custom`, `custom_categories[]`,
`materials[]`, `service_regions[]`, lead-time range) which drive **RFQ matching**:
only **active** suppliers that **accept custom work in the requested category** are
eligible recipients; matches carry transparent, data-backed reasons. The supplier
dashboard **Requests** tab is a real RFQ workspace (New / Quoted / Closed + a
validated quote form) — a supplier quotes only **as its own supplier** for a
request it was **addressed** (enforced server-side / by RLS; Supplier A can't quote
as B). An accepted quote is locked. No fake counts, no invented capabilities for
real suppliers. Full detail in `docs/RFQ_WORKFLOW.md`.

## Public marketplace (§35/§36)

- `/[locale]/suppliers` — active suppliers only; cards show name, location, type,
  and product count; demo suppliers carry the Sample/Demo badge; verified badge
  only when truly verified.
- `/[locale]/suppliers/[slug]` — supplier profile + their public products (reuses
  the shop `ProductGrid`).
