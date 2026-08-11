"use client";

import * as React from "react";
import type { Locale } from "@/i18n/config";
import { formatOmr } from "@/lib/catalog";
import { useVariant } from "./variant-context";

/**
 * The product price, reactive to the selected colour variant (local preview).
 * When a variant carries a price delta, the price updates live as the swatch
 * changes — no reload. Falls back to the base price when the product has no
 * variants. Business logic is unaffected; this is presentation only.
 */
export function VariantPrice({
  basePrice,
  locale,
}: {
  basePrice: number;
  locale: Locale;
}) {
  const variant = useVariant();
  const price = variant?.priceFor(basePrice) ?? basePrice;
  return (
    <span className="text-2xl font-semibold text-foreground tabular" aria-live="polite">
      {formatOmr(price, locale)}
    </span>
  );
}
