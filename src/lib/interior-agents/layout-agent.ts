/**
 * Layout / constraint validation (DETERMINISTIC).
 *
 * Athatti never claims exact fit from a single ordinary photo. Fit is decided by
 * application code, not the model: with a user-supplied available width we compare
 * real product widths; without it we return `NEEDS_MEASUREMENT` (honest) rather
 * than pretending fit is guaranteed. The model can never override this.
 */

import type { CatalogSelection, FitStatus, ItemFit, LayoutValidation } from "./types";

/** A small clearance factor: a piece close to the wall width is only "likely". */
const CLEARANCE = 0.9;

function fitFor(widthCm: number, availableWidthCm?: number): FitStatus {
  if (availableWidthCm === undefined) return "NEEDS_MEASUREMENT";
  if (widthCm > availableWidthCm) return "DOES_NOT_FIT";
  if (widthCm > availableWidthCm * CLEARANCE) return "FIT_LIKELY";
  return "FIT_CONFIRMED";
}

const RANK: Record<FitStatus, number> = {
  DOES_NOT_FIT: 0,
  NEEDS_MEASUREMENT: 1,
  FIT_LIKELY: 2,
  FIT_CONFIRMED: 3,
};

/**
 * Validate each selection's fit against the (optional) known available width.
 * `overall` is the weakest per-item status. Only the widest anchor pieces are
 * checked against the wall width; smaller accents don't gate the whole plan.
 */
export function validateLayout(selections: CatalogSelection[], knownWidthCm?: number): LayoutValidation {
  const items: ItemFit[] = selections.map((s) => ({
    slug: s.slug,
    widthCm: s.widthCm,
    status: fitFor(s.widthCm, knownWidthCm),
    ...(knownWidthCm !== undefined ? { availableWidthCm: knownWidthCm } : {}),
  }));

  const overall = items.length === 0
    ? "NEEDS_MEASUREMENT"
    : items.reduce<FitStatus>((weak, it) => (RANK[it.status] < RANK[weak] ? it.status : weak), "FIT_CONFIRMED");

  return { overall, items };
}
