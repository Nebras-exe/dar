/**
 * Provider abstraction. Athathi must never be coupled to one model vendor: a
 * provider takes a validated image and returns RAW model output (unknown JSON),
 * which the service then parses/validates/normalizes. Adding a vendor = adding
 * one file implementing this interface.
 */

export interface VisionImageInput {
  /** Raw image bytes. */
  bytes: Uint8Array;
  /** Validated MIME type (image/jpeg | image/png | image/webp). */
  mimeType: string;
}

export interface VisionProvider {
  /** Stable id, e.g. "anthropic" | "openai" | "gemini" | "demo". */
  readonly name: string;
  /** Model identifier for provenance (never a secret). */
  readonly model: string;
  /** True when the required credential/config is present in the environment. */
  isConfigured(): boolean;
  /**
   * Analyse the image and return RAW parsed JSON (unknown shape). Should throw
   * on transport/HTTP/parse errors; the service maps those to safe codes. Must
   * honour the provided AbortSignal for timeouts.
   */
  analyze(input: VisionImageInput, signal: AbortSignal): Promise<unknown>;
}

/** Base64-encode bytes without pulling in Buffer typings at call sites. */
export function toBase64(bytes: Uint8Array): string {
  // Node (route handler runs on the Node runtime) has Buffer available.
  return Buffer.from(bytes).toString("base64");
}

/**
 * Extract the first JSON object from a model text response. Models sometimes
 * wrap JSON in prose or ```json fences despite instructions; we defensively
 * slice the outermost {...}. Returns `undefined` when no JSON object is found.
 */
export function extractJson(text: string): unknown {
  if (!text) return undefined;
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return undefined;
  const slice = text.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch {
    return undefined;
  }
}
