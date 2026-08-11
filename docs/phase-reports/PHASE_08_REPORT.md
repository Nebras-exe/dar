# Phase 08 — Backend Foundation + Auth + Supplier Marketplace — Report

_Status: ✅ Complete & verified. Athathi now has a real marketplace architecture — a Supabase-ready database (schema + migrations + RLS), an auth foundation, a customer account, a public supplier marketplace, and a supplier dashboard with product CRUD — while remaining fully usable in **Demo Data Mode** with zero credentials and without breaking Phases 03–07. Build/lint/typecheck/tests green (111 tests); routes + session + authorization verified live over HTTP; no secrets in the client bundle. **No Supabase project is configured in this environment**, so the DB path is fully built + gated but not live-exercised — the demo fallback runs and one env pair activates the backend with no code change. The Chrome extension did not connect this session (no live click-through)._

## Summary

Phase 08 turns the polished prototype into the **foundation of a real marketplace**: REAL USERS + REAL SUPPLIERS + REAL PRODUCTS + AI. It adds a complete Supabase schema with Row Level Security, an auth architecture (email/password via GoTrue REST + a labelled demo session), a customer account (saved designs, favourites, rooms, orders-later), a public supplier marketplace + profiles, a supplier application flow, and a supplier dashboard with a sectioned product form and inventory/customization foundations. A **catalog repository adapter** lets everything depend on clean interfaces without caring whether data is the Phase 03 demo catalog or Supabase — so the AI Designer/Agent/Visualization keep working untouched.

## Backend mode

