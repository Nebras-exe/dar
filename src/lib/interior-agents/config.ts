/**
 * Multi-Agent Interior Engine — central configuration.
 *
 * The ONE place the Claude model name and the run limits live, so orchestration
 * logic never hardcodes them and they can change via env without code edits.
 * Reads only NON-secret env (a model name) — never the API key itself here.
 */

/**
 * The Claude model, configurable via `ANTHROPIC_MODEL` (a name, not a secret).
 * A single safe default lives here and nowhere else. The interior engine reuses
 * the same key env (`ANTHROPIC_API_KEY`) as the existing vision/agent providers.
 */
export function anthropicModel(): string {
  return process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-5";
}

/**
 * Cost / call controls (§21). Bound EVERY run even after Claude is enabled, so a
 * single design never fans out into unbounded model calls or tool loops.
 */
export const INTERIOR_LIMITS = {
  /** Max Claude (designer) calls per run — the planner runs once, plus retries. */
  maxClaudeCalls: 3,
  /** Max validation retries of a malformed plan before falling back to Demo. */
  maxPlanRetries: 1,
  /** Max product needs the planner may request (extra are dropped). */
  maxNeeds: 12,
  /** Max catalog selections in a plan. */
  maxSelections: 12,
  /** Per-provider network timeout (ms) for the planning call. */
  planTimeoutMs: 30_000,
  /** Per-provider network timeout (ms) for the vision call. */
  visionTimeoutMs: 30_000,
} as const;

/** Upload guard for the room image (§13/§20) — mirrors the existing vision route. */
export const IMAGE_LIMITS = {
  maxBytes: 8 * 1024 * 1024, // 8 MB
  allowedMime: ["image/jpeg", "image/png", "image/webp"] as const,
} as const;
