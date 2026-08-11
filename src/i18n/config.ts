/**
 * Localization configuration for Athathi.
 *
 * The product is architected for Arabic (RTL) and English (LTR) from day one.
 * Locale lives in the URL (`/en`, `/ar`) so direction and language are correct
 * on the server for the first paint — no client flash, no layout that only
 * works in LTR.
 */

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

export const localeLabels: Record<Locale, { native: string; english: string }> =
  {
    en: { native: "English", english: "English" },
    ar: { native: "العربية", english: "Arabic" },
  };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return localeDirection[locale];
}
