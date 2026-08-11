/**
 * Manufacturing + QC tests (Phase 11B, §27/§35). All pure + deterministic — no
 * external or paid calls; the notifier is a local Demo/Log adapter. Covers:
 * custom-only + ready-gated creation, catalog bypass, valid/invalid transitions,
 * completion, QC pass (checklist-complete required), QC fail (issue required),
 * rework loop, second QC, QC history preservation, ready-for-delivery guard,
 * milestones, snapshot reference immutability, ownership, supplier isolation,
 * customer read-only, the agent read-only boundary, the demo notifier, and the
 * explicit §27 cross-tenant abuse cases.
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { Order, SupplierOrderGroup, OrderItem } from "@/lib/orders";
import {
  groupNeedsManufacturing, canCreateManufacturing, buildManufacturingJob,
  startManufacturing, completeManufacturing, submitForQualityCheck,
  passQualityCheck, failQualityCheck, startRework, completeRework, markReadyForDelivery,
  toggleMilestone, openQualityCheck,
  canTransition, transition, isTerminal, availableActions, actionTargetStatus, canEditMilestones,
  buildCustomerTimeline, summarizeManufacturing,
  canReadManufacturing, canManageManufacturing, canCustomerWriteManufacturing,
  AGENT_CAN_MANAGE_MANUFACTURING, manufacturingNotifier,
  QUALITY_CRITERIA,
  type ManufacturingJob, type ManufacturingActor, type QualityCriterion,
} from "./index";

const SUP: ManufacturingActor = { role: "supplier", id: "sup-A" };
const FULL_CHECKLIST: Partial<Record<QualityCriterion, boolean>> =
  Object.fromEntries(QUALITY_CRITERIA.map((c) => [c, true]));

function customItem(over: Partial<Extract<OrderItem, { kind: "custom" }>> = {}): OrderItem {
  return {
    kind: "custom", requestId: "req-1", quoteId: "q-1",
    spec: { category: "sofas", hasReferenceImage: false, quantity: 1, seatCount: 3, material: "oak" as never },
    basePrice: 300, deliveryFee: 0, installationFee: 0, lineTotal: 300, quantity: 1,
    manufacturingDays: 21, warrantyText: "1-year", ...over,
  };
}
function catalogItem(): OrderItem {
  return {
    kind: "catalog", productId: "p1", slug: "luna", name: "Luna", nameAr: "لونا",
    category: "sofas" as never, unitPrice: 100, quantity: 1, lineTotal: 100,
  };
}
function makeGroup(over: Partial<SupplierOrderGroup> = {}): SupplierOrderGroup {
  return {
    supplierId: "sup-A", supplierName: "Studio A", items: [customItem()],
    goodsSubtotal: 300, deliveryFee: 0, installationFee: 0, groupTotal: 300, status: "new", ...over,
  };
}
function makeOrder(over: Partial<Order> = {}): Order {
  const groups = over.groups ?? [makeGroup()];
  return {
    id: "ord-1", orderNumber: "ATH-000001", customerId: "cust-1", source: "accepted_quote",
    status: "confirmed", groups,
    totals: { goodsSubtotal: 300, deliveryTotal: 0, installationTotal: 0, grandTotal: 300, itemCount: 1, supplierCount: groups.length },
    address: { fullName: "A", phone: "92123456", governorate: "M", wilayat: "S", area: "", building: "x" },
    isDemo: true, createdAt: 0, updatedAt: 0, ...over,
  };
}
function fresh(order = makeOrder(), group = order.groups[0]): ManufacturingJob {
  return buildManufacturingJob(order, group, "ful-1", 1000, 42);
}
/** Drive a job all the way to quality_check. */
function toQualityCheck(job = fresh()): ManufacturingJob {
  let j = startManufacturing(job, SUP, 2000).job;
  j = completeManufacturing(j, SUP, 3000).job;
  return submitForQualityCheck(j, SUP, 4000).job;
}

// ── Custom-only + ready-gated creation (§4/§22) ───────────────────────────────

test("catalog bypass: a catalog-only group never needs manufacturing", () => {
  assert.equal(groupNeedsManufacturing(makeGroup({ items: [catalogItem()] })), false);
  assert.equal(groupNeedsManufacturing(makeGroup({ items: [customItem()] })), true);
});

test("creation gate: custom + fulfillment ready_for_next_stage only", () => {
  assert.equal(canCreateManufacturing("ready_for_next_stage", true), true);
  assert.equal(canCreateManufacturing("ready_for_next_stage", false), false); // catalog
  for (const s of ["awaiting_supplier", "accepted", "preparing", "declined", "cancelled"] as const) {
    assert.equal(canCreateManufacturing(s, true), false); // not ready yet
  }
});

