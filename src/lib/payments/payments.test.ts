/**
 * Payments tests (Phase 10B, §35). All pure — no external/paid calls; the Demo
 * provider is deterministic + offline. Covers: intent creation, server-side
 * amount authority (client override rejected), idempotency + duplicate-intent
 * reuse, demo success + demo failure, verification, invalid transitions, paid
 * replay rejection, ownership, supplier-safe view, and the agent-cannot-pay
 * boundary.
 */

import test, { before, after } from "node:test";
import assert from "node:assert/strict";

import { __setCatalogProductsForTests, __resetCatalogProductsForTests } from "@/lib/catalog";
import { makeProduct } from "@/lib/catalog/test-fixtures";
import { buildCartDraft } from "@/lib/orders";
import type { Order } from "@/lib/orders";

// The real catalog is empty; use a fixed-price fixture so totals stay exact.
const PAY_SOFA = "test-pay-sofa"; // 320
before(() => __setCatalogProductsForTests([
  makeProduct({ slug: PAY_SOFA, category: "sofas", price: 320, colors: ["beige"], materials: ["boucle"], styleTags: ["warm-modern"], roomTypes: ["living-room"], supplier: "DAR Studio Collection" }),
]));
after(() => __resetCatalogProductsForTests());
import {
  buildIntent, assertOrderAmount, findReusableIntent, applyStatus, markPending,
  canTransition, transition, isTerminal, isPaid, canRetry,
  canPayOrder, canReadIntent, supplierPaymentView, AGENT_CAN_PAY,
  demoPaymentProvider,
  type PaymentIntent,
} from "./index";

// A confirmed order (from Phase 10A) to pay for.
function makeOrder(over: Partial<Order> = {}): Order {
  const draft = buildCartDraft([{ slug: PAY_SOFA, quantity: 2 }]); // 640
  return {
    id: "ord-1", orderNumber: "ATH-000001", customerId: "cust-1", source: "cart",
    status: "confirmed", groups: draft.groups, totals: draft.totals,
    address: { fullName: "A", phone: "92123456", governorate: "M", wilayat: "S", area: "", building: "x" },
    isDemo: true, createdAt: 0, updatedAt: 0, ...over,
  };
}

// ── Intent creation + server-side amount authority (§8/§15) ───────────────────

test("intent: amount is the ORDER's grand total (never client-supplied)", () => {
  const order = makeOrder();
  const intent = buildIntent(order, "demo", "demo", 1000, 42);
  assert.equal(intent.amount, order.totals.grandTotal); // 640
  assert.equal(intent.amount, 640);
  assert.equal(intent.currency, "OMR");
  assert.equal(intent.status, "not_started");
  assert.equal(intent.idempotencyKey, order.id);
  assert.equal(intent.isDemo, true);
});

test("amount authority: a client-claimed amount that differs is rejected", () => {
  const order = makeOrder(); // total 640
  assert.equal(assertOrderAmount(order, 640), true);
  assert.equal(assertOrderAmount(order, 1), false); // tampered lower
  assert.equal(assertOrderAmount(order, 999999), false); // tampered higher
  assert.equal(assertOrderAmount(order, "640"), false); // wrong type
  assert.equal(assertOrderAmount(order, undefined), false);
});

// ── Idempotency (§16) ─────────────────────────────────────────────────────────

test("idempotency: reuse an active intent instead of creating a duplicate", () => {
  const order = makeOrder();
  const active = buildIntent(order, "demo", "demo", 1000, 1);
  const pending = markPending(active, "DEMO-X:OK", 1001)!;
  const reuse = findReusableIntent([pending], order.id);
  assert.equal(reuse?.id, pending.id); // returns the existing intent
});

test("idempotency: a PAID intent is always returned (never re-created/re-charged)", () => {
  const order = makeOrder();
  const paid: PaymentIntent = { ...buildIntent(order, "demo", "demo", 1000, 1), status: "paid" };
  const reuse = findReusableIntent([paid], order.id);
  assert.equal(reuse?.id, paid.id);
  assert.equal(reuse?.status, "paid");
});

test("idempotency: no reusable intent for a different order", () => {
  const a = buildIntent(makeOrder({ id: "ord-A" }), "demo", "demo", 1000, 1);
  assert.equal(findReusableIntent([a], "ord-B"), null);
});

// ── Demo provider: success + deterministic failure (§11/§12) ──────────────────

