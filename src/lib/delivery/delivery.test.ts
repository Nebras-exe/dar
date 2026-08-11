/**
 * Delivery + installation tests (Phase 12, §35/§43). All pure + deterministic —
 * no external or paid calls; the notifier is a local Demo/Log adapter. Covers:
 * eligibility (custom ready_for_delivery, catalog fulfillment ready), multi-
 * supplier independence, slot validation, scheduling, assignment, out-for-
 * delivery, delivered, failure + reason, reschedule, failed-attempt history,
 * installation required/not-required + scheduling/completion, handover, the
 * completion rule, invalid transitions, ownership, supplier isolation, customer
 * read-only, address-snapshot immutability, the agent read-only boundary, the
 * demo notifier, and the explicit §35 abuse cases.
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { Order, SupplierOrderGroup, OrderItem } from "@/lib/orders";
import {
  groupIsCustom, installationRequiredFor, canCreateDelivery,
  buildDelivery, snapshotAddress,
  scheduleDelivery, assignDelivery, markOutForDelivery, markDelivered,
  markDeliveryFailed, requestReschedule, cancelDelivery,
  scheduleInstallation, startInstallation, completeInstallation, confirmHandover,
  canComplete, buildTracking, summarizeDeliveries,
  canTransitionDelivery, transitionDelivery, isTerminalDelivery, availableDeliveryActions,
  isValidSlot, upcomingDays,
  canReadDelivery, canManageDelivery, canCustomerScheduleDelivery, canCustomerWriteDeliveryStatus,
  AGENT_CAN_MANAGE_DELIVERY, deliveryNotifier, demoAssignment,
  type Delivery, type DeliveryActor, type DeliveryWindow,
} from "./index";

const SUP: DeliveryActor = { role: "supplier", id: "sup-A" };
const CUST: DeliveryActor = { role: "customer", id: "cust-1" };
const NOW = Date.UTC(2026, 7, 20); // fixed "now"
const DAYS = upcomingDays(NOW, 3);
const SLOT: DeliveryWindow = { date: DAYS[0], period: "afternoon" };

function customItem(installFee = 0): OrderItem {
  return {
    kind: "custom", requestId: "r1", quoteId: "q1",
    spec: { category: "sofas", hasReferenceImage: false, quantity: 1 },
    basePrice: 300, deliveryFee: 0, installationFee: installFee, lineTotal: 300 + installFee, quantity: 1,
    manufacturingDays: 21, warrantyText: "1y",
  };
}
function catalogItem(): OrderItem {
  return { kind: "catalog", productId: "p1", slug: "luna", name: "Luna", nameAr: "لونا", category: "sofas" as never, unitPrice: 100, quantity: 1, lineTotal: 100 };
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
    address: { fullName: "Ahmed", phone: "92123456", governorate: "Muscat", wilayat: "Seeb", area: "Al Khoudh", building: "Villa 12", notes: "Gate code 4455" },
    isDemo: true, createdAt: 0, updatedAt: 0, ...over,
  };
}
function fresh(order = makeOrder(), group = order.groups[0]): Delivery {
  return buildDelivery(order, group, NOW, 42);
}
/** Drive a delivery to delivered (no installation). */
function toDelivered(d = fresh()): Delivery {
  d = scheduleDelivery(d, SLOT, CUST, NOW).delivery;
  d = assignDelivery(d, demoAssignment(NOW), SUP, NOW).delivery;
  d = markOutForDelivery(d, SUP, NOW).delivery;
  return markDelivered(d, SUP, NOW).delivery;
}

// ── Eligibility (§5) ──────────────────────────────────────────────────────────

test("eligibility: custom needs manufacturing ready_for_delivery; catalog needs fulfillment ready", () => {
  assert.equal(groupIsCustom(makeGroup({ items: [customItem()] })), true);
  assert.equal(groupIsCustom(makeGroup({ items: [catalogItem()] })), false);
  // custom
  assert.equal(canCreateDelivery(true, null, "ready_for_delivery"), true);
  assert.equal(canCreateDelivery(true, null, "quality_check"), false);
  assert.equal(canCreateDelivery(true, "ready_for_next_stage", "manufacturing"), false); // custom uses mfg, not fulfillment
  // catalog
  assert.equal(canCreateDelivery(false, "ready_for_next_stage", null), true);
  assert.equal(canCreateDelivery(false, "preparing", null), false);
});

test("installation required only when the quote charged an install fee (§20)", () => {
  assert.equal(installationRequiredFor(makeGroup({ installationFee: 0 })), false);
  assert.equal(installationRequiredFor(makeGroup({ installationFee: 25 })), true);
  assert.equal(fresh().installationRequired, false);
  const withInstall = buildDelivery(makeOrder({ groups: [makeGroup({ installationFee: 25 })] }), makeGroup({ installationFee: 25 }), NOW, 1);
  assert.equal(withInstall.installationRequired, true);
});

