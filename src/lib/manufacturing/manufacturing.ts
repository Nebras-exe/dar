/**
 * Manufacturing orchestration (Phase 11B). Pure + deterministic so it runs
 * identically in the demo store and (later) a server route handler.
 *
 * Invariants enforced here:
 *  1. CUSTOM-ONLY, READY-GATED (§4/§22): a job is created only for a CUSTOM
 *     supplier group whose fulfillment reached `ready_for_next_stage`. Catalog
 *     groups never enter manufacturing.
 *  2. SNAPSHOT REFERENCE (§7/§8): the job references the accepted order-group spec
 *     by (orderId, supplierId) — it never duplicates or mutates the immutable
 *     snapshot.
 *  3. AUDITABLE HISTORY (§9/§18): every transition appends an event; QC attempts
 *     are append-only and a failed inspection is never overwritten.
 *  4. GATED TRANSITIONS (§6): all status changes go through the state machine.
 */

import type { Order, SupplierOrderGroup, OrderCustomSnapshot } from "@/lib/orders";
import type { FulfillmentStatus } from "@/lib/fulfillment";
import { canTransition } from "./status-machine";
import {
  QUALITY_CRITERIA,
  type ManufacturingActor,
  type ManufacturingEvent,
  type ManufacturingEventType,
  type ManufacturingJob,
  type ManufacturingMilestone,
  type ManufacturingStatus,
  type ManufacturingStage,
  type ManufacturingTimeline,
  type ManufacturingTimelineStep,
  type ManufacturingStepState,
  type QualityCheck,
  type QualityCriterion,
  type QualityIssue,
  type QualityIssueCategory,
  type QualityIssueSeverity,
} from "./types";

// ── Custom detection + creation gate (§4/§22) ─────────────────────────────────

/** A supplier group needs manufacturing iff it contains a custom (RFQ) item. */
export function groupNeedsManufacturing(group: Pick<SupplierOrderGroup, "items">): boolean {
  return group.items.some((i) => i.kind === "custom");
}

/** Manufacturing may begin only for a CUSTOM group whose fulfillment is ready (§4). */
export function canCreateManufacturing(fulfillmentStatus: FulfillmentStatus, isCustom: boolean): boolean {
  return isCustom && fulfillmentStatus === "ready_for_next_stage";
}

function tag(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36).slice(0, 6);
}

function makeEvent(
  jobId: string, type: ManufacturingEventType, actor: ManufacturingActor, at: number, seed: number, note?: string,
): ManufacturingEvent {
  return {
    id: `me_${at.toString(36)}_${(seed >>> 0).toString(36).slice(0, 6)}`,
    jobId, type, actor, at, ...(note ? { note } : {}),
  };
}

/**
 * Build a fresh manufacturing job for a custom supplier group. Status starts at
 * `not_started` (ready for manufacturing); the estimate comes from the accepted
 * quote. The caller must have verified the group is custom + fulfillment-ready.
 */
export function buildManufacturingJob(
  order: Pick<Order, "id" | "orderNumber" | "customerId" | "isDemo">,
  group: Pick<SupplierOrderGroup, "supplierId" | "supplierName" | "items">,
  fulfillmentId: string,
  now: number,
  seed: number,
): ManufacturingJob {
  const id = `mfg_${now.toString(36)}_${(seed >>> 0).toString(36).slice(0, 6)}_${tag(group.supplierId)}`;
  const custom = group.items.find((i): i is OrderCustomSnapshot => i.kind === "custom");
  return {
    id,
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerId: order.customerId,
    supplierId: group.supplierId,
    supplierName: group.supplierName,
    fulfillmentId,
    status: "not_started",
    ...(custom?.manufacturingDays ? { estimateDays: custom.manufacturingDays } : {}),
    milestones: [],
    qualityChecks: [],
    events: [makeEvent(id, "created", { role: "system" }, now, seed)],
    isDemo: order.isDemo,
    createdAt: now,
    updatedAt: now,
  };
}

// ── Transitions ───────────────────────────────────────────────────────────────

/** Infer the event type for a (from → to) transition (rework vs first pass). */
function eventForTransition(from: ManufacturingStatus, to: ManufacturingStatus): ManufacturingEventType {
  switch (to) {
    case "manufacturing": return "manufacturing_started";
    case "manufacturing_completed": return from === "rework" ? "rework_completed" : "manufacturing_completed";
    case "quality_check": return "qc_started";
    case "qc_passed": return "qc_passed";
    case "qc_failed": return "qc_failed";
    case "rework": return "rework_started";
    case "ready_for_delivery": return "ready_for_delivery";
    default: return "created";
  }
}

export interface TransitionResult {
  ok: boolean;
  changed: boolean;
  job: ManufacturingJob;
  error?: "invalid-transition" | "checklist-incomplete" | "issue-required" | "no-open-qc";
}

/**
 * Apply a raw status transition, gated by the machine, appending an audit event.
 * Idempotent: re-applying the current status is a successful no-op (§27 duplicate
 * transition). Invalid jumps are rejected (the job is unchanged).
 */
