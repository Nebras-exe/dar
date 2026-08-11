/**
 * Athathi Room Analysis (Vision) — domain contracts (Phase 05).
 *
 * Vision *observes and suggests*; it is never the source of truth. Its output is
 * a strongly-typed `RoomAnalysis` (never raw model prose) whose machine values
 * reuse the Phase 03 catalog + Phase 04 designer taxonomy, so the existing
 * wizard can consume it without change. A future agent tool
 * `analyze_room_image(image) → RoomAnalysis` returns this same shape.
 *
 * Kept free of server-only / React imports so the types + validator + mapping
 * can run on the client (to defensively re-validate the API response) and in
 * Node tests.
 */

import type {
  CategorySlug,
  ColorId,
  MaterialId,
  StyleTag,
} from "@/lib/catalog";
import type { DesignRoomType, FurnitureDisposition } from "@/lib/design";

/** A confidence value, always clamped to [0, 1] by the validator. */
export type Confidence = number;

/** Qualitative band — the UI shows this rather than raw decimals. */
export type ConfidenceBand = "low" | "medium" | "high";

export function confidenceBand(c: Confidence): ConfidenceBand {
  if (c >= 0.8) return "high";
  if (c >= 0.5) return "medium";
  return "low";
}

/** A detected colour: the model's raw phrase + a mapped catalog colour, if any. */
export interface DetectedColor {
  /** The model's short raw description, e.g. "warm white". Free text (sanitised). */
  raw: string;
  /** Mapped Phase 03 catalog colour id, or null when it doesn't map cleanly. */
  mappedColorId: ColorId | null;
  confidence: Confidence;
}

/** Style estimate expressed only in the Phase 03 style taxonomy. */
export interface StyleEstimate {
  primary: StyleTag | null;
  secondary: StyleTag | null;
  confidence: Confidence;
}

/** A detected existing piece of furniture. Vision's keep/replace is a suggestion only. */
export interface ExistingFurnitureItem {
  /** Mapped catalog category, or null when it maps to nothing supported. */
  category: CategorySlug | null;
  /** The model's raw label, e.g. "sofa" / "sectional couch" (sanitised). */
  rawLabel: string;
  confidence: Confidence;
  /** Approximate colour, mapped to the catalog taxonomy where possible. */
  approximateColorId: ColorId | null;
  approximateMaterialId: MaterialId | null;
  /** AI *suggestion* — the user always has final authority. */
  suggestion: FurnitureDisposition;
}

/** Non-precise architectural context (a controlled vocabulary, not geometry). */
export type ArchitecturalFeature =
  | "window"
  | "door"
  | "large-opening"
  | "wall-mounted-tv"
  | "built-in-cabinetry"
  | "ceiling-light"
  | "major-empty-wall"
  | "walkway";

/**
 * Whether physical scale is known. In Phase 05 this is ALWAYS `"unknown"` — a
 * single ordinary photo cannot give reliable real-world measurements, and the
 * validator hard-guarantees no numeric dimensions are ever produced.
 */
export type DimensionsStatus = "unknown";

/** How the analysis was produced. `demo` = a clearly-labelled sample, not real detection. */
export type AnalysisSource = "provider" | "demo";

/** The structured result the wizard consumes. */
export interface RoomAnalysis {
  roomType: DesignRoomType | "unknown";
  roomTypeConfidence: Confidence;

  style: StyleEstimate;
  palette: DetectedColor[];
  existingFurniture: ExistingFurnitureItem[];
  architecturalFeatures: ArchitecturalFeature[];

  /** Always "unknown" in Phase 05 — see {@link DimensionsStatus}. */
  dimensionsStatus: DimensionsStatus;

  /** Provenance + versioning (never contains secrets). */
  source: AnalysisSource;
  provider: string; // e.g. "anthropic" | "openai" | "gemini" | "demo"
  promptVersion: string;
  model?: string;
}

/** The service result: a discriminated union — never throws to the caller. */
export type VisionResult =
  | { ok: true; analysis: RoomAnalysis; durationMs: number }
  | { ok: false; code: VisionErrorCode; durationMs: number };

/** Stable, user-safe error codes (mapped to friendly i18n text in the UI). */
export type VisionErrorCode =
  | "no-provider" // no provider is configured in this environment
  | "invalid-image" // MIME/size/empty validation failed
  | "timeout" // provider took too long
  | "provider-error" // provider returned an error (details never surfaced)
  | "invalid-output" // model output failed schema validation
  | "rate-limited"
  | "unknown";
