/**
 * Product catalog source.
 *
 * The catalog is now populated from the local IKEA Oman REFERENCE gallery
 * (imported by `scripts/import-local-furniture.mjs` → `ikea-catalog.data.ts`).
 * This module is the single adapter that turns the generated `RawProduct`
 * records into fully-typed `Product`s: colour options are resolved from the
 * bilingual taxonomy, and prices are ESTIMATES (`priceType: "estimated"`), which
 * every price surface labels accordingly. Provenance lives in `sourceLabel` /
 * `sourceUrl`.
 *
 * The product SYSTEM is unchanged — types, queries, filtering, sorting, the
 * variant layer, cart, the design engine, the Agent and the chatbot all consume
 * this `products` export exactly as before. Per-colour real photos live in the
 * isolated variant layer (`src/lib/catalog-preview/variants.ts`), derived from
 * the same generated data, so a swatch switch shows the matching photo.
 *
 * To refresh: re-run the importer. To add hand-authored products, append typed
 * `Product` records to the exported array below.
 */

import type { ColorOption, Product } from "./types";
import { colorSwatches } from "./taxonomy";
import { RAW_IKEA_PRODUCTS, type RawProduct } from "./ikea-catalog.data";

function colorOptions(ids: RawProduct["colorIds"]): ColorOption[] {
  return ids.map((id) => ({ id, label: colorSwatches[id].label, hex: colorSwatches[id].hex }));
}

function toProduct(r: RawProduct): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.nameEn,
    nameAr: r.nameAr,
    description: r.descEn,
    descriptionAr: r.descAr,
    category: r.category,
    ...(r.subcategory ? { subcategory: r.subcategory } : {}),
    images: r.images,
    price: r.price,
    currency: "OMR",
    priceType: r.priceType,
    sourceLabel: r.sourceLabel,
    sourceUrl: r.sourceUrl,
    model: r.model,
    supplier: "DAR Studio Collection",
    isDemo: true,
    stockStatus: r.stockStatus,
    dimensions: r.dimensions,
    dimensionsKnown: r.dimensionsKnown,
    materials: r.materials,
    colors: colorOptions(r.colorIds),
    styleTags: r.styleTags,
    roomTypes: r.roomTypes,
    features: [
      { en: `Reference: ${r.sourceLabel}`, ar: `المرجع: ${r.sourceLabel}` },
      {
        en: `${r.colorIds.length} colour option${r.colorIds.length === 1 ? "" : "s"}`,
        ar: `${r.colorIds.length} خيار لون`,
      },
      { en: "Estimated price (OMR)", ar: "سعر تقديري (ر.ع.)" },
    ],
    customizable: r.customizable,
    ...(r.customizable ? { customizationOptions: ["color"] } : {}),
    addedAt: r.addedAt,
    featuredRank: r.featuredRank,
  };
}

/** The catalog — imported real reference furniture (estimated prices). */
export const products: readonly Product[] = Object.freeze(
  RAW_IKEA_PRODUCTS.map(toProduct),
);
