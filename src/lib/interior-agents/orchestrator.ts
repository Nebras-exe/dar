/**
 * Multi-Agent Interior Orchestrator (SERVER ONLY).
 *
 * Runs the pipeline: analyse room (Vision) → plan (Designer: Claude or Demo) →
 * ground catalog (deterministic) → validate budget + layout (deterministic) →
 * build render spec. The AI only PLANS; deterministic code owns catalog truth,
 * money, and fit. Every run is bounded (calls/retries/timeouts) and never throws
 * to the caller — failures map to safe codes. When Claude isn't configured, the
 * Demo provider carries the whole run with no network calls.
 */

import { analyzeRoomImage, isVisionConfigured } from "@/lib/vision/service";
import type { VisionImageInput } from "@/lib/vision/providers/types";
import type { RoomAnalysis } from "@/lib/vision";
import { resolveDesignerProvider, demoProvider } from "./provider";
import { validateBrief } from "./validation";
import { groundCatalog } from "./catalog-agent";
import { validateLayout } from "./layout-agent";
import { computeBudget, trimToBudget } from "./budget";
import { buildRenderSpec } from "./render-spec";
import { INTERIOR_LIMITS } from "./config";
import type {
  DesignBrief,
  InteriorDesignRun,
  InteriorRunInput,
  ProviderMeta,
  RunWarning,
} from "./types";

/** A minimal analysis when no image is supplied — honest, demo-sourced, no guesses. */
function minimalAnalysis(input: InteriorRunInput): RoomAnalysis {
  return {
    roomType: input.roomType,
    roomTypeConfidence: 0.4,
    style: { primary: input.primaryStyle, secondary: input.secondaryStyle ?? null, confidence: 0.4 },
    palette: [],
    existingFurniture: [],
    architecturalFeatures: [],
    dimensionsStatus: "unknown",
    source: "demo",
    provider: "none",
    promptVersion: "interior/none",
  };
}

function timeoutSignal(ms: number): { signal: AbortSignal; done: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, done: () => clearTimeout(timer) };
}

export interface RunOptions {
  /** Validated room image (route handler validated MIME/size). Optional. */
  image?: VisionImageInput;
  /** Test-only injection: a designer provider mock (never used in production). */
  designerOverride?: import("./provider").DesignerProvider;
  /** Test-only: force the vision path to demo (no network). */
  visionMode?: "auto" | "demo";
}

/**
 * Execute a full interior-design run. Returns a typed run (never throws). Safe to
 * call with no image (a minimal analysis is used) and with no Claude key (the
 * deterministic Demo provider carries the run).
 */
export async function runInteriorDesign(
  input: InteriorRunInput,
  options: RunOptions = {},
): Promise<InteriorDesignRun> {
  const id = `idr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const startedAt = Date.now();
  const warnings: RunWarning[] = [];
  const provider: ProviderMeta = { designer: "demo", vision: "demo" };

  const fail = (code: InteriorDesignRun["error"]): InteriorDesignRun => ({
    id, status: "failed", provider, roomAnalysis: null, designBrief: null,
    catalogSelections: [], layoutValidation: null, budgetResult: null, renderSpec: null,
    warnings, startedAt, finishedAt: Date.now(), error: code,
  });

  // ── 1. Room vision ────────────────────────────────────────────────────────
  let analysis: RoomAnalysis;
  if (options.image) {
    const mode = options.visionMode ?? (isVisionConfigured() ? "auto" : "demo");
    let res = await analyzeRoomImage(options.image, { mode });
    if (!res.ok && mode !== "demo") res = await analyzeRoomImage(options.image, { mode: "demo" });
    if (res.ok) {
      analysis = res.analysis;
      provider.vision = res.analysis.source === "provider" ? "provider" : "demo";
    } else {
      analysis = minimalAnalysis(input);
      provider.vision = "demo";
    }
  } else {
    analysis = minimalAnalysis(input);
    provider.vision = "demo";
  }

  // ── 2. Designer plan (Claude when configured, else Demo) ──────────────────
  const claude = options.designerOverride ?? resolveDesignerProvider();
  let brief: DesignBrief | null = null;
  let designerModel: string | undefined;

  if (claude) {
    let calls = 0;
    for (let attempt = 0; attempt <= INTERIOR_LIMITS.maxPlanRetries; attempt++) {
      if (calls >= INTERIOR_LIMITS.maxClaudeCalls) break;
      calls++;
      const { signal, done } = timeoutSignal(INTERIOR_LIMITS.planTimeoutMs);
      let planRes;
      try {
        planRes = await claude.plan(input, analysis, signal);
      } finally {
        done();
      }
      if (planRes.ok) {
        const v = validateBrief(planRes.raw);
        if (v.ok && v.brief) {
          brief = v.brief;
          designerModel = planRes.model;
          provider.designer = "claude";
          provider.model = planRes.model;
          break;
        }
      }
      // else: retry within the strict limit
    }
    if (!brief) provider.reason = "claude_failed";
  } else {
    provider.reason = "anthropic_key_missing";
  }

  // Deterministic fallback — always yields a valid brief.
  if (!brief) {
    const demo = demoProvider();
    const demoRes = await demo.plan(input, analysis, new AbortController().signal);
    const v = demoRes.ok ? validateBrief(demoRes.raw) : { ok: false as const };
    if (!v.ok || !v.brief) return fail("invalid-plan");
    brief = v.brief;
    provider.designer = "demo";
    designerModel = demo.model;
  }

  // ── 3. Catalog grounding (deterministic, authoritative) ───────────────────
  const { selections, unmatched } = groundCatalog(brief.needs);
  for (const c of unmatched) warnings.push({ code: "no_catalog_match", context: c });
  if (selections.length === 0) return fail("no-catalog-matches");
  if (unmatched.length > 0) warnings.push({ code: "partial_plan" });

  // ── 4. Budget (deterministic; trim to fit, then compute authoritative totals) ─
  const kept = trimToBudget(input.budget, selections);
  const budgetResult = computeBudget(input.budget, kept);
  if (!budgetResult.withinBudget) warnings.push({ code: "budget_exceeded" });

  // ── 5. Layout / fit (deterministic; never claims fit without measurements) ──
  const layoutValidation = validateLayout(kept, input.knownWidthCm);
  if (layoutValidation.overall === "NEEDS_MEASUREMENT") warnings.push({ code: "dimensions_unknown" });
  if (layoutValidation.overall === "DOES_NOT_FIT") warnings.push({ code: "does_not_fit" });

  // ── 6. Render spec (structured hand-off for a future image provider) ──────
  const renderSpec = buildRenderSpec(
    `room:${id}`,
    analysis,
    brief,
    kept,
    input.primaryStyle,
    input.secondaryStyle,
  );

  return {
    id,
    status: "complete",
    provider: { ...provider, model: designerModel },
    roomAnalysis: analysis,
    designBrief: brief,
    catalogSelections: kept,
    layoutValidation,
    budgetResult,
    renderSpec,
    warnings,
    startedAt,
    finishedAt: Date.now(),
  };
}
