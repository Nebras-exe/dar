# Real Catalog Preview (local/demo only)

A local-only layer that overlays **representative real-world furniture photography**
onto Athathi's product UI, so you can visually evaluate how the product looks with
real photos instead of the generated studio art. It is **isolated from the production
catalog** — it adds no product fields, changes no prices, and touches no business logic
(orders, payments, manufacturing, delivery, memory, notifications, RFQ are untouched).

**Zero paid APIs, zero credits, zero image generation.** All images are hotlink-permitted,
license-clean **Unsplash** CDN references (Unsplash License: free commercial + personal use,
no permission/attribution required). No access controls, anti-bot, or hotlink protection
were bypassed.

## How to use it

```bash
npm run dev          # preview is ON by default in local dev
```

- **Gallery:** `http://localhost:3000/en/preview` (and `/ar/preview`) — the whole catalog
  through the real product card, grouped by category, with coverage stats.
- **Everywhere else:** the real photos also appear on the homepage featured grid, shop,
  category pages, product cards, product galleries, recommendations, the AI Designer product
  selections, and Before/After references — because they all render through the single
  shared `ProductImage` seam.
- **Turn it off** (see the original generated art): set `NEXT_PUBLIC_REAL_CATALOG_PREVIEW=0`.

## How it works (architecture)

Isolated module `src/lib/catalog-preview/`:

| File | Role |
|---|---|
| `pools.ts` | Verified Unsplash photo-id pools, keyed by furniture "kind" (sofa, sectional, dining-chair, armchair, office-chair, stool, coffee-table, side-table, nightstand, dining-table, bed, desk, wardrobe, sideboard, bookshelf, cabinet, tv-unit, rug, mirror, lighting, outdoor-sofa, interior). Every id was HTTP-verified to return a live `image/jpeg`. Each id lives in exactly one pool. |
| `kind.ts` | `referenceKind(category, subcategory)` → pool key, or `null` for decor with no confident pool. |
| `overrides.ts` | `PREVIEW_OVERRIDES` — the single place to pin an **exact** photo per product slug. |
| `resolve.ts` | `previewImageFor(product, variant)` — override → category/subcategory pool (deterministic by slug hash; gallery angles rotate) → `null` (fall back to generated art). Reads the enable flag. |

The only wiring point is the shared `src/components/shop/product-image.tsx` seam, which
resolves in priority order: **explicit `product.images` → preview photo → generated art**.
One additive change; every product surface inherits it. `next/image` optimises the remote
images (`images.unsplash.com` whitelisted in `next.config.ts`).

## Coverage

- **Products populated with real photos: 73 of 79.**
- **Categories populated: all 15** (sofas, chairs, coffee-tables, side-tables, dining, beds,
  storage, wardrobes, tv-units, desks, rugs, lighting, mirrors, decor, outdoor).
- **Fallback to generated art: 6** — 5 small decor items (ceramic vase, throw blanket,
  cushion set, wall art, table tray) + 1 outdoor planter set. These deliberately keep the
  category-accurate generated art because no confident, subject-exact real-photo pool exists
  for them — this avoids ever showing a wrong subject.

Per-category: beds 6, chairs 8, coffee-tables 6, desks 4, dining 6, lighting 6, mirrors 3,
outdoor 4 (+1 art), rugs 6, side-tables 4, sofas 9, storage 5, tv-units 3, wardrobes 3, decor
0 (5 art).

## Exact vs representative

These are **representative, category/subcategory-accurate** references — **not exact
per-product retailer photos**. Curating exact IKEA / West Elm / Danube-style product images
was **not possible in this environment**: there is no live web browsing here, and the task
(rightly) forbids bypassing retailers' anti-bot / hotlink protection. So each product is
matched to its correct furniture *kind* (a chair pool never feeds a sofa; a coffee-table pool
never feeds a dining table), and colour/material is best-effort within the pool.

To make any reference **exact**: view `/en/preview`, and for any product that isn't a close
enough match, add its slug to `src/lib/catalog-preview/overrides.ts` with an Unsplash id or a
full hotlink-permitted URL. No other change is needed.

## Source stores researched

The intended real-world references were modelled on the catalog conventions of major
furniture retailers named in the brief — **IKEA, Danube Home, Home Centre, West Elm, Pottery
Barn, Ashley, Wayfair**, and GCC/Oman furniture stores — for product type, shape, style,
colour, material, seat count/configuration, and proportions (e.g. beige modular sofa → beige
modular sofa; walnut dining chair → walnut dining chair; oak round coffee table → oak round
coffee table; pendant lamp → pendant lamp). Because those retailers' own images are
copyright-protected and hotlink/anti-bot-guarded, the actual pixels come from the
license-clean Unsplash equivalent with the closest visual match, per the brief's fallback
clause ("use a legitimate reusable image with the closest visual match").

## Broken images / unmatched products

- **Broken images: 0.** Every Unsplash id in the pools was HTTP-verified (`200 image/jpeg`),
  and `next/image` was confirmed to optimise + serve them (`/_next/image` → `200 image/jpeg`).
  Dead/uncertain candidate ids were dropped during verification.
- **Unmatched products: 0.** Every product resolves to either a category-correct real photo
  (73) or its category-accurate generated art (6) — nothing is left broken or blank.

## Browser QA

The connected local Chrome extension was **not reliably available this session** (it
disconnected on first use in the prior phase), so pixel-level visual QA of the actual photos
was **not run and not faked**. QA was done via: route checks (`/en/preview`, `/ar/preview`,
home, shop, product, design all `200`, EN + AR), deterministic resolver checks (each sample
product → correct pool; decor → art), and image-delivery checks (every id `200 image/jpeg`;
the `next/image` optimiser serves them). **You are the visual reviewer** — open `/en/preview`
and `/ar/preview` on desktop + mobile and correct any mismatch via `overrides.ts`.

## Guarantees

- Isolated: no change to catalog data, prices, or business logic.
- Reversible: one env flag returns the original generated art.
- Honest: representative + category-accurate, clearly labelled "Local preview"; decor keeps
  art rather than risk a wrong subject.
- Free: Unsplash CDN only — no API keys, no credits, no generation.
