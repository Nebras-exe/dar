import { colorSwatches, type Product, type RoomType } from "@/lib/catalog";
import type { ProductInput } from "@/lib/repository";

/**
 * Map a supplier-authored `ProductInput` (+ slug) to the catalog `Product` shape
 * so the dashboard + preview can REUSE the existing `ProductImage`/`ProductArt`,
 * pricing and taxonomy — no duplicate product rendering (§23). Marked `isDemo`
 * because local products are a demo-mode workspace.
 */
export function toPreviewProduct(
  input: ProductInput,
  slug: string,
  supplierName: string,
): Product {
  return {
    id: slug,
    slug,
    name: input.name,
    nameAr: input.nameAr,
    description: input.description,
    descriptionAr: input.descriptionAr,
    category: input.category,
    price: input.basePrice,
    currency: "OMR",
    supplier: supplierName as Product["supplier"],
    isDemo: true,
    stockStatus: input.stockStatus,
    dimensions: input.dimensions,
    materials: input.materials,
    colors: input.colors.map((id) => ({ id, label: colorSwatches[id].label, hex: colorSwatches[id].hex })),
    styleTags: input.styleTags,
    roomTypes: input.roomTypes as RoomType[],
    features: [],
    customizable: input.customizable,
    addedAt: "2026-08-10",
  };
}
