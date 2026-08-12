/**
 * AI Designer wizard state: a reducer + localStorage persistence.
 *
 * The wizard is deliberately simple client state (no Redux) that survives step
 * navigation and refreshes. The uploaded image is intentionally NOT persisted
 * (only its name) — the blob stays as an ephemeral object URL in the component.
 * All design computation goes through the pure `generateDemoDesign` service, so
 * this file only orchestrates; it never re-implements recommendation logic.
 */

import {
  buildReason,
  generateDemoDesign,
  pickCustomerOption,
  summarize,
  type DesignInput,
  type DesignItem,
  type DesignRecommendation,
  type DesignTier,
  type FurnitureDisposition,
} from "@/lib/design";
import { getProductBySlug } from "@/lib/catalog";
import type {
  CategorySlug,
  ColorId,
  MaterialId,
  StyleTag,
} from "@/lib/catalog";
import type { DesignRoomType } from "@/lib/design";
import type { AnalysisPrefill, RoomAnalysis } from "@/lib/vision";

export const STORAGE_KEY = "athathi.design.v1";
export const TOTAL_STEPS = 7; // brief steps 0..6

export type WizardPhase = "brief" | "analysis" | "result";

/** How the main style is chosen: the user picks one, or DAR recommends it. */
export type StyleMode = "manual" | "ai-recommended";

/** Editable draft — a superset of DesignInput with UI-friendly fields. */
export interface DesignDraft {
  imageName?: string;
  roomType?: DesignRoomType;
  budgetText: string;
  /** "manual" = user picks a style; "ai-recommended" = derived from the room photo. */
  styleMode: StyleMode;
  primaryStyle?: StyleTag;
  secondaryStyle?: StyleTag;
  decisions: Record<string, FurnitureDisposition>;
  preferredColors: ColorId[];
  preferredMaterials: MaterialId[];
  note: string;
}

/** Minimum confidence for the AI-recommended style to be accepted from analysis. */
const STYLE_MIN_CONFIDENCE = 0.5;

/** The AI-recommended style from an analysis (a valid Athathi style id), or undefined. */
export function recommendedStyleFrom(
  analysis: RoomAnalysis | null,
): StyleTag | undefined {
  const s = analysis?.style;
  return s && s.primary && s.confidence >= STYLE_MIN_CONFIDENCE ? s.primary : undefined;
}

export interface WizardState {
  phase: WizardPhase;
  step: number;
  draft: DesignDraft;
  recommendation: DesignRecommendation | null;
  selectedTier: DesignTier;
  items: DesignItem[];
  addedToCart: boolean;
  saved: boolean;
  /** The latest room analysis (Phase 05), or null. Structured, never raw prose. */
  analysis: RoomAnalysis | null;
  /** Whether the analysis has been applied as a wizard pre-fill. */
  analysisApplied: boolean;
  /** Set once localStorage has been read on the client (gates persistence). */
  hydrated: boolean;
}

export const initialState: WizardState = {
  phase: "brief",
  step: 0,
  draft: {
    budgetText: "",
    styleMode: "manual",
    decisions: {},
    preferredColors: [],
    preferredMaterials: [],
    note: "",
  },
  recommendation: null,
  selectedTier: "balanced",
  items: [],
  addedToCart: false,
  saved: false,
  analysis: null,
  analysisApplied: false,
  hydrated: false,
};

export type WizardAction =
  | { type: "SET_IMAGE"; name: string }
  | { type: "CLEAR_IMAGE" }
  | { type: "SET_ROOM"; room: DesignRoomType }
  | { type: "SET_BUDGET_TEXT"; text: string }
  | { type: "SET_STYLE_MODE"; mode: StyleMode }
  | { type: "SET_PRIMARY_STYLE"; style: StyleTag }
  | { type: "SET_SECONDARY_STYLE"; style: StyleTag | undefined }
  | { type: "SET_DECISION"; category: CategorySlug; disposition: FurnitureDisposition }
  | { type: "TOGGLE_COLOR"; color: ColorId }
  | { type: "TOGGLE_MATERIAL"; material: MaterialId }
  | { type: "SET_NOTE"; note: string }
  | { type: "GO_TO_STEP"; step: number }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "GENERATE" }
  | { type: "ANALYSIS_DONE" }
  | { type: "REPLACE_ITEM"; index: number; slug: string }
  | { type: "SET_ITEM_COLOR"; index: number; color: ColorId }
  | { type: "REMOVE_ITEM"; index: number }
  | { type: "MARK_ADDED" }
  | { type: "CONTINUE_EDITING" }
  | { type: "MARK_SAVED" }
  | { type: "SET_ANALYSIS"; analysis: RoomAnalysis }
  | { type: "APPLY_PREFILL"; prefill: AnalysisPrefill }
  | { type: "CLEAR_ANALYSIS" }
  | { type: "APPLY_AGENT_RESULT"; input?: DesignInput; items: DesignItem[] }
  | { type: "RESET" }
  | { type: "HYDRATE"; state: WizardState };