test("creation: job starts not_started with estimate + created event", () => {
  const j = fresh();
  assert.equal(j.status, "not_started");
  assert.equal(j.estimateDays, 21);
  assert.equal(j.supplierId, "sup-A");
  assert.equal(j.fulfillmentId, "ful-1");
  assert.deepEqual(j.events.map((e) => e.type), ["created"]);
  assert.equal(j.qualityChecks.length, 0);
});

// ── State machine (§6) ────────────────────────────────────────────────────────

test("transitions: valid production + QC path", () => {
  assert.equal(canTransition("not_started", "manufacturing"), true);
  assert.equal(canTransition("manufacturing", "manufacturing_completed"), true);
  assert.equal(canTransition("manufacturing_completed", "quality_check"), true);
  assert.equal(canTransition("quality_check", "qc_passed"), true);
  assert.equal(canTransition("quality_check", "qc_failed"), true);
  assert.equal(canTransition("qc_passed", "ready_for_delivery"), true);
  assert.equal(canTransition("qc_failed", "rework"), true);
  assert.equal(canTransition("rework", "manufacturing_completed"), true);
});

test("transitions: illegal jumps rejected", () => {
  assert.equal(canTransition("not_started", "qc_passed"), false);
  assert.equal(canTransition("manufacturing", "ready_for_delivery"), false);
  assert.equal(canTransition("qc_failed", "ready_for_delivery"), false);
  assert.equal(canTransition("ready_for_delivery", "manufacturing"), false);
  assert.equal(canTransition("not_started", "quality_check"), false);
  assert.equal(transition("manufacturing", "ready_for_delivery").ok, false);
  assert.equal(isTerminal("ready_for_delivery"), true);
});

test("available actions match the machine", () => {
  assert.deepEqual(availableActions("not_started"), ["start_manufacturing"]);
  assert.deepEqual(availableActions("manufacturing"), ["complete_manufacturing"]);
  assert.deepEqual(availableActions("manufacturing_completed"), ["submit_for_qc"]);
  assert.deepEqual(availableActions("quality_check"), ["qc_pass", "qc_fail"]);
  assert.deepEqual(availableActions("qc_passed"), ["mark_ready_for_delivery"]);
  assert.deepEqual(availableActions("qc_failed"), ["start_rework"]);
  assert.deepEqual(availableActions("rework"), ["complete_rework"]);
  assert.deepEqual(availableActions("ready_for_delivery"), []);
  assert.equal(actionTargetStatus("mark_ready_for_delivery"), "ready_for_delivery");
});

// ── Happy path + QC pass (§11–§15/§19) ────────────────────────────────────────

test("happy path: start → complete → QC → pass → ready for delivery", () => {
  let j = fresh();
  j = startManufacturing(j, SUP, 2000).job;
  assert.equal(j.status, "manufacturing");
  j = completeManufacturing(j, SUP, 3000).job;
  assert.equal(j.status, "manufacturing_completed");
  j = submitForQualityCheck(j, SUP, 4000).job;
  assert.equal(j.status, "quality_check");
  assert.equal(j.qualityChecks.length, 1);
  assert.equal(openQualityCheck(j)?.attempt, 1);
  const pass = passQualityCheck(j, FULL_CHECKLIST, SUP, 5000);
  assert.equal(pass.ok, true);
  j = pass.job;
  assert.equal(j.status, "qc_passed");
  assert.equal(j.qualityChecks[0].status, "passed");
  const rfd = markReadyForDelivery(j, SUP, 6000);
  assert.equal(rfd.ok, true);
  assert.equal(rfd.job.status, "ready_for_delivery");
  assert.deepEqual(j.events.map((e) => e.type), [
    "created", "manufacturing_started", "manufacturing_completed", "qc_started", "qc_passed",
  ]);
});

test("QC pass requires ALL checklist criteria", () => {
  const j = toQualityCheck();
  const incomplete = { ...FULL_CHECKLIST, no_damage: false };
  const r = passQualityCheck(j, incomplete, SUP, 5000);
  assert.equal(r.ok, false);
  assert.equal(r.error, "checklist-incomplete");
  assert.equal(r.job.status, "quality_check"); // unchanged
});

test("ready-for-delivery guard: cannot skip QC pass", () => {
  const j = toQualityCheck(); // status quality_check
  assert.equal(markReadyForDelivery(j, SUP, 5000).ok, false);
  const completed = completeManufacturing(startManufacturing(fresh(), SUP, 2000).job, SUP, 3000).job;
  assert.equal(markReadyForDelivery(completed, SUP, 4000).ok, false); // not even QC'd
});

