/**
 * Athathi Fulfillment — domain contracts (Phase 11A).
 *
 * Fulfillment is a SEPARATE domain from order status (Phase 10A) and payment
 * status (Phase 10B) — the three never collapse into one field (§4). A paid
 * order hands off to its suppliers: EACH supplier group carries its OWN
 * fulfillment lifecycle (§6), so a multi-supplier order can have supplier A
 * `accepted` while supplier B is still `awaiting_supplier`.
 *
 * A fulfillment REFERENCES the immutable order-group snapshot (by orderId +
 * supplierId) — it never re-reads current catalog pricing to change the purchase
 * contract (§8/§24). Every meaningful change appends an auditable event (§9); a
 * status is never silently rewritten. Kept free of server/React imports so the
 * types + machine + builders run on the client and in Node tests.
 */

/** Per-supplier fulfillment lifecycle for Phase 11A (stops before manufacturing). */
export type FulfillmentStatus =
  | "awaiting_supplier"
  | "accepted"
  | "preparing"
  | "ready_for_next_stage"
  | "declined"
  | "cancelled";

/** Who performed an action. The Agent is READ-ONLY and never appears as a writer (§25). */
export type FulfillmentActorRole = "supplier" | "customer" | "system";

export interface FulfillmentActor {
  role: FulfillmentActorRole;
  /** Supplier id / customer id when applicable (never required for `system`). */
  id?: string;
}

/** Structured decline reasons (§12). The enum is safe to show a customer; a free note is NOT. */
export type DeclineReason =
  | "unable_to_fulfill"
  | "inventory_issue"
  | "capacity_issue"
  | "delivery_issue"
  | "other";

/** The kinds of auditable events recorded on a fulfillment timeline (§9). */
export type FulfillmentEventType =
  | "order_paid"
  | "supplier_notified"
  | "accepted"
  | "declined"
  | "preparing_started"
  | "ready_for_next_stage"
  | "cancelled";

/** An immutable, append-only audit record. `note` is a SAFE, short string. */
export interface FulfillmentEvent {
  id: string;
  fulfillmentId: string;
  type: FulfillmentEventType;
  actor: FulfillmentActor;
  at: number;
  /** Optional safe note (e.g. a decline-reason label). Never a raw internal note. */
  note?: string;
}

/** Recorded when a supplier accepts (§13). */
export interface SupplierAcceptance {
  at: number;
  by: FulfillmentActor;
}

/**
 * Recorded when a supplier declines (§12). `reason` (enum) is customer-safe;
 * `internalNote` is supplier/ops-only and MUST NOT be shown to the customer.
 */
export interface SupplierDecline {
  at: number;
  by: FulfillmentActor;
  reason: DeclineReason;
  internalNote?: string;
}

/**
 * One supplier group's fulfillment. Lean by design — it references the order
 * group by (orderId, supplierId) rather than duplicating the priced line
 * snapshot, so the purchase contract stays the single immutable source (§8).
 */
export interface Fulfillment {
  id: string;
  orderId: string;
  /** Denormalised for display/routing only; the money/lines live on the order. */
  orderNumber: string;
  customerId: string;
  supplierId: string;
  supplierName: string;
  /** "cart" | "accepted_quote" — drives the custom-furniture handoff copy (§23). */
  orderSource: "cart" | "accepted_quote";
  status: FulfillmentStatus;
  acceptance?: SupplierAcceptance;
  decline?: SupplierDecline;
  events: FulfillmentEvent[];
  isDemo: boolean;
  createdAt: number;
  updatedAt: number;
}

/** A customer-facing timeline stage (derived; never stored). */
export type FulfillmentStage =
  | "paid"
  | "awaiting_supplier"
  | "accepted"
  | "preparing"
  | "ready_for_next_stage";

export type TimelineStepState = "done" | "current" | "upcoming" | "declined" | "cancelled";

export interface TimelineStep {
  stage: FulfillmentStage;
  state: TimelineStepState;
  /** When this stage was reached (from the event history), if it was. */
  at?: number;
}

/** A per-supplier timeline for the customer order view (§17). */
export interface FulfillmentTimeline {
  supplierId: string;
  supplierName: string;
  status: FulfillmentStatus;
  steps: TimelineStep[];
  /** Customer-safe decline reason label key (never the internal note). */
  declineReason?: DeclineReason;
}

/** Stable, user-safe error codes for fulfillment operations. */
export type FulfillmentErrorCode =
  | "not-paid"
  | "not-found"
  | "not-owner"
  | "not-supplier"
  | "invalid-transition"
  | "already-decided"
  | "reason-required"
  | "unknown";
