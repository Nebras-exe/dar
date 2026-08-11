/**
 * Athathi Multi-Agent Interior Engine — domain contracts.
 *
 * A server-side orchestration layer that COMPOSES the existing systems (Phase 05
 * Vision for room analysis, the Phase 03 catalog + Phase-variants layer for
 * grounding, the Phase 04 design/budget helpers, and the Phase 07 visualization
 * contract for the render hand-off) into one interior-design run. The AI (Claude,
 * or the deterministic Demo provider) only PLANS — it never computes authoritative
 * totals, invents catalog products, or overrides deterministic fit/budget checks.
 *
 * Kept free of server-only / React imports so the types + validators run on the
 * client and in Node tests. Secrets never appear in any of these shapes.
 */

import type { CategorySlug, ColorId, MaterialId, StyleTag } from "@/lib/catalog";
import type { DesignRoomType } from "@/lib/design";
import type { RoomAnalysis } from "@/lib/vision";

// ── Run input ─────────────────────────────────────────────────────────────────

/** A SAFE memory context (approved preferences only) — never payment/secret data. */
export interface InteriorMemoryContext {
  preferredStyles: StyleTag[];
  preferredColors: ColorId[];
  preferredMaterials: MaterialId[];
  typicalBudget?: { min: number; max: number };
}

/** Everything a run needs. `instructions`/memory are DATA, never system instructions. */
export interface InteriorRunInput {
  locale: "en" | "ar";
  roomType: DesignRoomType;
  /** Numeric OMR budget (3-decimal). Never a formatted string. */
  budget: number;
  primaryStyle: StyleTag;
  secondaryStyle?: StyleTag;
  /** Free-text user instructions (treated as untrusted data). */
  instructions?: string;
  /** Approved user memory (optional). */
  memory?: InteriorMemoryContext;
  /**
   * User-supplied real dimensions (cm) when known — PREFERRED over any visual
   * estimate. A single photo never yields authoritative measurements.
   */
  knownWidthCm?: number;
}

// ── Designer plan (the AI's structured output) ──────────────────────────────────

/**
 * A product NEED — what the designer requests, NOT a product. The catalog agent
 * grounds each need into a real product + variant. The model may never name an id.
 */
export interface ProductNeed {
  category: CategorySlug;
  style?: StyleTag;
  material?: MaterialId;
  color?: ColorId;
  /** Max OMR price for this piece (a soft target; budget is enforced deterministically). */
  maxPrice?: number;
  /** 1 = most important; drives ordering when the budget is tight. */
  priority?: number;
}

/** The validated designer brief. All fields constrained to the real taxonomy. */
export interface DesignBrief {
  /** Short design intent, bilingual where the provider supplies it. */
  intentEn: string;
  intentAr: string;
  /** Categories to keep (from the room), remove, and needs to add. */
  keep: CategorySlug[];
  remove: CategorySlug[];
  needs: ProductNeed[];
  preferredColors: ColorId[];
  preferredMaterials: MaterialId[];
  /** Free-text layout guidance (advisory only; deterministic checks decide fit). */
  layoutGuidanceEn?: string;
  layoutGuidanceAr?: string;
}

// ── Catalog grounding (deterministic, authoritative) ────────────────────────────

/**
 * A grounded selection: a REAL catalog product (+ optional real colour variant).
 * Every value here comes from application code, never the model.
 */
export interface CatalogSelection {
  need: ProductNeed;
  slug: string;
  category: CategorySlug;
  nameEn: string;
  nameAr: string;
  /** Authoritative OMR price (base + any variant delta), 3-decimal. */
  priceOmr: number;
  supplier: string;
  widthCm: number;
  /** The selected colour variant, if any (a real variant id/colour). */
  colorId?: ColorId;
  variantColorEn?: string;
  variantColorAr?: string;
  variantMaterialId?: MaterialId;
  /** A reference image URL for the selection (local preview photo), never a fabricated render. */
  imageRef?: string;
}

// ── Layout / constraint validation (deterministic) ──────────────────────────────

