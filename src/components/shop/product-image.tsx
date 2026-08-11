import * as React from "react";
import Image from "next/image";
import type { Product } from "@/lib/catalog";
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
 * Renders a product's visual. Today every product uses generated `ProductArt`;
 * the moment a product has real `images`, this component serves them through
 * `next/image` (optimised, responsive, shift-free) instead — no other code
 * changes. This is the single seam between demo art and real photography.
 */
export function ProductImage({
  product,
  alt,
  variant = 0,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  className,
}: ProductImageProps) {
  const src = product.images?.[variant] ?? product.images?.[0];

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