test("cannot pass QC before manufacturing complete / QC opened", () => {
  const producing = startManufacturing(fresh(), SUP, 2000).job; // manufacturing
  const r = passQualityCheck(producing, FULL_CHECKLIST, SUP, 3000);
  assert.equal(r.ok, false);
  assert.equal(r.error, "invalid-transition");
});

// ── QC fail + rework + second QC + history (§16/§17/§18) ──────────────────────

test("QC fail requires a structured issue; records it", () => {
  const j = toQualityCheck();
  const noIssues = failQualityCheck(j, FULL_CHECKLIST, [], SUP, 5000);
  assert.equal(noIssues.ok, false);
  assert.equal(noIssues.error, "issue-required");
  const failed = failQualityCheck(j, { ...FULL_CHECKLIST, correct_finish: false },
    [{ category: "finish", severity: "major", description: "wrong sheen" }], SUP, 5000);
  assert.equal(failed.ok, true);
  assert.equal(failed.job.status, "qc_failed");
  assert.equal(failed.job.qualityChecks[0].status, "failed");
  assert.equal(failed.job.qualityChecks[0].issues[0].category, "finish");
});

test("rework loop → second QC → pass; failed QC #1 preserved (§18)", () => {
  let j = toQualityCheck();
  j = failQualityCheck(j, FULL_CHECKLIST, [{ category: "finish", severity: "major", description: "wrong sheen" }], SUP, 5000).job;
  assert.equal(j.status, "qc_failed");
  j = startRework(j, SUP, 6000).job;
  assert.equal(j.status, "rework");
  j = completeRework(j, SUP, 7000).job;
  assert.equal(j.status, "manufacturing_completed");
  j = submitForQualityCheck(j, SUP, 8000).job; // opens QC #2
  assert.equal(j.status, "quality_check");
  assert.equal(j.qualityChecks.length, 2);
  assert.equal(openQualityCheck(j)?.attempt, 2);
  j = passQualityCheck(j, FULL_CHECKLIST, SUP, 9000).job;
  assert.equal(j.status, "qc_passed");
  // History preserved: QC #1 still failed, QC #2 passed (§18).
  assert.equal(j.qualityChecks[0].status, "failed");
  assert.equal(j.qualityChecks[0].issues.length, 1);
  assert.equal(j.qualityChecks[1].status, "passed");
  // rework_completed recorded distinctly from the first completion.
  assert.equal(j.events.filter((e) => e.type === "rework_completed").length, 1);
});

test("duplicate QC submission does not open a second concurrent attempt (§27)", () => {
  const j = toQualityCheck();
  const again = submitForQualityCheck(j, SUP, 5000);
  assert.equal(again.changed, false);
  assert.equal(again.job.qualityChecks.length, 1);
});

test("duplicate transition is an idempotent no-op", () => {
  const j = startManufacturing(fresh(), SUP, 2000).job;
  const again = startManufacturing(j, SUP, 3000);
  assert.equal(again.ok, true);
  assert.equal(again.changed, false);
  assert.equal(again.job.events.filter((e) => e.type === "manufacturing_started").length, 1);
});

// ── Milestones (§12) ──────────────────────────────────────────────────────────

test("milestones: editable only while producing; genuine (no fake %)", () => {
  assert.equal(canEditMilestones("manufacturing"), true);
  assert.equal(canEditMilestones("rework"), true);
  assert.equal(canEditMilestones("not_started"), false);
  const producing = startManufacturing(fresh(), SUP, 2000).job;
  const withM = toggleMilestone(producing, "frame", SUP, 2500);
  assert.deepEqual(withM.milestones, ["frame"]);
  assert.equal(withM.events.at(-1)!.type, "milestone_reached");
  const toggledOff = toggleMilestone(withM, "frame", SUP, 2600);
  assert.deepEqual(toggledOff.milestones, []);
  // Not editable at not_started → no change.
  assert.deepEqual(toggleMilestone(fresh(), "frame", SUP, 2000).milestones, []);
});

// ── Customer timeline (§20) — never exposes issues/notes ──────────────────────

test("timeline: qc_failed/rework shows calm 'quality review', not the failure", () => {
  let j = toQualityCheck();
  j = failQualityCheck(j, FULL_CHECKLIST, [{ category: "damage", severity: "major", description: "scratch on arm" }], SUP, 5000).job;
  const tl = buildCustomerTimeline(j);
  assert.equal(tl.inQualityReview, true);
  const qcStep = tl.steps.find((s) => s.stage === "quality_check")!;
  assert.equal(qcStep.state, "current");
  // The customer-safe timeline never contains issue text.
  assert.equal(JSON.stringify(tl).includes("scratch on arm"), false);
});

