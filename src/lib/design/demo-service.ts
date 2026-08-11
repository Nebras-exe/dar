/**
 * The Demo Mode service boundary.
 *
 * The UI calls `generateDemoDesign(input)` and never touches the engine
 * directly. A future Phase 05 agent will add `generateAgentDesign(input)` with
 * the SAME `DesignRecommendation` return shape — so swapping Demo Mode for real
 * AI orchestration is a service change, not a UI rewrite. This is deliberately
 * the one seam between "how the design was produced" and "how it is shown".
 */

import { buildDesignRecommendation } from "./recommend";
import type { DesignInput, DesignRecommendation } from "./types";

/** Produce a deterministic, catalog-backed design from structured input. */
export function generateDemoDesign(input: DesignInput): DesignRecommendation {
  return buildDesignRecommendation(input);
}

// Future (Phase 05): a real agent orchestrator returning the same shape.
// export async function generateAgentDesign(input: DesignInput): Promise<DesignRecommendation> { ... }
