"use client";

import * as React from "react";
import {
  alwaysFalse, alwaysTrue, createPersistentStore,
} from "@/features/shop/persistent-store";
import {
  buildDelivery, canCreateDelivery, groupIsCustom,
  scheduleDelivery, assignDelivery, markOutForDelivery, markDelivered,
  markDeliveryFailed, requestReschedule, cancelDelivery,
  scheduleInstallation, startInstallation, completeInstallation, recordInstallationIssue,
  confirmHandover, summarizeDeliveries, demoAssignment, deliveryNotifier,
  type Delivery, type DeliveryActor, type DeliveryWindow, type DeliveryEventType,
  type DeliveryFailureReason, type DeliverySummary, type InstallationIssueCategory,
} from "@/lib/delivery";
import type { Order, SupplierOrderGroup } from "@/lib/orders";
import { getFulfillment } from "./fulfillment-store";
import { getManufacturingJob } from "./manufacturing-store";

/**
 * Demo delivery store (Phase 12, §36). With no backend, per-supplier-group
 * deliveries live here in `localStorage`, mirroring the DB shape
 * (`deliveries`/`delivery_events`/`installations`, RLS-scoped when Supabase is
 * configured). It enforces the same invariants a server route would: a delivery
 * is created only when the group is genuinely READY (custom → manufacturing
 * `ready_for_delivery`; catalog → fulfillment `ready_for_next_stage`, §5), it
 * captures an IMMUTABLE address snapshot (§10), transitions go through the state
 * machines with appended events (§7/§8), failed attempts are preserved (§19), and
 * the customer only ever sets the delivery WINDOW — never operational status (§33).
 */

function validate(value: unknown): Delivery[] {
  if (!Array.isArray(value)) return [];
  return value.filter((d): d is Delivery => Boolean(d) && typeof (d as Delivery).id === "string");
}

const store = createPersistentStore<Delivery[]>("athathi.deliveries.v1", [], validate);