// ── Address snapshot immutability (§10) ───────────────────────────────────────

test("address snapshot: frozen at creation; later order-address edits don't leak in", () => {
  const order = makeOrder();
  const d = fresh(order);
  assert.deepEqual(snapshotAddress(order.address), d.address);
  // Mutate the order address object afterwards — the snapshot must not change.
  order.address.building = "CHANGED";
  assert.equal(d.address.building, "Villa 12");
  assert.equal(d.address.notes, "Gate code 4455");
});

// ── Slot validation (§11/§12) ─────────────────────────────────────────────────

test("slot validation: rejects past dates, bad formats, impossible ranges", () => {
  assert.equal(isValidSlot({ date: DAYS[0], period: "morning" }, NOW), true);
  assert.equal(isValidSlot({ date: "2020-01-01", period: "morning" }, NOW), false); // past
  assert.equal(isValidSlot({ date: "not-a-date", period: "morning" }, NOW), false);
  assert.equal(isValidSlot({ date: "2026-13-01", period: "morning" }, NOW), false); // bad month
  assert.equal(isValidSlot({ date: "2026-02-31", period: "morning" }, NOW), false); // overflow
  assert.equal(isValidSlot({ date: DAYS[0], period: "midnight" as never }, NOW), false); // bad period
});

test("scheduling rejects an invalid slot", () => {
  const bad = scheduleDelivery(fresh(), { date: "2020-01-01", period: "morning" }, CUST, NOW);
  assert.equal(bad.ok, false);
  assert.equal(bad.error, "invalid-slot");
  assert.equal(bad.delivery.status, "awaiting_schedule");
});

// ── State machine (§7) ────────────────────────────────────────────────────────

test("transitions: valid delivery path", () => {
  assert.equal(canTransitionDelivery("awaiting_schedule", "scheduled"), true);
  assert.equal(canTransitionDelivery("scheduled", "assigned"), true);
  assert.equal(canTransitionDelivery("assigned", "out_for_delivery"), true);
  assert.equal(canTransitionDelivery("out_for_delivery", "delivered"), true);
  assert.equal(canTransitionDelivery("out_for_delivery", "delivery_failed"), true);
  assert.equal(canTransitionDelivery("delivery_failed", "reschedule_required"), true);
  assert.equal(canTransitionDelivery("reschedule_required", "scheduled"), true);
  assert.equal(canTransitionDelivery("delivered", "completed"), true);
});

test("transitions: illegal jumps rejected", () => {
  assert.equal(canTransitionDelivery("awaiting_schedule", "delivered"), false);
  assert.equal(canTransitionDelivery("scheduled", "completed"), false);
  assert.equal(canTransitionDelivery("delivery_failed", "delivered"), false);
  assert.equal(canTransitionDelivery("cancelled", "out_for_delivery"), false);
  assert.equal(transitionDelivery("scheduled", "completed").ok, false);
  assert.equal(isTerminalDelivery("completed"), true);
  assert.equal(isTerminalDelivery("cancelled"), true);
});

test("available actions match state + installation gate", () => {
  assert.deepEqual(availableDeliveryActions("awaiting_schedule", "not_required"), ["schedule"]);
  assert.deepEqual(availableDeliveryActions("scheduled", "not_required"), ["assign", "reschedule"]);
  assert.deepEqual(availableDeliveryActions("assigned", "not_required"), ["mark_out_for_delivery", "reschedule"]);
  assert.deepEqual(availableDeliveryActions("out_for_delivery", "not_required"), ["mark_delivered", "mark_failed"]);
  assert.deepEqual(availableDeliveryActions("delivered", "not_required"), ["complete"]);
  assert.deepEqual(availableDeliveryActions("delivered", "awaiting_schedule"), ["schedule_installation"]);
  assert.deepEqual(availableDeliveryActions("delivered", "in_progress"), ["complete_installation"]);
  assert.deepEqual(availableDeliveryActions("delivered", "completed"), ["complete"]);
});

// ── Happy path: schedule → assign → out → delivered → handover → completed ─────

test("happy path (no installation) reaches completed via handover", () => {
  let d = fresh();
  d = scheduleDelivery(d, SLOT, CUST, NOW).delivery;
  assert.equal(d.status, "scheduled");
  assert.equal(d.window?.period, "afternoon");
  d = assignDelivery(d, demoAssignment(NOW), SUP, NOW).delivery;
  assert.equal(d.status, "assigned");
  assert.equal(d.assignment?.isDemo, true);
  d = markOutForDelivery(d, SUP, NOW).delivery;
  assert.equal(d.status, "out_for_delivery");
  d = markDelivered(d, SUP, NOW).delivery;
  assert.equal(d.status, "delivered");
  assert.equal(d.deliveredAt, NOW);
  assert.equal(d.attempts.at(-1)?.outcome, "delivered");
  const done = confirmHandover(d, SUP, NOW);
  assert.equal(done.ok, true);
  assert.equal(done.delivery.status, "completed");
  assert.ok(done.delivery.handover);
});

