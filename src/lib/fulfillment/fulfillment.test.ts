/**
 * Fulfillment tests (Phase 11A, §28/§35). All pure + deterministic — no external
 * or paid calls; the notifier is a local Demo/Log adapter that never sends.
 * Covers: paid-only creation, unpaid rejection, per-supplier independent state,
 * valid + invalid transitions, duplicate-action idempotency, accept/decline
 * (+reason required), preparing, ready, timeline derivation, ownership, supplier
 * isolation, event history, custom + catalog snapshot references, the agent
 * read-only boundary, and the demo notifier (records, never delivers).
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { Order, SupplierOrderGroup } from "@/lib/orders";
import {
  canCreateFulfillment, buildFulfillment, applyTransition,
  acceptFulfillment, declineFulfillment, startPreparing, markReady, cancelFulfillment,
  canTransition, transition, isTerminal, availableSupplierActions, actionTargetStatus,
  buildTimeline, summarizeFulfillment, isDeclineReason,
  canReadFulfillment, canManageFulfillment, canCustomerWriteFulfillment,
  AGENT_CAN_MANAGE_FULFILLMENT,
  demoNotifier,
  type Fulfillment, type FulfillmentActor,
} from "./index";

const SUPPLIER: FulfillmentActor = { role: "supplier", id: "sup-A" };
const SYSTEM: FulfillmentActor = { role: "system" };

function makeGroup(over: Partial<SupplierOrderGroup> = {}): SupplierOrderGroup {
  return {
    supplierId: "sup-A", supplierName: "Studio A", items: [],
    goodsSubtotal: 100, deliveryFee: 0, installationFee: 0, groupTotal: 100, status: "new",
    ...over,
  };
}
function makeOrder(over: Partial<Order> = {}): Order {
  const groups = over.groups ?? [makeGroup()];
  return {
    id: "ord-1", orderNumber: "ATH-000001", customerId: "cust-1", source: "cart",
    status: "confirmed", groups, totals: { goodsSubtotal: 100, deliveryTotal: 0, installationTotal: 0, grandTotal: 100, itemCount: 1, supplierCount: groups.length },
    address: { fullName: "A", phone: "92123456", governorate: "M", wilayat: "S", area: "", building: "x" },
    isDemo: true, createdAt: 0, updatedAt: 0, ...over,
  };
}
function fresh(order = makeOrder(), group = order.groups[0], now = 1000): Fulfillment {
  return buildFulfillment(order, group, now, 42);
}

// ── Paid-only entry (§4/§30) ──────────────────────────────────────────────────

test("creation: only a PAID order may enter fulfillment", () => {
  assert.equal(canCreateFulfillment("paid"), true);
  for (const s of ["not_started", "pending", "failed", "cancelled", "authorized"] as const) {
    assert.equal(canCreateFulfillment(s), false);
  }
});

test("creation: fresh fulfillment starts awaiting_supplier with seeded history", () => {
  const f = fresh();
  assert.equal(f.status, "awaiting_supplier");
  assert.equal(f.supplierId, "sup-A");
  assert.equal(f.orderNumber, "ATH-000001");
  // Seeded audit trail: order paid → supplier notified (§9).
  assert.deepEqual(f.events.map((e) => e.type), ["order_paid", "supplier_notified"]);
  assert.equal(f.events.every((e) => e.actor.role === "system"), true);
});

// ── Per-supplier independent state (§6) ───────────────────────────────────────

test("multi-supplier: each group has its OWN fulfillment state", () => {
  const order = makeOrder({
    groups: [makeGroup({ supplierId: "sup-A", supplierName: "A" }), makeGroup({ supplierId: "sup-B", supplierName: "B" })],
  });
  const a = fresh(order, order.groups[0]);
  const b = fresh(order, order.groups[1]);
  const acceptedA = acceptFulfillment(a, { role: "supplier", id: "sup-A" }, 2000).fulfillment;
  assert.equal(acceptedA.status, "accepted");
  assert.equal(b.status, "awaiting_supplier"); // B untouched
  assert.notEqual(acceptedA.id, b.id);
});

// ── State machine: valid + invalid transitions (§16) ──────────────────────────

test("transitions: valid path awaiting → accepted → preparing → ready", () => {
  assert.equal(canTransition("awaiting_supplier", "accepted"), true);
  assert.equal(canTransition("accepted", "preparing"), true);
  assert.equal(canTransition("preparing", "ready_for_next_stage"), true);
  assert.equal(canTransition("awaiting_supplier", "declined"), true);
});

test("transitions: invalid jumps are rejected", () => {
  assert.equal(canTransition("awaiting_supplier", "ready_for_next_stage"), false); // skips steps
  assert.equal(canTransition("awaiting_supplier", "preparing"), false);
  assert.equal(canTransition("declined", "preparing"), false);
  assert.equal(canTransition("ready_for_next_stage", "awaiting_supplier"), false); // no regress
  assert.equal(canTransition("accepted", "accepted"), false); // no self-loop
  assert.equal(transition("declined", "preparing").ok, false);
});

test("transitions: terminal states", () => {
  assert.equal(isTerminal("ready_for_next_stage"), true);
  assert.equal(isTerminal("declined"), true);
  assert.equal(isTerminal("cancelled"), true);
  assert.equal(isTerminal("awaiting_supplier"), false);
  assert.equal(isTerminal("accepted"), false);
});

test("available actions match the machine", () => {
  assert.deepEqual(availableSupplierActions("awaiting_supplier"), ["accept", "decline"]);
  assert.deepEqual(availableSupplierActions("accepted"), ["start_preparing"]);
  assert.deepEqual(availableSupplierActions("preparing"), ["mark_ready"]);
  assert.deepEqual(availableSupplierActions("ready_for_next_stage"), []);
  assert.equal(actionTargetStatus("accept"), "accepted");
  assert.equal(actionTargetStatus("mark_ready"), "ready_for_next_stage");
});

// ── applyTransition: gating, events, idempotency (§35) ────────────────────────

test("applyTransition: invalid jump leaves fulfillment unchanged", () => {
  const f = fresh();
  const r = applyTransition(f, "ready_for_next_stage", SUPPLIER, 2000);
  assert.equal(r.ok, false);
  assert.equal(r.error, "invalid-transition");
  assert.equal(r.fulfillment.status, "awaiting_supplier");
  assert.equal(r.fulfillment.events.length, 2); // no event appended
});

test("duplicate accept is idempotent (no duplicate event)", () => {
  const f = fresh();
  const once = acceptFulfillment(f, SUPPLIER, 2000);
  assert.equal(once.ok, true);
  assert.equal(once.changed, true);
  const twice = acceptFulfillment(once.fulfillment, SUPPLIER, 3000);
  assert.equal(twice.ok, true);
  assert.equal(twice.changed, false); // idempotent no-op
  assert.equal(twice.fulfillment.events.filter((e) => e.type === "accepted").length, 1);
});

test("accept records acceptance + an audit event", () => {
  const r = acceptFulfillment(fresh(), SUPPLIER, 2000);
  assert.equal(r.fulfillment.status, "accepted");
  assert.equal(r.fulfillment.acceptance?.at, 2000);
  assert.equal(r.fulfillment.acceptance?.by.id, "sup-A");
  assert.equal(r.fulfillment.events.at(-1)!.type, "accepted");
});

// ── Decline (§12) ─────────────────────────────────────────────────────────────

test("decline requires a valid structured reason", () => {
  const f = fresh();
  // Missing/invalid reason → rejected.
  const bad = applyTransition(f, "declined", SUPPLIER, 2000, {});
  assert.equal(bad.ok, false);
  assert.equal(bad.error, "reason-required");
  assert.equal(isDeclineReason("capacity_issue"), true);
  assert.equal(isDeclineReason("nope"), false);
});

test("decline stores reason; internal note is NOT exposed in the event/timeline", () => {
  const r = declineFulfillment(fresh(), SUPPLIER, "inventory_issue", 2000, "secret ops note");
  assert.equal(r.fulfillment.status, "declined");
  assert.equal(r.fulfillment.decline?.reason, "inventory_issue");
  assert.equal(r.fulfillment.decline?.internalNote, "secret ops note");
  // The audit event carries only the SAFE reason key, never the internal note (§12).
  const ev = r.fulfillment.events.at(-1)!;
  assert.equal(ev.type, "declined");
  assert.equal(ev.note, "inventory_issue");
  assert.notEqual(ev.note, "secret ops note");
  // The customer-facing timeline exposes the reason label only.
  const tl = buildTimeline(r.fulfillment);
  assert.equal(tl.declineReason, "inventory_issue");
  assert.equal(JSON.stringify(tl).includes("secret ops note"), false);
});

// ── Preparing + ready (§14/§15) ───────────────────────────────────────────────

test("full happy path: accept → preparing → ready", () => {
  let f = fresh();
  f = acceptFulfillment(f, SUPPLIER, 2000).fulfillment;
  const prep = startPreparing(f, SUPPLIER, 3000);
  assert.equal(prep.ok, true);
  f = prep.fulfillment;
  assert.equal(f.status, "preparing");
  const ready = markReady(f, SUPPLIER, 4000);
  assert.equal(ready.ok, true);
  f = ready.fulfillment;
  assert.equal(f.status, "ready_for_next_stage");
  assert.deepEqual(f.events.map((e) => e.type), [
    "order_paid", "supplier_notified", "accepted", "preparing_started", "ready_for_next_stage",
  ]);
});

test("cannot start preparing from awaiting or from declined", () => {
  assert.equal(startPreparing(fresh(), SUPPLIER, 2000).ok, false);
  const declined = declineFulfillment(fresh(), SUPPLIER, "other", 2000).fulfillment;
  assert.equal(startPreparing(declined, SUPPLIER, 3000).ok, false);
});

// ── Timeline (§17/§18) ────────────────────────────────────────────────────────

test("timeline: current stage explicit, future upcoming", () => {
  const f = acceptFulfillment(fresh(), SUPPLIER, 2000).fulfillment;
  const tl = buildTimeline(f);
  const byStage = Object.fromEntries(tl.steps.map((s) => [s.stage, s.state]));
  assert.equal(byStage.paid, "done");
  assert.equal(byStage.awaiting_supplier, "done");
  assert.equal(byStage.accepted, "current");
  assert.equal(byStage.preparing, "upcoming");
  assert.equal(byStage.ready_for_next_stage, "upcoming");
  // Reached stages carry a timestamp from the event history.
  assert.equal(tl.steps.find((s) => s.stage === "accepted")!.at, 2000);
});

test("timeline: declined shows a declined marker, not further progress", () => {
  const f = declineFulfillment(fresh(), SUPPLIER, "capacity_issue", 2000).fulfillment;
  const tl = buildTimeline(f);
  const byStage = Object.fromEntries(tl.steps.map((s) => [s.stage, s.state]));
  assert.equal(byStage.paid, "done");
  assert.equal(byStage.awaiting_supplier, "declined");
  assert.equal(byStage.accepted, "upcoming");
});

test("timeline: cancelled marks the interrupted stage", () => {
  let f = acceptFulfillment(fresh(), SUPPLIER, 2000).fulfillment;
  f = cancelFulfillment(f, SYSTEM, 3000).fulfillment;
  const tl = buildTimeline(f);
  const byStage = Object.fromEntries(tl.steps.map((s) => [s.stage, s.state]));
  assert.equal(byStage.accepted, "done");
  assert.equal(byStage.preparing, "cancelled");
});

// ── Order-level summary (§19) ─────────────────────────────────────────────────

test("summary: counts per status + allReady", () => {
  const order = makeOrder({
    groups: [makeGroup({ supplierId: "a" }), makeGroup({ supplierId: "b" }), makeGroup({ supplierId: "c" })],
  });
  const a = acceptFulfillment(fresh(order, order.groups[0]), SUPPLIER, 1).fulfillment;
  const b = acceptFulfillment(fresh(order, order.groups[1]), SUPPLIER, 1).fulfillment;
  const c = fresh(order, order.groups[2]);
  const s = summarizeFulfillment([a, b, c]);
  assert.equal(s.total, 3);
  assert.equal(s.accepted, 2);
  assert.equal(s.awaiting, 1);
  assert.equal(s.allReady, false);

  const r1 = markReady(startPreparing(a, SUPPLIER, 2).fulfillment, SUPPLIER, 3).fulfillment;
  const r2 = markReady(startPreparing(b, SUPPLIER, 2).fulfillment, SUPPLIER, 3).fulfillment;
  const r3 = markReady(startPreparing(acceptFulfillment(c, SUPPLIER, 1).fulfillment, SUPPLIER, 2).fulfillment, SUPPLIER, 3).fulfillment;
  assert.equal(summarizeFulfillment([r1, r2, r3]).allReady, true);
});

// ── Authorization (§26) + agent boundary (§25) ────────────────────────────────

test("authorization: customer reads own; supplier reads/manages own group only", () => {
  const f = fresh(); // customer cust-1, supplier sup-A
  const customer = { userId: "cust-1", supplierIds: [] as string[] };
  const supA = { userId: "u-a", supplierIds: ["sup-A"] };
  const supB = { userId: "u-b", supplierIds: ["sup-B"] };

  assert.equal(canReadFulfillment(customer, f), true);
  assert.equal(canReadFulfillment(supA, f), true);
  assert.equal(canReadFulfillment(supB, f), false); // other supplier cannot read

  assert.equal(canManageFulfillment(supA, f), true);
  assert.equal(canManageFulfillment(supB, f), false); // supplier A's record, B cannot mutate
  assert.equal(canManageFulfillment(customer, f), false); // customer never manages
  assert.equal(canCustomerWriteFulfillment(), false);
});

test("agent boundary: read-only, cannot manage fulfillment", () => {
  assert.equal(AGENT_CAN_MANAGE_FULFILLMENT, false);
});

// ── Explicit §28 cross-tenant abuse cases ─────────────────────────────────────

test("§28: customer A cannot read customer B's fulfillment", () => {
  const f = fresh(); // belongs to cust-1
  const otherCustomer = { userId: "cust-2", supplierIds: [] as string[] };
  assert.equal(canReadFulfillment(otherCustomer, f), false);
});

test("§28: supplier A cannot accept/decline supplier B's fulfillment", () => {
  const orderB = makeOrder({ groups: [makeGroup({ supplierId: "sup-B", supplierName: "B" })] });
  const fB = fresh(orderB, orderB.groups[0]);
  const supA = { supplierIds: ["sup-A"] };
  // Authorization refuses even though the state-machine transition itself is valid.
  assert.equal(canManageFulfillment(supA, fB), false);
  assert.equal(canTransition(fB.status, "accepted"), true); // machine allows...
  assert.equal(canManageFulfillment(supA, fB), false);      // ...but authz does not
});

test("§28: a spoofed supplierId does not grant management rights", () => {
  const f = fresh(); // sup-A
  // A principal that is only a member of sup-B cannot manage sup-A's record.
  assert.equal(canManageFulfillment({ supplierIds: ["sup-B"] }, f), false);
  assert.equal(canManageFulfillment({ supplierIds: ["sup-A"] }, f), true);
});

test("§28: an unpaid order can never create a fulfillment", () => {
  for (const s of ["not_started", "pending", "requires_action", "authorized", "failed", "cancelled", "expired"] as const) {
    assert.equal(canCreateFulfillment(s), false);
  }
});

test("§28: a declined fulfillment cannot be resurrected to preparing/ready", () => {
  const declined = declineFulfillment(fresh(), SUPPLIER, "capacity_issue", 2000).fulfillment;
  assert.equal(applyTransition(declined, "preparing", SUPPLIER, 3000).ok, false);
  assert.equal(applyTransition(declined, "ready_for_next_stage", SUPPLIER, 3000).ok, false);
  assert.equal(applyTransition(declined, "accepted", SUPPLIER, 3000).ok, false);
});

// ── Snapshot reference (§8/§24): fulfillment never stores priced lines ─────────

test("snapshot: fulfillment references the group by id, not a re-read price", () => {
  const f = fresh();
  // The fulfillment carries no item/price fields — the purchase contract stays on the order.
  assert.equal("items" in f, false);
  assert.equal("groupTotal" in f, false);
  assert.equal(f.supplierId, "sup-A");
  assert.equal(f.orderId, "ord-1");
});

test("custom-order handoff preserves the source for the manufacturing note (§23)", () => {
  const order = makeOrder({ source: "accepted_quote" });
  const f = fresh(order, order.groups[0]);
  assert.equal(f.orderSource, "accepted_quote");
});

// ── Notification abstraction (§20/§30): records, never delivers ────────────────

test("demo notifier records a notification and NEVER delivers", () => {
  const before = demoNotifier.recorded().length;
  const receipt = demoNotifier.notify({
    audience: "supplier", fulfillmentId: "ful-x", orderNumber: "ATH-1", event: "order_paid", messageKey: "notify.supplier.newOrder",
  });
  assert.equal(receipt.delivered, false); // no external message sent (§30)
  assert.equal(receipt.recorded, true);
  assert.equal(receipt.channel, "demo-log");
  assert.equal(demoNotifier.recorded().length, before + 1);
});