test("timeline: ready_for_delivery marks the final stage", () => {
  let j = toQualityCheck();
  j = passQualityCheck(j, FULL_CHECKLIST, SUP, 5000).job;
  j = markReadyForDelivery(j, SUP, 6000).job;
  const byStage = Object.fromEntries(buildCustomerTimeline(j).steps.map((s) => [s.stage, s.state]));
  assert.equal(byStage.manufacturing, "done");
  assert.equal(byStage.quality_check, "done");
  assert.equal(byStage.ready_for_delivery, "done");
});

// ── Summary (§23) ─────────────────────────────────────────────────────────────

test("summary: counts per bucket + allReady", () => {
  const a = markReadyForDelivery(passQualityCheck(toQualityCheck(), FULL_CHECKLIST, SUP, 5000).job, SUP, 6000).job;
  const b = startManufacturing(fresh(), SUP, 2000).job;
  const s = summarizeManufacturing([a, b]);
  assert.equal(s.total, 2);
  assert.equal(s.readyForDelivery, 1);
  assert.equal(s.inProduction, 1);
  assert.equal(s.allReady, false);
  assert.equal(summarizeManufacturing([a]).allReady, true);
});

// ── Snapshot reference (§7/§8) ────────────────────────────────────────────────

test("snapshot: the job references the group; it never duplicates the priced spec", () => {
  const j = fresh();
  assert.equal("spec" in j, false);
  assert.equal("items" in j, false);
  assert.equal(j.orderId, "ord-1");
  assert.equal(j.supplierId, "sup-A");
});

// ── Authorization (§25) + agent boundary (§23) ────────────────────────────────

test("authorization: customer reads own; supplier reads/manages own supplier only", () => {
  const j = fresh(); // customer cust-1, supplier sup-A
  assert.equal(canReadManufacturing({ userId: "cust-1", supplierIds: [] }, j), true);
  assert.equal(canReadManufacturing({ userId: "u", supplierIds: ["sup-A"] }, j), true);
  assert.equal(canReadManufacturing({ userId: "cust-2", supplierIds: ["sup-B"] }, j), false);
  assert.equal(canManageManufacturing({ supplierIds: ["sup-A"] }, j), true);
  assert.equal(canManageManufacturing({ supplierIds: ["sup-B"] }, j), false);
  assert.equal(canManageManufacturing({ supplierIds: [] }, j), false); // customer/none
  assert.equal(canCustomerWriteManufacturing(), false);
});

test("agent boundary: read-only, cannot manage manufacturing", () => {
  assert.equal(AGENT_CAN_MANAGE_MANUFACTURING, false);
});

// ── Explicit §27 cross-tenant abuse cases ─────────────────────────────────────

test("§27: supplier A cannot manage supplier B's job (even though the transition is valid)", () => {
  const orderB = makeOrder({ groups: [makeGroup({ supplierId: "sup-B", supplierName: "B" })] });
  const jB = fresh(orderB, orderB.groups[0]);
  assert.equal(canManageManufacturing({ supplierIds: ["sup-A"] }, jB), false);
  assert.equal(canTransition(jB.status, "manufacturing"), true); // machine allows...
  assert.equal(canManageManufacturing({ supplierIds: ["sup-A"] }, jB), false); // ...authz does not
});

test("§27: customer A cannot read customer B's job; customer never writes", () => {
  const j = fresh();
  assert.equal(canReadManufacturing({ userId: "cust-2", supplierIds: [] }, j), false);
  assert.equal(canCustomerWriteManufacturing(), false);
});

test("§27: a passed job cannot regress to manufacturing", () => {
  let j = passQualityCheck(toQualityCheck(), FULL_CHECKLIST, SUP, 5000).job;
  j = markReadyForDelivery(j, SUP, 6000).job;
  assert.equal(startManufacturing(j, SUP, 7000).ok, false); // ready_for_delivery terminal
  assert.equal(canTransition("ready_for_delivery", "manufacturing"), false);
});

// ── Notification abstraction (§24): records, never delivers ───────────────────

test("demo notifier records a notification and NEVER delivers", () => {
  const before = manufacturingNotifier.recorded().length;
  const r = manufacturingNotifier.notify({
    audience: "customer", jobId: "mfg-x", orderNumber: "ATH-1", event: "manufacturing_started", messageKey: "notify.customer.manufacturing_started",
  });
  assert.equal(r.delivered, false);
  assert.equal(r.recorded, true);
  assert.equal(r.channel, "demo-log");
  assert.equal(manufacturingNotifier.recorded().length, before + 1);
});