// ── Completion rule (§25) ─────────────────────────────────────────────────────

test("completion rule: cannot complete before delivered", () => {
  const scheduled = scheduleDelivery(fresh(), SLOT, CUST, NOW).delivery;
  assert.equal(canComplete(scheduled), false);
  const r = confirmHandover(scheduled, SUP, NOW);
  assert.equal(r.ok, false);
  assert.equal(r.error, "not-delivered");
});

test("completion rule: required installation must be completed first", () => {
  const order = makeOrder({ groups: [makeGroup({ installationFee: 25 })] });
  let d = buildDelivery(order, order.groups[0], NOW, 7);
  assert.equal(d.installationRequired, true);
  d = toDelivered(d); // delivered → installation awaiting_schedule
  assert.equal(d.installation.status, "awaiting_schedule");
  assert.equal(canComplete(d), false);
  const early = confirmHandover(d, SUP, NOW);
  assert.equal(early.ok, false);
  assert.equal(early.error, "installation-required");
  // Do the installation, then complete.
  d = scheduleInstallation(d, SLOT, SUP, NOW).delivery;
  assert.equal(d.installation.status, "scheduled");
  d = startInstallation(d, SUP, NOW).delivery;
  assert.equal(d.installation.status, "in_progress");
  d = completeInstallation(d, SUP, NOW).delivery;
  assert.equal(d.installation.status, "completed");
  assert.equal(canComplete(d), true);
  const done = confirmHandover(d, SUP, NOW);
  assert.equal(done.ok, true);
  assert.equal(done.delivery.status, "completed");
});

// ── Failure + reschedule + history (§19) ──────────────────────────────────────

test("delivery failure requires a reason; history preserved across reschedule", () => {
  let d = fresh();
  d = scheduleDelivery(d, SLOT, CUST, NOW).delivery;
  d = assignDelivery(d, demoAssignment(NOW), SUP, NOW).delivery;
  d = markOutForDelivery(d, SUP, NOW).delivery;
  const noReason = markDeliveryFailed(d, "" as never, SUP, NOW);
  assert.equal(noReason.ok, false);
  d = markDeliveryFailed(d, "customer_unavailable", SUP, NOW).delivery;
  assert.equal(d.status, "delivery_failed");
  assert.equal(d.attempts.at(-1)?.outcome, "failed");
  assert.equal(d.attempts.at(-1)?.reason, "customer_unavailable");
  d = requestReschedule(d, SUP, NOW).delivery;
  assert.equal(d.status, "reschedule_required");
  d = scheduleDelivery(d, { date: DAYS[1], period: "morning" }, CUST, NOW).delivery;
  assert.equal(d.status, "scheduled");
  // The failed attempt remains in history (§19).
  assert.equal(d.attempts.filter((a) => a.outcome === "failed").length, 1);
  d = assignDelivery(d, demoAssignment(NOW), SUP, NOW).delivery;
  d = markOutForDelivery(d, SUP, NOW).delivery;
  d = markDelivered(d, SUP, NOW).delivery;
  assert.equal(d.attempts.length, 2); // failed + delivered both preserved
});

// ── Multi-supplier independence (§9) ──────────────────────────────────────────

test("multi-supplier: each group delivers independently", () => {
  const order = makeOrder({ groups: [makeGroup({ supplierId: "a", supplierName: "A" }), makeGroup({ supplierId: "b", supplierName: "B" })] });
  const a = markOutForDelivery(assignDelivery(scheduleDelivery(fresh(order, order.groups[0]), SLOT, CUST, NOW).delivery, demoAssignment(NOW), SUP, NOW).delivery, SUP, NOW).delivery;
  const b = fresh(order, order.groups[1]);
  assert.equal(a.status, "out_for_delivery");
  assert.equal(b.status, "awaiting_schedule");
  assert.notEqual(a.id, b.id);
});

// ── Tracking (§26/§27) — customer-safe ────────────────────────────────────────

test("tracking: installation stage only when required; rescheduling never leaks a raw code", () => {
  const noInstall = buildTracking(toDelivered());
  assert.equal(noInstall.steps.some((s) => s.stage === "installation"), false);

  let d = fresh();
  d = scheduleDelivery(d, SLOT, CUST, NOW).delivery;
  d = assignDelivery(d, demoAssignment(NOW), SUP, NOW).delivery;
  d = markOutForDelivery(d, SUP, NOW).delivery;
  d = markDeliveryFailed(d, "access_issue", SUP, NOW).delivery;
  const tl = buildTracking(d);
  assert.equal(tl.rescheduling, true);
  assert.equal(JSON.stringify(tl).includes("access_issue"), false); // no raw failure code
});

