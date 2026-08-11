/**
 * Athathi Delivery + Installation — domain contracts (Phase 12).
 *
 * Delivery is the operational continuation of the pipeline: a supplier group
 * enters delivery only when it is genuinely ready — a CUSTOM group when its
 * manufacturing job reached `ready_for_delivery` (Phase 11B), a READY-STOCK
 * catalog group when its fulfillment reached `ready_for_next_stage` (Phase 11A).
 * Ready-stock is NEVER forced through manufacturing (§5).
 *
 * A FIFTH SEPARATE domain from order · payment · fulfillment · manufacturing
 * status (§4). Each supplier group has its OWN delivery (§9). The delivery
 * carries an IMMUTABLE SNAPSHOT of the order's delivery address (§10) — it never
 * silently follows later account-address edits. Every transition appends an
 * auditable event; failed attempts are never deleted (§8/§19). No real courier /
 * GPS (§16/§28). Kept free of server/React imports so the types + machines +
 * builders run on the client and in Node tests.
 */

/** Per-supplier-group delivery lifecycle (§7). */
export type DeliveryStatus =
  | "awaiting_schedule"
  | "scheduled"
  | "assigned"
  | "out_for_delivery"
  | "delivered"
  | "delivery_failed"
  | "reschedule_required"
  | "cancelled"
  | "completed"; // terminal — delivery (+ any required installation) + handover done

/** Installation lifecycle (§21). `not_required` when the quote has no install fee. */
export type InstallationStatus =
  | "not_required"
  | "awaiting_schedule"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "issue";

/** Who performed an action. Customer + Agent are READ-ONLY and never appear here (§31/§33). */
export type DeliveryActorRole = "supplier" | "customer" | "system";

export interface DeliveryActor {
  role: DeliveryActorRole;
  id?: string;
}

/** A demo delivery window the customer can pick (§11). Local + deterministic. */
export type DeliverySlotPeriod = "morning" | "afternoon" | "evening";

export interface DeliveryWindow {
  /** ISO date (YYYY-MM-DD), local Oman day. */
  date: string;
  period: DeliverySlotPeriod;
}

/**
 * An immutable snapshot of the order's delivery address at delivery-creation time
 * (§10). Delivery never silently follows a later account-address change.
 */
export interface DeliveryAddressSnapshot {
  fullName: string;
  phone: string;
  governorate: string;
  wilayat: string;
  area: string;
  building: string;
  notes?: string;
}

/** A clearly-labelled DEMO assignment — never a fabricated real driver identity (§15). */
export interface DeliveryAssignment {
  /** e.g. "demo-team" / "demo-driver" — the demo provider id. */
  providerId: string;
  /** Display label, always Demo-tagged in the UI. */
  assigneeName: string;
  isDemo: true;
  at: number;
}

/** Practical delivery-failure reasons (§19). */
export type DeliveryFailureReason =
  | "customer_unavailable"
  | "incorrect_address"
  | "access_issue"
  | "vehicle_issue"
  | "item_issue"
  | "other";

/** Simple installation-issue categories (§23). */
export type InstallationIssueCategory =
  | "missing_component"
  | "damage_found"
  | "fit_issue"
  | "customer_request"
  | "other";

/** Auditable delivery event kinds (§8). */
export type DeliveryEventType =
  | "delivery_ready"
  | "slot_selected"
  | "delivery_scheduled"
  | "assigned"
  | "out_for_delivery"
  | "delivery_attempt_failed"
  | "rescheduled"
  | "delivered"
  | "installation_scheduled"
  | "installation_started"
  | "installation_completed"
  | "installation_issue"
  | "handover_confirmed"
  | "completed"
  | "cancelled";

export interface DeliveryEvent {
  id: string;
  deliveryId: string;
  type: DeliveryEventType;
  actor: DeliveryActor;
  at: number;
  /** Optional safe note (e.g. a slot label or failure-reason key). Never a raw internal note. */
  note?: string;
}

/** A recorded delivery attempt (preserved across reschedules — §19). */
export interface DeliveryAttempt {
  id: string;
  at: number;
  outcome: "delivered" | "failed";
  reason?: DeliveryFailureReason;
}

/** An installation issue record (supplier/ops-only description — §23). */
export interface InstallationIssue {
  id: string;
  category: InstallationIssueCategory;
  /** Supplier-side note — customers see a safe status, not this text. */
  description: string;
  at: number;
}

/** The installation sub-record on a delivery (only meaningful when required). */
export interface Installation {
  status: InstallationStatus;
  window?: DeliveryWindow;
  scheduledAt?: number;
  startedAt?: number;
  completedAt?: number;
  issues: InstallationIssue[];
}

/** A customer-safe handover confirmation (§24) — no signature, no biometrics. */
export interface HandoverConfirmation {
  at: number;
  by: DeliveryActor;
}

/**
 * One supplier group's delivery. Lean — it references the order group by
 * (orderId, supplierId) and carries an IMMUTABLE address snapshot; it never
 * duplicates the priced line snapshot (the order stays the single source).
 */
export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  supplierId: string;
  supplierName: string;
  /** "cart" | "accepted_quote" — drives customer-friendly labels only. */
  orderSource: "cart" | "accepted_quote";
  status: DeliveryStatus;
  address: DeliveryAddressSnapshot;
  /** Whether the quote included installation (§20). Fixed at creation. */
  installationRequired: boolean;
  window?: DeliveryWindow;
  scheduledAt?: number;
  assignment?: DeliveryAssignment;
  outForDeliveryAt?: number;
  deliveredAt?: number;
  attempts: DeliveryAttempt[];
  installation: Installation;
  handover?: HandoverConfirmation;
  completedAt?: number;
  events: DeliveryEvent[];
  isDemo: boolean;
  createdAt: number;
  updatedAt: number;
}

/** A customer-facing tracking stage (derived; never stored). */
export type TrackingStage =
  | "preparing"
  | "scheduled"
  | "out_for_delivery"
  | "delivered"
  | "installation"
  | "completed";

export type TrackingStepState = "done" | "current" | "upcoming" | "attention";

export interface TrackingStep {
  stage: TrackingStage;
  state: TrackingStepState;
  at?: number;
}

/** A customer-safe tracking timeline (§26). Never exposes internal failure codes. */
export interface DeliveryTracking {
  status: DeliveryStatus;
  installationStatus: InstallationStatus;
  steps: TrackingStep[];
  window?: DeliveryWindow;
  /** True after a failed attempt while a new time is arranged → calm wording (§27). */
  rescheduling: boolean;
}

/** Stable, user-safe error codes for delivery operations. */
export type DeliveryErrorCode =
  | "not-eligible"
  | "not-found"
  | "not-owner"
  | "not-supplier"
  | "invalid-transition"
  | "invalid-slot"
  | "reason-required"
  | "installation-required"
  | "not-delivered"
  | "unknown";
