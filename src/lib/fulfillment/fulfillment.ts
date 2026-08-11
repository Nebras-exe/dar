/**
 * Fulfillment orchestration (Phase 11A, §5/§8/§9/§13/§14/§15). Pure + deterministic
 * so it runs identically in the demo store and (later) a server route handler.
 *
 * Invariants enforced here:
 *  1. PAID-ONLY ENTRY (§4/§30): a fulfillment is created only from a `paid`
 *     order; `canCreateFulfillment` gates it. Demo Mode follows the same rule.
 *  2. PER-GROUP STATE (§6): one fulfillment per (orderId, supplierId). A
 *     multi-supplier order has independent fulfillments.
 *  3. AUDITABLE HISTORY (§9): every transition appends an immutable event; a
 *     status is never rewritten silently.
 *  4. SNAPSHOT REFERENCE (§8/§24): the fulfillment references the order group by
 *     id — it never re-reads current catalog pricing.
 */

import type { Order, SupplierOrderGroup } from "@/lib/orders";
import type { PaymentStatus } from "@/lib/payments";
import { canTransition } from "./status-machine";
import type {
  DeclineReason,
  Fulfillment,
  FulfillmentActor,
  FulfillmentEvent,
  FulfillmentEventType,
  FulfillmentStatus,
  FulfillmentTimeline,
  TimelineStep,
  TimelineStepState,
} from "./types";

const DECLINE_REASONS: readonly DeclineReason[] = [
  "unable_to_fulfill", "inventory_issue", "capacity_issue", "delivery_issue", "other",
];

export function isDeclineReason(v: unknown): v is DeclineReason {
  return typeof v === "string" && (DECLINE_REASONS as readonly string[]).includes(v);
}

/** Fulfillment may begin only for a PAID order (§4/§30). */
export function canCreateFulfillment(paymentStatus: PaymentStatus): boolean {
  return paymentStatus === "paid";
}

function makeEvent(
  fulfillmentId: string,
  type: FulfillmentEventType,
  actor: FulfillmentActor,
  at: number,
  seed: number,
  note?: string,
): FulfillmentEvent {
  return {
    id: `fe_${at.toString(36)}_${(seed >>> 0).toString(36).slice(0, 6)}`,
    fulfillmentId,
    type,
    actor,
    at,
    ...(note ? { note } : {}),
  };
}

/**
 * Build a fresh fulfillment for one supplier group of a PAID order. Status starts
 * at `awaiting_supplier` and the history is seeded with `order_paid` +
 * `supplier_notified` (§9). The caller must have verified payment is `paid`.
 */
/** Short, stable discriminator for a supplier id (keeps per-group ids distinct). */
function supplierTag(supplierId: string): string {
  let h = 5381;
  for (let i = 0; i < supplierId.length; i++) h = ((h << 5) + h + supplierId.charCodeAt(i)) >>> 0;
  return h.toString(36).slice(0, 6);
}

export function buildFulfillment(
  order: Pick<Order, "id" | "orderNumber" | "customerId" | "source" | "isDemo">,
  group: Pick<SupplierOrderGroup, "supplierId" | "supplierName">,
  now: number,
  seed: number,
): Fulfillment {
  const id = `ful_${now.toString(36)}_${(seed >>> 0).toString(36).slice(0, 6)}_${supplierTag(group.supplierId)}`;
  const system: FulfillmentActor = { role: "system" };
  return {
    id,
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerId: order.customerId,
    supplierId: group.supplierId,
    supplierName: group.supplierName,
    orderSource: order.source,
    status: "awaiting_supplier",
    events: [
      makeEvent(id, "order_paid", system, now, seed, undefined),
      makeEvent(id, "supplier_notified", system, now + 1, seed ^ 0x9e3779b9, undefined),
    ],
    isDemo: order.isDemo,
    createdAt: now,
    updatedAt: now,
  };
}

/** Map a transition target to the event it records. */
const EVENT_FOR: Partial<Record<FulfillmentStatus, FulfillmentEventType>> = {
  accepted: "accepted",
  declined: "declined",
  preparing: "preparing_started",
  ready_for_next_stage: "ready_for_next_stage",
  cancelled: "cancelled",
};

export interface TransitionResult {
  ok: boolean;
  changed: boolean;
  fulfillment: Fulfillment;
  error?: "invalid-transition" | "reason-required";
}

/**
 * Apply a status transition, gated by the machine, appending an audit event.
 * Idempotent: re-applying the current status is a successful no-op (§35 duplicate
 * action). Invalid jumps are rejected with `ok:false` (the fulfillment is unchanged).
 */
export function applyTransition(
  fulfillment: Fulfillment,
  to: FulfillmentStatus,
  actor: FulfillmentActor,
  now: number,
  opts: { reason?: DeclineReason; internalNote?: string; note?: string; seed?: number } = {},
): TransitionResult {
  // Idempotency: the same status again is a no-op success (no duplicate event).
  if (fulfillment.status === to) return { ok: true, changed: false, fulfillment };
  if (!canTransition(fulfillment.status, to)) {
    return { ok: false, changed: false, fulfillment, error: "invalid-transition" };
  }
  if (to === "declined" && !isDeclineReason(opts.reason)) {
    return { ok: false, changed: false, fulfillment, error: "reason-required" };
  }

  const seed = opts.seed ?? ((now ^ 0x5bd1e995) >>> 0);
  const eventType = EVENT_FOR[to] ?? "supplier_notified";
  const event = makeEvent(fulfillment.id, eventType, actor, now, seed, opts.note);

  const next: Fulfillment = {
    ...fulfillment,
    status: to,
    events: [...fulfillment.events, event],
    updatedAt: now,
    ...(to === "accepted" ? { acceptance: { at: now, by: actor } } : {}),
    ...(to === "declined"
      ? { decline: { at: now, by: actor, reason: opts.reason!, ...(opts.internalNote ? { internalNote: opts.internalNote } : {}) } }
      : {}),
  };
  return { ok: true, changed: true, fulfillment: next };
}

