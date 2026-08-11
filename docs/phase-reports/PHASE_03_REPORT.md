# Phase 03 — Furniture Catalog & Discovery — Report

_Status: ✅ Complete & verified (build/lint/typecheck/tests green; routes verified over HTTP; visual review via published art artifact). Live in-browser click-through was not possible this session — the Chrome extension did not connect._

## Summary

Phase 03 turns Athathi from a marketing homepage into a real-feeling furniture **discovery layer**: a structured, typed catalog of **79 clearly-labelled demo products** across **15 categories**, browsable by search, faceted filters and sorting, with premium product-detail pages, a local cart foundation, and full Arabic (RTL) / English (LTR) parity. Crucially, the catalog is designed as the **structured source of truth a future AI agent can query deterministically** — the same `filterProducts` / `sortProducts` functions the UI uses.

The Phase 01/02 visual system was preserved, not replaced. The Phase 02 `ProductCard` was evolved into a single catalog-driven card (no second card system), and the homepage now links into the real shop and real product pages.

## Routes Built

| Route | Rendering | Purpose |
| --- | --- | --- |
| `/[locale]/shop` | Dynamic (reads `searchParams`) | Full catalog with hero, category nav, search, filters, sort, grid, empty state. |
| `/[locale]/shop/[category]` | Dynamic + `generateStaticParams` for all categories | Category-scoped browsing (category locked; other facets still available). |
| `/[locale]/product/[slug]` | **SSG** — 158 pages (79 × 2 locales) | Product detail: gallery, buy-box, dimensions, materials/style/rooms, related. |
| `/[locale]/cart` | Static shell | Local demo cart (quantities, remove, subtotal, honest disabled checkout). |

404s are correctly returned for unknown product slugs and invalid category slugs. Homepage Shop/Search/Cart navigation and featured/before-after product cards now route to the real Phase 03 pages; **Design My Space** still points to the Phase 02 showcase (as instructed).

## Catalog Architecture

All catalog code lives in `src/lib/catalog/` and is **framework-free and pure**, so the identical logic runs in a React Server Component, a Node test, or a future AI-agent tool:

- `types.ts` — the typed `Product` model (machine values for everything filterable; localized `{ en, ar }` pairs for display; numeric price + structured `Dimensions`).
- `taxonomy.ts` — bilingual categories, styles, colours (with hex), materials, rooms + validation guards and stable ordered value lists.
- `products.ts` — the 79-product demo catalog, built from compact rows via a builder that expands colours from the taxonomy and assigns deterministic `addedAt` / `featuredRank`.
- `queries.ts` — `getAllProducts`, `getProductBySlug`, `getProductsByCategory`, `getCategories`, `filterProducts`, `sortProducts`, `getRelatedProducts`, `getPriceBounds`, plus type guards.
- `pricing.ts` — OMR-correct (3-decimal) `computeSubtotal`, `computeItemCount`, `roundOmr`, `formatOmr`.
- `index.ts` — the single public import surface (`@/lib/catalog`).

Presentation never re-implements catalog logic; the URL↔filter bridge (`features/shop/url-state.ts`) is the one place query strings become a `ProductFilter`.

## Product Data

- **79 demo products** (target ~80) across **15 categories**: sofas (9), chairs (8), coffee-tables (6), dining (6), beds (6), rugs (6), lighting (6), storage (5), decor (5), outdoor (5), side-tables (4), desks (4), wardrobes (3), tv-units (3), mirrors (3). Priority categories (sofas, chairs, coffee tables, rugs, lighting, beds, dining, storage) are the best-represented.
- Every product carries: structured dimensions (W/D/H, plus seat height / diameter where relevant), material list, colour options (id + label + hex), style tags, room compatibility, availability (`in-stock` / `made-to-order`), a clearly-fictional demo supplier, bilingual features, and customization flags.
- **Honesty:** every product is flagged `isDemo` and badged **Sample**; suppliers are `Athathi Studio Collection` / `Athathi Demo Supplier` / `Demo Furniture Lab`. **No** fake ratings, reviews, bestseller/limited-stock claims, discounts, certifications, or delivery guarantees exist anywhere.

## Product Imagery

Real photography doesn't exist yet, so cards can't look identical. `ProductArt` draws a **category-specific SVG furniture silhouette**, tinted by the product's own colour swatches over a warm gradient whose accent shape is placed from a per-product seed — deterministic (same product → same art) and visually distinct per product, with zero external assets. `ProductImage` is the seam: the moment a product gains real `images`, it renders `next/image` (optimised, responsive) instead — a data change, not a code change. A published artifact shows the art across all 15 categories for visual review.

## Search

Client-typed, debounced, bound to the `q` URL param; matches across name (EN + AR), category, subcategory, style, material, colour and supplier, with accent/harakat-insensitive normalization and multi-token AND. Server-rendered results, shareable links (e.g. `/en/shop?q=walnut`).

## Filters

Faceted, all persisted in the URL (facets combine with AND, values within a facet with OR): **Category, Price (min/max, accessible number inputs), Style, Colour (labelled swatches), Material, Room, Availability, Customisable-only.** Active filters render as removable chips with an active count and clear-all; desktop uses a sticky sidebar, mobile a full-height drawer sharing the same `FilterContent`. Selected states never rely on colour alone (ring + check + `aria-pressed`).

## Sorting

Recommended (curated deterministic order — the default), Price ↑, Price ↓, Recently added (`addedAt`), Name A–Z. Bound to the `sort` param via an accessible native `<select>`. No fake "most popular / best selling". Verified in-DOM: price-asc surfaces the cheapest product first, price-desc the most expensive.

## Product Detail

