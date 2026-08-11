"use client";

import type { Locale } from "@/i18n/config";
import { formatOmr, label, materialLabels } from "@/lib/catalog";
import type { ProductInput } from "@/lib/repository";
import { ImageFrame } from "@/components/ui/image-frame";
import { ProductImage } from "@/components/shop/product-image";
import { Badge } from "@/components/ui/badge";
import { toPreviewProduct } from "./local-product";

/**
 * Live customer-facing preview of an in-progress product (§23) — reuses the real
 * catalog `ProductImage`, pricing and taxonomy so what the supplier sees matches
 * the shop. Falls back gracefully while fields are empty.
 */
export function ProductPreview({
  input,
  supplierName,
  locale,
}: {
  input: ProductInput;
  supplierName: string;
  locale: Locale;
}) {
  const product = toPreviewProduct(input, "preview", supplierName);
  const name = locale === "ar" ? input.nameAr || input.name : input.name;
  const meta = input.materials[0] ? label(materialLabels[input.materials[0]], locale) : "";

  return (
    <article className="overflow-hidden rounded-xl border border-border-subtle bg-elevated">
      <ImageFrame ratio="square" className="border-b border-border-subtle">
        <ProductImage product={product} alt={name || "preview"} sizes="320px" />
      </ImageFrame>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-1 text-sm font-medium text-foreground">{name || "—"}</p>
          <Badge tone="neutral">{locale === "ar" ? "نموذجي" : "Sample"}</Badge>
        </div>
        {meta && <p className="mt-0.5 text-xs text-muted">{meta}</p>}
        <p className="mt-1 text-sm font-semibold text-foreground tabular">
          {formatOmr(input.basePrice || 0, locale)}
        </p>
      </div>
    </article>
  );
}
