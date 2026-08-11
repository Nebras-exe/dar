/**
 * Category-specific field registry (Phase 09, §7). Drives progressive disclosure
 * so the custom form shows only the fields that make sense for the chosen
 * category — never one giant 20-field form. Pure data; the UI renders from it.
 */

import type {
  CategoryFieldSpec,
  CustomCategory,
  CustomSpecFieldKey,
} from "./types";

export const CUSTOM_CATEGORIES: CustomCategory[] = [
  "sofas",
  "chairs",
  "dining",
  "beds",
  "storage",
  "tv-units",
  "desks",
  "coffee-tables",
];

export function isCustomCategory(v: string): v is CustomCategory {
  return (CUSTOM_CATEGORIES as string[]).includes(v);
}

/** Common fields most categories share, kept in a stable display order. */
const COMMON: CustomSpecFieldKey[] = ["style", "color", "material"];

const FIELDS: Record<CustomCategory, CustomSpecFieldKey[]> = {
  sofas: [...COMMON, "shape", "widthCm", "depthCm", "seatCount", "armStyle", "legStyle", "firmness"],
  chairs: [...COMMON, "widthCm", "depthCm", "heightCm", "legStyle", "firmness"],
  dining: [...COMMON, "widthCm", "depthCm", "heightCm", "legStyle", "finish"],
  beds: [...COMMON, "mattressSize", "widthCm", "heightCm", "finish"],
  storage: [...COMMON, "widthCm", "depthCm", "heightCm", "storageLayout", "finish"],
  "tv-units": [...COMMON, "widthCm", "depthCm", "heightCm", "storageLayout", "finish"],
  desks: [...COMMON, "widthCm", "depthCm", "heightCm", "legStyle", "finish"],
  "coffee-tables": [...COMMON, "shape", "widthCm", "depthCm", "heightCm", "finish"],
};

export function fieldsForCategory(category: CustomCategory): CustomSpecFieldKey[] {
  return FIELDS[category] ?? COMMON;
}

export function categoryFieldSpec(category: CustomCategory): CategoryFieldSpec {
  return { category, fields: fieldsForCategory(category) };
}

/** Fields that are dimensions (support the "unknown / ask supplier" value). */
export const DIMENSION_FIELDS: CustomSpecFieldKey[] = ["widthCm", "depthCm", "heightCm"];

/** Selectable option values for enum-like fields (machine values; labels via i18n). */
export const SHAPE_OPTIONS = ["straight", "l-shaped", "u-shaped", "round", "rectangular", "oval"] as const;
export const LEG_STYLE_OPTIONS = ["wooden", "metal", "tapered", "hairpin", "block", "plinth"] as const;
export const ARM_STYLE_OPTIONS = ["low", "rolled", "track", "armless"] as const;
export const FIRMNESS_OPTIONS = ["soft", "medium", "firm"] as const;
export const FINISH_OPTIONS = ["matte", "satin", "gloss", "oiled", "lacquered"] as const;
export const MATTRESS_SIZE_OPTIONS = ["single", "double", "queen", "king", "super-king"] as const;
export const STORAGE_LAYOUT_OPTIONS = ["open-shelving", "closed-doors", "mixed", "drawers"] as const;
