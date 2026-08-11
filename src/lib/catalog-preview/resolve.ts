/**
 * Real Catalog Preview — resolver (LOCAL/DEMO ONLY).
 *
 * Turns a product into a representative real-photo URL, deterministically, or
 * returns null so the caller falls back to the generated studio art. Pure + no
 * side effects; safe to call during render on client or server.
 *
 * Enable flag: `NEXT_PUBLIC_REAL_CATALOG_PREVIEW`. Default ON so `npm run dev`
 * shows the preview immediately; set it to `"0"`/`"false"` to see the original
 * generated art. This is a preview toggle only — it never changes catalog data,
 * prices, or any business logic (orders/payments/RFQ/etc. are untouched).
 */

import { PREVIEW_POOLS } from "./pools";
import { PREVIEW_OVERRIDES } from "./overrides";
import { referenceKind, type PreviewKindInput } from "./kind";

/** Deterministic non-negative hash of a string (FNV-1a). */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Is the preview turned on? (default on; explicit "0"/"false" turns it off). */
export function previewEnabled(): boolean {
  const v = process.env.NEXT_PUBLIC_REAL_CATALOG_PREVIEW;
  return v !== "0" && v !== "false";
}

/** Build an optimised, cropped Unsplash CDN URL from a photo id. */
function unsplashUrl(id: string, w: number, h: number): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=entropy&q=70&w=${w}&h=${h}`;
}

/** Normalise an override entry (id | full-url | array) to a URL for a given angle. */
function resolveOverride(entry: string | string[], variant: number, w: number, h: number): string {
  const pick = Array.isArray(entry) ? entry[variant % entry.length] : entry;
  return pick.startsWith("http") ? pick : unsplashUrl(pick, w, h);
}

export interface PreviewInput extends PreviewKindInput {
  slug: string;
}

/**
 * A representative real-photo URL for a product + gallery angle, or null to use
 * the generated art. Deterministic: the same product always resolves to the same
 * photo (and rotates predictably across gallery angles). Respects the enable flag.
 */
export function previewImageFor(product: PreviewInput, variant = 0, size = 800): string | null {
  if (!previewEnabled()) return null;

  const override = PREVIEW_OVERRIDES[product.slug];
  if (override) return resolveOverride(override, variant, size, size);

  const kind = referenceKind(product);
  if (!kind) return null; // no confident pool → generated art

  const pool = PREVIEW_POOLS[kind];
  if (!pool || pool.length === 0) return null;

  const idx = (hash(product.slug) + variant) % pool.length;
  return unsplashUrl(pool[idx], size, size);
}

/** True when a product would get a real photo (used by the /preview report + UI). */
export function hasPreviewPhoto(product: PreviewInput): boolean {
  return previewImageFor(product, 0) !== null;
}
