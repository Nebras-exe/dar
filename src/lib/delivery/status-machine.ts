/**
 * Delivery + installation status machines (Phase 12, §7). Deterministic,
 * allowlisted transitions.
 *
 * Delivery:
 *   awaiting_schedule → scheduled → assigned → out_for_delivery → delivered → completed
 *   out_for_delivery → delivery_failed → reschedule_required → scheduled  (retry loop)
 *   most states → cancelled
 * `completed` is terminal. Illegal jumps (`awaiting_schedule → delivered`,
 * `scheduled → completed`, `delivery_failed → delivered`,
 * `cancelled → out_for_delivery`) are rejected.
 *
 * `delivered → completed` is only legal once any REQUIRED installation is done —
 * that extra gate lives in the domain (completion rule §25), not here.
 */

import type { DeliveryStatus, InstallationStatus } from "./types";

const DELIVERY_TRANSITIONS: Record<DeliveryStatus, DeliveryStatus[]> = {
  awaiting_schedule: ["scheduled", "cancelled"],
  scheduled: ["assigned", "reschedule_required", "cancelled"],
  assigned: ["out_for_delivery", "reschedule_required", "cancelled"],
  out_for_delivery: ["delivered", "delivery_failed"],
  delivery_failed: ["reschedule_required", "cancelled"],
  reschedule_required: ["scheduled", "cancelled"],
  delivered: ["completed"], // gated further by the completion rule (installation)
  // Terminal states.
  completed: [],
  cancelled: [],
};

export function isTerminalDelivery(status: DeliveryStatus): boolean {
  return status === "completed" || status === "cancelled";
}

export function canTransitionDelivery(from: DeliveryStatus, to: DeliveryStatus): boolean {
  if (from === to) return false;
  return DELIVERY_TRANSITIONS[from]?.includes(to) ?? false;
}

export function transitionDelivery(from: DeliveryStatus, to: DeliveryStatus): { ok: boolean; status: DeliveryStatus } {
  if (canTransitionDelivery(from, to)) return { ok: true, status: to };
  return { ok: false, status: from };
}

// ── Installation machine (§21) ────────────────────────────────────────────────

const INSTALLATION_TRANSITIONS: Record<InstallationStatus, InstallationStatus[]> = {
  not_required: [],
  awaiting_schedule: ["scheduled"],
  scheduled: ["in_progress"],
  in_progress: ["completed", "issue"],
  issue: ["in_progress", "scheduled"],
  completed: [],
};

export function canTransitionInstallation(from: InstallationStatus, to: InstallationStatus): boolean {
  if (from === to) return false;
  return INSTALLATION_TRANSITIONS[from]?.includes(to) ?? false;
}

// ── Supplier actions available from the current state (drives the dashboard) ──

export type DeliveryAction =
  | "schedule"
  | "assign"
  | "mark_out_for_delivery"
  | "mark_delivered"
  | "mark_failed"
  | "reschedule"
  | "schedule_installation"
  | "start_installation"
  | "complete_installation"
  | "confirm_handover"
  | "complete";

export function availableDeliveryActions(
  status: DeliveryStatus,
  installationStatus: InstallationStatus,
): DeliveryAction[] {
  switch (status) {
    case "awaiting_schedule":
      return ["schedule"];
    case "scheduled":
      return ["assign", "reschedule"];
    case "assigned":
      return ["mark_out_for_delivery", "reschedule"];
    case "out_for_delivery":
      return ["mark_delivered", "mark_failed"];
    case "delivery_failed":
      return ["reschedule"];
    case "reschedule_required":
      return ["schedule"];
    case "delivered": {
      // Installation gate before completion (§25).
      if (installationStatus === "not_required" || installationStatus === "completed") return ["complete"];
      if (installationStatus === "awaiting_schedule") return ["schedule_installation"];
      if (installationStatus === "scheduled") return ["start_installation"];
      if (installationStatus === "in_progress") return ["complete_installation"];
      if (installationStatus === "issue") return ["start_installation", "schedule_installation"];
      return [];
    }
    default:
      return [];
  }
}

export function isCompleted(status: DeliveryStatus): boolean {
  return status === "completed";
}
