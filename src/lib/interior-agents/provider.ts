/**
 * Designer-agent provider abstraction (SERVER ONLY).
 *
 * A provider PLANS an interior design (returns a raw brief for validation) — it
 * never grounds catalog data, computes totals, or renders images. Claude is used
 * when `ANTHROPIC_API_KEY` is present; otherwise the deterministic Demo provider
 * carries the experience. The key is read only inside `claude-provider.ts` and is
 * never returned, logged, or exposed here.
 *
 * This module lives behind the server boundary; the client-safe barrel (`./index`)
 * does not re-export it.
 */

import type { DesignerPlanResult, InteriorRunInput } from "./types";
import type { RoomAnalysis } from "@/lib/vision";
import { demoDesignerProvider } from "./demo-provider";
import { claudeDesignerProvider } from "./claude-provider";

export interface DesignerProvider {
  /** Stable id — never a secret. */
  readonly name: "claude" | "demo";
  /** Model id for provenance — never a secret. */
  readonly model: string;
  /** True only when the required credential is present in the environment. */
  isConfigured(): boolean;
  /**
   * Produce a RAW design brief (unknown JSON) from the run input + room analysis,
   * validated by the caller before use. Must honour the AbortSignal and never
   * throw the provider's raw error upward.
   */
  plan(input: InteriorRunInput, analysis: RoomAnalysis, signal: AbortSignal): Promise<DesignerPlanResult>;
}

/** The active designer provider: Claude when configured, else null (→ Demo). */
export function resolveDesignerProvider(): DesignerProvider | null {
  return claudeDesignerProvider.isConfigured() ? claudeDesignerProvider : null;
}

/** The demo provider — always available, deterministic, offline. */
export function demoProvider(): DesignerProvider {
  return demoDesignerProvider;
}

/** Reported to the client (enum only, never a credential). */
export function interiorDesignerMode(): "claude" | "demo" {
  return resolveDesignerProvider() ? "claude" : "demo";
}
