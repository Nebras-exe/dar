/**
 * Argument coercion + validation for Agent tools.
 *
 * Model- or client-supplied JSON is never trusted: every tool argument is
 * coerced and checked against the Phase 03 taxonomy before a tool runs. Bad
 * values are dropped (arrays) or rejected (returns null), so a tool can never
 * receive an out-of-taxonomy category/style/colour/material or a nonsensical
 * budget. Dependency-free, consistent with the vision validator.
 */

import {
  isCategorySlug,
  isColorId,
  isMaterialId,
  isStyleTag,
  isStockStatus,
  getProductBySlug,
} from "@/lib/catalog";
import type {
  CategorySlug,
  ColorId,
  MaterialId,
  StockStatus,
  StyleTag,
} from "@/lib/catalog";
import type { ReplacementMode } from "@/lib/design";

export function num(v: unknown): number | undefined {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** A budget must be a finite positive number within sane bounds. */
export function validBudget(v: unknown): number | undefined {
  const n = num(v);
  if (n === undefined || n <= 0 || n > 1_000_000) return undefined;
  return n;
}

export function positiveInt(v: unknown, fallback = 1): number {
  const n = num(v);
  if (n === undefined || n < 1) return fallback;
  return Math.floor(n);
}

export function str(v: unknown, maxLen = 200): string {
  return typeof v === "string" ? v.slice(0, maxLen) : "";
}

/** A slug is valid only if it resolves to a real catalog product. */
export function validSlug(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  return getProductBySlug(v) ? v : undefined;
}

export function validCategory(v: unknown): CategorySlug | undefined {
  return typeof v === "string" && isCategorySlug(v) ? v : undefined;
}

export function categories(v: unknown): CategorySlug[] {
  return arr(v).filter((x): x is CategorySlug => typeof x === "string" && isCategorySlug(x));
}
export function styles(v: unknown): StyleTag[] {
  return arr(v).filter((x): x is StyleTag => typeof x === "string" && isStyleTag(x));
}
export function colors(v: unknown): ColorId[] {
  return arr(v).filter((x): x is ColorId => typeof x === "string" && isColorId(x));
}
export function materials(v: unknown): MaterialId[] {
  return arr(v).filter((x): x is MaterialId => typeof x === "string" && isMaterialId(x));
}
export function availability(v: unknown): StockStatus[] {
  return arr(v).filter((x): x is StockStatus => typeof x === "string" && isStockStatus(x));
}

export function replacementMode(v: unknown): ReplacementMode | undefined {
  return v === "cheaper" || v === "similar" || v === "upgrade" ? v : undefined;
}

function arr(v: unknown): unknown[] {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") return [v];
  return [];
}
