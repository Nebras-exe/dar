/**
 * Real Catalog Preview (Phase: local-only) — public surface.
 *
 * An ISOLATED, local/demo-only layer that overlays representative real-world
 * furniture photography onto the existing product UI for visual evaluation. It
 * never mutates the production catalog, prices, or any business logic. All images
 * are hotlink-permitted, license-clean Unsplash references (no paid API/credits).
 */

export { previewImageFor, hasPreviewPhoto, previewEnabled, previewImageUrl, type PreviewInput } from "./resolve";
export { referenceKind } from "./kind";
export { PREVIEW_POOLS, ALL_PREVIEW_IDS } from "./pools";
export { PREVIEW_OVERRIDES } from "./overrides";
export { PRODUCT_VARIANTS, type PreviewVariant } from "./variants";
export {
  variantsFor,
  hasVariants,
  defaultVariant,
  variantImageUrl,
  variantGalleryUrls,
  variantPrice,
} from "./variant-resolve";
