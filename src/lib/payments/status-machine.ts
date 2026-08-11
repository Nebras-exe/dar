/**
 * Payment status machine (Phase 10B, §19). Deterministic, allowlisted
 * transitions. A terminal `paid` never regresses to `pending`/`unpaid` without a
 * documented refund/reversal flow (not implemented this phase). Pure + tested.
 */

import type { PaymentStatus } from "./types";

/** Allowed transitions: from → set of permitted next states. */
const TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  not_started: ["pending", "cancelled"],
  pending: ["requires_action", "authorized", "paid", "failed", "cancelled", "expired"],
  requires_action: ["authorized", "paid", "failed", "cancelled", "expired"],
  authorized: ["paid", "failed", "cancelled"],
  // Terminal states: no forward transition (refund/reversal is a future flow).
  paid: [],
  failed: ["pending"], // a failed payment may be retried (new attempt)
  cancelled: [],
  expired: ["pending"], // an expired intent may be retried
};

/** Is a status a terminal state that must not silently change? */
export function isTerminal(status: PaymentStatus): boolean {
  return status === "paid" || status === "cancelled";
}

/** Can the payment move from `from` to `to`? */
export function canTransition(from: PaymentStatus, to: PaymentStatus): boolean {
  if (from === to) return false;
  return TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Apply a transition or throw-free reject. Returns the resulting status, or the
 * unchanged status when the transition is invalid (callers should check).
 */
export function transition(from: PaymentStatus, to: PaymentStatus): { ok: boolean; status: PaymentStatus } {
  if (canTransition(from, to)) return { ok: true, status: to };
  return { ok: false, status: from };
}

/** A retry is allowed only from a non-terminal, non-paid failure/expiry/pending. */
export function canRetry(status: PaymentStatus): boolean {
  return status === "failed" || status === "expired" || status === "pending";
}

/** A payment is "settled" (successfully complete). */
export function isPaid(status: PaymentStatus): boolean {
  return status === "paid";
}
