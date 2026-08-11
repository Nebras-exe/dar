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

---

# Real Furniture Color Variants (local prototype)

A prototype that demonstrates how real furniture customization will work: high-value products
gain **2–4 realistic colour/material variants**, each with its **own product photo**. Selecting
a swatch updates the image, gallery, variant label, price, and the cart selection — no reload.

**Same isolation + zero-cost guarantees as above.** Turning off `NEXT_PUBLIC_REAL_CATALOG_PREVIEW`
also hides variants (products fall back to their plain colour options).

## Model (adapts the existing option system — no duplication)

`src/lib/catalog-preview/variants.ts` — `PRODUCT_VARIANTS: Record<slug, PreviewVariant[]>`:

```ts
interface PreviewVariant {
  colorId: ColorId;      // an EXISTING product colour → cart/designer/label compatible;
                         //   bilingual name via the colorSwatches taxonomy
  materialId?: MaterialId; // material/finish → bilingual via materialLabels
  priceDelta?: number;   // OMR change vs base price
  image: string;         // this variant's OWN verified photo (Unsplash id or URL)
  gallery?: string[];    // extra angles
}
```

Each variant maps to one of the product's **existing catalog colours**, so the cart, colour
labels, and the AI Designer stay fully compatible with **no new option system** and no new
colour/label data (colour + material names already exist bilingually in the taxonomy). Resolver
helpers in `variant-resolve.ts`; the exact-photo escape hatch is a variant's `image` field.

## Coverage

- **Products with variants: 21** (sofas ×6, armchairs/lounge ×3, dining/office chairs ×2, beds ×3,
  dining/coffee tables ×4, sideboard, TV console, writing desk).
- **Total variants: 59.** Products with 2 variants: **4**; with 3+ variants: **17**.
- **Variants with a price delta: 9** (premium finishes — leather cognac, dark marble, walnut, etc.).

## Wiring

- **Product page** (`product-gallery` + `add-to-cart-panel`, glued by `variant-context`):
  visual colour swatches (+ a material/finish line); clicking one cross-fades the gallery image,
  updates the swatch/label, and updates the price (`variant-price`) — all via shared context, no
  reload, reduced-motion respected.
- **Product cards** already show the product's colour swatch dots (variant colours ⊆ product
  colours), so cards communicate the palette without clutter.
- **Cart**: each variant is a distinct line (keyed by `slug::colorId`) showing "Colour: X ·
  Finish: Y" (the finish is a display-only lookup — the cart's stored data model is unchanged, so
  checkout/orders/payment are untouched).
- **AI Designer** (`design-item-card`): a recommended piece with variants shows colour swatches;
  selecting one updates the reference image and the design item's colour (existing
  `SET_ITEM_COLOR`), which flows to the cart when the design is added.

## Honest limitations

- Variant photos are **representative** real furniture photos of the same product form — the
  swatch carries the exact colour (real hex from the taxonomy) and the photo genuinely changes
  per variant, but the photo isn't guaranteed to be that exact colour (no retailer browsing /
  no vision here). Pin an exact colour-matched photo by editing a variant's `image`.
- **Price:** the variant price delta updates live on the product page, but the **cart, checkout,
  and orders use the catalog base price** — deliberately, so the completed order/payment pipeline
  is not modified. This is a preview illustration of variant pricing, not a change to billing.
- **Before/After:** the Demo visualization references design items; variant colour changes update
  the item reference, but the Demo preview is a deterministic composition, not a photorealistic
  re-render (unchanged, honest).
- All variant images HTTP-verified (35 unique ids, 0 broken).

## Future production architecture

This prototype models the shape a real supplier upload would take: SKU + variant SKU, colour,
material, price, stock, dimensions, main image, and per-variant images — swapped in behind the
same `PreviewVariant`/`ProductImage` seam with no UI change.
