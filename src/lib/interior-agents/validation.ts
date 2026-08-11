/**
 * Interior plan validation. The model's raw JSON is never trusted: this maps it
 * to a typed `DesignBrief`, keeping ONLY values that exist in the real Athathi
 * taxonomy (fabricated categories/styles/colours/materials are dropped) and
 * clamping counts. Prices are treated as soft targets only — the budget engine is
 * authoritative. Pure + dependency-light so it runs in tests with no model calls.
 */

import {
  categories,
  isStyleTag,
  isColorId,
  isMaterialId,
  type CategorySlug,
  type ColorId,
  type MaterialId,
  type StyleTag,
} from "@/lib/catalog";
import { INTERIOR_LIMITS } from "./config";
import type { DesignBrief, ProductNeed } from "./types";

const CATEGORY_SET = new Set(categories.map((c) => c.slug));
function isCategory(v: unknown): v is CategorySlug {
  return typeof v === "string" && CATEGORY_SET.has(v as CategorySlug);
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}
function num(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : undefined;
}
function categoryList(v: unknown): CategorySlug[] {
  if (!Array.isArray(v)) return [];
  return [...new Set(v.filter(isCategory))];
}
function colorList(v: unknown): ColorId[] {
  if (!Array.isArray(v)) return [];
  return [...new Set(v.filter((x): x is ColorId => typeof x === "string" && isColorId(x)))];
}
function materialList(v: unknown): MaterialId[] {
  if (!Array.isArray(v)) return [];
  return [...new Set(v.filter((x): x is MaterialId => typeof x === "string" && isMaterialId(x)))];
}

function normalizeNeed(raw: unknown): ProductNeed | null {
  const o = (raw ?? {}) as Record<string, unknown>;
  if (!isCategory(o.category)) return null; // a need MUST target a real category
  const need: ProductNeed = { category: o.category };
  if (typeof o.style === "string" && isStyleTag(o.style)) need.style = o.style as StyleTag;
  if (typeof o.material === "string" && isMaterialId(o.material)) need.material = o.material as MaterialId;
  if (typeof o.color === "string" && isColorId(o.color)) need.color = o.color as ColorId;
  const mp = num(o.maxPrice);
  if (mp !== undefined) need.maxPrice = mp;
  const pr = num(o.priority);
  if (pr !== undefined) need.priority = pr;
  return need;
}

export interface ValidationResult {
  ok: boolean;
  brief?: DesignBrief;
  reason?: "not-object" | "no-needs";
}

/**
 * Validate + normalise a raw designer plan. Returns `ok:false` when the plan has
 * no usable needs, so the caller can retry or fall back to Demo. Never throws.
 */
export function validateBrief(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== "object") return { ok: false, reason: "not-object" };
  const o = raw as Record<string, unknown>;

  const needs = (Array.isArray(o.needs) ? o.needs : [])
    .map(normalizeNeed)
    .filter((n): n is ProductNeed => n !== null)
    .slice(0, INTERIOR_LIMITS.maxNeeds);

  if (needs.length === 0) return { ok: false, reason: "no-needs" };

  const brief: DesignBrief = {
    intentEn: str(o.intentEn).slice(0, 240),
    intentAr: str(o.intentAr).slice(0, 240),
    keep: categoryList(o.keep),
    remove: categoryList(o.remove),
    needs,
    preferredColors: colorList(o.preferredColors),
    preferredMaterials: materialList(o.preferredMaterials),
    ...(str(o.layoutGuidanceEn) ? { layoutGuidanceEn: str(o.layoutGuidanceEn).slice(0, 400) } : {}),
    ...(str(o.layoutGuidanceAr) ? { layoutGuidanceAr: str(o.layoutGuidanceAr).slice(0, 400) } : {}),
  };
  return { ok: true, brief };
}