// ── Summary (§29) ─────────────────────────────────────────────────────────────

test("summary: counts + allCompleted", () => {
  const a = confirmHandover(toDelivered(), SUP, NOW).delivery;
  const b = fresh();
  const s = summarizeDeliveries([a, b]);
  assert.equal(s.total, 2);
  assert.equal(s.completed, 1);
  assert.equal(s.preparing, 1);
  assert.equal(s.allCompleted, false);
  assert.equal(summarizeDeliveries([a]).allCompleted, true);
});

// ── Authorization (§33) + agent boundary (§31) ────────────────────────────────

test("authorization: customer reads own; supplier manages own supplier only", () => {
  const d = fresh(); // customer cust-1, supplier sup-A
  assert.equal(canReadDelivery({ userId: "cust-1", supplierIds: [] }, d), true);
  assert.equal(canReadDelivery({ userId: "u", supplierIds: ["sup-A"] }, d), true);
  assert.equal(canReadDelivery({ userId: "cust-2", supplierIds: ["sup-B"] }, d), false);
  assert.equal(canManageDelivery({ supplierIds: ["sup-A"] }, d), true);
  assert.equal(canManageDelivery({ supplierIds: ["sup-B"] }, d), false);
  assert.equal(canManageDelivery({ supplierIds: [] }, d), false);
  assert.equal(canCustomerScheduleDelivery({ userId: "cust-1" }, d), true);
  assert.equal(canCustomerScheduleDelivery({ userId: "cust-2" }, d), false);
  assert.equal(canCustomerWriteDeliveryStatus(), false);
});

test("agent boundary: read-only, cannot manage delivery", () => {
  assert.equal(AGENT_CAN_MANAGE_DELIVERY, false);
});

// ── Explicit §35 abuse cases ──────────────────────────────────────────────────

test("§35: supplier A cannot manage supplier B delivery (even when transition is valid)", () => {
  const orderB = makeOrder({ groups: [makeGroup({ supplierId: "sup-B", supplierName: "B" })] });
  const dB = fresh(orderB, orderB.groups[0]);
  assert.equal(canManageDelivery({ supplierIds: ["sup-A"] }, dB), false);
  assert.equal(canTransitionDelivery(dB.status, "scheduled"), true); // machine allows...
  assert.equal(canManageDelivery({ supplierIds: ["sup-A"] }, dB), false); // ...authz does not
});

test("§35: customer A cannot read customer B delivery (incl. its phone/address)", () => {
  const d = fresh();
  assert.equal(canReadDelivery({ userId: "cust-2", supplierIds: [] }, d), false);
  // A supplier that is not the delivery's supplier cannot read it either (phone/address protected).
  assert.equal(canReadDelivery({ userId: "u", supplierIds: ["sup-B"] }, d), false);
});

test("§35: mark delivered before out_for_delivery is rejected", () => {
  const scheduled = scheduleDelivery(fresh(), SLOT, CUST, NOW).delivery;
  assert.equal(markDelivered(scheduled, SUP, NOW).ok, false);
});

test("§35: completed is terminal — cannot go back out for delivery", () => {
  const done = confirmHandover(toDelivered(), SUP, NOW).delivery;
  assert.equal(markOutForDelivery(done, SUP, NOW).ok, false);
  assert.equal(canTransitionDelivery("completed", "out_for_delivery"), false);
});

test("§35: cancelled delivery cannot resume", () => {
  const cancelled = cancelDelivery(fresh(), SUP, NOW).delivery;
  assert.equal(cancelled.status, "cancelled");
  assert.equal(scheduleDelivery(cancelled, SLOT, CUST, NOW).ok, false);
});

// ── Demo notifier (§32): records, never delivers ──────────────────────────────

test("demo notifier records a notification and NEVER delivers", () => {
  const before = deliveryNotifier.recorded().length;
  const r = deliveryNotifier.notify({
    audience: "customer", deliveryId: "del-x", orderNumber: "ATH-1", event: "out_for_delivery", messageKey: "notify.customer.out_for_delivery",
  });
  assert.equal(r.delivered, false);
  assert.equal(r.recorded, true);
  assert.equal(r.channel, "demo-log");
  assert.equal(deliveryNotifier.recorded().length, before + 1);
});

test("demo assignment is clearly labelled Demo, not a real driver", () => {
  const a = demoAssignment(NOW);
  assert.equal(a.isDemo, true);
  assert.equal(a.providerId, "demo-team");
  assert.ok(a.assigneeName.toLowerCase().includes("demo"));
});
