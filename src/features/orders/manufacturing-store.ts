"use client";

import * as React from "react";
import {
  alwaysFalse, alwaysTrue, createPersistentStore,
} from "@/features/shop/persistent-store";
import {
  buildManufacturingJob, canCreateManufacturing, groupNeedsManufacturing,
  startManufacturing, completeManufacturing, submitForQualityCheck,
  passQualityCheck, failQualityCheck, startRework, completeRework, markReadyForDelivery,
  toggleMilestone, manufacturingNotifier,
  type ManufacturingJob, type ManufacturingActor, type ManufacturingMilestone,
  type ManufacturingEventType, type QualityCriterion, type QualityIssueCategory,
  type QualityIssueSeverity,
} from "@/lib/manufacturing";
import type { Order, SupplierOrderGroup } from "@/lib/orders";
import type { Fulfillment } from "@/lib/fulfillment";

/**
 * Demo manufacturing store (Phase 11B, §28). With no backend, per-custom-group
 * manufacturing jobs live here in `localStorage`, mirroring the DB shape
 * (`manufacturing_jobs`/`manufacturing_events`/`quality_checks`/`quality_issues`,
 * RLS-scoped when Supabase is configured). It enforces the same invariants a
 * server route would: a job is created ONLY for a CUSTOM group whose fulfillment
 * is `ready_for_next_stage` (§4/§22), transitions go through the state machine
 * with appended events (§6/§9), QC history is append-only (§18), and the customer
 * never writes manufacturing state (§25) — only the owning supplier does.
 */

function validate(value: unknown): ManufacturingJob[] {
  if (!Array.isArray(value)) return [];
  return value.filter((j): j is ManufacturingJob => Boolean(j) && typeof (j as ManufacturingJob).id === "string");
}

const store = createPersistentStore<ManufacturingJob[]>("athathi.manufacturing.v1", [], validate);

