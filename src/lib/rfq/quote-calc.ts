/**
 * Quote money math + comparison (Phase 09, §38/§37/§39). All arithmetic is here,
 * in exact 3-decimal OMR — never done by an LLM. Budget position and quote
 * sorting/recommendation are deterministic and transparent (reasons, not a
 * black-box score). Pure + client-safe.
 */

import { roundOmr } from "@/lib/catalog";
import type {
  BudgetPosition,
  CustomFurnitureSpec,
  Quote,
  QuoteRecommendation,
  QuoteSort,
  RecommendationReason,
} from "./types";

/** total = base + delivery + installation (rounded OMR). */
export function quoteTotal(basePrice: number, deliveryFee: number, installationFee: number): number {
  return roundOmr(roundOmr(basePrice + deliveryFee) + installationFee);
}

/** Where a quote sits vs the request budget (deterministic; §37). */
export function budgetPosition(total: number, budget: number | undefined): BudgetPosition {
  if (budget === undefined) return { status: "no-budget", overBy: 0 };
  if (total <= budget) return { status: "within", overBy: 0 };
  return { status: "over", overBy: roundOmr(total - budget) };
}

/** Sort quotes by the chosen key (deterministic; stable id tie-break). §39 */
export function sortQuotes(quotes: readonly Quote[], sort: QuoteSort, budget?: number): Quote[] {
  const copy = [...quotes];
  const byId = (a: Quote, b: Quote) => a.id.localeCompare(b.id);
  switch (sort) {
    case "lowest-price":
      return copy.sort((a, b) => a.total - b.total || byId(a, b));
    case "fastest":
      return copy.sort((a, b) => a.manufacturingDays - b.manufacturingDays || byId(a, b));
    case "within-budget":
      return copy.sort((a, b) => {
        const aw = budget !== undefined && a.total <= budget ? 0 : 1;
        const bw = budget !== undefined && b.total <= budget ? 0 : 1;
        return aw - bw || a.total - b.total || byId(a, b);
      });
    case "recommended":
    default: {
      const rec = recommendQuote(copy, budget);
      return copy.sort((a, b) => {
        if (rec && a.id === rec.quoteId) return -1;
        if (rec && b.id === rec.quoteId) return 1;
        return a.total - b.total || byId(a, b);
      });
    }
  }
}

/**
 * Pick a transparent "best value" quote (§27). Scoring is deterministic and each
 * winning quote is explained by reasons; ties break by lowest total then id. It
 * never favours "promoted" suppliers — only actual request fit (§28).
 */
export function recommendQuote(
  quotes: readonly Quote[],
  budget: number | undefined,
): QuoteRecommendation | null {
  if (quotes.length === 0) return null;
  const submitted = quotes.filter((q) => q.status === "submitted" || q.status === "accepted");
  const pool = submitted.length > 0 ? submitted : quotes;

  const cheapest = Math.min(...pool.map((q) => q.total));
  const fastest = Math.min(...pool.map((q) => q.manufacturingDays));

  let best: Quote | null = null;
  let bestScore = -Infinity;
  for (const q of pool) {
    let score = 0;
    if (budget !== undefined && q.total <= budget) score += 3;
    if (q.total === cheapest) score += 2;
    if (q.manufacturingDays === fastest) score += 1;
    if (q.deliveryFee === 0) score += 1;
    if (q.status === "accepted") score += 5;
    // Deterministic tie-break folded into the comparison below.
    if (
      score > bestScore ||
      (score === bestScore && best && (q.total < best.total || (q.total === best.total && q.id.localeCompare(best.id) < 0)))
    ) {
      best = q;
      bestScore = score;
    }
  }
  if (!best) return null;

  const reasons: RecommendationReason[] = [];
  if (budget !== undefined && best.total <= budget) reasons.push({ code: "within-budget" });
  if (best.total === cheapest) reasons.push({ code: "lowest-total" });
  if (best.manufacturingDays === fastest) reasons.push({ code: "fastest" });
  if (best.deliveryFee === 0) reasons.push({ code: "includes-delivery" });
  return { quoteId: best.id, reasons };
}

/** Compare against budget for a whole request (quantity-aware helper for the UI). */
export function requestBudget(spec: CustomFurnitureSpec): number | undefined {
  return spec.budget;
}
