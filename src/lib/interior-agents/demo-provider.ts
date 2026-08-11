/**
 * Demo Designer provider — deterministic, offline, no model calls.
 *
 * Produces a valid design brief from the run input + room analysis using the
 * existing Phase 04 room plan (deterministic category needs) and the user's stated
 * style/preferences. This is the honest fallback whenever Claude is not configured
 * — the whole multi-agent pipeline still runs end to end (analyse → plan → ground →
 * validate layout → validate budget → render spec), just without a live model.
 */

import { getRoomPlan, type DesignRoomType } from "@/lib/design";
import { roundOmr } from "@/lib/catalog";
import type { DesignerPlanResult, InteriorRunInput, ProductNeed } from "./types";
import type { RoomAnalysis } from "@/lib/vision";
import type { DesignerProvider } from "./provider";
import { INTERIOR_LIMITS } from "./config";

function buildBrief(input: InteriorRunInput, analysis: RoomAnalysis): Record<string, unknown> {
  const plan = getRoomPlan(input.roomType as DesignRoomType);

  // Categories the room analysis suggested keeping / replacing.
  const keep = analysis.existingFurniture
    .filter((f) => f.suggestion === "keep" && f.category)
    .map((f) => f.category);
  const remove = analysis.existingFurniture
    .filter((f) => f.suggestion === "replace" && f.category)
    .map((f) => f.category);
  const keepSet = new Set(keep);

  // Needs = the room's category plan, minus anything kept. Essentials first.
  const needCategories = plan.needs.filter((n) => !keepSet.has(n.category));
  const budgetShare = needCategories.length > 0 ? roundOmr(input.budget / needCategories.length) : input.budget;
  const preferredMaterial = input.memory?.preferredMaterials[0];
  const preferredColor = input.memory?.preferredColors[0];

  const needs: ProductNeed[] = needCategories.map((n, i) => ({
    category: n.category,
    style: input.primaryStyle,
    ...(preferredMaterial ? { material: preferredMaterial } : {}),
    ...(preferredColor ? { color: preferredColor } : {}),
    // Essentials get a bit more headroom than accents.
    maxPrice: roundOmr(budgetShare * (n.essential ? 1.4 : 0.8)),
    priority: n.essential ? 1 : i + 2,
  })).slice(0, INTERIOR_LIMITS.maxNeeds);

  return {
    intentEn: `A ${input.primaryStyle.replace("-", " ")} ${input.roomType.replace("-", " ")} within your ${input.budget} OMR budget.`,
    intentAr: `${input.roomType.replace("-", " ")} بأسلوب ${input.primaryStyle.replace("-", " ")} ضمن ميزانيتك ${input.budget} ر.ع.`,
    keep,
    remove,
    needs,
    preferredColors: input.memory?.preferredColors ?? [],
    preferredMaterials: input.memory?.preferredMaterials ?? [],
  };
}

export const demoDesignerProvider: DesignerProvider = {
  name: "demo",
  model: "demo-deterministic",
  isConfigured: () => true,
  async plan(input, analysis): Promise<DesignerPlanResult> {
    return { ok: true, raw: buildBrief(input, analysis), model: "demo-deterministic" };
  },
};