function seedFrom(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function findJob(all: readonly ManufacturingJob[], orderId: string, supplierId: string): ManufacturingJob | null {
  return all.find((j) => j.orderId === orderId && j.supplierId === supplierId) ?? null;
}

/** Create the job for a custom group iff its fulfillment is ready + none exists. Idempotent. */
function ensureJob(order: Order, group: SupplierOrderGroup, fulfillment: Fulfillment | null): ManufacturingJob | null {
  const existing = findJob(store.get(), order.id, group.supplierId);
  if (existing) return existing;
  if (!fulfillment) return null;
  const isCustom = groupNeedsManufacturing(group);
  if (!canCreateManufacturing(fulfillment.status, isCustom)) return null;
  const now = Date.now();
  const job = buildManufacturingJob(order, group, fulfillment.id, now, seedFrom(order.id + group.supplierId));
  store.set([job, ...store.get()]);
  manufacturingNotifier.notify({
    audience: "supplier", jobId: job.id, orderNumber: job.orderNumber,
    event: "created", messageKey: "notify.supplier.readyForManufacturing",
  });
  return job;
}

/** Notify the customer on customer-relevant manufacturing milestones (Demo Mode only). */
const CUSTOMER_NOTIFY: ReadonlySet<ManufacturingEventType> = new Set<ManufacturingEventType>([
  "manufacturing_started", "manufacturing_completed", "qc_passed", "ready_for_delivery",
]);

function persist(next: ManufacturingJob, notifyEvent?: ManufacturingEventType) {
  store.set(store.get().map((j) => (j.id === next.id ? next : j)));
  if (notifyEvent && CUSTOMER_NOTIFY.has(notifyEvent)) {
    manufacturingNotifier.notify({
      audience: "customer", jobId: next.id, orderNumber: next.orderNumber,
      event: notifyEvent, messageKey: `notify.customer.${notifyEvent}`,
    });
  }
}

export interface QcIssueInput {
  category: QualityIssueCategory;
  severity: QualityIssueSeverity;
  description: string;
}

// ── Supplier-side hook (manufacturing tab: create-on-open + actions) ──────────

export function useSupplierManufacturing(
  supplierId: string,
  orders: readonly Order[],
  fulfillments: readonly Fulfillment[],
) {
  const all = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);
  const actor = React.useMemo<ManufacturingActor>(() => ({ role: "supplier", id: supplierId }), [supplierId]);

  // Create-on-open: for every custom group of this supplier whose fulfillment is
  // ready, ensure a job exists. Never for catalog groups or not-ready fulfillments.
  React.useEffect(() => {
    for (const order of orders) {
      const group = order.groups.find((g) => g.supplierId === supplierId);
      if (!group || !groupNeedsManufacturing(group)) continue;
      if (findJob(store.get(), order.id, supplierId)) continue;
      const ful = fulfillments.find((f) => f.orderId === order.id && f.supplierId === supplierId) ?? null;
      ensureJob(order, group, ful);
    }
  }, [supplierId, orders, fulfillments]);

  const jobs = React.useMemo(
    () => all.filter((j) => j.supplierId === supplierId).sort((a, b) => b.createdAt - a.createdAt),
    [all, supplierId],
  );

  const withJob = React.useCallback(
    (jobId: string, fn: (j: ManufacturingJob, a: ManufacturingActor, now: number) => { ok: boolean; changed: boolean; job: ManufacturingJob },
     notifyEvent?: ManufacturingEventType): boolean => {
      const current = store.get().find((j) => j.id === jobId);
      if (!current) return false;
      const res = fn(current, actor, Date.now());
      if (!res.ok) return false;
      if (res.changed) persist(res.job, notifyEvent);
      return res.ok;
    },
    [actor],
  );

  const actions = React.useMemo(() => ({
    start: (jobId: string) => withJob(jobId, (j, a, n) => startManufacturing(j, a, n), "manufacturing_started"),
    complete: (jobId: string) => withJob(jobId, (j, a, n) => completeManufacturing(j, a, n), "manufacturing_completed"),
    submitQc: (jobId: string) => withJob(jobId, (j, a, n) => submitForQualityCheck(j, a, n), "qc_started"),
    passQc: (jobId: string, checklist: Partial<Record<QualityCriterion, boolean>>) =>
      withJob(jobId, (j, a, n) => passQualityCheck(j, checklist, a, n), "qc_passed"),
    failQc: (jobId: string, checklist: Partial<Record<QualityCriterion, boolean>>, issues: QcIssueInput[]) =>
      withJob(jobId, (j, a, n) => failQualityCheck(j, checklist, issues, a, n), "qc_failed"),
    startRework: (jobId: string) => withJob(jobId, (j, a, n) => startRework(j, a, n), "rework_started"),
    completeRework: (jobId: string) => withJob(jobId, (j, a, n) => completeRework(j, a, n), "manufacturing_completed"),
    markReady: (jobId: string) => withJob(jobId, (j, a, n) => markReadyForDelivery(j, a, n), "ready_for_delivery"),
    toggleMilestone: (jobId: string, m: ManufacturingMilestone) => {
      const current = store.get().find((j) => j.id === jobId);
      if (!current) return false;
      const next = toggleMilestone(current, m, actor, Date.now());
      if (next !== current) persist(next);
      return true;
    },
  }), [withJob, actor]);

  return { jobs, hydrated, actions };
}

// ── Customer-side hook (READ-ONLY — §25) ──────────────────────────────────────

/** Manufacturing jobs for an order's custom groups (customer timeline). Read-only. */
export function useOrderManufacturing(order: Order | null): { jobs: ManufacturingJob[]; hydrated: boolean } {
  const all = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);
  const jobs = React.useMemo(
    () => (order ? all.filter((j) => j.orderId === order.id) : []),
    [all, order],
  );
  return { jobs, hydrated };
}
