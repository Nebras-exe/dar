import "server-only";
import type { Locale } from "./config";
import en from "./dictionaries/en.json";
import ar from "./dictionaries/ar.json";

/**
 * The English dictionary is the source of truth for the shape; every other
 * locale must satisfy the same type. This gives us compile-time safety that a
 * translation key is never missing.
 */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  ar: ar as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
