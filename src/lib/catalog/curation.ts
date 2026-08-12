/**
 * Homepage visual curation (deterministic, §7/§9/§10).
 *
 * The SHOP shows every colour — bright pieces stay fully searchable and
 * purchasable. But curated HOMEPAGE sections should feel calm, warm and
 * cohesive with the DAR palette. This module is the single source of that rule:
 * it selects products that have a calm/muted variant, picks that calm variant
 * for display, balances categories, and never removes anything from the catalog.
 *
 * Pure + framework-free (same discipline as the rest of `@/lib/catalog`), so the
 * homepage server components and tests share one deterministic curation.
 */

import { getAllProducts } from "./queries";
import type { ColorId, Product } from "./types";

/**
 * Highly-saturated colours to avoid FEATURING on the homepage (they remain in
 * the shop). Everything not in this set counts as calm/muted for curation — the
 * DAR taxonomy hexes are otherwise warm and low-saturation. `multi`/`clear` are
 * excluded from calm because they aren't a single cohesive tone.
 */
export const SATURATED_COLORS: ReadonlySet<ColorId> = new Set<ColorId>([
  "red",
  "orange",
  "yellow",
  "pink",
  "blue",
  "multi",
  "clear",
]);

/** Is this colour calm/muted enough to feature on the homepage? */
export function isCalmColor(id: ColorId): boolean {
  return !SATURATED_COLORS.has(id);
}

/**
 * The calm variant to SHOW for a product on the homepage: the first of the
 * product's real colours that is calm/muted. Returns undefined when the product
 * has no calm variant (then it isn't homepage-eligible). Order follows the
 * product's own colour order, so it's deterministic.
 */
export function calmVariantFor(product: Product): ColorId | undefined {
  return product.colors.find((c) => isCalmColor(c.id))?.id;
}

/** A curated homepage pick: the real product + the calm variant colour to display. */
export interface CuratedPick {
  product: Product;
  /** A calm/muted colour variant of the product to display (never a bright one). */
  displayColorId: ColorId;
}

/**
 * Homepage-eligible products: those with at least one calm variant. Each is
 * paired with its calm display colour. In-stock pieces are preferred but not
 * required (order is otherwise the curated `featuredRank`). Deterministic.
 */
export function homepageEligible(source: readonly Product[] = getAllProducts()): CuratedPick[] {
  return source
    .map((product) => {
      const displayColorId = calmVariantFor(product);
      return displayColorId ? { product, displayColorId } : null;
    })
    .filter((p): p is CuratedPick => p !== null)
    .sort((a, b) => {
      // In-stock first, then the curated recommended order (stable, deterministic).
      const stock = Number(b.product.stockStatus === "in-stock") - Number(a.product.stockStatus === "in-stock");
      if (stock !== 0) return stock;
      return (a.product.featuredRank ?? Number.MAX_SAFE_INTEGER) - (b.product.featuredRank ?? Number.MAX_SAFE_INTEGER);
    });
}

/**
 * A calm, category-balanced set of homepage picks. Round-robins across the
 * distinct categories of the eligible pool (so one category never fills the
 * grid), taking the best (curated-order) pick from each in turn until `limit` is
 * reached. Falls back to filling from the remaining pool if categories run dry.
 * Deterministic: same catalog → same picks in the same order.
 */
export function homepageFeatured(
  limit = 6,
  source: readonly Product[] = getAllProducts(),
): CuratedPick[] {
  const eligible = homepageEligible(source);

  // Group by category, preserving each group's (already-sorted) order.
  const byCategory = new Map<string, CuratedPick[]>();
  for (const pick of eligible) {
    const list = byCategory.get(pick.product.category) ?? [];
    list.push(pick);
    byCategory.set(pick.product.category, list);
  }

  const out: CuratedPick[] = [];
  const queues = [...byCategory.values()];
  // Round-robin across categories for diversity.
  let progressed = true;
  while (out.length < limit && progressed) {
    progressed = false;
    for (const queue of queues) {
      if (out.length >= limit) break;
      const next = queue.shift();
      if (next) {
        out.push(next);
        progressed = true;
      }
    }
  }
  return out;
}
