"use client";

import * as React from "react";
import { ImageFrame } from "@/components/ui/image-frame";
import { ProductImage } from "@/components/shop/product-image";
import type { Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * Product gallery: a main square image plus selectable thumbnails. With no real
 * photography yet, the thumbnails are distinct generated "angles" (art variants)
 * so the gallery reads as a real one; when real `images` arrive they flow
 * through the same `ProductImage` seam. Thumbnails are real buttons with
 * `aria-pressed`, so selection is keyboard- and screen-reader-accessible.
 */
export function ProductGallery({
  product,
  name,
}: {
  product: Product;
  name: string;
}) {
  const thumbLabel = (index: number) => `${name} — ${index}`;
  const count = Math.max(1, product.images?.length ?? 4);
  const variants = Array.from({ length: count }, (_, i) => i);
  const [active, setActive] = React.useState(0);

  return (
    <div className="flex flex-col gap-4">
      <ImageFrame ratio="square" rounded="xl" className="border border-border-subtle">
        <ProductImage
          product={product}
          alt={name}
          variant={active}
          sizes="(max-width: 1024px) 100vw, 45vw"
        />
      </ImageFrame>

      {count > 1 && (
        <div className="grid grid-cols-4 gap-3" role="group" aria-label={name}>
          {variants.map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={active === v}
              onClick={() => setActive(v)}
              className={cn(
                "overflow-hidden rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                active === v
                  ? "border-brand ring-1 ring-brand"
                  : "border-border-subtle hover:border-taupe",
              )}
            >
              <ImageFrame ratio="square" rounded="md">
                <ProductImage
                  product={product}
                  alt={thumbLabel(v + 1)}
                  variant={v}
                  sizes="120px"
                />
              </ImageFrame>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
