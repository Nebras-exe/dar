/**
 * Manufacturing status machine (Phase 11B, §6). Deterministic, allowlisted
 * transitions. The QC failure/rework loop is explicit:
 *   quality_check → qc_failed → rework → manufacturing_completed → quality_check.
 * `ready_for_delivery` is terminal (Phase 12 begins there). Illegal jumps —
 * `not_started → qc_passed`, `manufacturing → ready_for_delivery`,
 * `qc_failed → ready_for_delivery`, `ready_for_delivery → manufacturing` — are
 * rejected. Pure + exhaustively unit-tested.
 */

import type { ManufacturingStatus } from "./types";

/** Allowed transitions: from → set of permitted next states. */
const TRANSITIONS: Record<ManufacturingStatus, ManufacturingStatus[]> = {
  not_started: ["manufacturing"],
  manufacturing: ["manufacturing_completed"],
  manufacturing_completed: ["quality_check"],
  quality_check: ["qc_passed", "qc_failed"],
  qc_passed: ["ready_for_delivery"],
  qc_failed: ["rework"],
  rework: ["manufacturing_completed"],
  // Terminal for Phase 11B — delivery/installation is Phase 12.
  ready_for_delivery: [],
};

/** Terminal state must never silently change. */
export function isTerminal(status: ManufacturingStatus): boolean {
  return status === "ready_for_delivery";
}

/** Can the job move from `from` to `to`? */
export function canTransition(from: ManufacturingStatus, to: ManufacturingStatus): boolean {
  if (from === to) return false;
  return TRANSITIONS[from]?.includes(to) ?? false;
}

/** Apply a transition or reject without throwing. Returns `ok` + resulting status. */
export function transition(
  from: ManufacturingStatus,
  to: ManufacturingStatus,
): { ok: boolean; status: ManufacturingStatus } {
  if (canTransition(from, to)) return { ok: true, status: to };
  return { ok: false, status: from };
}

/** Supplier actions available from a given status (drives the dashboard buttons). */
export type ManufacturingAction =
  | "start_manufacturing"
  | "complete_manufacturing"
  | "submit_for_qc"
  | "qc_pass"
  | "qc_fail"
  | "start_rework"
  | "complete_rework"
  | "mark_ready_for_delivery";

export function availableActions(status: ManufacturingStatus): ManufacturingAction[] {
  switch (status) {
    case "not_started": return ["start_manufacturing"];
    case "manufacturing": return ["complete_manufacturing"];
    case "manufacturing_completed": return ["submit_for_qc"];
    case "quality_check": return ["qc_pass", "qc_fail"];
    case "qc_passed": return ["mark_ready_for_delivery"];
    case "qc_failed": return ["start_rework"];
    case "rework": return ["complete_rework"];
    default: return [];
  }
}

/** Map a supplier action to the status it targets (single source of truth). */
export function actionTargetStatus(action: ManufacturingAction): ManufacturingStatus {
  switch (action) {
    case "start_manufacturing": return "manufacturing";
    case "complete_manufacturing": return "manufacturing_completed";
    case "submit_for_qc": return "quality_check";
    case "qc_pass": return "qc_passed";
    case "qc_fail": return "qc_failed";
    case "start_rework": return "rework";
    case "complete_rework": return "manufacturing_completed";
    case "mark_ready_for_delivery": return "ready_for_delivery";
  }
}

/** Milestones may be toggled only while actively producing (§12). */
export function canEditMilestones(status: ManufacturingStatus): boolean {
  return status === "manufacturing" || status === "rework";
}

export function isReadyForDelivery(status: ManufacturingStatus): boolean {
  return status === "ready_for_delivery";
}
