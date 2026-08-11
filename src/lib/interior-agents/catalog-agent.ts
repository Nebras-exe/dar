/**
 * Catalog grounding agent (DETERMINISTIC — authoritative).
 *
 * Turns the designer's product NEEDS into REAL catalog selections. Every value —
 * slug, price, dimensions, supplier, variant — comes from application code, never
 * the model. If a need doesn't match, it is dropped (and a warning is raised),
 * never fabricated. Reuses the Phase 03 catalog queries + the local variant layer.
 */

import {
  filterProducts,
  sortProducts,
  roundOmr,
  colorSwatches,
  materialLabels,
  type Product,
} from "@/lib/catalog";
import { variantsFor, variantPrice, variantImageUrl, previewImageFor } from "@/lib/catalog-preview";
import { INTERIOR_LIMITS } from "./config";
import type { CatalogSelection, ProductNeed } from "./types";

/** Pick a real product for a need — cheapest in-budget match, excluding taken slugs. */
function pickProduct(need: ProductNeed, taken: Set<string>): Product | null {
  const candidates = filterProducts({
    categories: [need.category],
    styles: need.style ? [need.style] : undefined,
    materials: need.material ? [need.material] : undefined,
    colors: need.color ? [need.color] : undefined,
    maxPrice: need.maxPrice,
  }).filter((p) => !taken.has(p.slug));

  // Progressive relaxation: drop the softest constraints if nothing matched, so a
  // need still grounds to a REAL product rather than being invented.
  let pool = candidates;
  if (pool.length === 0 && (need.color || need.material)) {
    pool = filterProducts({ categories: [need.category], styles: need.style ? [need.style] : undefined, maxPrice: need.maxPrice }).filter((p) => !taken.has(p.slug));
  }
  if (pool.length === 0) {
    pool = filterProducts({ categories: [need.category], maxPrice: need.maxPrice }).filter((p) => !taken.has(p.slug));
  }
  if (pool.length === 0) {
    pool = filterProducts({ categories: [need.category] }).filter((p) => !taken.has(p.slug));
  }
  if (pool.length === 0) return null;
  return sortProducts(pool, "price-asc")[0];
}

/** Resolve the real colour variant for a product given a requested colour. */
function resolveVariant(product: Product, requestedColor?: string) {
  const variants = variantsFor(product.slug);
  if (variants.length === 0) {
    // No variant layer — use the product's own first catalog colour, if any.
    const colorId = product.colors[0]?.id;
    const price = product.price;
    const imageRef = previewImageFor({ slug: product.slug, category: product.category, subcategory: product.subcategory }) ?? undefined;
    return { colorId, price, imageRef, variantColorEn: undefined, variantColorAr: undefined, variantMaterialId: undefined };
  }
  const variant = variants.find((v) => v.colorId === requestedColor) ?? variants[0];
  return {
    colorId: variant.colorId,
    price: roundOmr(variantPrice(product.price, variant)),
    imageRef: variantImageUrl(variant),
    variantColorEn: colorSwatches[variant.colorId].label.en,
    variantColorAr: colorSwatches[variant.colorId].label.ar,
    variantMaterialId: variant.materialId,
  };
}

export interface GroundingResult {
  selections: CatalogSelection[];
  /** Categories whose need found no catalog match. */
  unmatched: string[];
}

/** Ground every need into a real product + variant. Deterministic + authoritative. */
export function groundCatalog(needs: ProductNeed[]): GroundingResult {
  const taken = new Set<string>();
  const selections: CatalogSelection[] = [];
  const unmatched: string[] = [];

  // Essentials (priority 1) first, then by given priority.
  const ordered = [...needs].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

  for (const need of ordered) {
    if (selections.length >= INTERIOR_LIMITS.maxSelections) break;
    const product = pickProduct(need, taken);
    if (!product) {
      unmatched.push(need.category);
      continue;
    }
    taken.add(product.slug);
    const v = resolveVariant(product, need.color);
    selections.push({
      need,
      slug: product.slug,
      category: product.category,
      nameEn: product.name,
      nameAr: product.nameAr,
      priceOmr: v.price,
      supplier: product.supplier,
      widthCm: product.dimensions.widthCm,
      ...(v.colorId ? { colorId: v.colorId } : {}),
      ...(v.variantColorEn ? { variantColorEn: v.variantColorEn, variantColorAr: v.variantColorAr } : {}),
      ...(v.variantMaterialId ? { variantMaterialId: v.variantMaterialId } : {}),
      ...(v.imageRef ? { imageRef: v.imageRef } : {}),
    });
  }

  return { selections, unmatched };
}

/** Human-safe material label (used by the render spec / UI). */
export function materialLabelOf(id: keyof typeof materialLabels, locale: "en" | "ar"): string {
  return materialLabels[id][locale];
}