// ── Named supplier actions (thin, self-documenting wrappers) ──────────────────

export function acceptFulfillment(f: Fulfillment, actor: FulfillmentActor, now: number, seed?: number): TransitionResult {
  return applyTransition(f, "accepted", actor, now, { seed });
}

export function declineFulfillment(
  f: Fulfillment, actor: FulfillmentActor, reason: DeclineReason, now: number, internalNote?: string, seed?: number,
): TransitionResult {
  // The event note carries only the SAFE reason key — never the internal note (§12).
  return applyTransition(f, "declined", actor, now, { reason, internalNote, note: reason, seed });
}

export function startPreparing(f: Fulfillment, actor: FulfillmentActor, now: number, seed?: number): TransitionResult {
  return applyTransition(f, "preparing", actor, now, { seed });
}

export function markReady(f: Fulfillment, actor: FulfillmentActor, now: number, seed?: number): TransitionResult {
  return applyTransition(f, "ready_for_next_stage", actor, now, { seed });
}

export function cancelFulfillment(f: Fulfillment, actor: FulfillmentActor, now: number, seed?: number): TransitionResult {
  return applyTransition(f, "cancelled", actor, now, { seed });
}

// ── Customer timeline (derived; never stored) — §17/§18 ───────────────────────

const LINEAR_STAGES = ["paid", "awaiting_supplier", "accepted", "preparing", "ready_for_next_stage"] as const;

/** When each stage was reached, read from the immutable event history. */
function stageTimes(f: Fulfillment): Partial<Record<(typeof LINEAR_STAGES)[number], number>> {
  const at: Partial<Record<(typeof LINEAR_STAGES)[number], number>> = {};
  for (const e of f.events) {
    if (e.type === "order_paid") at.paid = e.at;
    else if (e.type === "supplier_notified") at.awaiting_supplier ??= e.at;
    else if (e.type === "accepted") at.accepted = e.at;
    else if (e.type === "preparing_started") at.preparing = e.at;
    else if (e.type === "ready_for_next_stage") at.ready_for_next_stage = e.at;
  }
  at.awaiting_supplier ??= f.createdAt;
  return at;
}

/**
 * Build a per-supplier timeline: linear stages with done/current/upcoming state,
 * plus declined/cancelled handling. The CURRENT stage is explicit (§18); future
 * stages are upcoming (subdued in UI). Colour is never the only signal — the UI
 * pairs each state with text + icon.
 */
export function buildTimeline(f: Fulfillment): FulfillmentTimeline {
  const at = stageTimes(f);
  // Furthest linear stage actually reached, from the event history.
  const reachedRank =
    at.ready_for_next_stage !== undefined ? 4
    : at.preparing !== undefined ? 3
    : at.accepted !== undefined ? 2
    : 1; // awaiting_supplier is always reached (created from a paid order)

  const steps: TimelineStep[] = LINEAR_STAGES.map((stage, index) => {
    let state: TimelineStepState;
    if (f.status === "declined") {
      // paid done; the awaiting stage is where it ended (declined); rest upcoming.
      if (index === 0) state = "done";
      else if (index === 1) state = "declined";
      else state = "upcoming";
    } else if (f.status === "cancelled") {
      if (index <= reachedRank) state = "done";
      else if (index === reachedRank + 1) state = "cancelled";
      else state = "upcoming";
    } else if (index < reachedRank) {
      state = "done";
    } else if (index === reachedRank) {
      state = "current";
    } else {
      state = "upcoming";
    }
    return { stage, state, ...(at[stage] !== undefined ? { at: at[stage] } : {}) };
  });

  return {
    supplierId: f.supplierId,
    supplierName: f.supplierName,
    status: f.status,
    steps,
    ...(f.decline ? { declineReason: f.decline.reason } : {}),
  };
}

// ── Order-level summary (account cards + agent) — §19/§25 ─────────────────────

export interface FulfillmentSummary {
  total: number;
  awaiting: number;
  accepted: number;
  preparing: number;
  ready: number;
  declined: number;
  cancelled: number;
  /** True when every supplier group has reached ready_for_next_stage. */
  allReady: boolean;
}

export function summarizeFulfillment(fulfillments: readonly Fulfillment[]): FulfillmentSummary {
  const s: FulfillmentSummary = {
    total: fulfillments.length,
    awaiting: 0, accepted: 0, preparing: 0, ready: 0, declined: 0, cancelled: 0,
    allReady: false,
  };
  for (const f of fulfillments) {
    switch (f.status) {
      case "awaiting_supplier": s.awaiting++; break;
      case "accepted": s.accepted++; break;
      case "preparing": s.preparing++; break;
      case "ready_for_next_stage": s.ready++; break;
      case "declined": s.declined++; break;
      case "cancelled": s.cancelled++; break;
    }
  }
  s.allReady = s.total > 0 && s.ready === s.total;
  return s;
}
