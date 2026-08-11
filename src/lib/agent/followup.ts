/**
 * Agent follow-up context + priority engine (Phase 13, §30–§34). Pure +
 * deterministic — it turns a snapshot of the CURRENT USER's project/order state
 * into a prioritized list of customer-safe next actions. It NEVER invents progress
 * (§30): every action is derived from real state the caller passes in. The Agent
 * may surface these, but performing them still respects existing authorization
 * (the Agent can never pay / accept / QC / mark delivered / write memory).
 *
 * Kept free of server/React imports so it runs on the client and in Node tests.
 */

import type { PaymentStatus } from "@/lib/payments";
import type { FulfillmentStatus } from "@/lib/fulfillment";
import type { ManufacturingStatus } from "@/lib/manufacturing";
import type { DeliveryStatus } from "@/lib/delivery";

/** A per-order snapshot the caller assembles from the user's own stores. */
export interface FollowUpOrderState {
  orderId: string;
  orderNumber: string;
  paymentStatus: PaymentStatus;
  /** Per-supplier statuses (may be empty before those stages). */
  fulfillmentStatuses: FulfillmentStatus[];
  manufacturingStatuses: ManufacturingStatus[];
  deliveryStatuses: DeliveryStatus[];
  /** True when a delivery of this order is awaiting the customer's slot choice. */
  awaitingSlot: boolean;
}

/** Higher-level user state (designs / RFQs) the caller assembles. */
export interface FollowUpInput {
  orders: FollowUpOrderState[];
  /** RFQ requests that have received at least one quote the user hasn't accepted. */
  pendingQuoteRequestIds: string[];
  /** In-progress (unsaved-to-order) design ids the user could continue. */
  activeDesignIds: string[];
}

export type FollowUpPriority = "high" | "medium" | "low";

/** A recommended, customer-safe next action (§33). `kind` never implies the Agent acts. */
export type NextActionKind =
  | "pay_order"
  | "review_quote"
  | "choose_delivery_slot"
  | "reschedule_delivery"
  | "view_order"
  | "continue_design";

export interface NextAction {
  kind: NextActionKind;
  priority: FollowUpPriority;
  /** The relevant surface for a deep link. */
  target: { kind: "order" | "design" | "request"; id: string };
  /** Safe params for localized rendering (e.g. order number). */
  params: Record<string, string>;
}

export interface AgentFollowUpContext {
  actions: NextAction[];
  /** The single most useful next action, or null when nothing needs attention. */
  top: NextAction | null;
  counts: { high: number; medium: number; low: number };
}

const RANK: Record<FollowUpPriority, number> = { high: 0, medium: 1, low: 2 };

/**
 * Build the prioritized follow-up context (§31/§32). Deterministic rules:
 *  HIGH   — payment failed, delivery needs reschedule, supplier declined.
 *  MEDIUM — quote received (review), delivery awaiting slot, quality review, unpaid order.
 *  LOW    — active design to continue.
 * All actions are customer-safe; the caller has already scoped state to this user.
 */
export function buildFollowUpContext(input: FollowUpInput): AgentFollowUpContext {
  const actions: NextAction[] = [];

  for (const o of input.orders) {
    const p = (kind: NextActionKind, priority: FollowUpPriority) =>
      actions.push({ kind, priority, target: { kind: "order", id: o.orderId }, params: { orderNumber: o.orderNumber } });

    // HIGH — needs the customer to act.
    if (o.paymentStatus === "failed") p("pay_order", "high");
    if (o.deliveryStatuses.some((s) => s === "delivery_failed" || s === "reschedule_required")) p("reschedule_delivery", "high");
    if (o.fulfillmentStatuses.includes("declined")) p("view_order", "high");

    // MEDIUM — useful next step.
    if (o.paymentStatus !== "paid" && o.paymentStatus !== "failed") p("pay_order", "medium");
    if (o.awaitingSlot) p("choose_delivery_slot", "medium");
    if (o.manufacturingStatuses.some((s) => s === "quality_check" || s === "qc_failed" || s === "rework")) p("view_order", "medium");
  }

  // MEDIUM — a quote is waiting to be reviewed.
  for (const requestId of input.pendingQuoteRequestIds) {
    actions.push({ kind: "review_quote", priority: "medium", target: { kind: "request", id: requestId }, params: {} });
  }

  // LOW — continue an in-progress design.
  for (const designId of input.activeDesignIds) {
    actions.push({ kind: "continue_design", priority: "low", target: { kind: "design", id: designId }, params: {} });
  }

  // Dedupe identical (kind,target) actions, keeping the highest priority.
  const seen = new Map<string, NextAction>();
  for (const a of actions) {
    const key = `${a.kind}:${a.target.kind}:${a.target.id}`;
    const prev = seen.get(key);
    if (!prev || RANK[a.priority] < RANK[prev.priority]) seen.set(key, a);
  }
  const deduped = [...seen.values()].sort((a, b) => RANK[a.priority] - RANK[b.priority]);

  const counts = { high: 0, medium: 0, low: 0 };
  for (const a of deduped) counts[a.priority]++;

  return { actions: deduped, top: deduped[0] ?? null, counts };
}
