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
import { externalImageProvider } from "./providers/external";
import { buildCatalogReferences } from "./references";
import { critique } from "./critic";

const TIMEOUT_MS = 30_000;

/**
 * Real image-generation providers in resolution order. The vendor-agnostic
 * `external` provider is registered but stays INERT until the operator sets
 * `IMAGE_PROVIDER` + `IMAGE_API_KEY` (+ endpoint) — with no key `isConfigured()`
 * is false, so the deterministic demo composition runs and NO paid call happens.
 * Adding another verified vendor is one more file implementing
 * `VisualizationProvider` registered here; nothing else in the app changes.
 */
const REAL_PROVIDERS: Record<string, VisualizationProvider> = {
  [externalImageProvider.name]: externalImageProvider,
  external: externalImageProvider,
};

/** Bounded render attempts (§11/§18): clamp IMAGE_MAX_ATTEMPTS to [1, 3], default 2. */
function renderAttempts(): number {
  const raw = Number(process.env.IMAGE_MAX_ATTEMPTS);
  if (!Number.isFinite(raw)) return 2;
  return Math.max(1, Math.min(3, Math.trunc(raw)));
}

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
  /** Override the bounded retry count (tests); defaults to IMAGE_MAX_ATTEMPTS/[1,3]. */
  maxAttempts?: number;
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

  // Server-resolved catalog allow-list (catalog truth) drives references + critic.
  const references = buildCatalogReferences(request);
  const maxAttempts = options.maxAttempts ?? renderAttempts();

  let lastError: VisualizationErrorCode | null = null;
  let approved: { output: import("./providers/types").ProviderOutput; critic: ReturnType<typeof critique> } | null = null;
  let lastAny: { output: import("./providers/types").ProviderOutput; critic: ReturnType<typeof critique> } | null = null;
  let attempts = 0;

  // Bounded retry (§11/§18): re-render only when the critic REJECTS a produced
  // image. No infinite loop; each attempt has its own timeout.
  for (let i = 0; i < maxAttempts; i++) {
    attempts = i + 1;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    log({ event: "start", provider: provider.name, model: provider.model, attempt: attempts });
    try {
      const output = await provider.generate(request, options.image, controller.signal);
      if (output.kind === "generated" && !output.imageDataUrl) {
        lastError = "invalid-output";
        continue;
      }
      const critic = critique(request, references, output, request.items);
      lastAny = { output, critic };
      if (critic.verdict === "APPROVED") {
        approved = { output, critic };
        break;
      }
      log({ event: "critic-rejected", provider: provider.name, attempt: attempts, issues: critic.issues });
    } catch (err) {
      lastError = classifyError(err);
      log({ event: "error", provider: provider.name, code: lastError, attempt: attempts });
    } finally {
      clearTimeout(timer);
    }
  }

  // Prefer an APPROVED render; otherwise fall back to the last produced render
  // (marked REJECTED so the UI never presents it as approved). If nothing was
  // ever produced, surface the classified error and let the caller show the plan.
  const chosen = approved ?? lastAny;
  if (!chosen) {
    return { ok: false, code: lastError ?? "provider-error" };
  }
  log({
    event: chosen.critic.verdict === "APPROVED" ? "success" : "unapproved",
    provider: provider.name,
    durationMs: Date.now() - started,
    fidelity: chosen.critic.fidelity,
    attempts,
  });
  return {
    ok: true,
    status: "ready",
    mode: "live",
    preview: chosen.output,
    provider: provider.name,
    promptVersion: VISUALIZATION_PROMPT_VERSION,
    designFingerprint: request.designFingerprint,
    usedItems: request.items,
    critic: chosen.critic,
    attempts,
    createdAt: Date.now(),
  };
}
