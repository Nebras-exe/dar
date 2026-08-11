/**
 * Delivery + installation orchestration (Phase 12). Pure + deterministic so it
 * runs identically in the demo store and (later) a server route handler.
 *
 * Invariants enforced here:
 *  1. ELIGIBILITY (§5): a delivery is created only when the group is genuinely
 *     ready — a CUSTOM group when manufacturing is `ready_for_delivery`, a
 *     ready-stock CATALOG group when fulfillment is `ready_for_next_stage`.
 *  2. ADDRESS SNAPSHOT (§10): the delivery captures the order's address at
 *     creation and never follows later account-address edits.
 *  3. GATED TRANSITIONS (§7): every status change goes through the machines.
 *  4. COMPLETION RULE (§25): `delivered → completed` requires that any REQUIRED
 *     installation is `completed` (+ handover).
 *  5. APPEND-ONLY HISTORY (§8/§19): every change appends an event; failed
 *     delivery attempts are preserved across reschedules.
 */

import type { Order, SupplierOrderGroup, DeliveryAddress } from "@/lib/orders";
import type { FulfillmentStatus } from "@/lib/fulfillment";
import type { ManufacturingStatus } from "@/lib/manufacturing";
import { canTransitionDelivery, canTransitionInstallation } from "./status-machine";
import { isValidSlot } from "./slots";
import type {
  Delivery,
  DeliveryActor,
  DeliveryAddressSnapshot,
  DeliveryAssignment,
  DeliveryEvent,
  DeliveryEventType,
  DeliveryFailureReason,
  DeliveryStatus,
  DeliveryTracking,
  DeliveryWindow,
  InstallationIssue,
  InstallationIssueCategory,
  InstallationStatus,
  TrackingStage,
  TrackingStep,
  TrackingStepState,
} from "./types";

// ── Eligibility (§5) ──────────────────────────────────────────────────────────

/** Does this group contain a custom (manufactured) item? */
export function groupIsCustom(group: Pick<SupplierOrderGroup, "items">): boolean {
  return group.items.some((i) => i.kind === "custom");
}

/** Installation is required iff the accepted quote charged an installation fee (§20). */
export function installationRequiredFor(group: Pick<SupplierOrderGroup, "installationFee">): boolean {
  return group.installationFee > 0;
}

/**
 * A group may enter delivery when it is actually ready (§5):
 *  - custom: its manufacturing status is `ready_for_delivery`;
 *  - catalog: its fulfillment status is `ready_for_next_stage`.
 * `manufacturingStatus` is ignored for catalog groups (they never manufacture).
 */
export function canCreateDelivery(
  isCustom: boolean,
  fulfillmentStatus: FulfillmentStatus | null,
  manufacturingStatus: ManufacturingStatus | null,
): boolean {
  if (isCustom) return manufacturingStatus === "ready_for_delivery";
  return fulfillmentStatus === "ready_for_next_stage";
}

function tag(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36).slice(0, 6);
}

function makeEvent(
  deliveryId: string, type: DeliveryEventType, actor: DeliveryActor, at: number, seed: number, note?: string,
): DeliveryEvent {
  return {
    id: `de_${at.toString(36)}_${(seed >>> 0).toString(36).slice(0, 6)}`,
    deliveryId, type, actor, at, ...(note ? { note } : {}),
  };
}

/** Freeze the order's delivery address into an immutable snapshot (§10). */
export function snapshotAddress(address: DeliveryAddress): DeliveryAddressSnapshot {
  return {
    fullName: address.fullName, phone: address.phone, governorate: address.governorate,
    wilayat: address.wilayat, area: address.area, building: address.building,
    ...(address.notes ? { notes: address.notes } : {}),
  };
}

/**
 * Build a fresh delivery for a ready supplier group. Status starts at
 * `awaiting_schedule`; installation is `not_required` unless the quote charged
 * for it. The caller must have verified eligibility.
 */
