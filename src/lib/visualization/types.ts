/**
 * Athathi Before/After Visualization — domain contracts (Phase 07).
 *
 * The visualization is a *design preview*, never a measurement, an architectural
 * plan, or a guarantee of physical fit. Its structured request and result reuse
 * the Phase 03 catalog + Phase 04 design taxonomy, so every product shown
 * resolves to a REAL catalog product (the model may never invent one). A future
 * `generate_visualization(request) → VisualizationResult` agent tool returns this
 * same shape.
 *
 * Kept free of server-only / React imports so the types + fingerprint + request
 * builder + validator run on the client (to build requests, compute staleness,
 * render results) and in Node tests.
 */

import type {
  CategorySlug,
  ColorId,
  StyleTag,
} from "@/lib/catalog";
import type { DesignRoomType } from "@/lib/design";

/** Whether a real image provider ran, or the deterministic demo composition. */
export type VisualizationMode = "live" | "demo";

/**
 * UI-level lifecycle of a preview. Distinct from the service result: the panel
 * tracks whether the shown preview still matches the current design.
 */
export type VisualizationUiStatus =
  | "idle" // no preview requested yet
  | "generating" // request in flight
  | "ready" // preview matches the current design fingerprint
  | "stale" // the design changed since this preview was made
  | "failed"; // last attempt failed

/** One real catalog product featured in the preview (slug is the source of truth). */
export interface VisualizationItemRef {
  slug: string;
  category: CategorySlug;
  /** A VERIFIED colour variant of the product, or undefined for its default. */
  colorId?: ColorId;
}

/** Generation options. Architecture is always preserved in this phase. */
export interface VisualizationOptions {
  /** Preserve room geometry / doors / windows / perspective (always true). */
  preserveArchitecture: boolean;
}

/**
 * The typed request the client sends. Deliberately structured — never
 * uncontrolled prose. The server re-validates every value against the catalog
 * taxonomy and drops anything that doesn't resolve.
 */
export interface VisualizationRequest {
  locale: "en" | "ar";
  roomType: DesignRoomType;
  primaryStyle: StyleTag;
  secondaryStyle?: StyleTag;
  /** Real catalog products to introduce. Fakes are rejected server-side. */
  items: VisualizationItemRef[];
  /** Categories the user chose to KEEP — the preview must retain these. */
  keep: CategorySlug[];
  /** Categories the user chose to REPLACE — the preview may change these. */
  replace: CategorySlug[];
  /** Preferred palette (catalog colour ids) — influences the mood only. */
  paletteColors: ColorId[];
  /** Deterministic fingerprint of the design this request represents. */
  designFingerprint: string;
  options: VisualizationOptions;
}

/**
 * A deterministic demo composition rendered CLIENT-SIDE over the room photo.
 * It is explicitly a labelled "Demo Preview" — not a real AI render. It carries
 * only resolved catalog data + a deterministic mood, never a fabricated image.
 */
export interface DemoScheme {
  /** Ordered resolved products to feature (all real catalog slugs). */
  items: VisualizationItemRef[];
  /** Deterministic mood palette (hex) derived from the design's colours. */
  palette: string[];
  /** Deterministic overlay angle (degrees) for the mood wash. */
  overlayAngle: number;
  /** Deterministic warm/tint strength 0..1 for the wash. */
  washStrength: number;
}

/**
 * The preview payload. A real provider yields a generated image; demo mode
 * yields a composition scheme the client renders honestly over the room photo.
 */
export type VisualizationPreview =
  | { kind: "generated"; imageDataUrl: string }
  | { kind: "demo-composition"; scheme: DemoScheme };

/** A successful visualization (matches §17's output contract). */
export interface VisualizationSuccess {
  ok: true;
  status: "ready";
  mode: VisualizationMode;
  preview: VisualizationPreview;
  provider: string; // "demo" | "anthropic" | ... (never a secret)
  promptVersion: string;
  /** Server-recomputed fingerprint of the resolved design (authoritative). */
  designFingerprint: string;
  /** The real catalog products actually used in this preview. */
  usedItems: VisualizationItemRef[];
  createdAt: number;
}

/** Stable, user-safe error codes (mapped to friendly bilingual UI text). */
export type VisualizationErrorCode =
  | "no-image" // live mode needs a room photo
  | "invalid-image" // MIME/size/magic-byte validation failed
  | "invalid-request" // structured request failed validation
  | "no-consent" // live mode requires explicit consent to send the photo
  | "no-provider" // no live image provider is configured
  | "timeout" // provider took too long
  | "provider-error" // provider returned an error (details never surfaced)
  | "invalid-output" // provider output failed validation
  | "rate-limited"
  | "unknown";

/** The service result: a discriminated union — never throws to the caller. */
export type VisualizationResult =
  | VisualizationSuccess
  | { ok: false; code: VisualizationErrorCode };