export type FitStatus = "FIT_CONFIRMED" | "FIT_LIKELY" | "NEEDS_MEASUREMENT" | "DOES_NOT_FIT";

export interface ItemFit {
  slug: string;
  status: FitStatus;
  widthCm: number;
  /** The available width used for the check, when known. */
  availableWidthCm?: number;
}

export interface LayoutValidation {
  /** The weakest per-item status (NEEDS_MEASUREMENT unless dimensions are known). */
  overall: FitStatus;
  items: ItemFit[];
}

// ── Budget validation (deterministic) ───────────────────────────────────────────

export interface BudgetResult {
  currency: "OMR";
  budget: number;
  subtotal: number;
  total: number;
  remaining: number;
  /** > 0 only when the plan exceeds the budget. */
  exceededBy: number;
  withinBudget: boolean;
}

// ── Render specification (structured hand-off to a future image provider) ───────

export interface RenderInsert {
  slug: string;
  category: CategorySlug;
  colorId?: ColorId;
  /** Reference image for the product/variant (never a generated image). */
  imageRef?: string;
}

/**
 * The deterministic, structured spec a FUTURE image provider consumes. Phase-safe:
 * Claude prepares this; no image is generated here (the demo/visualization layer or
 * a real provider does that later).
 */
export interface RenderSpec {
  /** Opaque handle to the uploaded room image (never the bytes/base64). */
  roomImageRef: string;
  preserveArchitecture: string[];
  preserveExistingFurniture: string[];
  insertProducts: RenderInsert[];
  primaryStyle: StyleTag;
  secondaryStyle?: StyleTag;
  paletteColors: ColorId[];
  /** Hard "do NOT" constraints for the image edit (keys, rendered by the UI/provider). */
  negativeConstraints: string[];
  /** Deterministic design fingerprint (reuses the visualization fingerprint). */
  designFingerprint: string;
}

// ── Run state ───────────────────────────────────────────────────────────────────

export type RunStatus =
  | "analyzing_room"
  | "planning"
  | "searching_catalog"
  | "validating_layout"
  | "validating_budget"
  | "preparing_visualization"
  | "complete"
  | "failed";

/** Which engine produced each AI step (never a secret; safe for the client). */
export interface ProviderMeta {
  /** The interior designer step: a live Claude call, or the deterministic Demo. */
  designer: "claude" | "demo";
  /** The room-vision step: a real provider, or the deterministic demo analysis. */
  vision: "provider" | "demo";
  /** Model id for provenance only — never a secret. */
  model?: string;
  /** Why the demo path was taken, e.g. "anthropic_key_missing". */
  reason?: string;
}

/** Stable, user-safe warning codes surfaced to the UI. */
export type RunWarningCode =
  | "dimensions_unknown"
  | "budget_exceeded"
  | "no_catalog_match"
  | "does_not_fit"
  | "partial_plan";

export interface RunWarning {
  code: RunWarningCode;
  /** Optional safe context (e.g. a category), never sensitive. */
  context?: string;
}

/** Stable, user-safe error codes (mapped to friendly i18n text; raw errors never surface). */
export type RunErrorCode =
  | "invalid-input"
  | "invalid-image"
  | "vision-failed"
  | "planning-failed"
  | "invalid-plan"
  | "no-catalog-matches"
  | "timeout"
  | "provider-error"
  | "unknown";

/** The full, typed run — what the API returns (minus the raw image). */
export interface InteriorDesignRun {
  id: string;
  status: RunStatus;
  provider: ProviderMeta;
  roomAnalysis: RoomAnalysis | null;
  designBrief: DesignBrief | null;
  catalogSelections: CatalogSelection[];
  layoutValidation: LayoutValidation | null;
  budgetResult: BudgetResult | null;
  renderSpec: RenderSpec | null;
  warnings: RunWarning[];
  startedAt: number;
  finishedAt: number | null;
  /** Present only when status === "failed". */
  error?: RunErrorCode;
}

/** The provider's raw plan call result — validated before it enters the pipeline. */
export type DesignerPlanResult =
  | { ok: true; raw: unknown; model: string }
  | { ok: false; code: "not-configured" | "provider-error" | "timeout" };