export function buildDelivery(
  order: Pick<Order, "id" | "orderNumber" | "customerId" | "source" | "isDemo" | "address">,
  group: Pick<SupplierOrderGroup, "supplierId" | "supplierName" | "installationFee">,
  now: number,
  seed: number,
): Delivery {
  const id = `del_${now.toString(36)}_${(seed >>> 0).toString(36).slice(0, 6)}_${tag(group.supplierId)}`;
  const installationRequired = installationRequiredFor(group);
  return {
    id,
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerId: order.customerId,
    supplierId: group.supplierId,
    supplierName: group.supplierName,
    orderSource: order.source,
    status: "awaiting_schedule",
    address: snapshotAddress(order.address),
    installationRequired,
    attempts: [],
    installation: { status: installationRequired ? "not_required" : "not_required", issues: [] },
    events: [makeEvent(id, "delivery_ready", { role: "system" }, now, seed)],
    isDemo: order.isDemo,
    createdAt: now,
    updatedAt: now,
  };
}

// ── Delivery transitions ──────────────────────────────────────────────────────

const EVENT_FOR: Partial<Record<DeliveryStatus, DeliveryEventType>> = {
  scheduled: "delivery_scheduled",
  assigned: "assigned",
  out_for_delivery: "out_for_delivery",
  delivered: "delivered",
  delivery_failed: "delivery_attempt_failed",
  reschedule_required: "rescheduled",
  completed: "completed",
  cancelled: "cancelled",
};

export interface DeliveryResult {
  ok: boolean;
  changed: boolean;
  delivery: Delivery;
  error?: "invalid-transition" | "invalid-slot" | "reason-required" | "installation-required" | "not-delivered";
}

function transition(
  delivery: Delivery, to: DeliveryStatus, actor: DeliveryActor, now: number, seed: number, note?: string, patch?: Partial<Delivery>,
): DeliveryResult {
  if (delivery.status === to) return { ok: true, changed: false, delivery };
  if (!canTransitionDelivery(delivery.status, to)) return { ok: false, changed: false, delivery, error: "invalid-transition" };
  const event = makeEvent(delivery.id, EVENT_FOR[to] ?? "delivery_ready", actor, now, seed, note);
  return {
    ok: true, changed: true,
    delivery: { ...delivery, ...patch, status: to, events: [...delivery.events, event], updatedAt: now },
  };
}

function seedFor(now: number): number {
  return (now ^ 0x5bd1e995) >>> 0;
}

/** Customer selects a delivery window → schedule. Validates the slot (§11/§12). */
export function scheduleDelivery(delivery: Delivery, window: DeliveryWindow, actor: DeliveryActor, now: number, seed?: number): DeliveryResult {
  if (!isValidSlot(window, now)) return { ok: false, changed: false, delivery, error: "invalid-slot" };
  const s = seed ?? seedFor(now);
  // slot_selected is recorded alongside the schedule transition.
  const withSlot: Delivery = {
    ...delivery,
    events: [...delivery.events, makeEvent(delivery.id, "slot_selected", actor, now, s, window.period)],
  };
  return transition(withSlot, "scheduled", actor, now + 1, s ^ 0x1234, window.period, { window, scheduledAt: now });
}

/** Assign a clearly-labelled DEMO delivery team (§15). */
export function assignDelivery(delivery: Delivery, assignment: DeliveryAssignment, actor: DeliveryActor, now: number, seed?: number): DeliveryResult {
  return transition(delivery, "assigned", actor, now, seed ?? seedFor(now), assignment.assigneeName, { assignment });
}

export function markOutForDelivery(delivery: Delivery, actor: DeliveryActor, now: number, seed?: number): DeliveryResult {
  return transition(delivery, "out_for_delivery", actor, now, seed ?? seedFor(now), undefined, { outForDeliveryAt: now });
}

/** Mark delivered — records deliveredAt + a successful attempt. Does NOT complete (§18). */
export function markDelivered(delivery: Delivery, actor: DeliveryActor, now: number, seed?: number): DeliveryResult {
  const s = seed ?? seedFor(now);
  const attempts = [...delivery.attempts, { id: `da_${now.toString(36)}`, at: now, outcome: "delivered" as const }];
  // If installation is required, open its scheduling; else leave not_required.
  const installation = delivery.installationRequired
    ? { ...delivery.installation, status: "awaiting_schedule" as InstallationStatus }
    : delivery.installation;
  return transition(delivery, "delivered", actor, now, s, undefined, { deliveredAt: now, attempts, installation });
}

