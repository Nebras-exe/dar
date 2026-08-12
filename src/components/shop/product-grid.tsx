import * as React from "react";
import {
  ProductCard,
  type ProductCardLabels,
} from "@/components/shared/product-card";
import type { Locale } from "@/i18n/config";
import type { ColorId, Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export interface ProductGridProps {
  products: readonly Product[];
  locale: Locale;
  labels: ProductCardLabels;
  /**
   * Per-product colour variant to display (its own photo + highlighted swatch).
   * Used when results are surfaced BECAUSE of a colour — a colour filter, a
   * colour search, or the calm homepage variant. Returns undefined for default.
   */
  displayColorFor?: (product: Product) => ColorId | undefined;
  className?: string;
}

/**
 * Responsive editorial product grid: 2 columns on mobile (readable), 3 on
 * tablet, 4 on desktop. Generous vertical rhythm keeps it from feeling like a
 * dense marketplace.
 */
export function ProductGrid({ products, locale, labels, displayColorFor, className }: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          product={product}
          locale={locale}
          labels={labels}
          displayColorId={displayColorFor?.(product)}
        />
      ))}
    </div>
  );
}