`src/lib/backend/config.ts` → `backendMode()`: **`"supabase"`** when both `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set, else **`"demo"`** (default). No SDK is added — Supabase Auth (GoTrue) is called via **server-side `fetch`**, matching the project's established provider pattern (vision/agent). This environment has no project configured → `backendMode()` is `"demo"`.

## Supabase status

**Not configured.** `GET /api/auth/session` → `{signedIn:false,isSupplier:false}`; the marketplace runs on demo data. The complete backend is ready: `supabase/migrations/0001_init.sql` (schema), `0002_rls.sql` (RLS), `0003_seed_demo.sql` (demo seed), plus `supabase/README.md`. Setting the two public env vars (after applying migrations) switches `backendMode()` to `"supabase"` with no code change.

## Database schema

16 tables (`docs/DATABASE.md`): `profiles`, `suppliers`, `supplier_members`, `supplier_applications`, `categories`, `products`, `product_images`, `product_dimensions`, `product_colors`, `product_materials`, `product_variants`, `inventory`, `product_customization_options`, `favorites`, `saved_rooms`, `saved_designs` (+ `saved_design_items`). OMR money is **`numeric(12,3)`** (§33). Future tables (`orders`, `order_items`, `custom_requests`, `quotes`, `manufacturing_jobs`, `deliveries`) are documented but intentionally not built (§5).

## Migrations

Three ordered SQL files applicable via the Supabase CLI (`supabase db reset`/`push`) or `psql` (see `supabase/README.md`). Enums, `updated_at` triggers, indexes, RLS helpers (`is_supplier_member`, `can_manage_product`), and an idempotent demo seed tagged `is_demo = true`.

## Authentication

`src/lib/auth/` — server-only session in an **httpOnly, SameSite=Lax** cookie. `signUpAction` / `signInAction` / `signOutAction` are server actions; in Supabase mode they call GoTrue (`/auth/v1/signup`, `/token?grant_type=password`, `/user`) via server-side `fetch`; in demo mode they create a **clearly-labelled local session** (this browser only, no server account store). `getSession()` reads/validates the cookie. Auth pages (`/login`, `/signup`) match the premium design system — not a generic SaaS screen. Verified: signing in sets the cookie and `/account` becomes accessible; the header reflects state via a booleans-only endpoint (so pages stay static).

## Authorization

Two enforced layers (§28): **server-side** guards (the `/supplier` route resolves membership from the session — never client input — and renders the workspace only for a member; `/account` redirects to login without a session) **and** **RLS** in Postgres. Pure rules in `src/lib/auth/authorization.ts` mirror the policies and are unit-tested. Verified live: a customer session gets the honest "no workspace yet" guard on `/supplier`; only an owner/member session renders the dashboard.

## RLS

`0002_rls.sql` enables RLS on all tables. Public reads only `active` products/suppliers; users own only their own profile/favourites/rooms/designs; supplier members manage only their own supplier's data (publish/archive ≥ manager) via `security definer` helpers. **Supplier A can never read a draft or edit a product of Supplier B.** Applications are applicant-scoped; admin review uses the service role. Reviewed for privilege escalation (helpers pin `search_path`, checks are membership-based, no role is client-trusted).

## Supplier model

See `docs/SUPPLIER_MODEL.md`. Suppliers default `pending`/`verified=false` (never auto-activated); demo suppliers are labelled Sample/Demo; the verified badge shows only when truly verified. Membership (owner/manager/staff) authorizes the workspace.

## Supplier marketplace

`/[locale]/suppliers` lists active suppliers (name, location, type, product count, sample badge); `/[locale]/suppliers/[slug]` shows the profile + public products (reusing the shop `ProductGrid`); `/[locale]/suppliers/apply` submits a validated application (pending; demo submissions acknowledged locally).

## Supplier dashboard

`/[locale]/supplier` — Overview (truthful counts), Products (create/edit/publish/unpublish/archive/delete + read-only catalog samples), Inventory (honest status), Requests (empty/future), Analytics (truthful counts only — **no fake revenue/charts**), Settings. In demo mode products are a labelled local workspace; in Supabase mode the same UI is DB-backed (RLS-scoped).

## Product management

A sectioned product form (§22: Basic, Pricing, Images, Dimensions, Materials & colours, Inventory, Customization, Preview) with a live customer-facing **Preview** reusing the real catalog components (§23). Validated with the **same** `validateProductInput` the server uses; new products default to **draft** (not public) until published; slugs are unique + Arabic-safe.

## Inventory

Structured statuses (`in_stock`/`low_stock`/`out_of_stock`/`made_to_order`) editable per product. **No fake urgency** — inventory reflects only what the supplier sets (§13).

## Customization

`product_customization_options` + a form editor for basic options (`color`/`material`/`size`/`legs`/`fabric`/`wood`/`other`) with a deterministic OMR `price_delta`. `computeConfiguredPrice` (tested) proves **business logic owns price changes, never the AI** (§25).

## Catalog adapter

`src/lib/repository/catalog.ts` (`repoGetProducts`/`repoGetProductBySlug`/`repoSearchProducts`/`repoGetProductsBySupplier`) is the clean seam. In demo mode it wraps the pure Phase 03 catalog; in Supabase mode the same signatures resolve DB-backed active products. Tested: the demo repository matches the pure catalog exactly; fake slugs resolve to null; suppliers isolate.

## Demo fallback

Everything works with no backend: demo auth (local session), demo saved designs + supplier products (`localStorage`, clearly labelled), demo suppliers (structured, `is_demo`). Demo content is always labelled; nothing is claimed as real (§34/§56).

## AI / Agent compatibility

**Phases 04–07 are untouched.** The AI Designer, Agent and Visualization keep consuming the pure `@/lib/catalog` (the demo source of truth), so nothing broke or duplicated. In Supabase mode the repository is the seam that feeds DB-backed active products; wiring the agent tools to the async repository is the documented next integration. Verified: the full test suite (including all Phase 04–07 tests) still passes.

## Arabic / RTL

~180 new bilingual keys (auth, account, suppliers, dashboard, product form, inventory, errors, empty states, nav) in logical Unicode, EN == AR structure. All new routes verified server-rendered on `/ar/*` (`dir="rtl"`); forms, selects, chips, tabs and the dashboard reflow correctly.

## Accessibility

Real labelled form controls with `aria-invalid` + inline errors; native `<select>` for category/type/inventory (accessible, not custom); `role="tablist"`/`tab` with `aria-selected` on the dashboard; colour pickers are `aria-pressed` buttons with `aria-label` (never colour-only); focus-visible throughout; server-side redirects rather than client-only hiding; sign-out is a real form submit.

## Security review

- **Service-role key never in the client** — `SUPABASE_SERVICE_ROLE_KEY` is not imported by any client module and is absent from `.next/static` (grep-verified). Server actions are `"use server"`; GoTrue tokens + session-cookie internals never reach the client bundle (verified).
- **Server-side authz** — supplier workspace + product mutations are gated by session-derived membership, never client-sent ids; `/account` redirects without a session. Mirrored by RLS.
- **Validation (§49)** — negative/huge/NaN prices, negative/zero/oversized dimensions, unknown category/colour/material, bad status/inventory, over-long text — all rejected/normalized (unit-tested). Slug collisions can't overwrite another product.
- **Public exposure** — new products default draft; only `active` is public (RLS + `isPubliclyVisibleProduct`).
- **No raw backend errors** — auth/repository return stable codes; the session endpoint returns booleans only.

## Skills used

See `PHASE_08_SKILLS.md`. Headline: `frontend-design` (premium auth/dashboard within the existing system), `code-review`/`security-review`-style manual passes, and `claude-api` knowledge for the GoTrue REST shape. Testing via `node:test`.

## Browser QA

The Chrome extension did not connect this session (as in Phases 04–07) — not faked. Fallback: all-route HTTP checks (EN + AR) for `/login`, `/signup`, `/account` (307 guard → login), `/suppliers`, `/suppliers/[slug]`, `/suppliers/apply`, `/supplier`; a crafted-cookie authorization matrix proving customer→guard vs member→dashboard and the booleans-only session endpoint; plus responsive/RTL code review. Live database testing was **not** performed (no project) and is not claimed.

## Tests

`npm test` → **111 passing** (21 new: `repository.test.ts` + `auth.test.ts`): mode selection; demo↔catalog adapter compatibility; public-active-only + demo flags; cross-supplier isolation; product validation (bad price/dimensions/category, junk taxonomy dropped, draft default); deterministic configured price; supplier-application validation + email; slug uniqueness + Arabic-safe stubs; authorization (customer denied, member-only, role rank, publish≥manager, ownership, public visibility). No real backend writes.

## Build / Lint / Typecheck

- `npm run lint` → clean, **0 warnings**.
- `npm run typecheck` → clean.
- `npm run build` → success. Existing pages stay **static** (home/shop products/login/signup/suppliers/suppliers[slug]); only per-user pages are dynamic (`/account`, `/supplier`, `/suppliers/apply`, `/shop`) + the API routes (`/api/auth/session` + agent/vision/visualization).

## Known limitations

- **No live Supabase project** → the DB/RLS/GoTrue paths are built + gated but not exercised live; the demo fallback runs. Applying the migrations + setting two env vars activates them.
- Demo auth accounts + saved designs + supplier products are **local to the browser** (clearly labelled) — they are not a real server account until Supabase is configured.
- Admin approval of suppliers is a **data model + service-role workflow** only — no admin UI was built (§41), by design.
- Image upload uses Supabase Storage when configured; in demo mode products render generated art (no upload).
- The AI Agent still reads the pure catalog; DB-backed agent search is the documented next integration (async tools).
- No live browser click-through (extension offline); verified via HTTP + authz matrix + tests + code review.

## Setup instructions

1. Create a Supabase project. 2. Apply `supabase/migrations/0001→0003` (`supabase db reset` or `psql`; see `supabase/README.md`). 3. Copy `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and server-only `SUPABASE_SERVICE_ROLE_KEY`) into `.env.local`. 4. Restart — `backendMode()` becomes `"supabase"`. Without these, the app stays in Demo Data Mode.

## Recommended Phase 09

**Phase 09 — Custom Furniture + Request for Quote (RFQ):** reference image → structured custom specification → supplier matching → RFQ → multiple quotes → comparison → user approval. The supplier + product + membership foundation and the `custom_requests`/`quotes` future tables are already designed for it. **Do not start it.**
