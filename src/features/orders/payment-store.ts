"use client";

import * as React from "react";
import {
  alwaysFalse,
  alwaysTrue,
  createPersistentStore,
} from "@/features/shop/persistent-store";
import {
  buildIntent, findReusableIntent, markPending, applyStatus, canRetry,
  demoPaymentProvider,
  type PaymentIntent, type PaymentMethod, type PaymentStatus,
} from "@/lib/payments";
import type { Order } from "@/lib/orders";

/**
 * Demo payment store (Phase 10B, §11/§16/§17). With no gateway configured,
 * payment intents live here in `localStorage`. It enforces the same invariants a
 * server route would: the intent amount is derived from the ORDER (never a client
 * value — §15), one active intent per order (idempotent — §16), and "paid" is set
 * ONLY via the provider's `verify` gated by the status machine (§17). Every intent
 * is `isDemo` and labelled **Demo Payment** in the UI; no real money moves.
 *
 * When Supabase + a real gateway are configured, `payment_intents`/`_attempts`
 * (RLS-scoped) + the API routes are the source of truth with the same shape.
 */

function validate(value: unknown): PaymentIntent[] {
  if (!Array.isArray(value)) return [];
  return value.filter((i): i is PaymentIntent => Boolean(i) && typeof (i as PaymentIntent).id === "string");
}

const store = createPersistentStore<PaymentIntent[]>("athathi.payments.v1", [], validate);

function seed(): number {
  return (Date.now() ^ Math.floor(Math.random() * 0xffffff)) >>> 0;
}

export function usePayment(order: Order | null) {
  const all = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);

  const intent = React.useMemo(
    () => (order ? findReusableIntent(all, order.id) : null),
    [all, order],
  );

  /**
   * Idempotently create (or reuse) the intent for this order + begin it with the
   * Demo provider. Repeated calls never create duplicates or re-charge a paid
   * intent. `demoOutcome` picks the deterministic success/failure path (§12).
   */
  const start = React.useCallback(
    async (method: PaymentMethod, demoOutcome: "success" | "failure"): Promise<PaymentIntent | null> => {
      if (!order) return null;
      const current = findReusableIntent(store.get(), order.id);
      // A paid intent is returned as-is (never re-created / re-charged).
      if (current && current.status === "paid") return current;

      // Reuse an existing non-paid intent, or build a fresh one from the ORDER.
      let base = current ?? buildIntent(order, "demo", method, Date.now(), seed());
      // If retrying a failed/expired intent, move it back to a usable state first.
      if (base.status === "failed" || base.status === "expired") {
        base = applyStatus(base, "pending", Date.now()) ?? base;
      }

      const created = await demoPaymentProvider.createIntent({
        intentId: base.id, orderId: order.id, amount: base.amount, currency: "OMR", demoOutcome,
      });
      const pending = base.status === "not_started"
        ? markPending(base, created.providerReference, Date.now())
        : { ...base, providerReference: created.providerReference, updatedAt: Date.now() };
      const next = pending ?? base;

      const rest = store.get().filter((i) => i.id !== next.id && i.orderId !== order.id);
      store.set([next, ...rest]);
      return next;
    },
    [order],
  );

  /**
   * Verify the payment server-side (through the provider abstraction) and, only
   * if verified, transition to paid via the status machine (§17/§19). Never
   * trusts any client "success" flag.
   */
  const verify = React.useCallback(async (): Promise<PaymentIntent | null> => {
    if (!order) return null;
    const current = findReusableIntent(store.get(), order.id);
    if (!current) return null;
    if (current.status === "paid") return current; // already settled — idempotent
    const result = await demoPaymentProvider.verify(current);
    const nextStatus: PaymentStatus = result.verified ? "paid" : "failed";
    const updated = applyStatus(current, nextStatus, Date.now(), result.providerReference) ?? current;
    store.set(store.get().map((i) => (i.id === updated.id ? updated : i)));
    return updated;
  }, [order]);

  const retry = React.useCallback(() => {
    if (!order) return;
    const current = findReusableIntent(store.get(), order.id);
    if (current && canRetry(current.status)) {
      const back = applyStatus(current, "pending", Date.now());
      if (back) store.set(store.get().map((i) => (i.id === back.id ? back : i)));
    }
  }, [order]);

  return { intent, hydrated, start, verify, retry };
}

/** Plain read of the payment status for an order (non-hook; used by the notification feed). */
export function getPaymentStatus(orderId: string): PaymentStatus {
  const intent = findReusableIntent(store.get(), orderId);
  return intent?.status ?? "not_started";
}

/** Read the payment status for an order (used by order/account/supplier views). */
export function usePaymentStatus(orderId: string | null): { status: PaymentStatus; intent: PaymentIntent | null; hydrated: boolean } {
  const all = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);
  const intent = orderId ? findReusableIntent(all, orderId) : null;
  return { status: intent?.status ?? "not_started", intent, hydrated };
}
