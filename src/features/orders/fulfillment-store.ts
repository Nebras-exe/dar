"use client";

import * as React from "react";
import {
  alwaysFalse,
  alwaysTrue,
  createPersistentStore,
} from "@/features/shop/persistent-store";
import {
  buildFulfillment, canCreateFulfillment,
  acceptFulfillment, declineFulfillment, startPreparing, markReady,
  summarizeFulfillment, demoNotifier,
  type Fulfillment, type FulfillmentActor, type DeclineReason, type FulfillmentSummary,
} from "@/lib/fulfillment";
import type { Order, SupplierOrderGroup } from "@/lib/orders";
import type { PaymentStatus } from "@/lib/payments";

/**
 * Demo fulfillment store (Phase 11A, §29). With no backend, per-supplier
 * fulfillments live here in `localStorage`, mirroring the DB shape
 * (`fulfillments`/`fulfillment_events`, RLS-scoped when Supabase is configured).
 * It enforces the same invariants a server route would: a fulfillment is created
 * ONLY from a PAID order (§4/§30), one per supplier group (§6), transitions go
 * through the status machine with an appended audit event (§9), and the customer
 * never writes fulfillment state (§28) — only the owning supplier does.
 */

function validate(value: unknown): Fulfillment[] {
  if (!Array.isArray(value)) return [];
  return value.filter((f): f is Fulfillment => Boolean(f) && typeof (f as Fulfillment).id === "string");
}

const store = createPersistentStore<Fulfillment[]>("athathi.fulfillments.v1", [], validate);

function seedFrom(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function find(all: readonly Fulfillment[], orderId: string, supplierId: string): Fulfillment | null {
  return all.find((f) => f.orderId === orderId && f.supplierId === supplierId) ?? null;
}

/**
 * Create the fulfillment for a group if — and only if — the order is PAID and no
 * record exists yet. Idempotent: repeated calls never duplicate. Persists and
 * records a Demo-Mode supplier notification (no external message, §20/§30).
 */
function ensureFulfillment(
  order: Order,
  group: Pick<SupplierOrderGroup, "supplierId" | "supplierName">,
  paymentStatus: PaymentStatus,
): Fulfillment | null {
  const existing = find(store.get(), order.id, group.supplierId);
  if (existing) return existing;
  if (!canCreateFulfillment(paymentStatus)) return null;
  const now = Date.now();
  const f = buildFulfillment(order, group, now, seedFrom(order.id + group.supplierId));
  store.set([f, ...store.get()]);
  demoNotifier.notify({
    audience: "supplier", fulfillmentId: f.id, orderNumber: f.orderNumber,
    event: "supplier_notified", messageKey: "notify.supplier.newPaidOrder",
  });
  return f;
}

/** Build a transient (not-persisted) awaiting timeline for a paid order the supplier hasn't opened yet. */
function synthesize(order: Order, group: Pick<SupplierOrderGroup, "supplierId" | "supplierName">): Fulfillment {
  return buildFulfillment(order, group, order.updatedAt || order.createdAt, seedFrom(order.id + group.supplierId));
}

// ── Supplier-side hook (create-on-open + lifecycle actions) ───────────────────

export function useSupplierFulfillment(order: Order | null, supplierId: string, paymentStatus: PaymentStatus) {
  const all = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);

  const group = order?.groups.find((g) => g.supplierId === supplierId) ?? null;
  const paid = paymentStatus === "paid";

  // The supplier "receives" a paid order → the fulfillment record is created when
  // the supplier opens their dashboard (create-on-open). Never for unpaid orders.
  React.useEffect(() => {
    if (order && group && paid && !find(store.get(), order.id, supplierId)) {
      ensureFulfillment(order, group, paymentStatus);
    }
  }, [order, group, supplierId, paid, paymentStatus]);

  const fulfillment = order ? find(all, order.id, supplierId) : null;
  const actor = React.useMemo<FulfillmentActor>(() => ({ role: "supplier", id: supplierId }), [supplierId]);

  const run = React.useCallback(
    (op: (f: Fulfillment, a: FulfillmentActor, now: number) => { ok: boolean; changed: boolean; fulfillment: Fulfillment; error?: string },
     notifyEvent?: Parameters<typeof demoNotifier.notify>[0]["event"]) =>
    (): boolean => {
      if (!order) return false;
      const current = find(store.get(), order.id, supplierId);
      if (!current) return false;
      const res = op(current, actor, Date.now());
      if (!res.ok) return false;
      if (res.changed) {
        store.set(store.get().map((f) => (f.id === res.fulfillment.id ? res.fulfillment : f)));
        if (notifyEvent) {
          demoNotifier.notify({
            audience: "customer", fulfillmentId: res.fulfillment.id, orderNumber: res.fulfillment.orderNumber,
            event: notifyEvent, messageKey: `notify.customer.${notifyEvent}`,
          });
        }
      }
      return true;
    },
    [order, supplierId, actor],
  );

  const accept = React.useMemo(() => run((f, a, n) => acceptFulfillment(f, a, n), "accepted"), [run]);
  const beginPreparing = React.useMemo(() => run((f, a, n) => startPreparing(f, a, n), "preparing_started"), [run]);
  const ready = React.useMemo(() => run((f, a, n) => markReady(f, a, n), "ready_for_next_stage"), [run]);

  const decline = React.useCallback(
    (reason: DeclineReason, internalNote?: string): boolean => {
      if (!order) return false;
      const current = find(store.get(), order.id, supplierId);
      if (!current) return false;
      const res = declineFulfillment(current, actor, reason, Date.now(), internalNote);
      if (!res.ok) return false;
      if (res.changed) {
        store.set(store.get().map((f) => (f.id === res.fulfillment.id ? res.fulfillment : f)));
        demoNotifier.notify({
          audience: "customer", fulfillmentId: res.fulfillment.id, orderNumber: res.fulfillment.orderNumber,
          event: "declined", messageKey: "notify.customer.declined",
        });
      }
      return true;
    },
    [order, supplierId, actor],
  );

  return { fulfillment, hydrated, accept, decline, beginPreparing, ready };
}

