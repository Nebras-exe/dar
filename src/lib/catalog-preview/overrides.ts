/**
 * Real Catalog Preview — exact per-product overrides (LOCAL ONLY).
 *
 * The pools give a representative, category-accurate photo for every product. To
 * pin an EXACT reference for a specific product (e.g. after visually reviewing the
 * preview), add its slug here — no other code change is needed. Values are Unsplash
 * photo ids (the numeric-hyphen part of `photo-<id>`), or a full https URL to any
 * other legitimately reusable, hotlink-permitted image. An array supplies multiple
 * gallery angles.
 *
 * Leave empty to use the pools. This is the single place a human (who can view the
 * images) corrects any mismatch found during visual QA.
 */

/** slug → Unsplash id, full URL, or an array of either (gallery angles). */
export const PREVIEW_OVERRIDES: Record<string, string | string[]> = {
  // Example (commented): pin an exact photo for the Luna modular sofa.
  // "luna-modular-sofa": "1555041469-a586c61ea9bc",
};
