/**
 * Notification event mapping (Phase 13, §21/§24/§32). The single deterministic
 * source of truth: each allowlisted event key → its category, priority, and
 * localization keys. A client-supplied event outside this map is rejected (§39).
 */

import type {
  NotificationCategory,
  NotificationEventKey,
  NotificationPriority,
} from "./types";

interface EventMeta {
  category: NotificationCategory;
  priority: NotificationPriority;
  titleKey: string;
  bodyKey: string;
}

/** event key → metadata. Priorities follow §32 (high = needs action). */
const EVENT_MAP: Record<NotificationEventKey, EventMeta> = {
  // quotes / RFQ
  quote_received: { category: "quotes", priority: "medium", titleKey: "quote_received.title", bodyKey: "quote_received.body" },
  quote_accepted: { category: "quotes", priority: "low", titleKey: "quote_accepted.title", bodyKey: "quote_accepted.body" },
  // payment
  payment_confirmed: { category: "orders", priority: "medium", titleKey: "payment_confirmed.title", bodyKey: "payment_confirmed.body" },
  payment_failed: { category: "orders", priority: "high", titleKey: "payment_failed.title", bodyKey: "payment_failed.body" },
  // fulfillment
  supplier_accepted: { category: "orders", priority: "medium", titleKey: "supplier_accepted.title", bodyKey: "supplier_accepted.body" },
  supplier_declined: { category: "orders", priority: "high", titleKey: "supplier_declined.title", bodyKey: "supplier_declined.body" },
  preparing_started: { category: "orders", priority: "low", titleKey: "preparing_started.title", bodyKey: "preparing_started.body" },
  ready_for_next_stage: { category: "orders", priority: "low", titleKey: "ready_for_next_stage.title", bodyKey: "ready_for_next_stage.body" },
  // manufacturing
  manufacturing_started: { category: "orders", priority: "low", titleKey: "manufacturing_started.title", bodyKey: "manufacturing_started.body" },
  quality_review: { category: "orders", priority: "medium", titleKey: "quality_review.title", bodyKey: "quality_review.body" },
  manufacturing_ready: { category: "orders", priority: "medium", titleKey: "manufacturing_ready.title", bodyKey: "manufacturing_ready.body" },
  // delivery / installation
  delivery_scheduled: { category: "delivery", priority: "medium", titleKey: "delivery_scheduled.title", bodyKey: "delivery_scheduled.body" },
  out_for_delivery: { category: "delivery", priority: "medium", titleKey: "out_for_delivery.title", bodyKey: "out_for_delivery.body" },
  delivered: { category: "delivery", priority: "medium", titleKey: "delivered.title", bodyKey: "delivered.body" },
  delivery_reschedule: { category: "delivery", priority: "high", titleKey: "delivery_reschedule.title", bodyKey: "delivery_reschedule.body" },
  installation_completed: { category: "delivery", priority: "low", titleKey: "installation_completed.title", bodyKey: "installation_completed.body" },
  order_completed: { category: "orders", priority: "low", titleKey: "order_completed.title", bodyKey: "order_completed.body" },
};

export function isNotificationEvent(v: unknown): v is NotificationEventKey {
  return typeof v === "string" && v in EVENT_MAP;
}

export function eventMeta(key: NotificationEventKey): EventMeta {
  return EVENT_MAP[key];
}

const PRIORITY_RANK: Record<NotificationPriority, number> = { high: 0, medium: 1, low: 2 };

export function priorityRank(p: NotificationPriority): number {
  return PRIORITY_RANK[p];
}
