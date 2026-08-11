/**
 * The vision service. Orchestrates: pick provider → call with a timeout →
 * validate/normalize output → return a discriminated `VisionResult`. It NEVER
 * throws to the caller, never surfaces raw provider errors, and never logs
 * secrets or image bytes. This is the single seam the route handler uses, and
 * the shape a future `analyze_room_image` agent tool will expose.
 *
 * SERVER BOUNDARY (structural): this module and everything under `providers/`
 * read `process.env` secrets and are imported ONLY by the API route handler.
 * The client-safe barrel (`./index`) deliberately does not re-export them, so
 * they can never enter a client bundle. (`server-only` is not a dependency of
 * this project; the boundary is enforced by import discipline + env access.)
 */

import { parseRoomAnalysis } from "./schema";
import type { VisionErrorCode, VisionResult } from "./types";
import type { VisionImageInput, VisionProvider } from "./providers/types";
import { anthropicProvider } from "./providers/anthropic";
import { openaiProvider } from "./providers/openai";
import { geminiProvider } from "./providers/gemini";
import { demoProvider } from "./providers/demo";

const TIMEOUT_MS = 25_000;

/** Real providers in resolution order. */
const REAL_PROVIDERS: Record<string, VisionProvider> = {
  anthropic: anthropicProvider,
  openai: openaiProvider,
  gemini: geminiProvider,
};

/**
 * The active real provider, or null when none is configured. Honours an
 * explicit `ATHATHI_VISION_PROVIDER` selection; otherwise picks the first
 * configured provider.
 */
export function resolveProvider(): VisionProvider | null {
  const explicit = process.env.ATHATHI_VISION_PROVIDER?.toLowerCase().trim();
  if (explicit && REAL_PROVIDERS[explicit]) {
    return REAL_PROVIDERS[explicit].isConfigured() ? REAL_PROVIDERS[explicit] : null;
  }
  for (const provider of Object.values(REAL_PROVIDERS)) {
    if (provider.isConfigured()) return provider;
  }
  return null;
}

/** True when at least one real Vision provider is configured. */
export function isVisionConfigured(): boolean {
  return resolveProvider() !== null;
}

/** Structured, secret-free diagnostics. */
function log(event: Record<string, unknown>) {
  try {
    console.info("[vision]", JSON.stringify({ ts: Date.now(), ...event }));
  } catch {
    /* logging must never break the request */
  }
}

export interface AnalyzeOptions {
  /** "demo" forces the labelled sample provider; otherwise the real provider. */
  mode?: "demo" | "auto";
  /**
   * Inject a provider (used by tests to exercise timeout/malformed/success
   * paths without any network call). Ignored in normal operation.
   */
  providerOverride?: VisionProvider;
}

/**
 * Analyse a validated image. The caller (route handler) is responsible for MIME
 * / size validation before calling this.
 */
export async function analyzeRoomImage(
  input: VisionImageInput,
  options: AnalyzeOptions = {},
): Promise<VisionResult> {
  const started = Date.now();
  const useDemo = options.mode === "demo";
  const provider =
    options.providerOverride ?? (useDemo ? demoProvider : resolveProvider());

  if (!provider) {
    log({ event: "no-provider" });
    return { ok: false, code: "no-provider", durationMs: Date.now() - started };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  log({ event: "start", provider: provider.name, model: provider.model });

  try {
    const raw = await provider.analyze(input, controller.signal);
    const parsed = parseRoomAnalysis(raw, {
      source: useDemo ? "demo" : "provider",
      provider: provider.name,
      model: provider.model,
    });
    const durationMs = Date.now() - started;

    if (!parsed.ok || !parsed.analysis) {
      log({ event: "invalid-output", provider: provider.name, durationMs });
      return { ok: false, code: "invalid-output", durationMs };
    }

    log({
      event: "success",
      provider: provider.name,
      durationMs,
      roomType: parsed.analysis.roomType,
      furnitureCount: parsed.analysis.existingFurniture.length,
    });
    return { ok: true, analysis: parsed.analysis, durationMs };
  } catch (err) {
    const durationMs = Date.now() - started;
    const code = classifyError(err);
    // Log only the classified code + name — never the raw message/body/secret.
    log({ event: "error", provider: provider.name, code, durationMs });
    return { ok: false, code, durationMs };
  } finally {
    clearTimeout(timer);
  }
}

function classifyError(err: unknown): VisionErrorCode {
  if (err instanceof Error) {
    if (err.name === "AbortError") return "timeout";
    if (/http 429/.test(err.message)) return "rate-limited";
    if (/http \d/.test(err.message)) return "provider-error";
  }
  return "unknown";
}
