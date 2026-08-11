/**
 * The deterministic recommendation engine (Phase 04).
 *
 * Pure and testable, built ENTIRELY on the Phase 03 catalog (`filterProducts`,
 * catalog queries, `computeSubtotal`) — there is one product source of truth and
 * no LLM. It turns a structured `DesignInput` into budget-aware `DesignOption`s
 * across three tiers, with per-product reasons, plus replacement queries.
 */

import {
  computeSubtotal,
  filterProducts,
  getProductBySlug,
  roundOmr,
  type Product,
} from "@/lib/catalog";
import { getCatalogRoom, getRoomPlan } from "./room-needs";
import { buildReason } from "./reasons";
import type {
  BudgetSummary,
  DesignInput,
  DesignItem,
  DesignOption,
  DesignRecommendation,
  DesignTier,
  KeptCategory,
  ReplacementMode,
} from "./types";
import type { CategorySlug } from "@/lib/catalog";

const TIERS: DesignTier[] = ["smart-saver", "balanced", "premium"];
const TIER_RANK: Record<DesignTier, number> = {
  "smart-saver": 1,
  balanced: 2,
  premium: 3,
};

/** Soft match score — mirrors the reason priority (style → colour → material). */
function scoreProduct(product: Product, input: DesignInput): number {
  let s = 0;
  if (product.styleTags.includes(input.primaryStyle)) s += 4;
  if (input.secondaryStyle && product.styleTags.includes(input.secondaryStyle))
    s += 2;
  if (product.colors.some((c) => input.preferredColors.includes(c.id))) s += 3;
  if (product.materials.some((m) => input.preferredMaterials.includes(m))) s += 2;
  return s;
}

/**
 * Candidate products for a category, best match first. Filtered by the room
 * (relaxed to category-only if the room has no products), then ranked by match
 * score, then price, then curated order — fully deterministic.
 */
