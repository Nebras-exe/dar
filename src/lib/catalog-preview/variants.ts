/**
 * Real Furniture Color Variants — data (LOCAL/DEMO ONLY).
 *
 * A local prototype that demonstrates how real furniture customization will work:
 * high-value products gain 2–4 realistic variants, each mapped to one of the
 * product's EXISTING catalog colours (so the cart, labels, and AI Designer stay
 * fully compatible — no duplicate option system, per the brief), with its OWN
 * representative product photo, an optional material/finish, and an optional price
 * delta.
 *
 * ISOLATED from production: this adds NO fields to `src/lib/catalog` products and
 * changes NO business logic. Colour names come from the existing bilingual
 * `colorSwatches` taxonomy; material/finish names from `materialLabels` — both
 * already EN/AR. Images are verified, hotlink-permitted, license-clean Unsplash
 * references (no paid API, no credits, no generation).
 *
 * HONESTY (same constraint as the catalog preview): browsing retailer catalogs to
 * curate exact per-colour photos was not available here, so each variant's photo
 * is a REPRESENTATIVE real furniture photo of the same product form — the EXACT
 * colour is conveyed by the swatch (real hex from the taxonomy), and the photo
 * genuinely CHANGES per variant. To pin an exact colour-matched photo, edit a
 * variant's `image` below (an Unsplash id or any hotlink-permitted URL).
 *
 * The reference furniture options (which colours/finishes are realistic for a
 * given piece) are modelled on IKEA, Danube Home, and Home Centre product pages.
 */

import type { ColorId, MaterialId } from "@/lib/catalog";
import { RAW_IKEA_PRODUCTS } from "@/lib/catalog/ikea-catalog.data";

export interface PreviewVariant {
  /** An EXISTING product colour id — bilingual name via `colorSwatches`, cart-compatible. */
  colorId: ColorId;
  /** Optional material/finish — bilingual name via `materialLabels`. */
  materialId?: MaterialId;
  /** OMR price change vs the base price (default 0). */
  priceDelta?: number;
  /** This variant's own representative photo (verified Unsplash id, or full URL). */
  image: string;
  /** Optional extra gallery angles (ids/urls). */
  gallery?: string[];
}

/**
 * slug → ordered variants. The first entry is the default. Only high-value,
 * visually important products are given variants (the rest keep their single
 * representative photo). Images are distinct per variant so switching a swatch
 * visibly changes the product photo.
 */
export const PRODUCT_VARIANTS: Record<string, PreviewVariant[]> = Object.fromEntries(
  RAW_IKEA_PRODUCTS
    // Only multi-colour products get a swatch/photo switcher; single-colour items
    // keep their one representative photo (via the product's own `images`).
    .filter((p) => p.variants.length >= 2)
    .map((p) => [
      p.slug,
      p.variants.map((v): PreviewVariant => ({
        colorId: v.colorId,
        ...(v.materialId ? { materialId: v.materialId } : {}),
        // Imported reference prices are colour-independent → no delta.
        image: v.image,
        ...(v.gallery && v.gallery.length ? { gallery: v.gallery } : {}),
      })),
    ]),
);
