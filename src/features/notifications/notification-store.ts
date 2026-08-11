"use client";

import * as React from "react";
import {
  alwaysFalse, alwaysTrue, createPersistentStore,
} from "@/features/shop/persistent-store";
import {
  ingest, groupForUser, markRead, markAllRead, dismiss, forUser, topUnread,
  type Notification, type NotificationInput,
} from "@/lib/notifications";
import type { Order } from "@/lib/orders";
import { getPaymentStatus } from "@/features/orders/payment-store";
import { getFulfillment } from "@/features/orders/fulfillment-store";
import { getManufacturingJob } from "@/features/orders/manufacturing-store";
import { getOrderDeliveries } from "@/features/orders/delivery-store";

/**
 * Demo in-app notification store (Phase 13, §22/§25). With no backend, a user's
 * notifications live here in `localStorage`. Domain events are DERIVED
 * deterministically from the existing stores (payment / fulfillment / manufacturing
 * / delivery) and `ingest`-ed with STABLE ids, so repeated page loads or
 * rehydration never create duplicates (§25). This is the IN-APP sink — no external
 * message is ever sent (§20).
 */

function validate(value: unknown): Notification[] {
  if (!Array.isArray(value)) return [];
  return value.filter((n): n is Notification => Boolean(n) && typeof (n as Notification).id === "string");
}

const store = createPersistentStore<Notification[]>("athathi.notifications.v1", [], validate);

/**
 * Derive the canonical notification events for one order from deterministic state.
 * Only high-signal events (§24) — not every internal state-machine tick. Stable
 * `sourceId` per event so dedupe works across reloads (§25).
 */
function deriveOrderNotifications(order: Order): NotificationInput[] {
  const out: NotificationInput[] = [];
  const at = order.updatedAt || order.createdAt;
  const link = { kind: "order" as const, id: order.id };
  const params = { orderNumber: order.orderNumber };
  const push = (
    sourceType: NotificationInput["sourceType"], sourceId: string, eventKey: NotificationInput["eventKey"],
  ) => out.push({ userId: order.customerId, audience: "customer", sourceType, sourceId, eventKey, params, link, at });

  // Payment
  const pay = getPaymentStatus(order.id);
  if (pay === "paid") push("payment", order.id, "payment_confirmed");
  else if (pay === "failed") push("payment", order.id, "payment_failed");

  // Per-supplier fulfillment / manufacturing / delivery
  for (const group of order.groups) {
    const gid = `${order.id}:${group.supplierId}`;
    const ful = getFulfillment(order.id, group.supplierId);
    if (ful) {
      if (ful.status === "accepted") push("fulfillment", gid, "supplier_accepted");
      else if (ful.status === "declined") push("fulfillment", gid, "supplier_declined");
      else if (ful.status === "preparing") push("fulfillment", gid, "preparing_started");
      else if (ful.status === "ready_for_next_stage") push("fulfillment", gid, "ready_for_next_stage");
    }
    const job = getManufacturingJob(order.id, group.supplierId);
    if (job) {
      if (job.status === "manufacturing") push("manufacturing", gid, "manufacturing_started");
      else if (job.status === "quality_check" || job.status === "qc_failed" || job.status === "rework") push("manufacturing", gid, "quality_review");
      else if (job.status === "ready_for_delivery") push("manufacturing", gid, "manufacturing_ready");
    }
  }
  for (const del of getOrderDeliveries(order.id)) {
    const did = del.id;
    if (del.status === "scheduled") push("delivery", did, "delivery_scheduled");
    else if (del.status === "out_for_delivery") push("delivery", did, "out_for_delivery");
    else if (del.status === "delivered") push("delivery", did, "delivered");
    else if (del.status === "delivery_failed" || del.status === "reschedule_required") push("delivery", did, "delivery_reschedule");
    if (del.installation.status === "completed") push("delivery", `${did}:install`, "installation_completed");
    if (del.status === "completed") push("delivery", `${did}:done`, "order_completed");
  }
  return out;
}

/** Ingest (deduped) the derived events for a set of orders. */
function ingestOrders(orders: readonly Order[]) {
  const inputs = orders.flatMap(deriveOrderNotifications);
  if (inputs.length === 0) return;
  const next = ingest(store.get(), inputs);
  // Only write if something actually changed (avoid render loops).
  if (next.length !== store.get().length) store.set(next);
}

/**
 * Customer notification feed. Derives + ingests from the user's orders on mount /
 * when orders change, then exposes the grouped feed + read actions. Ownership is
 * always scoped to `userId` (§27).
 */
export function useNotifications(userId: string, orders: readonly Order[]) {
  const all = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);

  React.useEffect(() => {
    ingestOrders(orders.filter((o) => o.customerId === userId));
  }, [userId, orders]);

  // "now" captured once at mount is fine for the Today/Earlier boundary.
  const [now] = React.useState(() => Date.now());
  const groups = React.useMemo(() => groupForUser(all, userId, now), [all, userId, now]);
  const mine = React.useMemo(() => forUser(all, userId), [all, userId]);

  const actions = React.useMemo(() => ({
    markRead: (id: string) => store.set(markRead(store.get(), userId, id, Date.now())),
    markAllRead: () => store.set(markAllRead(store.get(), userId, Date.now())),
    dismiss: (id: string) => store.set(dismiss(store.get(), userId, id)),
  }), [userId]);

  return { notifications: mine, groups, unreadCount: groups.unreadCount, hydrated, ...actions };
}

/** Just the unread count + top item (for the header bell). */
export function useNotificationSummary(userId: string, orders: readonly Order[]) {
  const all = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);
  React.useEffect(() => {
    ingestOrders(orders.filter((o) => o.customerId === userId));
  }, [userId, orders]);
  const count = React.useMemo(() => forUser(all, userId).filter((n) => n.readAt === null).length, [all, userId]);
  const top = React.useMemo(() => topUnread(all, userId), [all, userId]);
  return { unreadCount: count, top, hydrated };
}
