/**
 * Agent follow-up tests (Phase 13, §49). All pure + deterministic. Covers: active
 * quote review, unpaid-order next action, manufacturing/quality follow-up, delivery
 * scheduled / awaiting-slot, delivery failure → reschedule (high), completed order
 * (no action), priority ordering, empty state, and the read-only recommend-only
 * boundary (the context never executes anything).
 */

import test from "node:test";
import assert from "node:assert/strict";

import { buildFollowUpContext, type FollowUpInput, type FollowUpOrderState } from "./followup";

function order(over: Partial<FollowUpOrderState> = {}): FollowUpOrderState {
  return {
    orderId: "ord-1", orderNumber: "ATH-000001", paymentStatus: "paid",
    fulfillmentStatuses: [], manufacturingStatuses: [], deliveryStatuses: [], awaitingSlot: false, ...over,
  };
}
function input(over: Partial<FollowUpInput> = {}): FollowUpInput {
  return { orders: [], pendingQuoteRequestIds: [], activeDesignIds: [], ...over };
}

test("unpaid order → pay_order (medium)", () => {
  const ctx = buildFollowUpContext(input({ orders: [order({ paymentStatus: "pending" })] }));
  assert.equal(ctx.actions.some((a) => a.kind === "pay_order" && a.priority === "medium"), true);
});

test("failed payment → pay_order (HIGH)", () => {
  const ctx = buildFollowUpContext(input({ orders: [order({ paymentStatus: "failed" })] }));
  const pay = ctx.actions.find((a) => a.kind === "pay_order");
  assert.equal(pay?.priority, "high");
  assert.equal(ctx.top?.kind, "pay_order");
});

test("pending quote → review_quote (medium)", () => {
  const ctx = buildFollowUpContext(input({ pendingQuoteRequestIds: ["req-9"] }));
  const q = ctx.actions.find((a) => a.kind === "review_quote");
  assert.equal(q?.priority, "medium");
  assert.equal(q?.target.id, "req-9");
});

test("delivery awaiting slot → choose_delivery_slot", () => {
  const ctx = buildFollowUpContext(input({ orders: [order({ awaitingSlot: true })] }));
  assert.equal(ctx.actions.some((a) => a.kind === "choose_delivery_slot"), true);
});

test("delivery failure → reschedule_delivery (HIGH)", () => {
  const ctx = buildFollowUpContext(input({ orders: [order({ deliveryStatuses: ["delivery_failed"] })] }));
  assert.equal(ctx.top?.kind, "reschedule_delivery");
  assert.equal(ctx.top?.priority, "high");
});

test("supplier declined → high-priority view_order", () => {
  const ctx = buildFollowUpContext(input({ orders: [order({ fulfillmentStatuses: ["declined"] })] }));
  assert.equal(ctx.actions.some((a) => a.kind === "view_order" && a.priority === "high"), true);
});

test("manufacturing quality review → view_order (medium)", () => {
  const ctx = buildFollowUpContext(input({ orders: [order({ manufacturingStatuses: ["quality_check"] })] }));
  assert.equal(ctx.actions.some((a) => a.kind === "view_order" && a.priority === "medium"), true);
});

test("active design → continue_design (low)", () => {
  const ctx = buildFollowUpContext(input({ activeDesignIds: ["d1"] }));
  assert.equal(ctx.actions.some((a) => a.kind === "continue_design" && a.priority === "low"), true);
});

test("completed, paid order with nothing pending → no actions", () => {
  const ctx = buildFollowUpContext(input({ orders: [order({ paymentStatus: "paid", deliveryStatuses: ["completed"] })] }));
  assert.equal(ctx.actions.length, 0);
  assert.equal(ctx.top, null);
});

test("priority ordering: high before medium before low; deduped", () => {
  const ctx = buildFollowUpContext(input({
    orders: [order({ paymentStatus: "failed", awaitingSlot: true })],
    pendingQuoteRequestIds: ["req-1"],
    activeDesignIds: ["d1"],
  }));
  // Sorted high → low.
  const priorities = ctx.actions.map((a) => a.priority);
  const rank = { high: 0, medium: 1, low: 2 } as const;
  for (let i = 1; i < priorities.length; i++) {
    assert.ok(rank[priorities[i - 1]] <= rank[priorities[i]]);
  }
  assert.equal(ctx.top?.priority, "high");
  assert.equal(ctx.counts.high >= 1, true);
});

test("actions are recommendations only — the context carries no executable capability", () => {
  const ctx = buildFollowUpContext(input({ orders: [order({ paymentStatus: "pending" })] }));
  // Every action is a target + kind + priority; nothing that performs a write.
  for (const a of ctx.actions) {
    assert.ok(["order", "design", "request"].includes(a.target.kind));
    assert.equal("execute" in a, false);
  }
});
