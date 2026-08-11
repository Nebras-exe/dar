/**
 * Real Furniture Color Variants — resolver (LOCAL/DEMO ONLY).
 *
 * Thin, pure helpers over the isolated `PRODUCT_VARIANTS` data. Respects the same
 * enable flag as the catalog preview, so turning the preview off also hides
 * variants (the product falls back to its plain colour options). No side effects.
 */

import { PRODUCT_VARIANTS, type PreviewVariant } from "./variants";
import { previewEnabled, previewImageUrl } from "./resolve";

/** The variants for a product, or an empty array. Empty when the preview is off. */
export function variantsFor(slug: string): PreviewVariant[] {
  if (!previewEnabled()) return [];
  return PRODUCT_VARIANTS[slug] ?? [];
}

/** Does this product have preview variants (and the preview is on)? */
export function hasVariants(slug: string): boolean {
  return variantsFor(slug).length > 0;
}

/** The default (first) variant, or null. */
export function defaultVariant(slug: string): PreviewVariant | null {
  return variantsFor(slug)[0] ?? null;
}

/** The main image URL for a variant. */
export function variantImageUrl(variant: PreviewVariant, size = 800): string {
  return previewImageUrl(variant.image, size);
}

/**
 * The gallery image URLs for a variant: its main photo first, then any extra
 * angles. Always at least one entry.
 */
export function variantGalleryUrls(variant: PreviewVariant, size = 800): string[] {
  const extras = (variant.gallery ?? []).map((g) => previewImageUrl(g, size));
  return [previewImageUrl(variant.image, size), ...extras];
}

/** The final price for a variant given the product's base price. */
export function variantPrice(basePrice: number, variant: PreviewVariant): number {
  return basePrice + (variant.priceDelta ?? 0);
}

export type { PreviewVariant };