// ── Customer-side hooks (READ-ONLY — §28) ─────────────────────────────────────

/** All per-supplier fulfillments for an order (customer timeline). Read-only. */
export function useOrderFulfillments(order: Order | null, paymentStatus: PaymentStatus) {
  const all = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);
  const paid = paymentStatus === "paid";

  const fulfillments = React.useMemo<Fulfillment[]>(() => {
    if (!order) return [];
    return order.groups.map((g) => {
      const existing = find(all, order.id, g.supplierId);
      if (existing) return existing;
      // Paid but the supplier hasn't opened yet → show a transient "awaiting" state.
      return paid ? synthesize(order, g) : null;
    }).filter((f): f is Fulfillment => f !== null);
  }, [all, order, paid]);

  return { fulfillments, hydrated };
}

/** Deterministic order-level summary for the account order cards. Read-only. */
export function useFulfillmentSummary(order: Order | null, paymentStatus: PaymentStatus): { summary: FulfillmentSummary; hydrated: boolean } {
  const { fulfillments, hydrated } = useOrderFulfillments(order, paymentStatus);
  return { summary: summarizeFulfillment(fulfillments), hydrated };
}

/** All persisted fulfillments for a supplier (drives the Phase 11B manufacturing tab). */
export function useSupplierFulfillments(supplierId: string): { fulfillments: Fulfillment[]; hydrated: boolean } {
  const all = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);
  const fulfillments = React.useMemo(() => all.filter((f) => f.supplierId === supplierId), [all, supplierId]);
  return { fulfillments, hydrated };
}

/** Plain read of the fulfillment for a group (non-hook; used by the manufacturing store). */
export function getFulfillment(orderId: string, supplierId: string): Fulfillment | null {
  return find(store.get(), orderId, supplierId);
}
