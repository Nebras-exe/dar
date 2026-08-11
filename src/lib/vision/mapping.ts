/**
 * Pure mapping from a validated `RoomAnalysis` to Phase 04 wizard-draft
 * pre-fills. This is the ONLY place vision feeds the designer, and it encodes
 * the golden rule:
 *
 *   AI PRE-FILL → USER EDIT → USER WINS
 *
 * The mapping never decides products (that stays with the design engine) and it
 * only proposes values; the caller applies them WITHOUT overwriting anything the
 * user has already set. No `server-only` import — it runs on the client after
 * the API response returns.
 */

import type { ColorId, StyleTag } from "@/lib/catalog";
import type { DesignRoomType, FurnitureDisposition } from "@/lib/design";
import { getDecisionCategories } from "@/lib/design";
import { confidenceBand, type RoomAnalysis } from "./types";

/** A structured, ready-to-apply set of suggestions derived from an analysis. */
export interface AnalysisPrefill {
  roomType?: DesignRoomType;
  primaryStyle?: StyleTag;
  secondaryStyle?: StyleTag;
  preferredColors: ColorId[];
  /** Per-category keep/replace/unsure suggestions (only mapped categories). */
  decisions: Record<string, FurnitureDisposition>;
}

/** Only pre-fill a field when the model is at least reasonably confident. */
const MIN_PREFILL_CONFIDENCE = 0.5;

/**
 * Derive suggested draft values from an analysis. Fields the model was unsure
 * about are simply omitted (the user fills them in the normal wizard).
 */
export function analysisToPrefill(analysis: RoomAnalysis): AnalysisPrefill {
  const prefill: AnalysisPrefill = {
    preferredColors: [],
    decisions: {},
  };

  if (
    analysis.roomType !== "unknown" &&
    analysis.roomTypeConfidence >= MIN_PREFILL_CONFIDENCE
  ) {
    prefill.roomType = analysis.roomType;
  }

  if (analysis.style.primary && analysis.style.confidence >= MIN_PREFILL_CONFIDENCE) {
    prefill.primaryStyle = analysis.style.primary;
    if (analysis.style.secondary && analysis.style.secondary !== analysis.style.primary) {
      prefill.secondaryStyle = analysis.style.secondary;
    }
  }

  // Up to three highest-signal mapped colours, de-duplicated, order preserved.
  const seenColors = new Set<ColorId>();
  for (const c of analysis.palette) {
    if (c.mappedColorId && !seenColors.has(c.mappedColorId) && c.confidence >= 0.4) {
      seenColors.add(c.mappedColorId);
      prefill.preferredColors.push(c.mappedColorId);
      if (prefill.preferredColors.length >= 3) break;
    }
  }

  // Keep/replace suggestions, only for categories valid in the chosen room.
  const validCategories = prefill.roomType
    ? new Set(getDecisionCategories(prefill.roomType))
    : null;
  for (const item of analysis.existingFurniture) {
    if (!item.category) continue;
    if (validCategories && !validCategories.has(item.category)) continue;
    // First detection per category wins (validator already de-duplicated).
    if (prefill.decisions[item.category] === undefined) {
      prefill.decisions[item.category] = item.suggestion;
    }
  }

  return prefill;
}

/**
 * A per-field "should we auto-apply or ask the user?" hint, based on confidence
 * bands — the UI uses this to decide whether to show a value as pre-selected or
 * as a gentle suggestion.
 */
export function roomTypeBand(analysis: RoomAnalysis) {
  return confidenceBand(analysis.roomTypeConfidence);
}
