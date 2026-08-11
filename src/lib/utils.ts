export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[];

/**
 * Minimal class-name joiner. Kept dependency-free on purpose — the component
 * layer is small and does not produce conflicting Tailwind utilities, so the
 * weight of clsx + tailwind-merge is not justified in Phase 01.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else {
      out.push(String(input));
    }
  }
  return out.join(" ");
}

/** Format a price in Omani Rial with locale-correct digits and 3 decimals. */
export function formatOmr(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-OM" : "en-OM", {
    style: "currency",
    currency: "OMR",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount);
}

/** Format a plain integer with locale-correct digits (Eastern Arabic for `ar`). */
export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-OM" : "en-OM").format(value);
}
