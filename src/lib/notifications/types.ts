/**
 * Athathi In-App Notifications — domain contracts (Phase 13).
 *
 * A REAL in-app notification system (NOT external messaging, §20). It aggregates
 * events from the existing domains (RFQ / quote / order / payment / fulfillment /
 * manufacturing / QC / delivery / installation, §21) into a per-user feed. Every
 * notification carries a STABLE source identity `(sourceType, sourceId, eventKey)`
 * so repeated page loads / rehydration never create duplicates (§25). Payloads are
 * STRUCTURED localization data (keys + safe params), not pre-rendered strings
 * (§26). A deep link points at the relevant order/design/request. Kept free of
 * server/React imports so the types + mapping + dedupe run on the client and in
 * Node tests.
 */

/** Who the notification is for. Customer + supplier feeds are separate (§28). */
export type NotificationAudience = "customer" | "supplier";

/** Coarse category for grouping in the UI (§24). */
export type NotificationCategory = "orders" | "designs" | "quotes" | "delivery";

/** Deterministic priority (§32) — drives ordering + the agent's "next action". */
export type NotificationPriority = "high" | "medium" | "low";

/** The domain a notification originated from (part of its stable identity). */
export type NotificationSourceType =
  | "rfq"
  | "quote"
  | "order"
  | "payment"
  | "fulfillment"
  | "manufacturing"
  | "delivery";

/**
 * The canonical event keys Athathi can notify about. Each maps to a title/body
 * localization key + a category + a priority (see `mapping.ts`). The list is an
 * allowlist — a client-supplied event outside it is rejected (§39 fabricated source).
 */
export type NotificationEventKey =
  // quotes / RFQ
  | "quote_received"
  | "quote_accepted"
  // payment
  | "payment_confirmed"
  | "payment_failed"
  // fulfillment
  | "supplier_accepted"
  | "supplier_declined"
  | "preparing_started"
  | "ready_for_next_stage"
  // manufacturing
  | "manufacturing_started"
  | "quality_review"
  | "manufacturing_ready"
  // delivery / installation
  | "delivery_scheduled"
  | "out_for_delivery"
  | "delivered"
  | "delivery_reschedule"
  | "installation_completed"
  | "order_completed";

/** A deep link into the app (locale-relative path built by the UI). */
export interface NotificationLink {
  /** Which surface: an order, a design, or an RFQ request. */
  kind: "order" | "design" | "request";
  id: string;
}

/**
 * A single in-app notification. `titleKey`/`bodyKey` are localization keys; `params`
 * are safe interpolation values (e.g. an order number) — never secrets/PII beyond
 * the order reference. `read_at` is null while unread.
 */
export interface Notification {
  id: string;
  userId: string;
  audience: NotificationAudience;
  sourceType: NotificationSourceType;
  sourceId: string;
  eventKey: NotificationEventKey;
  category: NotificationCategory;
  priority: NotificationPriority;
  titleKey: string;
  bodyKey: string;
  params: Record<string, string>;
  link?: NotificationLink;
  readAt: number | null;
  createdAt: number;
}

/** The input used to raise a notification (before id/dedupe/enrichment). */
export interface NotificationInput {
  userId: string;
  audience: NotificationAudience;
  sourceType: NotificationSourceType;
  sourceId: string;
  eventKey: NotificationEventKey;
  params?: Record<string, string>;
  link?: NotificationLink;
  /** Creation time (epoch ms). */
  at: number;
}

/** Grouped view for the notification center (§24). */
export interface NotificationGroups {
  today: Notification[];
  earlier: Notification[];
  unreadCount: number;
}

/** Stable, user-safe error codes. */
export type NotificationErrorCode =
  | "invalid-event"
  | "not-owner"
  | "duplicate"
  | "unknown";