/**
 * Apply an AI pre-fill to a draft under the golden rule **USER WINS**: a field
 * is filled ONLY when the user hasn't already set it. Colours merge in without
 * removing any the user added; per-category keep/replace suggestions apply only
 * to categories the user hasn't decided. Pure + exported for testing.
 */
export function applyPrefill(
  draft: DesignDraft,
  prefill: AnalysisPrefill,
): DesignDraft {
  const next: DesignDraft = { ...draft };

  if (draft.roomType === undefined && prefill.roomType) {
    next.roomType = prefill.roomType;
  }
  if (draft.primaryStyle === undefined && prefill.primaryStyle) {
    next.primaryStyle = prefill.primaryStyle;
    if (prefill.secondaryStyle && prefill.secondaryStyle !== prefill.primaryStyle) {
      next.secondaryStyle = prefill.secondaryStyle;
    }
  }
  if (draft.preferredColors.length === 0 && prefill.preferredColors.length > 0) {
    next.preferredColors = [...prefill.preferredColors];
  }
  // Merge keep/replace suggestions only for undecided categories.
  const decisions = { ...draft.decisions };
  for (const [category, disposition] of Object.entries(prefill.decisions)) {
    if (decisions[category] === undefined) decisions[category] = disposition;
  }
  next.decisions = decisions;

  return next;
}

/** Parse the budget text into a number (or NaN). */
export function parseBudget(text: string): number {
  const cleaned = text.replace(/[^\d.]/g, "");
  if (cleaned === "") return NaN;
  return Number(cleaned);
}

export const MIN_BUDGET = 30;
export const MAX_BUDGET = 100000;

/** Validate the current step; returns true when Continue/Generate is allowed. */
export function canAdvance(state: WizardState): boolean {
  const d = state.draft;
  switch (state.step) {
    case 0:
      return true; // photo optional
    case 1:
      return Boolean(d.roomType);
    case 2: {
      const b = parseBudget(d.budgetText);
      return Number.isFinite(b) && b >= MIN_BUDGET && b <= MAX_BUDGET;
    }
    case 3:
      return Boolean(d.primaryStyle);
    case 4:
      return true; // decisions default to "unsure"
    case 5:
      return true; // preferences optional
    case 6:
      return true; // review → generate
    default:
      return true;
  }
}

