/**
 * Budget validation (DETERMINISTIC — authoritative).
 *
 * The model NEVER computes authoritative totals. All money is exact 3-decimal OMR
 * via the shared catalog helpers, summed from the grounded selections (base price +
 * any real variant delta, already resolved by the catalog agent).
 */

import { computeSubtotal, roundOmr } from "@/lib/catalog";
import type { BudgetResult, CatalogSelection } from "./types";

export function computeBudget(budget: number, selections: CatalogSelection[]): BudgetResult {
  const subtotal = computeSubtotal(selections.map((s) => ({ price: s.priceOmr, quantity: 1 })));
  const total = subtotal; // delivery/installation are not part of a design estimate
  const remaining = roundOmr(Math.max(0, budget - total));
  const exceededBy = roundOmr(Math.max(0, total - budget));
  return {
    currency: "OMR",
    budget: roundOmr(budget),
    subtotal,
    total,
    remaining,
    exceededBy,
    withinBudget: exceededBy === 0,
  };
}

/**
 * Trim the plan to fit the budget by dropping the lowest-priority selections until
 * it fits (deterministic; essentials kept last). Returns the kept selections.
 */
export function trimToBudget(budget: number, selections: CatalogSelection[]): CatalogSelection[] {
  let kept = [...selections];
  // Drop from the end (lowest priority is grounded last / has the highest priority number).
  const byPriority = (s: CatalogSelection) => s.need.priority ?? 99;
  kept.sort((a, b) => byPriority(a) - byPriority(b));
  while (kept.length > 1 && computeBudget(budget, kept).exceededBy > 0) {
    kept = kept.slice(0, -1);
  }
  return kept;
}
