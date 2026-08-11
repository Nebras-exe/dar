/**
 * Visualization provider abstraction (Phase 07). Athathi must never be coupled
 * to one image-generation vendor: a provider takes the validated structured
 * request (and, for real providers, the room image bytes) and returns a
 * `ProviderOutput`, which the service normalizes into a `VisualizationResult`.
 *
 * Adding a real vendor = adding one file implementing this interface. Providers
 * are server-only (they may read `process.env` credentials) and are imported
 * ONLY by the service, which is imported ONLY by the API route.
 */

import type { DemoScheme, VisualizationRequest } from "../types";

/** Room image bytes for a real provider (never required by the demo provider). */
export interface VisualizationImageInput {
  bytes: Uint8Array;
  mimeType: string;
}

/** What a provider returns to the service. */
export type ProviderOutput =
  | { kind: "generated"; imageDataUrl: string }
  | { kind: "demo-composition"; scheme: DemoScheme };

export interface VisualizationProvider {
  /** Stable id, e.g. "demo" | "anthropic" | "openai" (never a secret). */
  readonly name: string;
  /** Model identifier for provenance (never a secret). */
  readonly model: string;
  /** True when the required credential/config is present in the environment. */
  isConfigured(): boolean;
  /**
   * Produce the preview. Real providers call a vendor REST API via server-side
   * `fetch`, honour the AbortSignal, and should throw on transport/HTTP/parse
   * errors (the service maps those to safe codes). The demo provider ignores the
   * image entirely and builds a deterministic composition scheme.
   */
  generate(
    request: VisualizationRequest,
    image: VisualizationImageInput | null,
    signal: AbortSignal,
  ): Promise<ProviderOutput>;
}