/** Convert a valid draft into the structured, deterministic DesignInput. */
export function draftToInput(draft: DesignDraft): DesignInput {
  const decisions = Object.entries(draft.decisions).map(([category, disposition]) => ({
    category: category as CategorySlug,
    disposition,
  }));
  return {
    roomType: draft.roomType!,
    budget: parseBudget(draft.budgetText),
    primaryStyle: draft.primaryStyle!,
    secondaryStyle: draft.secondaryStyle,
    preferredColors: draft.preferredColors,
    preferredMaterials: draft.preferredMaterials,
    decisions,
    note: draft.note.trim() || undefined,
    imageName: draft.imageName,
  };
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "HYDRATE":
      return { ...action.state, hydrated: true };
    case "SET_IMAGE":
      return { ...state, draft: { ...state.draft, imageName: action.name } };
    case "CLEAR_IMAGE":
      return { ...state, draft: { ...state.draft, imageName: undefined } };
    case "SET_ROOM":
      // Changing room invalidates keep-decisions (categories differ).
      return {
        ...state,
        draft: { ...state.draft, roomType: action.room, decisions: {} },
      };
    case "SET_BUDGET_TEXT":
      return { ...state, draft: { ...state.draft, budgetText: action.text } };
    case "SET_STYLE_MODE": {
      if (action.mode === "ai-recommended") {
        // Derive the style from the room photo's analysis (a valid Athathi id).
        // With no image/analysis yet, `primaryStyle` stays undefined and the
        // Style step asks the user to upload a photo first — never a fake claim.
        const recommended = recommendedStyleFrom(state.analysis);
        return {
          ...state,
          draft: {
            ...state.draft,
            styleMode: "ai-recommended",
            primaryStyle: recommended,
            secondaryStyle: recommended ? state.draft.secondaryStyle : undefined,
          },
        };
      }
      return { ...state, draft: { ...state.draft, styleMode: "manual" } };
    }
    case "SET_PRIMARY_STYLE": {
      const secondaryStyle =
        state.draft.secondaryStyle === action.style
          ? undefined
          : state.draft.secondaryStyle;
      // A manual pick switches out of AI-recommended mode (the user takes control).
      return {
        ...state,
        draft: { ...state.draft, styleMode: "manual", primaryStyle: action.style, secondaryStyle },
      };
    }
    case "SET_SECONDARY_STYLE":
      return { ...state, draft: { ...state.draft, secondaryStyle: action.style } };
    case "SET_DECISION":
      return {
        ...state,
        draft: {
          ...state.draft,
          decisions: { ...state.draft.decisions, [action.category]: action.disposition },
        },
      };
    case "TOGGLE_COLOR":
      return {
        ...state,
        draft: {
          ...state.draft,
          preferredColors: toggle(state.draft.preferredColors, action.color),
        },
      };
    case "TOGGLE_MATERIAL":
      return {
        ...state,
        draft: {
          ...state.draft,
          preferredMaterials: toggle(state.draft.preferredMaterials, action.material),
        },
      };
    case "SET_NOTE":
      return { ...state, draft: { ...state.draft, note: action.note } };
    case "GO_TO_STEP":
      return { ...state, phase: "brief", step: action.step };
    case "NEXT":
      return { ...state, step: Math.min(TOTAL_STEPS - 1, state.step + 1) };
    case "BACK":
      return { ...state, step: Math.max(0, state.step - 1) };
    case "GENERATE": {
      const input = draftToInput(state.draft);
      const recommendation = generateDemoDesign(input);
      // ONE budget-fit design for the customer (no spending tiers to choose).
      const option = pickCustomerOption(recommendation);
      return {
        ...state,
        phase: "analysis",
        recommendation,
        selectedTier: option.tier,
        items: option.items,
        addedToCart: false,
        saved: false,
      };
    }
    case "ANALYSIS_DONE":
      return { ...state, phase: "result" };
    case "REPLACE_ITEM": {
      if (!state.recommendation) return state;
      const product = getProductBySlug(action.slug);
      if (!product) return state;
      const items = state.items.map((item, i) =>
        i === action.index
          ? {
              slug: product.slug,
              category: product.category,
              colorId: product.colors[0]?.id,
              reason: buildReason(product, state.recommendation!.input),
            }
          : item,
      );
      return { ...state, items, addedToCart: false, saved: false };
    }
    case "SET_ITEM_COLOR": {
      // Only accept a colour that is a VERIFIED variant of that exact product.
      const target = state.items[action.index];
      if (!target) return state;
      const product = getProductBySlug(target.slug);
      if (!product || !product.colors.some((c) => c.id === action.color)) return state;
      const items = state.items.map((item, i) =>
        i === action.index ? { ...item, colorId: action.color } : item,
      );
      return { ...state, items, addedToCart: false, saved: false };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((_, i) => i !== action.index),
        addedToCart: false,
        saved: false,
      };
    case "MARK_ADDED":
      return { ...state, addedToCart: true };
    case "CONTINUE_EDITING":
      return { ...state, addedToCart: false };
    case "MARK_SAVED":
      return { ...state, saved: true };
    case "SET_ANALYSIS": {
      // In AI-recommended mode, keep the derived style in sync with the newest
      // analysis (so choosing the option before analysing, then analysing, works).
      const draft =
        state.draft.styleMode === "ai-recommended"
          ? { ...state.draft, primaryStyle: recommendedStyleFrom(action.analysis) }
          : state.draft;
      return { ...state, draft, analysis: action.analysis, analysisApplied: false };
    }
    case "APPLY_PREFILL":
      return {
        ...state,
        draft: applyPrefill(state.draft, action.prefill),
        analysisApplied: true,
      };
    case "CLEAR_ANALYSIS": {
      // Replacing/removing the image invalidates any analysis-derived state: the
      // AI-recommended style is dropped (nothing to base it on until re-analysis).
      const draft =
        state.draft.styleMode === "ai-recommended"
          ? { ...state.draft, primaryStyle: undefined, secondaryStyle: undefined }
          : state.draft;
      return { ...state, draft, analysis: null, analysisApplied: false };
    }
    case "APPLY_AGENT_RESULT": {
      // The Agent operates on the current design; apply its structured result
      // (updated items, and possibly an updated budget/decisions) to the plan.
      if (!state.recommendation) return state;
      const input = action.input ?? state.recommendation.input;
      return {
        ...state,
        recommendation: { ...state.recommendation, input },
        items: action.items,
        addedToCart: false,
        saved: false,
      };
    }
    case "RESET":
      // Stay hydrated — we're already on the client; only the design resets.
      return { ...initialState, hydrated: true };
    default:
      return state;
  }
}

/** Current budget summary from the working item set (single source: catalog). */
export function currentSummary(state: WizardState) {
  if (!state.recommendation) return null;
  return summarize(state.items, state.recommendation.input);
}

/** Serialise for localStorage (image blob is never persisted). */
export function serialize(state: WizardState): string {
  return JSON.stringify(state);
}

export function deserialize(raw: string): WizardState | null {
  try {
    const parsed = JSON.parse(raw) as WizardState;
    if (!parsed || typeof parsed !== "object" || !parsed.draft) return null;
    // Drop items that reference products no longer in the catalog.
    const items = Array.isArray(parsed.items)
      ? parsed.items.filter((i) => getProductBySlug(i.slug))
      : [];
    return { ...initialState, ...parsed, items };
  } catch {
    return null;
  }
}
