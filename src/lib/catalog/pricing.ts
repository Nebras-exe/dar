/**
 * Money math for the catalog and cart. Pure and deterministic: totals are
 * always computed from numeric OMR values, never from formatted strings. OMR
 * has three decimal places (1 rial = 1000 baisa), which every helper respects.
 */

/** Round to OMR's three decimal places, avoiding binary float drift. */
export function roundOmr(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 1000) / 1000;
}

export interface LineItemLike {
  price: number;
  quantity: number;
}

/** Sum line items (price × quantity), rounded to 3 decimals. */
export function computeSubtotal(items: readonly LineItemLike[]): number {
  return roundOmr(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
}

/** Total quantity across all lines. */
export function computeItemCount(
  items: readonly { quantity: number }[],
): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Format an OMR amount for display. Uses Intl for locale-correct digits and
 * grouping, always with three fraction digits (e.g. `OMR 185.000` / `ر.ع.‏ ١٨٥٫٠٠٠`).
 */
export function formatOmr(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-OM" : "en-OM", {
    style: "currency",
    currency: "OMR",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(roundOmr(amount));
}