export function getCandidates(
  category: CategorySlug,
  input: DesignInput,
): Product[] {
  const room = getCatalogRoom(input.roomType);
  let pool = filterProducts({
    categories: [category],
    rooms: [room],
    availability: ["in-stock", "made-to-order"],
  });
  if (pool.length === 0) {
    pool = filterProducts({
      categories: [category],
      availability: ["in-stock", "made-to-order"],
    });
  }
  return pool
    .map((p) => ({ p, score: scoreProduct(p, input) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.p.price - b.p.price ||
        (a.p.featuredRank ?? 0) - (b.p.featuredRank ?? 0),
    )
    .map((x) => x.p);
}

/**
 * Choose one product for a tier from best-first `candidates`, honouring the
 * remaining budget. When nothing fits and the category is essential, the
 * cheapest candidate is taken (minimising any overspend, which is surfaced —
 * never silent). Non-essential categories are skipped when nothing fits.
 */
function pickForTier(
  candidates: Product[],
  tier: DesignTier,
  remaining: number,
  essential: boolean,
): Product | null {
  if (candidates.length === 0) return null;
  const fitting = candidates.filter((p) => p.price <= remaining);

  if (fitting.length === 0) {
    if (!essential) return null;
    // Cheapest essential — keeps any overspend as small as possible.
    return [...candidates].sort((a, b) => a.price - b.price)[0];
  }

  switch (tier) {
    case "smart-saver":
      // Cheapest option that fits.
      return [...fitting].sort((a, b) => a.price - b.price)[0];
    case "premium":
      // Nicest (priciest) option that still fits the remaining budget.
      return [...fitting].sort((a, b) => b.price - a.price)[0];
    case "balanced":
    default:
      // Best match that fits (fitting is already score-sorted best-first).
      return fitting[0];
  }
}

function keptCategories(input: DesignInput): KeptCategory[] {
  return input.decisions
    .filter((d) => d.disposition === "keep")
    .map((d) => ({ category: d.category }));
}

/** Build one complete option at a tier. */
export function buildOption(input: DesignInput, tier: DesignTier): DesignOption {
  const plan = getRoomPlan(input.roomType);
  const kept = new Set(keptCategories(input).map((k) => k.category));
  const needs = plan.needs.filter((n) => !kept.has(n.category));

  const items: DesignItem[] = [];
  const used = new Set<string>();
  let total = 0;

  for (const need of needs) {
    const remaining = roundOmr(input.budget - total);
    const candidates = getCandidates(need.category, input).filter(
      (p) => !used.has(p.slug),
    );
    if (candidates.length === 0) continue;

    const pick = pickForTier(candidates, tier, remaining, need.essential);
    if (!pick) continue;

    // The best-matching candidate was too expensive → this pick is a budget compromise.
    const best = candidates[0];
    const budgetDriven = best.price > remaining && pick.slug !== best.slug;

    used.add(pick.slug);
    total = roundOmr(total + pick.price);
    items.push({
      slug: pick.slug,
      category: need.category,
      colorId: pick.colors[0]?.id,
      reason: buildReason(pick, input, { budgetDriven }),
    });
  }

  return {
    tier,
    items,
    kept: keptCategories(input),
    summary: summarize(items, input),
  };
}

/** Recompute a budget summary from the current item set (used after edits). */
export function summarize(
  items: DesignItem[],
  input: DesignInput,
): BudgetSummary {
  const total = computeSubtotal(
    items
      .map((i) => getProductBySlug(i.slug))
      .filter((p): p is Product => Boolean(p))
      .map((p) => ({ price: p.price, quantity: 1 })),
  );
  return {
    budget: input.budget,
    newFurnitureTotal: total,
    remaining: roundOmr(Math.max(0, input.budget - total)),
    overBudget: roundOmr(Math.max(0, total - input.budget)),
    keptCount: keptCategories(input).length,
    itemCount: items.length,
  };
}

const DEMO_STEPS = [
  { en: "Room preferences received", ar: "تم استلام تفضيلات الغرفة" },
  { en: "Budget checked", ar: "تم التحقق من الميزانية" },
  { en: "Style profile matched", ar: "تمت مطابقة ملف الطراز" },
  { en: "Searching the Athathi catalog", ar: "جارٍ البحث في كتالوج أثاثي" },
  { en: "Checking product prices", ar: "التحقق من أسعار المنتجات" },
  { en: "Building a budget-aware bundle", ar: "تجهيز باقة تراعي الميزانية" },
];

/** The public entry point: a full recommendation across all three tiers. */
export function buildDesignRecommendation(
  input: DesignInput,
): DesignRecommendation {
  const options = TIERS.map((t) => buildOption(input, t));
  const inBudget = options.filter((o) => o.summary.overBudget === 0);
  const pool = inBudget.length > 0 ? inBudget : options;
  // Recommend the richest option that stays in budget; else the leanest.
  const recommendedTier =
    inBudget.length > 0
      ? [...pool].sort((a, b) => TIER_RANK[b.tier] - TIER_RANK[a.tier])[0].tier
      : "smart-saver";

  return { input, options, recommendedTier, demoSteps: DEMO_STEPS };
}

export function getOption(
  recommendation: DesignRecommendation,
  tier: DesignTier,
): DesignOption {
  return (
    recommendation.options.find((o) => o.tier === tier) ??
    recommendation.options[0]
  );
}

/**
 * Replacement candidates for an item, deterministic per mode:
 * - `cheaper`  — priced below the current item, nearest-cheaper first.
 * - `upgrade`  — priced above, nearest step-up first.
 * - `similar`  — within ±30% of the current price, best match first.
 * `excludeSlugs` (the rest of the current design) is never returned.
 */
export function findReplacements(
  currentSlug: string,
  mode: ReplacementMode,
  input: DesignInput,
  excludeSlugs: string[] = [],
): Product[] {
  const current = getProductBySlug(currentSlug);
  if (!current) return [];
  const exclude = new Set([currentSlug, ...excludeSlugs]);
  const base = getCandidates(current.category, input).filter(
    (p) => !exclude.has(p.slug),
  );

  switch (mode) {
    case "cheaper":
      return base
        .filter((p) => p.price < current.price)
        .sort((a, b) => b.price - a.price);
    case "upgrade":
      return base
        .filter((p) => p.price > current.price)
        .sort((a, b) => a.price - b.price);
    case "similar":
    default:
      return base
        .filter((p) => Math.abs(p.price - current.price) / current.price <= 0.3)
        .sort(
          (a, b) =>
            scoreProduct(b, input) - scoreProduct(a, input) ||
            a.price - b.price,
        );
  }
}

/** The single best replacement for a mode, or null when none exists. */
export function pickReplacement(
  currentSlug: string,
  mode: ReplacementMode,
  input: DesignInput,
  excludeSlugs: string[] = [],
): Product | null {
  return findReplacements(currentSlug, mode, input, excludeSlugs)[0] ?? null;
}

export { buildReason };