Two-column gallery + info: name, OMR price, availability badge, demo supplier, description; a buy-box (`AddToCartPanel`) with colour selection, an accessible quantity stepper, Add-to-cart, an honestly **disabled "Try in My Room — coming in a later phase"**, and a favourite toggle; a prominent structured **Dimensions** panel; materials and style tags as links that deep-link into filtered shop views (a preview of AI deep-linking); room compatibility; feature bullets; and a deterministic **Related products** row (shared category/style/room + price proximity). Breadcrumbs and per-product metadata (title/description/canonical) are set; no fake `AggregateRating`/`Review`/`Offer` JSON-LD.

## Cart Foundation

Local, `localStorage`-persisted via a `useSyncExternalStore` external store that keeps only intent (slug + colour + quantity) — **price and naming are always derived from the catalog**, so totals can't drift. Add / change quantity / remove / clear, a header badge with live count, and a `/cart` page with a summary, OMR subtotal, and a clearly **disabled checkout ("arrives in a later phase — nothing is charged")**. All money math is 3-decimal-OMR exact and unit-tested. The store is shaped to be swapped for an authenticated backend cart behind the same hook.

## Arabic / RTL QA

- `<html dir="rtl" lang="ar">` is set on the server (verified over HTTP); no client flash.
- All new UI uses logical properties (`ps/pe`, `ms/me`, `start/end`, `text-start`); only genuinely directional glyphs flip (`rtl:rotate-180`).
- Entity labels (categories, styles, colours, materials, rooms) and all product names/descriptions/features are authored bilingually; a compile-time key-parity check guarantees no missing Arabic key. Arabic authored in logical Unicode — never reversed. OMR renders with `ar-OM` digits.

## Responsive QA

- Grid: 2 columns mobile, 3 tablet, 4 desktop; product detail collapses to a single column; cart summary stacks under the lines on mobile.
- Category nav becomes an edge-to-edge horizontal scroll on mobile; filters move into a drawer; toolbar wraps.
- Verified by mobile-first responsive code review. **Limitation (unchanged from Phase 02):** the browser tool's viewport could not be resized, and this session the extension did not connect at all, so true device emulation and click-through screenshots were not captured.

## Accessibility

Semantic `<button>` vs `<a>`/`<Link>` throughout; visible `:focus-visible` everywhere; real form controls with labels; `role="search"`; `aria-pressed` on toggles (chips, swatches, favourites, sort thumbnails); `aria-live` on the result count, quantity and add-to-cart confirmation; selected states carry a non-colour cue; icon-only controls have accessible names; correct heading hierarchy (one `<h1>` per page — the shop landing's missing `<h1>` was found and fixed during review); RTL and reduced-motion respected.

## Skills Used

See `PHASE_03_SKILLS.md`. Headline: `frontend-design` (review lens, preserved the existing identity) and `artifact-design` (visual-QA artifact). Testing used the built-in `node:test` runner (no new dependency).

## Browser QA

Attempted via Claude-in-Chrome; the extension did not connect this session. Substituted with rigorous HTTP verification against the running dev server: route status codes (incl. 404s), server-rendered RTL, and the full search/filter/sort/empty matrix asserted by rendered product counts and DOM order vs data extremes — plus a published artifact of the generated art for visual review. Client-only cart/favourites behaviour is covered by unit-tested pure logic and type/build checks.

## Tests

`npm test` → **15 passing** (`src/lib/catalog/catalog.test.ts`) over: catalog integrity (unique slugs, demo flags, Arabic names, positive prices), category membership, lookups, every filter facet incl. the AI-style compound query, bilingual search, sort correctness + non-mutation, deterministic related selection, price bounds, and exact 3-decimal-OMR cart math. Runs on Node's built-in runner with no added dependency.

## Build / Lint / Typecheck

- `npm run lint` → clean (all `react-hooks/set-state-in-effect` issues fixed properly via `useSyncExternalStore` and the render-time state-sync pattern — no rules weakened).
- `npm run typecheck` → clean (`tsc --noEmit`, strict).
- `npm run build` → success, **197 pages** (product pages SSG; shop/category dynamic for `searchParams`).

## Known Limitations

- **No live browser QA this session** — the Chrome extension did not connect; verification was HTTP + unit tests + the art artifact + code review. Mobile emulation remains unavailable.
- Product imagery is generated art, not photography (deliberately swappable via `ProductImage`).
- Cart/favourites/account and "Try in My Room" are local/demo shells; checkout is intentionally disabled.
- Search/filter are client-side over the local dataset (correct for 79 demo products; a backend/index arrives with real inventory).

## Future AI Readiness

The catalog is the structured source of truth for the future Athathi Agent. `filterProducts(criteria)` already answers the canonical query deterministically:

> _category = sofa, style = warm-modern, colours include beige, width ≤ 240 cm, price ≤ 320 OMR, availability = in stock_

— it's an explicit, unit-tested test case (`filter: the AI-style compound query…`). Because dimensions are numeric, room-fit checks (`widthCm ≤ …`) are already possible; styles/colours/materials/rooms are machine values for scoring; `getRelatedProducts` shows deterministic similarity ranking. The agent will call the **same pure functions** the UI uses — no parallel logic, no faked integrations. `ProductImage` + the demo-supplier/`isDemo` flags keep the data honest for when real inventory and photography replace the demo set.

## Next Phase

**Recommended: Phase 04 — AI Designer UX (room → budget → catalog-backed recommendations).** The deterministic catalog + query layer is now exactly what an agent needs to search, and the homepage already narrates the "Design My Space" flow that currently points at a placeholder. Building the designer next converts Athathi's core thesis (real room + real budget + real products + AI) into a working flow on top of this catalog. A dedicated **product customization & full cart/checkout** phase can follow once a real backend exists — customization and checkout both want persistence and auth that are out of scope until then.
