"use client";

import * as React from "react";
import { ImageFrame } from "@/components/ui/image-frame";
import { ProductImage } from "@/components/shop/product-image";
import type { Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { useVariant } from "./variant-context";

/**
 * Product gallery: a main square image plus selectable thumbnails.
 *
 * When the product has real furniture VARIANTS (local preview), the gallery shows
 * the selected variant's own photo(s) — switching a colour swatch in the buy-box
 * updates the image here via shared context, with a subtle cross-fade (respecting
 * reduced-motion). Otherwise it shows distinct generated "angles"; when real
 * `images` exist they flow through the same `ProductImage` seam. Thumbnails are
 * real buttons with `aria-pressed`, so selection is keyboard/screen-reader safe.
 */
export function ProductGallery({
  product,
  name,
}: {
  product: Product;
  name: string;
}) {
  const variant = useVariant();
  const variantUrls = variant?.selected ? variant.galleryUrls(1000) : [];
  const usingVariant = variantUrls.length > 0;

  const thumbLabel = (index: number) => `${name} — ${index}`;
  const count = usingVariant
    ? variantUrls.length
    : Math.max(1, product.images?.length ?? 4);
  const angles = Array.from({ length: count }, (_, i) => i);
  const [active, setActive] = React.useState(0);

  // Reset the active thumbnail to the main image when the selected variant changes
  // (React's "adjust state during render" pattern — no effect, no cascading render).
  const variantKey = variant?.selectedIndex ?? -1;
  const [lastVariant, setLastVariant] = React.useState(variantKey);
  if (variantKey !== lastVariant) {
    setLastVariant(variantKey);
    setActive(0);
  }

  const safeActive = Math.min(active, count - 1);

  return (
    <div className="flex flex-col gap-4">
      <ImageFrame ratio="square" rounded="xl" className="border border-border-subtle">
        <div key={`${variantKey}:${safeActive}`} className="size-full motion-safe:animate-fade">
          <ProductImage
            product={product}
            alt={name}
            variant={safeActive}
            overrideSrc={usingVariant ? variantUrls[safeActive] : undefined}
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </div>
      </ImageFrame>

      {count > 1 && (
        <div className="grid grid-cols-4 gap-3" role="group" aria-label={name}>
          {angles.map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={safeActive === v}
              onClick={() => setActive(v)}
              className={cn(
                "overflow-hidden rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                safeActive === v
                  ? "border-brand ring-1 ring-brand"
                  : "border-border-subtle hover:border-taupe",
              )}
            >
              <ImageFrame ratio="square" rounded="md">
                <ProductImage
                  product={product}
                  alt={thumbLabel(v + 1)}
                  variant={v}
                  overrideSrc={usingVariant ? variantUrls[v] : undefined}
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
