import * as React from "react";
import Image from "next/image";
import type { Product } from "@/lib/catalog";
import { previewImageFor } from "@/lib/catalog-preview";
import { ProductArt } from "./product-art";
import { cn } from "@/lib/utils";

export interface ProductImageProps {
  product: Product;
  /** Accessible description of the image for the specific context. */
  alt: string;
  /** Gallery angle when using generated art. */
  variant?: number;
  /** Responsive `sizes` hint for real photography. */
  sizes?: string;
  className?: string;
}

/**
 * Renders a product's visual. This is the single seam between demo art and real
 * photography, resolved in priority order:
 *   1. an explicit `product.images[]` (production data — unchanged);
 *   2. the isolated LOCAL Real Catalog Preview (representative real photos, when
 *      the `NEXT_PUBLIC_REAL_CATALOG_PREVIEW` flag is on) — this adds NO product
 *      data and no business logic; it only overlays a photo for visual evaluation;
 *   3. otherwise the generated category-accurate `ProductArt`.
 * Real photos are served through `next/image` (optimised, responsive, shift-free).
 */
export function ProductImage({
  product,
  alt,
  variant = 0,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  className,
}: ProductImageProps) {
  const src =
    product.images?.[variant] ??
    product.images?.[0] ??
    previewImageFor({ slug: product.slug, category: product.category, subcategory: product.subcategory }, variant) ??
    undefined;

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <>
      <ProductArt product={product} variant={variant} className={cn("size-full", className)} />
      <span className="sr-only">{alt}</span>
    </>
  );
}
