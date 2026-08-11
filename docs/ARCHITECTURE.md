# Athathi — Technical Architecture

Status: **Through Phase 14 (Final Competition Polish + Demo + QA) — COMPETITION BUILD READY**. Phase 14 added no new domain: it hardened + polished the whole product (SEO/`hreflang` metadata, a branded `[locale]` 404 + error boundary via a catch-all route, a security final pass, and the competition deliverables in `docs/COMPETITION_DEMO.md` + `docs/FINAL_PRODUCT_STATUS.md`). Documents the chosen stack, the catalog data layer (Phase 03, §5), the design domain layer (Phase 04, §5.1), the vision layer (Phase 05, §5.2), the agent layer (Phase 06, §5.3), the visualization layer (Phase 07, §5.4), the backend/repository/auth layer (Phase 08, §5.5), the RFQ layer (Phase 09, §5.6), the orders layer (Phase 10A, §5.7), the payment layer (Phase 10B, §5.8), the fulfillment layer (Phase 11A, §5.9), the manufacturing layer (Phase 11B, §5.10), the delivery layer (Phase 12, §5.11), the personalization + notifications + follow-up layer (Phase 13, §5.12), and the direction for later phases. It intentionally does not over-engineer ahead of need.

**Testing:** deterministic catalog + design + vision + agent + visualization + repository/auth + i18n + rfq + orders logic is covered by `node --test` (`catalog.test.ts`, `design.test.ts`, `vision.test.ts`, `agent.test.ts`, `visualization.test.ts`, `repository.test.ts`, `auth.test.ts`, `i18n.test.ts`, `rfq.test.ts`, `orders.test.ts` — 155 tests) with no test-framework dependency and **no external/paid API calls** (vision, the agent's LLM path, and the visualization live path are exercised with injected mock providers). A tiny ESM resolve hook (`scripts/register-ts-resolver.mjs` + `ts-resolver.mjs`) lets the runner execute the app's TypeScript sources unchanged, mapping both extensionless relative imports and the `@/…` path alias; run with `npm test`.

**AI providers:** vision, the agent, and the visualization run server-side only; keys are read from `process.env` and never reach the client. No key is configured in this environment — the designer works fully without one (vision → sample/manual; agent → Demo Agent; visualization → Demo Preview). Enable via `.env.example` names (`ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY`; optional `ATHATHI_VISION_PROVIDER`/`ATHATHI_VISION_MODEL`, `ATHATHI_AGENT_PROVIDER`/`ATHATHI_AGENT_MODEL`, `ATHATHI_VISUALIZATION_PROVIDER`/`ATHATHI_VISUALIZATION_MODEL`).

## 1. Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 16 (App Router)** | SSR/SSG, file-based routing, first-class i18n, future server actions for the agent. |
| Language | **TypeScript (strict)** | Type-safe catalog, dictionaries, and future agent tool contracts. |
| Styling | **Tailwind CSS v4** | Token-first, CSS-variable theme, logical-property utilities for RTL. |
| Icons | **lucide-react** | One consistent, elegant line-icon set (no emoji, no mixed styles). |
| Fonts | **next/font (Google)** | Self-hosted, `font-display: swap`, no external font requests at runtime. |
| Lint | **ESLint (eslint-config-next)** | Baseline quality gate. |

No component library was added — Athathi uses a **custom premium visual language**, not a library-demo look. Only one runtime dependency (`lucide-react`) was introduced beyond the framework.

### Runtime versions (this environment)

- Node **v24.18.0**, npm **11.16.0**.
- Next **16.3.0**, React **19.2.8**, Tailwind **^4**, TypeScript **^5**.

## 2. Folder structure

```
src/
  app/
    [locale]/            # locale-scoped routes (renders <html lang dir>)
      layout.tsx         # header + footer + fonts + metadata
      page.tsx           # Phase 01 foundation showcase
    globals.css          # design tokens + base layer + utilities
  components/
    ui/                  # reusable primitives (button, chip, card, input, …)
    layout/              # header, site-footer
    shared/              # logo, locale-switcher
  features/
    foundation/          # showcase-only building blocks (color swatch, style chips, …)
  i18n/
    config.ts            # locales, direction, helpers
    dictionaries.ts      # typed loader (server-only)
    dictionaries/        # en.json, ar.json
  lib/
    fonts.ts             # next/font setup
    utils.ts             # cn(), formatOmr()
  proxy.ts               # locale negotiation + prefixing (Next 16 "proxy")
```

Added in Phase 03:

```
src/
  app/[locale]/
    shop/page.tsx                 # catalog browsing (dynamic — reads searchParams)
    shop/[category]/page.tsx      # category-scoped browsing
    product/[slug]/page.tsx       # product detail (SSG via generateStaticParams)
    cart/page.tsx                 # local demo cart
  lib/catalog/                    # PURE, framework-free catalog layer (see §5)
    types.ts taxonomy.ts products.ts queries.ts pricing.ts index.ts
    catalog.test.ts               # node:test suite
  features/
    shop/       # url-state bridge, filter/search/sort controls, grid glue, product art gallery
    cart/       # CartProvider (useSyncExternalStore) + cart view
    favorites/  # FavoritesProvider (useSyncExternalStore)
  components/shop/                # ProductArt, ProductImage, ProductGrid, FavoriteButton
scripts/                          # ts-resolver.mjs (node:test), render-art-preview.mjs (visual QA)
```

Added in Phase 04:

```
src/
  app/[locale]/design/page.tsx    # AI Designer route (prerendered per locale)
  lib/design/                     # PURE design domain layer (see §5.1)
    types.ts room-needs.ts reasons.ts recommend.ts demo-service.ts index.ts
    design.test.ts                # node:test suite (17 tests)
  features/design/                # wizard shell, reducer+persistence, steps,
                                  # demo analysis, result, budget meter, item card
```

Added in Phase 05:

```
src/
  app/api/vision/analyze/route.ts # server-side room-image analysis (Node runtime)
  lib/vision/                     # provider-agnostic vision layer (see §5.2)
    types.ts schema.ts prompt.ts mapping.ts service.ts index.ts
    providers/{types,demo,anthropic,openai,gemini}.ts
    vision.test.ts                # node:test suite (18 tests)
```

Added in Phase 06:

```
src/
  app/api/agent/route.ts          # server-side Agent endpoint (Node runtime)
  lib/agent/                      # tool-using Agent layer (see §5.3)
    types.ts validation.ts tools.ts intent.ts demo.ts prompts.ts
    orchestrator.ts service.ts index.ts
    providers/{types,anthropic,openai}.ts
    agent.test.ts                 # node:test suite (23 tests)
  features/design/agent-panel.tsx # the "Ask Athathi" control panel
```

Added in Phase 07:

```
src/
  app/api/visualization/generate/route.ts  # server-side before/after preview (Node runtime)
  lib/visualization/                        # provider-agnostic visualization layer (see §5.4)
    types.ts fingerprint.ts schema.ts prompt.ts mapping.ts service.ts index.ts
    providers/{types,demo}.ts
    visualization.test.ts                   # node:test suite (17 tests)
  components/ui/before-after-slider.tsx     # generalized, shared comparison slider (Phase 02 + 07)
  features/design/
    room-image-context.tsx                  # session-scoped room photo (never persisted)
    visualization-section.tsx               # the before/after section + state machine
    visualization-preview.tsx               # before/after composition (demo + generated)
    visualization-product-card.tsx          # colour-selectable, dimensioned product card
```


## 3. Localization strategy

- **Locale in the URL** (`/en`, `/ar`). `src/proxy.ts` (Next 16's renamed middleware) prefixes any unprefixed path, negotiating from `Accept-Language` (never IP), defaulting to `en`.
- The **`[locale]` layout** sets `<html lang dir>` on the server, so direction and language are correct on the first paint — no client flash, no LTR-only assumptions.
- **Typed dictionaries**: `en.json` defines the `Dictionary` type; every other locale must satisfy it — a missing key is a compile error.
- **RTL correctness** comes from logical CSS properties (`ps/pe`, `ms/me`, `start/end`, `text-start`) plus `rtl:` variants for the few directional glyphs (e.g. arrows). The same component code renders both directions.
- Numbers/currency use `Intl.NumberFormat` (`formatOmr`) for real values; sample demo strings are localised in the dictionaries.
- Later phases can adopt `next-intl`/ICU message formatting without changing the routing model.

## 4. Design system

Tokens live as CSS variables in `globals.css`, mapped into Tailwind via `@theme` so they are usable as utilities (`bg-brand`, `text-muted`, `rounded-lg`, shadow vars). One warm light theme; `color-scheme: light` is committed deliberately. Full detail in `DESIGN_SYSTEM.md`.

## 5. Data architecture

**Built in Phase 03 (`src/lib/catalog/`).** The catalog is a **pure, framework-free layer** — no React/Next imports — so the same code runs in a Server Component, a Node test, or a future AI-agent tool. This is deliberate: the agent must reuse the exact functions the UI uses, never a parallel implementation.

- `types.ts` — the typed `Product` model. Everything filterable is a **machine value** (category/style/colour/material/room slugs + numeric price + structured `Dimensions` in cm); human-readable text is stored as `{ en, ar }` pairs. Money and sizes are numbers so totals and room-fit checks are deterministic; formatted strings are always derived, never stored.
- `taxonomy.ts` — bilingual categories/styles/colours (with hex)/materials/rooms, ordered value lists, and type guards.
- `products.ts` — 79 demo products built from compact rows (colours expanded from the taxonomy; deterministic `addedAt`/`featuredRank`). Frozen at module load.
- `queries.ts` — the deterministic query contract: `getAllProducts`, `getProductBySlug`, `getProductsByCategory`, `getCategories`, **`filterProducts(ProductFilter)`** (facets AND, values OR; supports price/width bounds, availability, customizable, free-text), **`sortProducts`**, **`getRelatedProducts`** (shared category/style/room + price proximity), `getPriceBounds`.
- `pricing.ts` — OMR-correct (3-decimal) `roundOmr`/`computeSubtotal`/`computeItemCount`/`formatOmr`.

The URL is the shop's state: `features/shop/url-state.ts` is the single bridge that parses `searchParams` → validated `ShopState` → `ProductFilter` (shared by server pages and client controls). `ProductImage` is the seam between generated demo art and real `next/image` photography.

**Client stores** (cart, favourites) use `useSyncExternalStore` over a small `localStorage`-backed store (`features/shop/persistent-store.ts`) — no `setState`-in-effect, no hydration warning, cross-tab sync for free. The cart stores only intent (slug + colour + quantity); price/name are re-derived from the catalog every render.

**Later backend:** PostgreSQL, likely via **Supabase** (auth, relational DB, image storage). The pure query layer already behaves like a repository interface, so a real DB can back the same function signatures; anticipated entities: `users, rooms, room_images, style_profiles, suppliers, products, product_variants, product_customization_options, design_projects, design_items, carts, cart_items, orders, order_items, agent_sessions` (future: `custom_requests, quotes, manufacturing_jobs, deliveries`). Secrets go through `.env.example`; nothing committed.

### 5.1 Design domain layer (Phase 04)

`src/lib/design/` is a second **pure, framework-free** layer built ON TOP of the catalog — it never re-implements catalog logic and holds the single product source of truth by resolving slugs from `@/lib/catalog`.

- `types.ts` — `DesignInput` (roomType, numeric budget, primary/secondary style, preferred colours/materials, keep/replace `FurnitureDecision[]`, optional note/imageName) and the outputs `DesignItem` / `DesignOption` / `BudgetSummary` / `DesignRecommendation`.
- `room-needs.ts` — per-room ordered category plans (essentials first) + catalog-room mapping.
- `recommend.ts` — `buildDesignRecommendation(input)` produces three budget-aware tiers using `filterProducts` + `computeSubtotal`; `findReplacements`/`pickReplacement` handle cheaper/similar/upgrade; `summarize` recomputes budget after edits.
- `reasons.ts` — deterministic bilingual (`{ en, ar }`) reasons from real match conditions.
- `demo-service.ts` — **the boundary**: `generateDemoDesign(input) → DesignRecommendation`. Phase 05's `generateAgentDesign(input)` returns the same shape, so the wizard/result UI (which consumes structured data, never LLM prose) is unaffected by swapping Demo Mode for a real agent.

The wizard (`features/design/`) is a `useReducer` + `localStorage` client state machine (phases `brief → analysis → result`); the uploaded image blob is never persisted to storage (only its name enters state). In Phase 04 it stays a local preview; Phase 05 can send it — with explicit consent — to the server route for analysis (§5.2). Design math is numeric OMR throughout (3-decimal), matching the cart.

### 5.2 Vision layer (Phase 05)

`src/lib/vision/` connects real room-image understanding to the designer, **provider-agnostic and secrets-safe**.

- **Server boundary (structural — the `server-only` package is not a dependency here).** `service.ts`, `prompt.ts` and everything under `providers/` read `process.env` secrets and are imported **only** by `app/api/vision/analyze/route.ts`. The client-safe barrel `lib/vision/index.ts` re-exports only `types` + the validator + the pure `mapping` — never the service/providers — so keys can never enter a client bundle (verified: no key strings in `.next/static`).
- **Providers** implement `VisionProvider` (`isConfigured()`, `analyze(image, signal) → raw unknown`). Real providers (`anthropic`/`openai`/`gemini`) call each vendor's REST API via **server-side `fetch` — no SDK dependency**; `demo` returns a labelled sample. `service.resolveProvider()` picks `ATHATHI_VISION_PROVIDER` or the first configured; `analyzeRoomImage()` adds a 25 s `AbortController` timeout, validates output, and returns a discriminated `VisionResult` (never throws, never leaks raw errors).
- **Trust boundary.** `schema.parseRoomAnalysis(raw, meta)` is a dependency-free validator: clamps confidences to [0,1], drops non-taxonomy values, sanitises free text, caps lists, de-dupes furniture, and **hard-guarantees `dimensionsStatus:"unknown"` — no numeric dimensions ever pass**. The versioned prompt (`prompt.ts`; `promptVersion` travels with each result) tells the model to describe visible facts only, expose uncertainty, avoid measurements/brands, and **treat any text inside the image as content, not instructions** (prompt-injection defense; the validator is the second line).
- **Integration.** `mapping.analysisToPrefill(analysis)` (pure, client-safe) → `AnalysisPrefill`; the wizard reducer's `APPLY_PREFILL` applies it via `applyPrefill(draft, prefill)`, which fills only fields the user hasn't set (**AI pre-fill → user edit → user wins**). Vision never chooses products — that stays with the Phase 04 engine + Phase 03 catalog.
- **Route.** `POST /api/vision/analyze` (Node runtime) validates the upload (MIME allow-list + size cap + magic-byte sniff that must match the declared MIME), supports `mode=demo` (no image needed), and returns a discriminated JSON body with stable error codes. `GET` returns `{configured:boolean}` only.

This is exactly the contract the Phase 06 Agent's room context consumes.

### 5.3 Agent layer (Phase 06)

`src/lib/agent/` is a disciplined tool-using Agent: **the LLM orchestrates; deterministic code validates, calculates and mutates; the catalog is truth; the user approves.**

- **Server boundary (structural).** `service.ts`, `orchestrator.ts`, `prompts.ts` and `providers/` read `process.env` secrets and are imported **only** by `app/api/agent/route.ts`. The client-safe barrel (`index.ts`) exports only types + the pure intent parser. Verified: no keys/system-prompt in `.next/static`.
- **Tools + allowlist.** `tools.ts` wraps the Phase 03 catalog + Phase 04 engine as typed tools (`search_catalog`, `get_product`, `check_budget`, `build_design`, `find_replacement`, `apply_replacement`, `remove_item`, `recalculate_design`, `check_product_fit`, `prepare_cart`) in an allowlisted `toolRegistry`. `runTool(name,args)` rejects unknown names. `validation.ts` coerces + taxonomy-checks every argument; **slugs are valid only if they resolve to real products**. Money uses the exact OMR helpers — never model arithmetic.
- **Two engines, one contract.** `service.runAgent(req)` returns an `AgentResponse` whether produced by the LLM path or the Demo Agent. When a provider (`ATHATHI_AGENT_PROVIDER` / first configured) exists, `orchestrator.runProviderAgent` runs a **bounded (`MAX_AGENT_STEPS=8`), validated tool loop**: the provider proposes tool calls; the orchestrator rejects unknown names, forces the current server-side design into design-scoped tool args (no smuggling), executes, and feeds results back; any result carrying `items` updates the working design; `prepare_cart` sets an approval gate. With no provider, `demo.runDemoAgent` parses a constrained EN+AR intent set (`intent.ts`) and executes the same deterministic tools.
- **Approval boundary.** The Agent may search/compare/modify the design draft freely, but `prepare_cart` only proposes; `requiresApproval` gates the actual `cart.add` behind an explicit UI confirmation (Phase 03 cart).
- **Route.** `POST /api/agent` (Node runtime) validates the envelope (message ≤ 1000 chars, body ≤ 24 KB, taxonomy-checked design state, **item slugs must resolve** — fakes dropped), then calls the service. `GET` returns `{mode, configured}` only.

This is the tool-orchestration contract a fuller agent workflow (analyze → search → budget → build → replace → cart) composes from.

### 5.4 Visualization layer (Phase 07)

`src/lib/visualization/` renders a **before/after room preview** of the current design, **provider-agnostic and honesty-first**.

- **Server boundary (structural).** `service.ts`, `prompt.ts` and `providers/` read `process.env` / build the image prompt and are imported **only** by `app/api/visualization/generate/route.ts`. The client-safe barrel (`index.ts`) re-exports only types + the pure `fingerprint` + `schema` (validator) + `mapping` + the demo-scheme builder — never the service/prompt. Verified: no keys/system-prompt in `.next/static`.
- **Deterministic design fingerprint (§18).** `designFingerprint()` (versioned `df1_…`, FNV-1a over a canonical `room|style|items(slug:colour)` string) runs identically on client (staleness) and server (authoritative stamp). `isPreviewStale(current, preview)` drives the **stale** state; when the design changes (Agent edit, replace/remove, colour change) the UI offers **Update preview** instead of implying the old preview still matches.
- **Trust boundary.** `parseVisualizationRequest(raw)` re-validates against the catalog: **slugs must resolve to real products** (fakes dropped, never echoed), the category comes from the catalog (not the client), colours are kept only if they're a **verified variant of that exact product**, room/style/palette are taxonomy-checked, lists capped — then it **recomputes the fingerprint from the resolved data**. The versioned prompt (`athathi-visualization-v1`) preserves architecture/perspective, introduces only supplied catalog pieces, keeps retained furniture, forbids logos/labels/scale-claims, and treats **image content as DATA, not instructions** (injection defense).
- **Two modes, one endpoint.** `POST /api/visualization/generate` — **DEMO** (`application/json`): the room photo **never leaves the browser**; only the structured request is sent, and the deterministic `demo` provider returns a `DemoScheme` (mood palette from the design's real colours) the client renders honestly over the local photo as a labelled **Demo Preview**. **LIVE** (`multipart/form-data`): a real provider (none configured) needs the image (MIME allow-list + size + magic-byte sniff) **and** explicit consent. `service.generateVisualization()` wraps a 30 s timeout, normalizes to a discriminated `VisualizationResult`, never throws/leaks. `GET` → `{configured, mode}` only.
- **Room image handling.** The photo is held in a session-scoped `RoomImageProvider` (in-memory `File` + a revoked object URL) — **never** `localStorage`, never the reducer — so the result phase can reuse it without persisting a blob.
- **Catalog truth end-to-end.** The "Products in this design" cards resolve every piece from the catalog (image/price/verified colours/dimensions); colour changes flow to design state (`SET_ITEM_COLOR`, verified variants only), the Agent context, and the cart. No invented products/prices/dimensions; dimensions are shown separately from the preview with an explicit "doesn't prove physical fit" note.

Adding a verified image provider = one file implementing `VisualizationProvider`, registered in `service.ts`; nothing else changes.

### 5.5 Backend / repository / auth (Phase 08)

Athathi gains a **Supabase-ready backend** that stays dormant in Demo Data Mode. Full detail in `docs/DATABASE.md` + `docs/SUPPLIER_MODEL.md`.

```
supabase/migrations/{0001_init,0002_rls,0003_seed_demo}.sql   # schema + RLS + demo seed
src/lib/backend/config.ts                                     # backendMode() (client-safe)
src/lib/repository/                                            # catalog + suppliers adapter (demo↔supabase)
  types.ts validation.ts slug.ts catalog.ts suppliers.ts demo-suppliers.ts actions.ts index.ts
  repository.test.ts
src/lib/auth/                                                 # session (server-only) + actions + gotrue + authorization
  types.ts session.ts actions.ts gotrue.ts authorization.ts auth.test.ts
src/app/[locale]/{login,signup,account,suppliers,suppliers/[slug],suppliers/apply,supplier}/page.tsx
src/app/api/auth/session/route.ts                             # booleans-only session probe (keeps pages static)
src/features/{auth,account,supplier}/                         # forms, dashboard, local demo stores
```

- **Mode.** `backendMode()` → `"supabase"` when both public env vars are set, else `"demo"`. **No SDK** — Supabase Auth (GoTrue) and PostgREST are reached via **server-side `fetch`** (the project's established pattern). This environment: `"demo"`.
- **Repository adapter (§5 seam).** `repoGetProducts`/`repoGetProductBySlug`/`repoSearchProducts`/`repoGetProductsBySupplier` — in demo mode adapt the pure Phase 03 catalog (so Phases 04–07 are untouched); in Supabase mode resolve DB-backed **active** products. Same signatures, one seam.
- **Auth.** httpOnly, SameSite=Lax cookie session; `signUp/signIn/signOut` server actions (GoTrue REST when configured, a labelled **demo local session** otherwise); `getSession()` is server-only. The header reflects state via `GET /api/auth/session` (booleans only) so existing pages stay **static**.
- **Authorization (two layers).** Server-side membership guards (never client-sent ids) + **RLS** in Postgres, mirrored by pure, unit-tested rules in `auth/authorization.ts`. Public sees only `active` products; users own only their own resources; supplier members manage only their own supplier (publish/archive ≥ manager). **Supplier A can never touch Supplier B.**
- **Money.** OMR is `numeric(12,3)` in the DB; numeric throughout TS (`roundOmr`/`formatOmr`) — never stored as a formatted string.
- **Secrets.** `SUPABASE_SERVICE_ROLE_KEY` is server-only, never imported client-side, verified absent from `.next/static`.

### 5.6 RFQ / custom-furniture layer (Phase 09)

`src/lib/rfq/` (pure, client-safe) turns an idea into comparable supplier quotes. Full detail in `docs/RFQ_WORKFLOW.md`.

```
src/lib/rfq/
  types.ts spec-fields.ts validation.ts extract.ts matching.ts
  demo-quotes.ts quote-calc.ts authorization.ts index.ts rfq.test.ts
src/features/custom/         # custom-experience + steps/ + rfq-store + account-requests
src/features/supplier/supplier-rfq.tsx   # the supplier RFQ dashboard (quote form)
src/app/[locale]/custom/page.tsx
supabase/migrations/{0004_custom_furniture_rfq,0005_rfq_rls}.sql
```

- **Spec.** `CustomFurnitureSpec` is category-aware (`spec-fields.ts` → progressive disclosure); dimensions support an explicit `"unknown"` (ask the supplier). `validateSpec` bounds everything and encodes the minimum for a ready RFQ.
- **Extraction.** `extractSpecFromText` proposes fields from the user's own words (stated facts only, EN + Arabic, reuses the Phase 05 mappers) — deterministic; the user reviews. A real Agent/Vision provider proposes the same shape server-side.
- **Matching.** `matchSuppliers` uses real supplier data + `supplier_capabilities`: only active + accept-custom + right-category suppliers are eligible; transparent, data-backed reasons; fake/ineligible recipients dropped.
- **Quotes + money.** `quoteTotal`/`budgetPosition`/`sortQuotes`/`recommendQuote` are exact-OMR + deterministic (no LLM arithmetic; recommendation is reasons, not a score; a promoted-listings firewall is enforced). `generateDemoQuotes` is deterministic per (request, supplier).
- **Authorization.** `authorization.ts` mirrors `0005_rfq_rls.sql`: customer owns their request/quotes; supplier reads/quotes only for RFQs addressed to a supplier it belongs to (A can't quote as B); accepted quotes are locked. Unit-tested.
- **Agent tools.** The Phase 06 registry gained `create_custom_spec` / `find_custom_suppliers` / `list_quotes` / `compare_quotes` / `recommend_quote` — allowlisted, validated, rfq-backed; they never invent quotes/suppliers/prices, and never accept (the customer does).
- **Mode.** Demo: a labelled `localStorage` RFQ store (deterministic Demo Quotes; reference images stay local). Supabase: `custom_requests`/`quotes` (RLS-scoped) are the source of truth. No payment/order (Phase 10).

### 5.7 Orders / checkout layer (Phase 10A)

`src/lib/orders/` (pure, client-safe) turns a cart OR an accepted quote into an immutable, supplier-grouped order. Full detail in `docs/phase-reports/PHASE_10A_REPORT.md`.

```
src/lib/orders/  types.ts totals.ts snapshot.ts validation.ts authorization.ts index.ts orders.test.ts
src/features/orders/  order-store.ts  checkout-experience.tsx  order-views.tsx
src/app/[locale]/checkout/page.tsx   src/app/[locale]/orders/[id]/page.tsx
supabase/migrations/{0006_orders,0007_orders_rls}.sql
```

- **One architecture, two sources.** `buildCartDraft` (catalog cart) and `buildQuoteDraft` (accepted quote) both produce a `CheckoutDraft` of `SupplierOrderGroup`s → the same checkout, order, and views.
- **Immutable snapshots (§6).** Order items copy name/price/dimensions (catalog) or the accepted quote terms + frozen spec (custom) at order time; later catalog/quote changes never alter history.
- **Money (§7).** `totals.ts` computes per-supplier + order totals in exact 3-decimal OMR; the client never supplies a total — it is always recomputed on create.
- **Validation.** `validateAddress` (Oman fields), `revalidateCart` (re-resolve against the catalog; drop fakes; clamp qty; surface price changes but always charge the catalog price), `validateAcceptedQuote` (owned + accepted only — never a browser-supplied quote id).
- **Authorization (§21/§22).** `authorization.ts` mirrors `0007_orders_rls.sql`: a customer reads/confirms only their own order; a supplier reads only its own group (`redactOrderForSupplier`) and updates only its own group's status. `order_items` are readable to the owner OR the group's supplier — cross-supplier items are never exposed. Routes are auth-gated.
- **Agent.** `summarize_checkout` (allowlisted, deterministic) groups the cart with exact totals and `requiresApproval: true` — it never confirms; confirmation is an explicit UI action.
- **Mode.** Demo: a labelled `localStorage` order store (`isDemo`). Supabase: `orders`/`order_groups`/`order_items` (RLS-scoped). Payment is a separate domain — §5.8.

### 5.8 Payment layer (Phase 10B)

`src/lib/payments/` (pure; providers server-oriented) turns a **confirmed order** into a
**paid order** through a provider-agnostic layer. Full detail in `docs/PAYMENT_ARCHITECTURE.md`.

```
src/lib/payments/  types.ts status-machine.ts intent.ts authorization.ts index.ts payments.test.ts
                   providers/{demo,index}.ts
src/features/orders/  payment-store.ts  payment-experience.tsx
src/app/[locale]/orders/[id]/payment/page.tsx
src/app/api/payments/{create-intent,verify,status,webhook/[provider]}/route.ts
supabase/migrations/{0008_payments,0009_payments_rls}.sql
```

- **Flow.** `CONFIRMED → PAYMENT INTENT → PENDING → (provider.verify) → PAID → receipt`; on decline `FAILED → retry`. Payment status is **separate** from `Order.status`.
- **Provider abstraction (§4).** `PaymentProvider` interface; `resolveProvider` returns a configured real gateway or the Demo provider. `REAL_PROVIDERS` is intentionally empty → `paymentMode() = "demo"`. Adding a real, hosted/tokenized gateway is one file + a registry line; checkout/orders/UI are unchanged.
- **Amount authority (§15).** The intent amount is always `order.totals.grandTotal`; `assertOrderAmount` rejects a tampered client amount; the API `create-intent` route never reads the amount from the body.
- **Idempotency (§16).** `unique(order_id)` + `findReusableIntent`; a `paid` intent is returned as-is, never re-created or re-charged.
- **Verification (§17).** `paid` is set only by `provider.verify()` passing the status-machine gate — never a client `?success`/localStorage flag. The `verify` API route documents the same server-side rule.
- **Safe transitions.** `status-machine.ts` is the only path; `paid`/`cancelled` terminal; `failed`/`expired` → `pending` (retry); `paid → pending` impossible without a documented refund.
- **Authorization (§8/§22).** Owner-only intents; `supplierPaymentView` exposes only paid/awaiting; `AGENT_CAN_PAY=false`; `summarize_payment` is read-only.
- **No raw card data.** No card/CVV/PIN/bank field exists; only safe `providerReference`s are stored. Secrets are server-only; routes return booleans/enum + stable safe codes.
- **Mode.** Demo: a labelled `localStorage` intent store (`athathi.payments.v1`, `isDemo`). Supabase: `payment_intents`/`payment_attempts`/`payment_events` (RLS-scoped). Refunds documented, not built.

### 5.9 Fulfillment layer (Phase 11A)

`src/lib/fulfillment/` (pure) turns a **paid** order into a per-supplier fulfillment
handoff. SEPARATE domain from order status and payment status. Full detail in
`docs/FULFILLMENT_WORKFLOW.md`.

```
src/lib/fulfillment/  types.ts status-machine.ts fulfillment.ts authorization.ts notifications.ts index.ts fulfillment.test.ts
src/features/orders/  fulfillment-store.ts  (+ order-views.tsx: supplier controls, customer timeline, account summary)
supabase/migrations/{0010_fulfillment,0011_fulfillment_rls}.sql
```

- **Per-supplier lifecycle (§6).** `awaiting_supplier → accepted → preparing → ready_for_next_stage` (or `declined`/`cancelled`); each `order_group` has its own state — a multi-supplier order is never one status.
- **Paid-only entry (§4).** `canCreateFulfillment(paymentStatus)` + the `assert_order_paid` insert trigger gate creation. Order/payment/fulfillment stay three separate fields.
- **Safe state machine.** `status-machine.ts` allowlists transitions; terminals never regress; `availableSupplierActions` drives the UI, and the store re-checks the machine (a hidden button is never the only guard).
- **Snapshot reference (§8/§24).** A fulfillment references the order group by id — it never re-reads current catalog pricing; the purchase contract is the immutable order snapshot.
- **Auditable events (§9).** Every transition appends an immutable `FulfillmentEvent`; the decline internal note is never placed in an event or the customer timeline (§12).
- **Authorization (§26).** Customer reads own; supplier reads/manages own group only; customer never writes; `AGENT_CAN_MANAGE_FULFILLMENT=false`; `summarize_fulfillment` is read-only. Mirrored in `0011` RLS.
- **Notifications (§20/§30).** `FulfillmentNotifier` contract + `demoNotifier` (records, `delivered:false`) — ZERO external messaging; a real provider drops in behind the same interface.
- **Mode.** Demo: a labelled `localStorage` store (`athathi.fulfillments.v1`, `isDemo`). Supabase: `fulfillments`/`fulfillment_events` (RLS-scoped). Manufacturing/delivery detail is Phase 11B.

### 5.10 Manufacturing layer (Phase 11B)

`src/lib/manufacturing/` (pure) is the CUSTOM-furniture continuation of fulfillment —
production + a real quality-check loop ending at `ready_for_delivery`. A FOURTH
SEPARATE domain from order/payment/fulfillment status. Full detail in
`docs/MANUFACTURING_WORKFLOW.md`.

```
src/lib/manufacturing/  types.ts status-machine.ts manufacturing.ts authorization.ts notifications.ts index.ts manufacturing.test.ts
src/features/orders/  manufacturing-store.ts   src/features/supplier/manufacturing-workspace.tsx
                      (+ order-views.tsx: customer manufacturing timeline)
supabase/migrations/{0012_manufacturing,0013_manufacturing_rls}.sql
```

- **Custom-only, ready-gated (§4/§22).** `groupNeedsManufacturing` (has a custom item) + `canCreateManufacturing(fulfillmentStatus, isCustom)` (`ready_for_next_stage`). Catalog groups bypass manufacturing and keep their Phase 11A fulfillment timeline. The `assert_custom_and_ready` insert trigger enforces the same in the DB.
- **State machine (§6).** `not_started → manufacturing → manufacturing_completed → quality_check → qc_passed → ready_for_delivery`; fail loop `quality_check → qc_failed → rework → manufacturing_completed`. `ready_for_delivery` terminal (Phase 12 seam); illegal jumps rejected.
- **Snapshot reference (§7/§8).** The job references the accepted order-group spec by `(orderId, supplierId)` + `fulfillmentId` — it never duplicates or mutates the immutable snapshot; the manufacturing contract IS the accepted spec (change-orders are future).
- **Append-only history (§9/§18).** Every transition appends an event; QC attempts are numbered and never overwritten (`unique(job_id, attempt)`); a failed inspection is preserved across rework.
- **QC (§14–§17).** Manual supplier QC: 8-criterion checklist (pass requires all), structured issues (category + severity), rework + resubmit opens the next attempt.
- **Authorization (§25).** Customer reads a safe view; supplier reads/manages own supplier only; customer never writes; issue descriptions supplier-only; `AGENT_CAN_MANAGE_MANUFACTURING=false`; `summarize_manufacturing` is read-only. Mirrored in `0013` RLS.
- **Notifications (§24).** `ManufacturingNotifier` + `manufacturingNotifier` (records, `delivered:false`) — ZERO external messaging.
- **Mode.** Demo: a labelled `localStorage` store (`athathi.manufacturing.v1`, `isDemo`). Supabase: `manufacturing_jobs`/`manufacturing_events`/`quality_checks`/`quality_issues` (RLS-scoped). Delivery/installation is Phase 12.

### 5.11 Delivery + installation layer (Phase 12)

`src/lib/delivery/` (pure) is the operational finish — scheduling → assignment →
out-for-delivery → delivered → optional installation → handover → `completed`. A
FIFTH SEPARATE domain. No real courier / GPS. Full detail in
`docs/DELIVERY_INSTALLATION_WORKFLOW.md`.

```
src/lib/delivery/  types.ts status-machine.ts slots.ts delivery.ts authorization.ts notifications.ts index.ts delivery.test.ts
src/features/orders/  delivery-store.ts  slot-picker.tsx  (+ order-views.tsx: customer tracking)
src/features/supplier/  delivery-workspace.tsx
supabase/migrations/{0014_delivery,0015_delivery_rls}.sql
```

- **Eligibility (§5).** `canCreateDelivery(isCustom, fulfillmentStatus, manufacturingStatus)` — custom needs manufacturing `ready_for_delivery`; catalog needs fulfillment `ready_for_next_stage`. Ready-stock never manufactures. The `assert_delivery_eligible` insert trigger enforces the same.
- **State machines (§7/§21).** Delivery: `awaiting_schedule → scheduled → assigned → out_for_delivery → delivered → completed`, fail loop `out_for_delivery → delivery_failed → reschedule_required → scheduled`. Installation: `not_required / awaiting_schedule → scheduled → in_progress → completed / issue`. `completed`/`cancelled` terminal; illegal jumps rejected.
- **Completion rule (§25).** `delivered → completed` requires any REQUIRED installation to be `completed`; handover is customer-safe (no signature/biometrics).
- **Address snapshot (§10).** An immutable `DeliveryAddressSnapshot` captured at creation — never follows later account-address edits.
- **Slots (§11/§12).** Deterministic demo windows over the next 7 days; `isValidSlot` rejects past/malformed/impossible; no external calendar, no invented availability.
- **Append-only history (§8/§19).** Every transition appends an event; failed delivery attempts are preserved across reschedules.
- **Authorization (§33).** Customer reads own + sets only the slot; supplier reads/manages own supplier only (incl. the customer phone/address snapshot); customer never writes status; `AGENT_CAN_MANAGE_DELIVERY=false`; `summarize_delivery` is read-only. Mirrored in `0015` RLS.
- **No fake GPS (§28).** Tracking is status + timeline only; assignment is a labelled Demo Delivery Team; notifications are Demo/Log (`delivered:false`) — ZERO external.
- **Mode.** Demo: a labelled `localStorage` store (`athathi.deliveries.v1`, `isDemo`). Supabase: `deliveries`/`delivery_events`/`delivery_attempts`/`installations`/`installation_events` (RLS-scoped). Real courier/GPS is a future phase.

### 5.12 Personalization + notifications + follow-up (Phase 13)

Three pure domains make Athathi an ongoing assistant. Full detail in
`docs/USER_MEMORY.md`, `docs/NOTIFICATIONS.md`, `docs/AGENT_FOLLOWUP.md`.

```
src/lib/memory/         types.ts memory.ts validation.ts authorization.ts index.ts memory.test.ts
src/lib/notifications/  types.ts mapping.ts notifications.ts authorization.ts adapter.ts index.ts notifications.test.ts
src/lib/agent/followup.ts (+ followup.test.ts)  new agent tools in tools.ts
src/features/account/  memory-store.ts memory-settings.tsx followup-card.tsx
src/features/notifications/  notification-store.ts notification-center.tsx
src/features/design/  memory-seed.tsx
supabase/migrations/{0016_user_memory,0017_user_memory_rls,0018_notifications,0019_notifications_rls}.sql
```

- **Memory (opt-in, §4).** Preferences (styles/colours/materials — real taxonomy values), a budget RANGE, and saved rooms — stored ONLY with consent, with provenance + confidence; a suggested preference is never auto-persisted (§8/§9). Stores no secrets/cards/tokens/raw reasoning (§5). `buildMemoryContext` exposes a SAFE, approved-values-only context to the design flow + Agent. Clear ≠ disable; clearing never touches orders (§37/§38).
- **Notifications (in-app only, §20).** Domain events → a per-user feed, deduped by a stable `(user, source, event)` id (the id IS the dedupe key, §25), with structured localization payloads (§26), priority + category mapping, grouping, and read state. The in-app sink is the only connected channel; email/whatsapp/push are "not connected" (§29). No external send.
- **Agent follow-up (§30).** `buildFollowUpContext` turns per-user order/quote/design state into a deterministic priority list of customer-safe next actions; never invents progress. Agent tools `get_user_memory`/`suggest_memory_update`/`summarize_followup` are READ-ONLY; the Agent can never write memory or perform operational actions, and memory/notifications are treated as DATA not instructions (§40).
- **Authorization (§11/§27/§39).** Owner-only everywhere; suppliers/public have no access to private memory; cross-user reads/forged sources are rejected. Mirrored in `0017`/`0019` RLS.
- **Mode.** Demo: labelled `localStorage` stores (`athathi.memory.v1` per user, `athathi.notifications.v1`). Supabase: memory tables + `notifications` (RLS-scoped) gated.

## 6. AI agent architecture (direction)

- **Orchestration vs. validation split.** The LLM orchestrates and explains; a deterministic **constraint + scoring layer** owns selection.
  - Hard constraints: stock, dimensions/fit, strict budget caps.
  - Soft ranking: style, colour compatibility, material/user preference.
- **Explicit tool interfaces** (typed functions) let a real model connect later: `analyze_room`, `search_catalog`, `check_dimensions`, `check_budget`, `score_products`, `optimize_room_bundle`, `create_cart`, `request_customer_approval`, `create_order`, … No faked integrations; interfaces first.
- **Demo Mode** returns clearly-labelled sample analysis so the flow is demonstrable without pretending an API call occurred.
- **Human approval gate** before any cart-to-order transition.

## 7. Image storage strategy

- Phase 01 ships **no external image assets**; furniture imagery is represented by tasteful, clearly-labelled placeholders.
- Product imagery will use `next/image` with fixed aspect ratios (`ImageFrame`) to prevent layout shift; user room uploads will target Supabase Storage (or equivalent) behind an upload abstraction.

## 8. Authentication strategy (direction)

- Deferred past the foundation. Planned via Supabase Auth (email + OAuth), with account routes (`/account/*`) and a supplier role for `/supplier/*`. Session/user typing will flow through the same typed data layer.

## 9. Future mobile reuse

- Business logic (constraints, scoring, budget optimisation, agent tool contracts) is being designed **framework-agnostic** in `lib/` so a future React Native / native app can reuse the same TypeScript core and API, keeping web and mobile consistent.

## 10. Performance & SEO defaults

- Static generation for locale pages, self-hosted fonts with `swap`, no heavy dependencies, compositor-friendly transitions, `prefers-reduced-motion` honoured.
- Per-locale metadata via `generateMetadata`; semantic headings and crawlable structure prepared for later SEO work.

## Key decisions log

- **`[locale]` routing over a client locale toggle** — correct SSR direction/language, real deep-linkable locales.
- **Custom design system over a UI library** — avoids a generic template look; matches the premium brief.
- **Single warm light theme** — commits fully to the interior-studio aesthetic; dark mode can be layered on the token system later.
- **One dependency (`lucide-react`)** — icon consistency justified; everything else hand-built.
- **`proxy.ts` (not `middleware.ts`)** — adopts the Next 16 convention and avoids the deprecation warning.