function seedFrom(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function find(all: readonly Delivery[], orderId: string, supplierId: string): Delivery | null {
  return all.find((d) => d.orderId === orderId && d.supplierId === supplierId) ?? null;
}

/** Is this group eligible for delivery right now? (reads fulfillment / manufacturing state) */
function eligible(order: Order, group: SupplierOrderGroup): boolean {
  const isCustom = groupIsCustom(group);
  const ful = getFulfillment(order.id, group.supplierId);
  const job = getManufacturingJob(order.id, group.supplierId);
  return canCreateDelivery(isCustom, ful?.status ?? null, job?.status ?? null);
}

/** Create the delivery for a ready group iff none exists. Idempotent. */
function ensureDelivery(order: Order, group: SupplierOrderGroup): Delivery | null {
  const existing = find(store.get(), order.id, group.supplierId);
  if (existing) return existing;
  if (!eligible(order, group)) return null;
  const now = Date.now();
  const d = buildDelivery(order, group, now, seedFrom(order.id + group.supplierId));
  store.set([d, ...store.get()]);
  deliveryNotifier.notify({
    audience: "supplier", deliveryId: d.id, orderNumber: d.orderNumber,
    event: "delivery_ready", messageKey: "notify.supplier.readyForDelivery",
  });
  return d;
}

const CUSTOMER_NOTIFY: ReadonlySet<DeliveryEventType> = new Set<DeliveryEventType>([
  "delivery_scheduled", "out_for_delivery", "delivered", "installation_scheduled", "installation_completed", "completed",
]);

function persist(next: Delivery, notifyEvent?: DeliveryEventType) {
  store.set(store.get().map((d) => (d.id === next.id ? next : d)));
  if (notifyEvent && CUSTOMER_NOTIFY.has(notifyEvent)) {
    deliveryNotifier.notify({
      audience: "customer", deliveryId: next.id, orderNumber: next.orderNumber,
      event: notifyEvent, messageKey: `notify.customer.${notifyEvent}`,
    });
  }
}

// ── Supplier-side hook (delivery tab: create-on-open + operational actions) ───

export function useSupplierDeliveries(supplierId: string, orders: readonly Order[]) {
  const all = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);
  const actor = React.useMemo<DeliveryActor>(() => ({ role: "supplier", id: supplierId }), [supplierId]);

  // Create-on-open: for every ready group of this supplier, ensure a delivery exists.
  React.useEffect(() => {
    for (const order of orders) {
      const group = order.groups.find((g) => g.supplierId === supplierId);
      if (!group) continue;
      if (find(store.get(), order.id, supplierId)) continue;
      ensureDelivery(order, group);
    }
  }, [supplierId, orders]);

  const deliveries = React.useMemo(
    () => all.filter((d) => d.supplierId === supplierId).sort((a, b) => b.createdAt - a.createdAt),
    [all, supplierId],
  );

  const run = React.useCallback(
    (id: string, fn: (d: Delivery, a: DeliveryActor, now: number) => { ok: boolean; changed: boolean; delivery: Delivery }, notifyEvent?: DeliveryEventType): boolean => {
      const current = store.get().find((d) => d.id === id);
      if (!current) return false;
      const res = fn(current, actor, Date.now());
      if (!res.ok) return false;
      if (res.changed) persist(res.delivery, notifyEvent);
      return res.ok;
    },
    [actor],
  );

  const actions = React.useMemo(() => ({
    schedule: (id: string, w: DeliveryWindow) => run(id, (d, a, n) => scheduleDelivery(d, w, a, n), "delivery_scheduled"),
    assign: (id: string) => run(id, (d, a, n) => assignDelivery(d, demoAssignment(n), a, n), "assigned"),
    outForDelivery: (id: string) => run(id, (d, a, n) => markOutForDelivery(d, a, n), "out_for_delivery"),
    delivered: (id: string) => run(id, (d, a, n) => markDelivered(d, a, n), "delivered"),
    failed: (id: string, reason: DeliveryFailureReason) => run(id, (d, a, n) => markDeliveryFailed(d, reason, a, n)),
    reschedule: (id: string) => run(id, (d, a, n) => requestReschedule(d, a, n)),
    cancel: (id: string) => run(id, (d, a, n) => cancelDelivery(d, a, n)),
    scheduleInstallation: (id: string, w: DeliveryWindow) => run(id, (d, a, n) => scheduleInstallation(d, w, a, n), "installation_scheduled"),
    startInstallation: (id: string) => run(id, (d, a, n) => startInstallation(d, a, n)),
    completeInstallation: (id: string) => run(id, (d, a, n) => completeInstallation(d, a, n), "installation_completed"),
    recordInstallationIssue: (id: string, category: InstallationIssueCategory, description: string) =>
      run(id, (d, a, n) => recordInstallationIssue(d, category, description, a, n)),
    confirmHandover: (id: string) => run(id, (d, a, n) => confirmHandover(d, a, n), "completed"),
  }), [run]);

  return { deliveries, hydrated, actions };
}

// ── Customer-side hooks ───────────────────────────────────────────────────────

/** Deliveries for an order (customer tracking). Customer may set only the slot (§33). */
export function useOrderDeliveries(order: Order | null) {
  const all = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);

  // Create-on-open for eligible groups so the customer sees "preparing your delivery"
  // as soon as a group is ready (idempotent; never for ineligible groups).
  React.useEffect(() => {
    if (!order) return;
    for (const group of order.groups) {
      if (find(store.get(), order.id, group.supplierId)) continue;
      ensureDelivery(order, group);
    }
  }, [order]);

  const deliveries = React.useMemo(
    () => (order ? all.filter((d) => d.orderId === order.id) : []),
    [all, order],
  );

  /** The customer chooses a delivery window for their own delivery (validated). */
  const chooseSlot = React.useCallback((deliveryId: string, window: DeliveryWindow): boolean => {
    const current = store.get().find((d) => d.id === deliveryId);
    if (!current) return false;
    const res = scheduleDelivery(current, window, { role: "customer", id: current.customerId }, Date.now());
    if (!res.ok) return false;
    persist(res.delivery, "delivery_scheduled");
    return true;
  }, []);

  return { deliveries, hydrated, chooseSlot };
}

/** Deterministic order-level delivery summary for the account cards. Read-only. */
export function useDeliverySummary(order: Order | null): { summary: DeliverySummary; hydrated: boolean } {
  const { deliveries, hydrated } = useOrderDeliveries(order);
  return { summary: summarizeDeliveries(deliveries), hydrated };
}