/** Mark a failed attempt with a practical reason (§19). Preserves attempt history. */
export function markDeliveryFailed(delivery: Delivery, reason: DeliveryFailureReason, actor: DeliveryActor, now: number, seed?: number): DeliveryResult {
  if (!reason) return { ok: false, changed: false, delivery, error: "reason-required" };
  const s = seed ?? seedFor(now);
  const attempts = [...delivery.attempts, { id: `da_${now.toString(36)}`, at: now, outcome: "failed" as const, reason }];
  return transition(delivery, "delivery_failed", actor, now, s, reason, { attempts });
}

/** Move a failed delivery into reschedule_required (§19). */
export function requestReschedule(delivery: Delivery, actor: DeliveryActor, now: number, seed?: number): DeliveryResult {
  return transition(delivery, "reschedule_required", actor, now, seed ?? seedFor(now));
}

export function cancelDelivery(delivery: Delivery, actor: DeliveryActor, now: number, seed?: number): DeliveryResult {
  return transition(delivery, "cancelled", actor, now, seed ?? seedFor(now));
}

// ── Installation (§20–§23) ────────────────────────────────────────────────────

function setInstallation(
  delivery: Delivery, to: InstallationStatus, eventType: DeliveryEventType, actor: DeliveryActor, now: number, seed: number, patch?: Partial<Delivery["installation"]>, note?: string,
): DeliveryResult {
  if (delivery.status !== "delivered") return { ok: false, changed: false, delivery, error: "invalid-transition" };
  if (!canTransitionInstallation(delivery.installation.status, to)) return { ok: false, changed: false, delivery, error: "invalid-transition" };
  const event = makeEvent(delivery.id, eventType, actor, now, seed, note);
  return {
    ok: true, changed: true,
    delivery: {
      ...delivery,
      installation: { ...delivery.installation, ...patch, status: to },
      events: [...delivery.events, event],
      updatedAt: now,
    },
  };
}

export function scheduleInstallation(delivery: Delivery, window: DeliveryWindow, actor: DeliveryActor, now: number, seed?: number): DeliveryResult {
  if (!isValidSlot(window, now)) return { ok: false, changed: false, delivery, error: "invalid-slot" };
  return setInstallation(delivery, "scheduled", "installation_scheduled", actor, now, seed ?? seedFor(now), { window, scheduledAt: now }, window.period);
}

export function startInstallation(delivery: Delivery, actor: DeliveryActor, now: number, seed?: number): DeliveryResult {
  return setInstallation(delivery, "in_progress", "installation_started", actor, now, seed ?? seedFor(now), { startedAt: now });
}

export function completeInstallation(delivery: Delivery, actor: DeliveryActor, now: number, seed?: number): DeliveryResult {
  return setInstallation(delivery, "completed", "installation_completed", actor, now, seed ?? seedFor(now), { completedAt: now });
}

export function recordInstallationIssue(
  delivery: Delivery, category: InstallationIssueCategory, description: string, actor: DeliveryActor, now: number, seed?: number,
): DeliveryResult {
  const issue: InstallationIssue = { id: `ii_${now.toString(36)}`, category, description, at: now };
  const issues = [...delivery.installation.issues, issue];
  return setInstallation(delivery, "issue", "installation_issue", actor, now, seed ?? seedFor(now), { issues }, category);
}

// ── Handover + completion (§24/§25) ───────────────────────────────────────────

/** The completion rule (§25): delivered + (no install required OR install completed). */
export function canComplete(delivery: Pick<Delivery, "status" | "installationRequired" | "installation">): boolean {
  if (delivery.status !== "delivered") return false;
  if (!delivery.installationRequired) return true;
  return delivery.installation.status === "completed";
}

/**
 * Confirm handover + complete the group. Requires the completion rule to hold.
 * Records a customer-safe handover (§24) — no signature/biometrics.
 */
