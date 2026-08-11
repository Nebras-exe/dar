/**
 * Fulfillment status machine (Phase 11A, §16). Deterministic, allowlisted
 * transitions per supplier group. Terminal states (`ready_for_next_stage`,
 * `declined`, `cancelled`) never regress. Invalid jumps — e.g.
 * `awaiting_supplier → ready_for_next_stage` (skipping accept/prepare),
 * `declined → preparing`, `ready_for_next_stage → awaiting_supplier` — are
 * rejected. Pure + exhaustively unit-tested.
 */

import type { FulfillmentStatus } from "./types";

/** Allowed transitions: from → set of permitted next states. */
const TRANSITIONS: Record<FulfillmentStatus, FulfillmentStatus[]> = {
  awaiting_supplier: ["accepted", "declined", "cancelled"],
  accepted: ["preparing", "cancelled"],
  preparing: ["ready_for_next_stage", "cancelled"],
  // Terminal for Phase 11A — the next stage (manufacturing/delivery) is Phase 11B.
  ready_for_next_stage: [],
  declined: [],
  cancelled: [],
};

/** Terminal states must never silently change. */
export function isTerminal(status: FulfillmentStatus): boolean {
  return status === "ready_for_next_stage" || status === "declined" || status === "cancelled";
}

/** Can fulfillment move from `from` to `to`? */
export function canTransition(from: FulfillmentStatus, to: FulfillmentStatus): boolean {
  if (from === to) return false;
  return TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Apply a transition or reject without throwing. Returns the resulting status,
 * or the unchanged status when the transition is invalid (callers must check `ok`).
 */
export function transition(
  from: FulfillmentStatus,
  to: FulfillmentStatus,
): { ok: boolean; status: FulfillmentStatus } {
  if (canTransition(from, to)) return { ok: true, status: to };
  return { ok: false, status: from };
}

/** The supplier actions available from a given status (drives the dashboard buttons). */
export type SupplierAction = "accept" | "decline" | "start_preparing" | "mark_ready";

export function availableSupplierActions(status: FulfillmentStatus): SupplierAction[] {
  switch (status) {
    case "awaiting_supplier":
      return ["accept", "decline"];
    case "accepted":
      return ["start_preparing"];
    case "preparing":
      return ["mark_ready"];
    default:
      return [];
  }
}

/** Map a supplier action to the status it targets (single source of truth). */
export function actionTargetStatus(action: SupplierAction): FulfillmentStatus {
  switch (action) {
    case "accept":
      return "accepted";
    case "decline":
      return "declined";
    case "start_preparing":
      return "preparing";
    case "mark_ready":
      return "ready_for_next_stage";
  }
}

/** True once the supplier has ready-handed-off (Phase 11B may begin). */
export function isReadyForNextStage(status: FulfillmentStatus): boolean {
  return status === "ready_for_next_stage";
}