function transitionJob(
  job: ManufacturingJob, to: ManufacturingStatus, actor: ManufacturingActor, now: number, seed?: number,
): TransitionResult {
  if (job.status === to) return { ok: true, changed: false, job };
  if (!canTransition(job.status, to)) return { ok: false, changed: false, job, error: "invalid-transition" };
  const s = seed ?? ((now ^ 0x5bd1e995) >>> 0);
  const event = makeEvent(job.id, eventForTransition(job.status, to), actor, now, s);
  return { ok: true, changed: true, job: { ...job, status: to, events: [...job.events, event], updatedAt: now } };
}

export function startManufacturing(job: ManufacturingJob, actor: ManufacturingActor, now: number, seed?: number): TransitionResult {
  return transitionJob(job, "manufacturing", actor, now, seed);
}

export function completeManufacturing(job: ManufacturingJob, actor: ManufacturingActor, now: number, seed?: number): TransitionResult {
  return transitionJob(job, "manufacturing_completed", actor, now, seed);
}

export function startRework(job: ManufacturingJob, actor: ManufacturingActor, now: number, seed?: number): TransitionResult {
  return transitionJob(job, "rework", actor, now, seed);
}

export function completeRework(job: ManufacturingJob, actor: ManufacturingActor, now: number, seed?: number): TransitionResult {
  return transitionJob(job, "manufacturing_completed", actor, now, seed);
}

export function markReadyForDelivery(job: ManufacturingJob, actor: ManufacturingActor, now: number, seed?: number): TransitionResult {
  return transitionJob(job, "ready_for_delivery", actor, now, seed);
}

// ── Milestones (§12) — genuine, supplier-entered, never a fake % ──────────────

export function toggleMilestone(
  job: ManufacturingJob, milestone: ManufacturingMilestone, actor: ManufacturingActor, now: number, seed?: number,
): ManufacturingJob {
  // Milestones are informational and don't gate transitions; only meaningful in production.
  if (job.status !== "manufacturing" && job.status !== "rework") return job;
  const has = job.milestones.includes(milestone);
  const milestones = has ? job.milestones.filter((m) => m !== milestone) : [...job.milestones, milestone];
  const events = has
    ? job.events
    : [...job.events, makeEvent(job.id, "milestone_reached", actor, now, seed ?? ((now ^ 0x27d4eb2f) >>> 0), milestone)];
  return { ...job, milestones, events, updatedAt: now };
}

// ── Quality check (§14/§15/§17/§18) ───────────────────────────────────────────

/** The open (pending) QC attempt, if any. */
export function openQualityCheck(job: ManufacturingJob): QualityCheck | null {
  return job.qualityChecks.find((q) => q.status === "pending") ?? null;
}

/**
 * Submit the completed item for quality check → opens a NEW QC attempt (QC #n)
 * and moves the job to `quality_check`. Idempotent if already in QC (§27 duplicate
 * QC submission): it does not open a second concurrent attempt.
 */
export function submitForQualityCheck(job: ManufacturingJob, actor: ManufacturingActor, now: number, seed?: number): TransitionResult {
  if (job.status === "quality_check") return { ok: true, changed: false, job }; // no duplicate attempt
  const t = transitionJob(job, "quality_check", actor, now, seed);
  if (!t.ok) return t;
  const attempt = job.qualityChecks.length + 1;
  const qc: QualityCheck = {
    id: `qc_${now.toString(36)}_${attempt}`,
    jobId: job.id, attempt, status: "pending", checklist: {}, issues: [], by: actor, startedAt: now,
  };
  return { ok: true, changed: true, job: { ...t.job, qualityChecks: [...t.job.qualityChecks, qc] } };
}

function checklistComplete(checklist: Partial<Record<QualityCriterion, boolean>>): boolean {
  return QUALITY_CRITERIA.every((c) => checklist[c] === true);
}

/**
 * Pass the open QC attempt. Requires the job to be in `quality_check`, an open
 * attempt, and ALL checklist criteria confirmed (§15). Finalises that attempt
 * (never overwrites a past one) and moves the job to `qc_passed`.
 */
export function passQualityCheck(
  job: ManufacturingJob, checklist: Partial<Record<QualityCriterion, boolean>>, actor: ManufacturingActor, now: number, seed?: number,
): TransitionResult {
  if (job.status !== "quality_check") return { ok: false, changed: false, job, error: "invalid-transition" };
  const open = openQualityCheck(job);
  if (!open) return { ok: false, changed: false, job, error: "no-open-qc" };
  if (!checklistComplete(checklist)) return { ok: false, changed: false, job, error: "checklist-incomplete" };
  const t = transitionJob(job, "qc_passed", actor, now, seed);
  if (!t.ok) return t;
  const qualityChecks = t.job.qualityChecks.map((q) =>
    q.id === open.id ? { ...q, status: "passed" as const, checklist, decidedAt: now } : q);
  return { ok: true, changed: true, job: { ...t.job, qualityChecks } };
}

