/**
 * Real Catalog Preview — verified image pools (LOCAL/DEMO ONLY).
 *
 * This module is ISOLATED from the production catalog (`src/lib/catalog`): it adds
 * NO fields to any product and changes NO business logic. It only supplies
 * representative, real-world furniture photography for LOCAL visual evaluation of
 * how Athathi looks with real product photos instead of the generated studio art.
 *
 * Source: Unsplash (Unsplash License — free for commercial + non-commercial use,
 * no permission or attribution required; hotlinking the Unsplash CDN is permitted).
 * No paid API, no image-generation, no credits. No access controls are bypassed.
 *
 * HONESTY: these are REPRESENTATIVE, category/subcategory-accurate references —
 * NOT exact per-product retailer photos (browsing retailer catalogs to curate
 * exact photos was not available in this environment). Every id below was
 * HTTP-verified to return a live `image/jpeg` from the Unsplash CDN. Each id is
 * used in a single pool so the subject stays category-correct (a chair pool never
 * feeds a sofa). Products whose "kind" has no confident pool fall back to the
 * existing category-accurate generated art — so the preview is never broken and
 * never wildly off-subject. To pin an EXACT photo for a product, add its slug to
 * `PREVIEW_OVERRIDES` in `overrides.ts` (no code change needed).
 */

/**
 * Pool key → verified photo ids. Intentionally EMPTY — the demo furniture catalog
 * was cleared, so the old representative photo pools were removed too. The resolver
 * architecture (`referenceKind` → pool lookup, deterministic + license-clean) stays
 * intact and reusable: repopulate the pools keyed by `referenceKind` (sofa, bed,
 * dining-table, …) when real products are added, or supply exact per-product photos
 * via `PREVIEW_OVERRIDES` in `overrides.ts`.
 */
export const PREVIEW_POOLS: Record<string, string[]> = {};

/** Every id, for the QA/verification report. */
export const ALL_PREVIEW_IDS: string[] = Object.values(PREVIEW_POOLS).flat();
