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

// ── Detected existing furniture, confidence-filtered ─────────────────────────

/** A single detected keep-candidate the Keep step renders (real detection only). */
export interface DetectedItem {
  category: NonNullable<RoomAnalysis["existingFurniture"][number]["category"]>;
  rawLabel: string;
  confidence: number;
  approximateColorId: RoomAnalysis["existingFurniture"][number]["approximateColorId"];
  suggestion: RoomAnalysis["existingFurniture"][number]["suggestion"];
}

/** Show a detection as a confident keep-candidate. */
export const KEEP_SHOW_CONFIDENCE = 0.7;
/** Show a detection only under a "maybe also present" group. */
export const KEEP_MAYBE_CONFIDENCE = 0.5;

/**
 * Split the analysis's detected furniture into what the Keep step should show:
 *  - `items`  — confident detections (≥ 0.70), shown normally;
 *  - `maybe`  — uncertain detections (0.50–0.69), shown under "maybe also present";
 *  - below 0.50 is dropped entirely (never guessed into the UI).
 *
 * Only items that map to a real catalog category are eligible (a detection with
 * no mapped category is not actionable in the keep/replace flow). De-duplicated
 * by category (highest-confidence detection per category wins). Pure + testable —
 * this is the ONE source of truth for the Keep step, so it never invents rows.
 */
export function detectedKeepItems(analysis: RoomAnalysis | null): {
  items: DetectedItem[];
  maybe: DetectedItem[];
} {
  if (!analysis) return { items: [], maybe: [] };

  // Highest-confidence detection per mapped category.
  const byCategory = new Map<string, DetectedItem>();
  for (const f of analysis.existingFurniture) {
    if (!f.category) continue;
    if (f.confidence < KEEP_MAYBE_CONFIDENCE) continue; // below 0.50 never shown
    const existing = byCategory.get(f.category);
    if (!existing || f.confidence > existing.confidence) {
      byCategory.set(f.category, {
        category: f.category,
        rawLabel: f.rawLabel,
        confidence: f.confidence,
        approximateColorId: f.approximateColorId,
        suggestion: f.suggestion,
      });
    }
  }

  const items: DetectedItem[] = [];
  const maybe: DetectedItem[] = [];
  for (const item of byCategory.values()) {
    (item.confidence >= KEEP_SHOW_CONFIDENCE ? items : maybe).push(item);
  }
  // Deterministic order: highest confidence first.
  items.sort((a, b) => b.confidence - a.confidence);
  maybe.sort((a, b) => b.confidence - a.confidence);
  return { items, maybe };
}
