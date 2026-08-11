"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  formatOmr,
  getProductBySlug,
  label,
  materialLabels,
  type ColorId,
} from "@/lib/catalog";
import { ImageFrame } from "@/components/ui/image-frame";
import { ProductImage } from "@/components/shop/product-image";
import { cn, formatNumber } from "@/lib/utils";

/**
 * A read + colour-select card for the "Products in this design" list under the
 * visualization. Reuses the catalog `ProductImage`, pricing and taxonomy (no
 * duplicate catalog logic). Colour selection is limited to the product's VERIFIED
 * variants; dimensions come straight from product data (never invented); the
 * preview never claims physical fit.
 */
export function VisualizationProductCard({
  slug,
  colorId,
  index,
  t,
  locale,
  onColor,
}: {
  slug: string;
  colorId?: ColorId;
  index: number;
  t: Dictionary["design"]["visualization"];
  locale: Locale;
  onColor: (index: number, color: ColorId) => void;
}) {
  const product = getProductBySlug(slug);
  if (!product) return null;

  const name = locale === "ar" ? product.nameAr : product.name;
  const activeColor = colorId ?? product.colors[0]?.id;
  const meta = product.materials[0]
    ? label(materialLabels[product.materials[0]], locale)
    : "";

  const d = product.dimensions;
  const dims: { key: string; label: string; value: number }[] = [
    { key: "w", label: t.dimensionsWidth, value: d.widthCm },
    { key: "d", label: t.dimensionsDepth, value: d.depthCm },
    { key: "h", label: t.dimensionsHeight, value: d.heightCm },
  ].filter((x) => Number.isFinite(x.value) && x.value > 0);

  return (
    <article className="flex gap-4 rounded-xl border border-border-subtle bg-elevated p-3 sm:p-4">
      <Link
        href={`/${locale}/product/${product.slug}`}
        className="w-24 shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-28"
      >
        <ImageFrame ratio="square" rounded="lg" className="border border-border-subtle">
          <ProductImage product={product} alt={name} sizes="120px" />
        </ImageFrame>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/${locale}/product/${product.slug}`}
              className="rounded-md text-[0.95rem] font-medium text-foreground hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <span className="line-clamp-1">{name}</span>
            </Link>
            {meta && <p className="mt-0.5 line-clamp-1 text-sm text-muted">{meta}</p>}
          </div>
          <span className="shrink-0 text-[0.95rem] font-semibold text-foreground tabular">
            {formatOmr(product.price, locale)}
          </span>
        </div>

        {/* Colour variants — verified only */}
        {product.colors.length > 1 && (
          <div className="mt-2.5">
            <p className="mb-1.5 text-xs text-subtle">
              {t.colorLabel}
              {activeColor && (
                <span className="text-muted">
                  {" · "}
                  {label(product.colors.find((c) => c.id === activeColor)!.label, locale)}
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={t.colorLabel}>
              {product.colors.map((c) => {
                const selected = c.id === activeColor;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={selected}
                    aria-label={label(c.label, locale)}
                    title={label(c.label, locale)}
                    onClick={() => onColor(index, c.id)}
                    className={cn(
                      "size-6 rounded-full ring-1 ring-inset ring-black/10 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                      selected && "ring-2 ring-brand ring-offset-1 ring-offset-elevated",
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Dimensions — from product data; never a fit guarantee */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          {dims.length > 0 ? (
            <>
              <span className="text-subtle">{t.dimensionsLabel}:</span>
              {dims.map((dim) => (
                <span key={dim.key} className="tabular">
                  {dim.label} {formatNumber(dim.value, locale)}
                  {t.dimensionsUnit}
                </span>
              ))}
            </>
          ) : (
            <span className="text-subtle">{t.dimensionsUnverified}</span>
          )}
        </div>

        <div className="mt-auto pt-3">
          <Link
            href={`/${locale}/product/${product.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-3 py-1.5 text-sm font-medium text-foreground hover:border-taupe hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {t.viewProduct}
            <ExternalLink className="size-3.5 text-muted rtl:-scale-x-100" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
