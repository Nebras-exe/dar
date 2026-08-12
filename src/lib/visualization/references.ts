/**
 * Catalog reference builder (SERVER-ONLY, §3/§9).
 *
 * Turns a validated `VisualizationRequest` into the explicit catalog ALLOW-LIST
 * an external image provider may draw from: for every selected item it reloads
 * the REAL product from CatalogRepository (catalog truth — the client can never
 * assert product data) and resolves the SELECTED variant's ACTUAL reference
 * photo. If the Olive variant was chosen, the Olive image is sent — never a beige
 * reference with "imagine olive".
 *
 * Pure over the catalog + isolated variant layer; reads no secrets. Not exported
 * from the client-safe barrel — only the service / providers import it.
 */

import {
  getProductBySlug,
  colorSwatches,
  categoryBySlug,
  type CategorySlug,
} from "@/lib/catalog";
import { variantsFor, variantImageUrl, previewImageFor } from "@/lib/catalog-preview";
import type { CatalogReference, VisualizationRequest } from "./types";

/**
 * Hard negative constraints for the image edit (§9). Stable keys — the UI /
 * provider prompt renders friendly text; the image model receives them as rules.
 */
export const VISUALIZATION_NEGATIVE_CONSTRAINTS = [
  "do_not_add_furniture_not_in_references",
  "do_not_invent_extra_furniture",
  "do_not_change_selected_product_colour",
  "do_not_replace_selected_products_with_generic",
  "do_not_remove_doors_or_windows",
  "do_not_change_room_geometry",
  "preserve_camera_perspective",
] as const;

/** Deterministic placement hint per category (English — goes to the image prompt). */
const PLACEMENT: Partial<Record<CategorySlug, string>> = {
  sofas: "against the main wall of the seating area",
  chairs: "beside the seating group, angled toward the room",
  "coffee-tables": "centered in front of the sofa",
  "side-tables": "next to the seating, within easy reach",
  dining: "centered in the dining area",
  beds: "against the main bedroom wall, headboard centered",
  storage: "along a side wall, clear of walkways",
  wardrobes: "against a bedroom wall, doors clear to open",
  "tv-units": "on the wall opposite the main seating",
  desks: "near a window or a quiet corner",
  rugs: "under the main seating group, framing it",
  lighting: "in a corner or beside the seating for ambient light",
  mirrors: "on a prominent wall to add light and depth",
  decor: "as finishing accents on existing surfaces",
  outdoor: "in the open terrace area",
};

function placementFor(category: CategorySlug): string {
  return PLACEMENT[category] ?? "in a balanced position appropriate to the room";
}

/**
 * Resolve one request item to a real catalog reference (or null when its slug no
 * longer resolves — dropped, never fabricated). The reference image is the
 * SELECTED colour variant's own photo where one exists.
 */
export function buildCatalogReference(
  slug: string,
  colorId: string | undefined,
): CatalogReference | null {
  const product = getProductBySlug(slug);
  if (!product) return null; // catalog truth

  // Prefer the SELECTED variant's own photo (real per-colour image).
  const variants = variantsFor(product.slug);
  const chosenVariant = colorId ? variants.find((v) => v.colorId === colorId) : undefined;
  const referenceImage =
    (chosenVariant ? variantImageUrl(chosenVariant) : undefined) ??
    product.images?.[0] ??
    previewImageFor({ slug: product.slug, category: product.category, subcategory: product.subcategory }) ??
    "";

  const gallery = chosenVariant?.gallery?.map((g) => variantImageUrl({ ...chosenVariant, image: g }));

  const colorOption = colorId ? product.colors.find((c) => c.id === colorId) : product.colors[0];
  const colorSwatch = colorOption ? colorSwatches[colorOption.id] : undefined;

  const cat = categoryBySlug.get(product.category);
  void cat; // category label available if needed by the provider prompt

  return {
    productId: product.id,
    slug: product.slug,
    ...(chosenVariant ? { variantId: `${product.slug}-${chosenVariant.colorId}` } : {}),
    nameEn: product.name,
    nameAr: product.nameAr,
    category: product.category,
    ...(colorOption ? { colorId: colorOption.id } : {}),
    ...(colorSwatch ? { colorLabelEn: colorSwatch.label.en, colorLabelAr: colorSwatch.label.ar } : {}),
    ...(chosenVariant?.materialId ? { materialId: chosenVariant.materialId } : product.materials[0] ? { materialId: product.materials[0] } : {}),
    ...(product.dimensionsKnown !== false
      ? { dimensions: { widthCm: product.dimensions.widthCm, depthCm: product.dimensions.depthCm, heightCm: product.dimensions.heightCm } }
      : {}),
    referenceImage,
    ...(gallery && gallery.length ? { gallery } : {}),
    placement: placementFor(product.category),
  };
}

/** Build the full catalog allow-list for a request (server-side, catalog truth). */
export function buildCatalogReferences(request: VisualizationRequest): CatalogReference[] {
  const out: CatalogReference[] = [];
  for (const item of request.items) {
    const ref = buildCatalogReference(item.slug, item.colorId);
    if (ref) out.push(ref);
  }
  return out;
}
