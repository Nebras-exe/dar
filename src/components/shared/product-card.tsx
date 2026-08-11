import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageFrame } from "@/components/ui/image-frame";
import { ProductImage } from "@/components/shop/product-image";
import { FavoriteButton } from "@/components/shop/favorite-button";
import type { Locale } from "@/i18n/config";
import {
  formatOmr,
  label,
  materialLabels,
  styleLabels,
  type Product,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

export interface ProductCardLabels {
  sample: string;
  save: string;
  saved: string;
  madeToOrder: string;
  outOfStock: string;
  customizable?: string;
}

export interface ProductCardProps {
  product: Product;
  locale: Locale;
  labels: ProductCardLabels;
  className?: string;
}

/**
 * The single catalog product card, used on the shop, category, related and
 * homepage-featured grids. Editorial restraint: square generated image, a
 * one-line material·style meta, colour swatches, an OMR price, an honest demo
 * badge and a favourite toggle. The whole card is a link (stretched-link
 * pattern) while the favourite button stays independently operable.
 */
export function ProductCard({ product, locale, labels, className }: ProductCardProps) {
  const name = locale === "ar" ? product.nameAr : product.name;
  const href = `/${locale}/product/${product.slug}`;
  const meta = [
    product.materials[0] && label(materialLabels[product.materials[0]], locale),
    product.styleTags[0] && label(styleLabels[product.styleTags[0]], locale),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-lg",
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-brand",
        className,
      )}
    >
      <div className="lift relative overflow-hidden rounded-lg bg-elevated shadow-[var(--shadow-xs)] ring-1 ring-border-subtle">
        <ImageFrame ratio="square" rounded="lg" zoomOnHover>
          <ProductImage product={product} alt={name} />
        </ImageFrame>
        <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
          <div className="flex flex-col items-start gap-1.5">
            <Badge tone="demo">{labels.sample}</Badge>
            {product.stockStatus === "out-of-stock" && (
              <Badge tone="neutral">{labels.outOfStock}</Badge>
            )}
          </div>
          <div className="pointer-events-auto">
            <FavoriteButton
              slug={product.slug}
              labelSave={labels.save}
              labelSaved={labels.saved}
            />
          </div>
        </div>
        {product.customizable && labels.customizable && (
          <span className="pointer-events-none absolute bottom-3 start-3 inline-flex items-center gap-1 rounded-full bg-elevated/85 px-2.5 py-1 text-[0.68rem] font-medium text-brand shadow-[var(--shadow-xs)] backdrop-blur-sm">
            <Sparkles className="size-3" strokeWidth={2} aria-hidden="true" />
            {labels.customizable}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3 px-0.5">
        <div className="min-w-0">
          <h3 className="text-[0.95rem] font-medium text-foreground">
            <Link
              href={href}
              className="outline-none transition-colors group-hover:text-brand after:absolute after:inset-0 after:content-['']"
            >
              <span className="line-clamp-1">{name}</span>
            </Link>
          </h3>
          {meta && <p className="mt-0.5 line-clamp-1 text-sm text-muted">{meta}</p>}
          {product.colors.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5" aria-hidden="true">
              {product.colors.slice(0, 4).map((c) => (
                <span
                  key={c.id}
                  className="size-3.5 rounded-full ring-1 ring-inset ring-black/10 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[0.7rem] text-subtle">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="shrink-0 text-end">
          <span className="block text-[1.05rem] font-semibold text-foreground tabular">
            {formatOmr(product.price, locale)}
          </span>
        </div>
      </div>
    </article>
  );
}

/** Small convenience so grids can build the labels object from the dictionary. */
export function productCardLabels(shop: {
  card: { sample: string; save: string; saved: string; customizable?: string };
  availability: { "made-to-order": string; "out-of-stock": string };
}): ProductCardLabels {
  return {
    sample: shop.card.sample,
    save: shop.card.save,
    saved: shop.card.saved,
    madeToOrder: shop.availability["made-to-order"],
    outOfStock: shop.availability["out-of-stock"],
    customizable: shop.card.customizable,
  };
}
