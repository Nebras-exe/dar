/**
 * Athathi Manufacturing + Quality Check — domain contracts (Phase 11B).
 *
 * Manufacturing is the CUSTOM-furniture continuation of fulfillment (Phase 11A):
 * it begins only after a CUSTOM supplier group reaches `ready_for_next_stage`.
 * Regular ready-stock catalog groups NEVER enter manufacturing (§4/§22). A job
 * manufactures from the ACCEPTED, immutable order-group specification — it
 * REFERENCES that snapshot (by orderId + supplierId) and never duplicates or
 * mutates it (§7/§8). Every transition appends an auditable event; QC history is
 * append-only and a failed inspection is never overwritten (§17/§18). This phase
 * ends at `ready_for_delivery` — no courier/tracking/installation (§19).
 *
 * A SEPARATE domain from order status, payment status, and fulfillment status.
 * Kept free of server/React imports so the types + machine + builders run on the
 * client and in Node tests.
 */

/** Manufacturing lifecycle for Phase 11B (ends at ready_for_delivery). */
export type ManufacturingStatus =
  | "not_started"            // fulfillment ready → ready for manufacturing
  | "manufacturing"          // in production
  | "manufacturing_completed"
  | "quality_check"
  | "qc_passed"
  | "qc_failed"
  | "rework"
  | "ready_for_delivery";    // terminal for this phase

/** Who performed an action. Customer + Agent are READ-ONLY and never appear here (§23/§25). */
export type ManufacturingActorRole = "supplier" | "system";

export interface ManufacturingActor {
  role: ManufacturingActorRole;
  id?: string;
}

/** Optional, supplier-entered production milestones (§12) — genuine, never a fake %. */
export type ManufacturingMilestone =
  | "materials_prepared"
  | "frame"
  | "assembly"
  | "upholstery_finish"
  | "final_finishing";

export const MANUFACTURING_MILESTONES: readonly ManufacturingMilestone[] = [
  "materials_prepared", "frame", "assembly", "upholstery_finish", "final_finishing",
];

/** Structured furniture QC checklist criteria (§14). Pass requires ALL of these. */
export type QualityCriterion =
  | "dimensions_match"
  | "correct_material"
  | "correct_colour"
  | "correct_finish"
  | "construction_ok"
  | "no_damage"
  | "components_included"
  | "customization_matches";

export const QUALITY_CRITERIA: readonly QualityCriterion[] = [
  "dimensions_match", "correct_material", "correct_colour", "correct_finish",
  "construction_ok", "no_damage", "components_included", "customization_matches",
];

export type QualityCheckStatus = "pending" | "passed" | "failed";

/** Structured quality-issue categories (§16). */
export type QualityIssueCategory =
  | "dimensions"
  | "material"
  | "colour"
  | "finish"
  | "construction"
  | "damage"
  | "missing_component"
  | "customization_mismatch"
  | "other";

export type QualityIssueSeverity = "minor" | "major";

export interface QualityIssue {
  id: string;
  category: QualityIssueCategory;
  severity: QualityIssueSeverity;
  /** Supplier-side technical description — customer sees only a safe status (§18). */
  description: string;
  at: number;
}

/** One QC attempt. History is preserved — a failed check is NEVER overwritten (§17/§18). */
export interface QualityCheck {
  id: string;
  jobId: string;
  /** 1-based attempt number (QC #1, QC #2, …). */
  attempt: number;
  status: QualityCheckStatus;
  /** Which criteria the inspector confirmed. */
  checklist: Partial<Record<QualityCriterion, boolean>>;
  issues: QualityIssue[];
  by: ManufacturingActor;
  startedAt: number;
  decidedAt?: number;
}

/** The kinds of auditable events recorded on a manufacturing job (§9/§11/§13). */
export type ManufacturingEventType =
  | "created"
  | "manufacturing_started"
  | "milestone_reached"
  | "manufacturing_completed"
  | "qc_started"
  | "qc_passed"
  | "qc_failed"
  | "rework_started"
  | "rework_completed"
  | "ready_for_delivery";

export interface ManufacturingEvent {
  id: string;
  jobId: string;
  type: ManufacturingEventType;
  actor: ManufacturingActor;
  at: number;
  /** Optional safe note (e.g. a milestone key). Never a raw internal note. */
  note?: string;
}

/**
 * One custom supplier group's manufacturing job. Lean by design — it REFERENCES
 * the accepted order-group specification by (orderId, supplierId) rather than
 * duplicating the immutable snapshot (§7/§8). The purchase/manufacturing contract
 * stays the single source on the order.
 */
export interface ManufacturingJob {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  supplierId: string;
  supplierName: string;
  /** Link back to the Phase 11A fulfillment this job continues. */
  fulfillmentId: string;
  status: ManufacturingStatus;
  /** Manufacturing estimate (days) from the accepted quote, if known. */
  estimateDays?: number;
  /** Supplier-entered production milestones completed so far (§12). */
  milestones: ManufacturingMilestone[];
  /** Full, append-only QC history (QC #1, QC #2, …). */
  qualityChecks: QualityCheck[];
  events: ManufacturingEvent[];
  isDemo: boolean;
  createdAt: number;
  updatedAt: number;
}

/** A customer-facing manufacturing stage (derived; never stored). */
export type ManufacturingStage =
  | "manufacturing"
  | "manufacturing_completed"
  | "quality_check"
  | "ready_for_delivery";

export type ManufacturingStepState = "done" | "current" | "upcoming";

export interface ManufacturingTimelineStep {
  stage: ManufacturingStage;
  state: ManufacturingStepState;
  at?: number;
}

/** A customer-safe manufacturing timeline (§20). Never exposes QC issues/notes. */
export interface ManufacturingTimeline {
  status: ManufacturingStatus;
  steps: ManufacturingTimelineStep[];
  /** True during qc_failed/rework → calm "quality review in progress" wording. */
  inQualityReview: boolean;
}

/** Stable, user-safe error codes for manufacturing operations. */
export type ManufacturingErrorCode =
  | "not-custom"
  | "fulfillment-not-ready"
  | "not-found"
  | "not-owner"
  | "not-supplier"
  | "invalid-transition"
  | "checklist-incomplete"
  | "issue-required"
  | "no-open-qc"
  | "unknown";
