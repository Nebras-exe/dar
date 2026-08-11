/**
 * Payment intent orchestration (Phase 10B, §8/§15/§16/§17). Pure + deterministic
 * so it runs identically in the demo store and (later) a server route handler.
 *
 * The three invariants this file enforces:
 *  1. SERVER-SIDE AMOUNT AUTHORITY (§15): the intent amount is ALWAYS derived
 *     from the order's authoritative grand total. A client-supplied amount is
 *     ignored/rejected — `assertOrderAmount` compares and refuses a mismatch.
 *  2. IDEMPOTENCY (§16): one active intent per order (key = order id). Creating
 *     again returns the existing intent instead of a duplicate; a paid intent is
 *     never re-created or re-charged.
 *  3. SAFE VERIFICATION (§17): "paid" is only ever set via the provider's
 *     server-side `verify`, gated by the status machine — never from client state.
 */

import type { Order } from "@/lib/orders";
import { canTransition, isPaid } from "./status-machine";
import type {
  PaymentIntent,
  PaymentMethod,
  PaymentProviderId,
  PaymentStatus,
} from "./types";

/** Build a fresh intent from an ORDER — amount is the order's grand total. */
export function buildIntent(
  order: Pick<Order, "id" | "customerId" | "totals" | "isDemo">,
  provider: PaymentProviderId,
  method: PaymentMethod,
  now: number,
  seed: number,
): PaymentIntent {
  return {
    id: `pi_${now.toString(36)}_${(seed >>> 0).toString(36).slice(0, 6)}`,
    orderId: order.id,
    customerId: order.customerId,
    provider,
    providerReference: null,
    // AUTHORITATIVE amount — from the order, never from a client value (§15).
    amount: order.totals.grandTotal,
    currency: "OMR",
    status: "not_started",
    method,
    idempotencyKey: order.id,
    isDemo: provider === "demo" || order.isDemo,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Server-side amount authority check (§15). Returns true only when a
 * client-claimed amount matches the order's authoritative total. Callers reject
 * on false — the payable is never the client's number.
 */
export function assertOrderAmount(order: Pick<Order, "totals">, claimedAmount: unknown): boolean {
  if (typeof claimedAmount !== "number") return false;
  return claimedAmount === order.totals.grandTotal;
}

/**
 * Idempotent intent selection (§16). Given the existing intents for an order,
 * return the reusable one (any non-failed/non-cancelled) or null if a fresh
 * intent should be created. A `paid` intent is always returned as-is (never
 * duplicated, never re-charged).
 */
export function findReusableIntent(existing: readonly PaymentIntent[], orderId: string): PaymentIntent | null {
  const forOrder = existing.filter((i) => i.orderId === orderId);
  const paid = forOrder.find((i) => isPaid(i.status));
  if (paid) return paid;
  const active = forOrder.find((i) => i.status === "pending" || i.status === "requires_action" || i.status === "authorized" || i.status === "not_started");
  return active ?? null;
}

/** Apply a status change through the machine; returns the updated intent or null. */
export function applyStatus(intent: PaymentIntent, next: PaymentStatus, now: number, providerReference?: string | null): PaymentIntent | null {
  if (!canTransition(intent.status, next)) return null;
  return {
    ...intent,
    status: next,
    providerReference: providerReference !== undefined ? providerReference : intent.providerReference,
    updatedAt: now,
  };
}

/** Move `not_started → pending` when the provider begins the payment. */
export function markPending(intent: PaymentIntent, providerReference: string | null, now: number): PaymentIntent | null {
  return applyStatus(intent, "pending", now, providerReference);
}
