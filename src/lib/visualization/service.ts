/**
 * The visualization service. Orchestrates: pick mode/provider → (real) call with
 * a timeout → normalize into a discriminated `VisualizationResult`. It NEVER
 * throws to the caller, never surfaces raw provider errors, and never logs
 * secrets or image bytes. This is the single seam the route handler uses and the
 * shape a future `generate_visualization` agent tool exposes.
 *
 * SERVER BOUNDARY (structural): this module + everything under `providers/` +
 * `prompt.ts` read `process.env`/build prompts and are imported ONLY by the API
 * route. The client-safe barrel (`./index`) never re-exports them, so no secret
 * or system prompt can enter a client bundle. (`server-only` is not a dependency
 * of this project; the boundary is enforced by import discipline.)
 */

import { VISUALIZATION_PROMPT_VERSION } from "./prompt";
import type {
  VisualizationErrorCode,
  VisualizationRequest,
  VisualizationResult,
} from "./types";
import type {
  VisualizationImageInput,
  VisualizationProvider,
} from "./providers/types";
import { demoVisualizationProvider } from "./providers/demo";

const TIMEOUT_MS = 30_000;

/**
 * Real image-generation providers in resolution order. Intentionally EMPTY:
 * this environment has no verified image-generation credential + supported model
 * to legitimately support, so — per §6 — Athathi does not pretend one exists. It
 * runs the deterministic demo composition instead. Adding a verified vendor is
 * one file implementing `VisualizationProvider` registered here; nothing else in
 * the app changes.
 */
const REAL_PROVIDERS: Record<string, VisualizationProvider> = {};

/** The active real provider, or null when none is configured. */
export function resolveProvider(): VisualizationProvider | null {
  const explicit = process.env.ATHATHI_VISUALIZATION_PROVIDER?.toLowerCase().trim();
  if (explicit && REAL_PROVIDERS[explicit]) {
    return REAL_PROVIDERS[explicit].isConfigured() ? REAL_PROVIDERS[explicit] : null;
  }
  for (const provider of Object.values(REAL_PROVIDERS)) {
    if (provider.isConfigured()) return provider;
  }
  return null;
}

/** True when a real image provider is configured (none in this environment). */
export function isVisualizationConfigured(): boolean {
  return resolveProvider() !== null;
}

/** Reported to the client via GET — booleans/enum only, never a credential. */
export function visualizationMode(): "live" | "demo" {
  return isVisualizationConfigured() ? "live" : "demo";
}

/** Structured, secret-free diagnostics. */
function log(event: Record<string, unknown>) {
  try {
    console.info("[visualization]", JSON.stringify({ ts: Date.now(), ...event }));
  } catch {
    /* logging must never break the request */
  }
}

export interface GenerateOptions {
  /** "demo" forces the deterministic composition; "auto" prefers a real provider. */
  mode?: "demo" | "auto";
  /** Room image (required for a REAL provider; ignored by demo). */
  image?: VisualizationImageInput | null;
  /** Explicit consent to send the photo to a real provider (required for live). */
  consent?: boolean;
  /** Inject a provider for tests (exercises timeout/error/success without network). */
  providerOverride?: VisualizationProvider;
}

function classifyError(err: unknown): VisualizationErrorCode {
  if (err instanceof Error) {
    if (err.name === "AbortError") return "timeout";
    if (/http 429/.test(err.message)) return "rate-limited";
    if (/http \d/.test(err.message)) return "provider-error";
  }
  return "unknown";
}

/**
 * Produce a visualization for a validated request. The route handler validates
 * the request (catalog truth) + the image (MIME/size/magic bytes) before calling.
 */
export async function generateVisualization(
  request: VisualizationRequest,
  options: GenerateOptions = {},
): Promise<VisualizationResult> {
  const started = Date.now();
  const useDemo = options.mode === "demo" && !options.providerOverride;

  const provider =
    options.providerOverride ?? (useDemo ? null : resolveProvider());

  // Demo path: deterministic composition, no image, no network, no secrets.
  if (!provider) {
    const output = await demoVisualizationProvider.generate(request, null, new AbortController().signal);
    log({ event: "demo", fingerprint: request.designFingerprint, items: request.items.length });
    return {
      ok: true,
      status: "ready",
      mode: "demo",
      preview: output,
      provider: demoVisualizationProvider.name,
      promptVersion: VISUALIZATION_PROMPT_VERSION,
      designFingerprint: request.designFingerprint,
      usedItems: request.items,
      createdAt: Date.now(),
    };
  }

  // Live path: a real provider needs the room image + explicit consent.
  if (!options.image || options.image.bytes.length === 0) {
    return { ok: false, code: "no-image" };
  }
  if (!options.consent) {
    return { ok: false, code: "no-consent" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  log({ event: "start", provider: provider.name, model: provider.model });

  try {
    const output = await provider.generate(request, options.image, controller.signal);
    if (output.kind === "generated" && !output.imageDataUrl) {
      log({ event: "invalid-output", provider: provider.name });
      return { ok: false, code: "invalid-output" };
    }
    log({
      event: "success",
      provider: provider.name,
      durationMs: Date.now() - started,
      items: request.items.length,
    });
    return {
      ok: true,
      status: "ready",
      mode: "live",
      preview: output,
      provider: provider.name,
      promptVersion: VISUALIZATION_PROMPT_VERSION,
      designFingerprint: request.designFingerprint,
      usedItems: request.items,
      createdAt: Date.now(),
    };
  } catch (err) {
    const code = classifyError(err);
    log({ event: "error", provider: provider.name, code, durationMs: Date.now() - started });
    return { ok: false, code };
  } finally {
    clearTimeout(timer);
  }
}