export function confirmHandover(delivery: Delivery, actor: DeliveryActor, now: number, seed?: number): DeliveryResult {
  if (!canComplete(delivery)) {
    return { ok: false, changed: false, delivery, error: delivery.status !== "delivered" ? "not-delivered" : "installation-required" };
  }
  const s = seed ?? seedFor(now);
  const withHandover: Delivery = {
    ...delivery,
    handover: { at: now, by: actor },
    events: [...delivery.events, makeEvent(delivery.id, "handover_confirmed", actor, now, s)],
  };
  return transition(withHandover, "completed", actor, now + 1, s ^ 0x99, undefined, { completedAt: now });
}

// ── Customer tracking (§26/§27) — customer-safe; never raw failure codes ──────

const TRACK_STAGES: readonly TrackingStage[] = [
  "preparing", "scheduled", "out_for_delivery", "delivered", "installation", "completed",
];

function stageTimes(d: Delivery): Partial<Record<TrackingStage, number>> {
  const at: Partial<Record<TrackingStage, number>> = { preparing: d.createdAt };
  for (const e of d.events) {
    if (e.type === "delivery_scheduled") at.scheduled = e.at;
    else if (e.type === "out_for_delivery") at.out_for_delivery = e.at;
    else if (e.type === "delivered") at.delivered = e.at;
    else if (e.type === "installation_completed") at.installation = e.at;
    else if (e.type === "completed") at.completed = e.at;
  }
  return at;
}

function trackRank(status: DeliveryStatus): number {
  switch (status) {
    case "awaiting_schedule": return 0;
    case "scheduled": case "reschedule_required": return 1;
    case "assigned": case "out_for_delivery": case "delivery_failed": return 2;
    case "delivered": return 3;
    case "completed": return 5;
    case "cancelled": return -1;
  }
}

/**
 * Build the customer-safe tracking timeline (§26). The `installation` stage is
 * only shown when installation is required. After a failed attempt (`rescheduling`)
 * the UI shows calm "a new time is being arranged" wording — never a raw code (§27).
 */
export function buildTracking(d: Delivery): DeliveryTracking {
  const at = stageTimes(d);
  const rank = trackRank(d.status);
  const rescheduling = d.status === "delivery_failed" || d.status === "reschedule_required";
  const showInstall = d.installationRequired;

  const stages = showInstall ? TRACK_STAGES : TRACK_STAGES.filter((s) => s !== "installation");
  const steps: TrackingStep[] = stages.map((stage) => {
    const index = TRACK_STAGES.indexOf(stage);
    let state: TrackingStepState;
    if (d.status === "delivered" && stage === "installation") {
      // Delivered + installation required but not finished → this is the current focus.
      state = d.installation.status === "completed" ? "done" : "current";
    } else if (index < rank) {
      state = "done";
    } else if (index === rank) {
      state = d.status === "completed" ? "done" : "current";
    } else {
      state = "upcoming";
    }
    if (rescheduling && stage === "out_for_delivery") state = "attention";
    return { stage, state, ...(at[stage] !== undefined ? { at: at[stage] } : {}) };
  });

  return {
    status: d.status,
    installationStatus: d.installation.status,
    steps,
    ...(d.window ? { window: d.window } : {}),
    rescheduling,
  };
}

// ── Order-level summary (account cards + agent) — §29 ─────────────────────────

export interface DeliverySummary {
  total: number;
  preparing: number;    // awaiting_schedule
  scheduled: number;    // scheduled | assigned | reschedule_required
  outForDelivery: number;
  delivered: number;    // delivered (not yet completed)
  completed: number;
  needsAttention: number; // delivery_failed
  allCompleted: boolean;
}

export function summarizeDeliveries(deliveries: readonly Delivery[]): DeliverySummary {
  const s: DeliverySummary = {
    total: deliveries.length, preparing: 0, scheduled: 0, outForDelivery: 0,
    delivered: 0, completed: 0, needsAttention: 0, allCompleted: false,
  };
  for (const d of deliveries) {
    switch (d.status) {
      case "awaiting_schedule": s.preparing++; break;
      case "scheduled": case "assigned": case "reschedule_required": s.scheduled++; break;
      case "out_for_delivery": s.outForDelivery++; break;
      case "delivered": s.delivered++; break;
      case "completed": s.completed++; break;
      case "delivery_failed": s.needsAttention++; break;
    }
  }
  s.allCompleted = s.total > 0 && s.completed === s.total;
  return s;
}
