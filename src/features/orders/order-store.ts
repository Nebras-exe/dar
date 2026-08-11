"use client";

import * as React from "react";
import {
  alwaysFalse,
  alwaysTrue,
  createPersistentStore,
} from "@/features/shop/persistent-store";
import { recomputeGroups, makeOrderNumber } from "@/lib/orders";
import type {
  CheckoutDraft,
  DeliveryAddress,
  Order,
  SupplierGroupStatus,
} from "@/lib/orders";

/**
 * Demo order store (Phase 10A, §16). With no backend, a customer's confirmed
 * orders live here in `localStorage`, clearly labelled "Demo Order". When
 * Supabase is configured, `orders`/`order_groups`/`order_items` (RLS-scoped) are
 * the source of truth and this is the honest local fallback with the same shape.
 * Totals are ALWAYS recomputed from the snapshotted lines on create — the caller
 * never supplies a total.
 */

function validate(value: unknown): Order[] {
  if (!Array.isArray(value)) return [];
  return value.filter((o): o is Order => Boolean(o) && typeof (o as Order).id === "string");
}

const store = createPersistentStore<Order[]>("athathi.orders.v1", [], validate);

/** Create a confirmed demo order from a validated draft. Returns the order id. */
export function createDemoOrder(
  customerId: string,
  draft: CheckoutDraft,
  address: DeliveryAddress,
): Order {
  const now = Date.now();
  // Recompute totals authoritatively from the snapshot (never trust a passed total).
  const { groups, totals } = recomputeGroups(draft.groups);
  const seed = (now ^ Math.floor(Math.random() * 0xffffff)) >>> 0;
  const order: Order = {
    id: `ord_${now.toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    orderNumber: makeOrderNumber(seed),
    customerId,
    source: draft.source,
    status: "confirmed",
    groups,
    totals,
    address,
    isDemo: true,
    createdAt: now,
    updatedAt: now,
  };
  store.set([order, ...store.get()]);
  return order;
}

export function useOrders(customerId: string) {
  const all = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);

  const orders = React.useMemo(
    () => all.filter((o) => o.customerId === customerId).sort((a, b) => b.createdAt - a.createdAt),
    [all, customerId],
  );
  const byId = React.useCallback(
    (id: string) => all.find((o) => o.id === id && o.customerId === customerId) ?? null,
    [all, customerId],
  );

  return { orders, byId, hydrated };
}

/** Supplier view: orders that contain a group for this supplier (redacted to that group). */
export function useSupplierOrders(supplierId: string) {
  const all = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);

  const orders = React.useMemo(
    () => all.filter((o) => o.groups.some((g) => g.supplierId === supplierId)).sort((a, b) => b.createdAt - a.createdAt),
    [all, supplierId],
  );

  /** Advance the supplier's OWN group status (new → acknowledged → processing). */
  const setGroupStatus = React.useCallback(
    (orderId: string, status: SupplierGroupStatus) => {
      store.set(
        store.get().map((o) =>
          o.id === orderId
            ? {
                ...o,
                groups: o.groups.map((g) => (g.supplierId === supplierId ? { ...g, status } : g)),
                updatedAt: Date.now(),
              }
            : o,
        ),
      );
    },
    [supplierId],
  );

  return { orders, setGroupStatus, hydrated };
}