/**
 * Fail the open QC attempt with at least one structured issue (§15/§16). Finalises
 * that attempt (preserved forever) and moves the job to `qc_failed`. The failed
 * attempt + its issues remain in history when a later attempt passes (§18).
 */
export function failQualityCheck(
  job: ManufacturingJob,
  checklist: Partial<Record<QualityCriterion, boolean>>,
  issues: ReadonlyArray<{ category: QualityIssueCategory; severity: QualityIssueSeverity; description: string }>,
  actor: ManufacturingActor, now: number, seed?: number,
): TransitionResult {
  if (job.status !== "quality_check") return { ok: false, changed: false, job, error: "invalid-transition" };
  const open = openQualityCheck(job);
  if (!open) return { ok: false, changed: false, job, error: "no-open-qc" };
  if (issues.length === 0) return { ok: false, changed: false, job, error: "issue-required" };
  const t = transitionJob(job, "qc_failed", actor, now, seed);
  if (!t.ok) return t;
  const built: QualityIssue[] = issues.map((iss, i) => ({
    id: `qi_${now.toString(36)}_${i}`,
    category: iss.category, severity: iss.severity, description: iss.description, at: now,
  }));
  const qualityChecks = t.job.qualityChecks.map((q) =>
    q.id === open.id ? { ...q, status: "failed" as const, checklist, issues: built, decidedAt: now } : q);
  return { ok: true, changed: true, job: { ...t.job, qualityChecks } };
}

// ── Customer timeline (§20) — customer-safe; never exposes QC issues/notes ─────

const MFG_STAGES: readonly ManufacturingStage[] = [
  "manufacturing", "manufacturing_completed", "quality_check", "ready_for_delivery",
];

function stageTimes(job: ManufacturingJob): Partial<Record<ManufacturingStage, number>> {
  const at: Partial<Record<ManufacturingStage, number>> = {};
  for (const e of job.events) {
    if (e.type === "manufacturing_started") at.manufacturing ??= e.at;
    else if (e.type === "manufacturing_completed" || e.type === "rework_completed") at.manufacturing_completed = e.at;
    else if (e.type === "qc_started") at.quality_check = e.at;
    else if (e.type === "ready_for_delivery") at.ready_for_delivery = e.at;
  }
  return at;
}

/** How far along the linear customer stages the job has reached. */
function reachedRank(status: ManufacturingStatus): number {
  switch (status) {
    case "not_started": return -1;              // manufacturing hasn't started
    case "manufacturing": return 0;
    case "manufacturing_completed": return 1;
    case "quality_check":
    case "qc_failed":
    case "rework":
    case "qc_passed": return 2;                  // all sit at the "quality check" stage
    case "ready_for_delivery": return 3;
  }
}

/**
 * Build the customer-safe manufacturing timeline. During qc_failed/rework the
 * customer sees a calm "quality review in progress" state — never the failure,
 * the issues, or internal notes (§18/§20).
 */
export function buildCustomerTimeline(job: ManufacturingJob): ManufacturingTimeline {
  const at = stageTimes(job);
  const rank = reachedRank(job.status);
  const inQualityReview = job.status === "qc_failed" || job.status === "rework";
  const steps: ManufacturingTimelineStep[] = MFG_STAGES.map((stage, index) => {
    let state: ManufacturingStepState;
    if (index < rank) state = "done";
    else if (index === rank) state = job.status === "ready_for_delivery" ? "done" : "current";
    else state = "upcoming";
    // qc_passed has cleared quality_check → nudge "ready_for_delivery" to current.
    if (job.status === "qc_passed" && stage === "quality_check") state = "done";
    if (job.status === "qc_passed" && stage === "ready_for_delivery") state = "current";
    return { stage, state, ...(at[stage] !== undefined ? { at: at[stage] } : {}) };
  });
  return { status: job.status, steps, inQualityReview };
}

// ── Order-level summary (customer cards + agent) — §23 ────────────────────────

export interface ManufacturingSummary {
  total: number;
  inProduction: number;   // manufacturing | rework
  inQc: number;           // quality_check | qc_failed
  readyForDelivery: number;
  notStarted: number;
  completed: number;      // manufacturing_completed | qc_passed
  allReady: boolean;
}

export function summarizeManufacturing(jobs: readonly ManufacturingJob[]): ManufacturingSummary {
  const s: ManufacturingSummary = {
    total: jobs.length, inProduction: 0, inQc: 0, readyForDelivery: 0, notStarted: 0, completed: 0, allReady: false,
  };
  for (const j of jobs) {
    switch (j.status) {
      case "not_started": s.notStarted++; break;
      case "manufacturing": case "rework": s.inProduction++; break;
      case "manufacturing_completed": case "qc_passed": s.completed++; break;
      case "quality_check": case "qc_failed": s.inQc++; break;
      case "ready_for_delivery": s.readyForDelivery++; break;
    }
  }
  s.allReady = s.total > 0 && s.readyForDelivery === s.total;
  return s;
}
