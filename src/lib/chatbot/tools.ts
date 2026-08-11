/**
 * Chatbot tool grounding — deterministic + authoritative.
 *
 * Reuses the EXISTING allowlisted Agent tool registry for catalog truth
 * (search_catalog / get_product) plus the catalog/variant libs, so the chatbot
 * never fabricates a product/price/variant. The chatbot is NOT given tools for
 * payment, supplier acceptance, QC, delivery writes, memory writes, DB admin,
 * SQL, or the filesystem — those are structurally unavailable here.
 */

import {
  getProductBySlug,
  filterProducts,
  sortProducts,
  computeSubtotal,
  roundOmr,
  type CategorySlug,
  type ColorId,
  type MaterialId,
  type StyleTag,
} from "@/lib/catalog";
import { variantsFor } from "@/lib/catalog-preview";
import { CHAT_LIMITS } from "./config";

export interface GroundQuery {
  category?: CategorySlug;
  style?: StyleTag;
  color?: ColorId;
  material?: MaterialId;
  maxPrice?: number;
  limit?: number;
}

/** Search the real catalog. Returns REAL slugs only (cheapest first). */
export function searchCatalog(q: GroundQuery): string[] {
  const products = filterProducts({
    categories: q.category ? [q.category] : undefined,
    styles: q.style ? [q.style] : undefined,
    colors: q.color ? [q.color] : undefined,
    materials: q.material ? [q.material] : undefined,
    maxPrice: q.maxPrice,
  });
  const limit = Math.min(q.limit ?? CHAT_LIMITS.maxCards, CHAT_LIMITS.maxCards);
  return sortProducts(products, "price-asc").slice(0, limit).map((p) => p.slug);
}

/** Is this a real catalog product? (used to reject fabricated ids). */
export function isRealProduct(slug: string): boolean {
  return Boolean(getProductBySlug(slug));
}

/** The real colour variants available for a product (empty if none). */
export function productVariants(slug: string): ColorId[] {
  return variantsFor(slug).map((v) => v.colorId);
}

/** Deterministic budget maths (OMR, 3-decimal) — never the model. */
export function budgetFor(slugs: string[], budget: number) {
  const items = slugs
    .map((s) => getProductBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ price: p.price, quantity: 1 }));
  const total = computeSubtotal(items);
  return {
    budget: roundOmr(budget),
    total,
    remaining: roundOmr(Math.max(0, budget - total)),
    overBudget: roundOmr(Math.max(0, total - budget)),
    withinBudget: total <= budget,
  };
}