test("demo provider: success path → pending then verified paid (deterministic)", async () => {
  const order = makeOrder();
  const intent = buildIntent(order, "demo", "demo", 1000, 1);
  const created = await demoPaymentProvider.createIntent({ intentId: intent.id, orderId: order.id, amount: intent.amount, currency: "OMR", demoOutcome: "success" });
  assert.equal(created.status, "pending");
  assert.match(created.providerReference!, /^DEMO-.*:OK$/);
  const pending = markPending(intent, created.providerReference, 1001)!;
  const v1 = await demoPaymentProvider.verify(pending);
  const v2 = await demoPaymentProvider.verify(pending);
  assert.deepEqual(v1, v2); // deterministic
  assert.equal(v1.verified, true);
  assert.equal(v1.status, "paid");
});

test("demo provider: explicit failure path → verify returns failed (not random)", async () => {
  const order = makeOrder();
  const intent = buildIntent(order, "demo", "demo", 1000, 1);
  const created = await demoPaymentProvider.createIntent({ intentId: intent.id, orderId: order.id, amount: intent.amount, currency: "OMR", demoOutcome: "failure" });
  assert.match(created.providerReference!, /:FAILURE$/);
  const pending = markPending(intent, created.providerReference, 1001)!;
  const v = await demoPaymentProvider.verify(pending);
  assert.equal(v.verified, false);
  assert.equal(v.status, "failed");
  assert.equal(v.failureCode, "declined");
});

test("demo provider: no card fields — createIntent takes only safe input", async () => {
  // The provider signature accepts no card/CVV/token — only intent/order/amount.
  const r = await demoPaymentProvider.createIntent({ intentId: "pi", orderId: "o", amount: 100, currency: "OMR" });
  assert.ok(r.providerReference && !/[0-9]{12,}/.test(r.providerReference)); // no PAN-like string
});

// ── Status machine (§19) ──────────────────────────────────────────────────────

test("transitions: valid forward moves allowed; regressions blocked", () => {
  assert.equal(canTransition("not_started", "pending"), true);
  assert.equal(canTransition("pending", "paid"), true);
  assert.equal(canTransition("pending", "failed"), true);
  assert.equal(canTransition("failed", "pending"), true); // retry
  // Terminal / illegal:
  assert.equal(canTransition("paid", "pending"), false);
  assert.equal(canTransition("paid", "failed"), false);
  assert.equal(canTransition("cancelled", "paid"), false);
  assert.equal(canTransition("pending", "pending"), false);
  assert.equal(isTerminal("paid"), true);
  assert.equal(isTerminal("pending"), false);
  assert.equal(canRetry("failed"), true);
  assert.equal(canRetry("paid"), false);
});

test("applyStatus: paid intent cannot be moved back to pending (replay rejected)", () => {
  const paid: PaymentIntent = { ...buildIntent(makeOrder(), "demo", "demo", 1, 1), status: "paid" };
  assert.equal(applyStatus(paid, "pending", 2), null); // invalid → null
  assert.equal(applyStatus(paid, "failed", 2), null);
  // A valid move applies:
  const pending: PaymentIntent = { ...paid, status: "pending" };
  assert.equal(applyStatus(pending, "paid", 2)?.status, "paid");
  assert.equal(transition("paid", "pending").ok, false);
  assert.equal(isPaid("paid"), true);
});

// ── Authorization (§21/§22/§25/§27) ───────────────────────────────────────────

test("authz: only the order-owning customer may pay / read the intent", () => {
  const order = makeOrder({ customerId: "cust-1" });
  assert.equal(canPayOrder({ userId: "cust-1" }, order), true);
  assert.equal(canPayOrder({ userId: "cust-9" }, order), false);
  const intent = buildIntent(order, "demo", "demo", 1, 1);
  assert.equal(canReadIntent({ userId: "cust-1" }, intent), true);
  assert.equal(canReadIntent({ userId: "cust-9" }, intent), false);
});

test("authz: supplier sees only a safe paid/awaiting flag for its own order group", () => {
  const order = makeOrder();
  const supplierId = order.groups[0].supplierId;
  assert.deepEqual(supplierPaymentView(order, [supplierId], "paid"), { paid: true });
  assert.deepEqual(supplierPaymentView(order, [supplierId], "pending"), { paid: false });
  // A supplier not in the order gets nothing (no leakage).
  assert.equal(supplierPaymentView(order, ["demo-other"], "paid"), null);
});

test("authz: the Agent can never pay (read-only boundary)", () => {
  assert.equal(AGENT_CAN_PAY, false);
});
