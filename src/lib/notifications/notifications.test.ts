/**
 * In-app notification tests (Phase 13, §48). All pure + deterministic — no
 * external send. Covers: create from allowlisted event, dedupe on re-ingest,
 * unread count, mark one/all read, deep-link metadata, ownership + cross-user
 * isolation, fabricated/invalid source rejection, event → category/priority
 * mapping, grouping, top-unread priority, and the not-connected channels.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildNotification, ingest, forUser, unreadCount, markRead, markAllRead, dismiss,
  groupForUser, topUnread, notificationKey, isNotificationEvent, eventMeta,
  canReadNotification, canUpdateNotification, CHANNEL_STATUS, UnconnectedSink,
  type NotificationInput, type Notification,
} from "./index";

function input(over: Partial<NotificationInput> = {}): NotificationInput {
  return {
    userId: "u1", audience: "customer", sourceType: "payment", sourceId: "ord-1",
    eventKey: "payment_confirmed", params: { orderNumber: "ATH-000001" },
    link: { kind: "order", id: "ord-1" }, at: 1000, ...over,
  };
}

// ── Create + mapping (§21) ────────────────────────────────────────────────────

test("build: allowlisted event → structured notification with mapped meta", () => {
  const n = buildNotification(input())!;
  assert.ok(n);
  assert.equal(n.category, "orders");
  assert.equal(n.priority, "medium");
  assert.equal(n.titleKey, "payment_confirmed.title");
  assert.equal(n.params.orderNumber, "ATH-000001");
  assert.deepEqual(n.link, { kind: "order", id: "ord-1" });
  assert.equal(n.readAt, null);
});

test("mapping: priorities follow §32 (payment_failed = high)", () => {
  assert.equal(eventMeta("payment_failed").priority, "high");
  assert.equal(eventMeta("delivery_reschedule").priority, "high");
  assert.equal(eventMeta("supplier_declined").priority, "high");
  assert.equal(eventMeta("quote_received").priority, "medium");
  assert.equal(eventMeta("preparing_started").priority, "low");
});

// ── Fabricated / invalid source rejected (§39) ────────────────────────────────

test("fabricated event key is rejected (no forged notification)", () => {
  assert.equal(isNotificationEvent("payment_confirmed"), true);
  assert.equal(isNotificationEvent("make_me_admin"), false);
  assert.equal(buildNotification(input({ eventKey: "make_me_admin" as never })), null);
  assert.equal(buildNotification(input({ userId: "" })), null);
  assert.equal(buildNotification(input({ sourceId: "" })), null);
});

// ── Dedupe (§25) ──────────────────────────────────────────────────────────────

test("dedupe: re-ingesting the same event never duplicates", () => {
  let list: Notification[] = [];
  list = ingest(list, [input()]);
  assert.equal(list.length, 1);
  // Same (user, source, event) again — e.g. a page reload.
  list = ingest(list, [input()]);
  assert.equal(list.length, 1);
  // A different event on the same order is a new notification.
  list = ingest(list, [input({ sourceType: "delivery", sourceId: "del-1", eventKey: "delivered" })]);
  assert.equal(list.length, 2);
  // The id is exactly the stable dedupe key.
  assert.equal(list.some((n) => n.id === notificationKey("u1", "payment", "ord-1", "payment_confirmed")), true);
});

test("dedupe preserves read state on re-ingest", () => {
  let list = ingest([], [input()]);
  list = markRead(list, "u1", list[0].id, 2000);
  assert.equal(list[0].readAt, 2000);
  // Re-ingest must not resurrect it as unread.
  list = ingest(list, [input()]);
  assert.equal(list.find((n) => n.id === list[0].id)?.readAt, 2000);
});

// ── Unread + read actions (§23) ───────────────────────────────────────────────

test("unread count, mark one, mark all", () => {
  let list = ingest([], [
    input({ sourceType: "payment", sourceId: "o1", eventKey: "payment_confirmed" }),
    input({ sourceType: "delivery", sourceId: "d1", eventKey: "delivered", at: 1001 }),
  ]);
  assert.equal(unreadCount(list, "u1"), 2);
  list = markRead(list, "u1", list[1].id, 2000);
  assert.equal(unreadCount(list, "u1"), 1);
  list = markAllRead(list, "u1", 3000);
  assert.equal(unreadCount(list, "u1"), 0);
});

// ── Ownership + cross-user isolation (§27/§39) ────────────────────────────────

test("ownership: a user sees + mutates only their own notifications", () => {
  const list = ingest([], [input({ userId: "u1" }), input({ userId: "u2", sourceId: "o2" })]);
  assert.equal(forUser(list, "u1").length, 1);
  assert.equal(forUser(list, "u2").length, 1);
  // u1 cannot mark u2's notification read.
  const u2id = forUser(list, "u2")[0].id;
  const after = markRead(list, "u1", u2id, 5000);
  assert.equal(after.find((n) => n.id === u2id)?.readAt, null); // untouched
  // authz mirrors.
  assert.equal(canReadNotification({ userId: "u1" }, { userId: "u1" }), true);
  assert.equal(canReadNotification({ userId: "u1" }, { userId: "u2" }), false);
  assert.equal(canUpdateNotification({ userId: "u1" }, { userId: "u2" }), false);
});

test("dismiss removes only the owner's notification", () => {
  const list = ingest([], [input({ userId: "u1" }), input({ userId: "u2", sourceId: "o2" })]);
  const u2id = forUser(list, "u2")[0].id;
  assert.equal(dismiss(list, "u1", u2id).length, 2); // u1 can't dismiss u2's
  assert.equal(dismiss(list, "u2", u2id).length, 1);
});

// ── Grouping + top-unread priority (§24/§32) ──────────────────────────────────

test("grouping into Today / Earlier + top-unread by priority", () => {
  const now = 10 * 86_400_000 + 43_200_000; // day 10, midday
  const list = ingest([], [
    input({ sourceType: "payment", sourceId: "o1", eventKey: "payment_confirmed", at: now - 5000 }), // today, medium
    input({ sourceType: "delivery", sourceId: "d1", eventKey: "delivery_reschedule", at: now - 3 * 86_400_000 }), // earlier, high
  ]);
  const g = groupForUser(list, "u1", now);
  assert.equal(g.today.length, 1);
  assert.equal(g.earlier.length, 1);
  assert.equal(g.unreadCount, 2);
  // Top unread is the HIGH-priority reschedule even though it's older.
  assert.equal(topUnread(list, "u1")?.eventKey, "delivery_reschedule");
});

// ── Channels (§29): only in-app connected; no external send ───────────────────

test("only in-app is available; future channels are not connected + never send", () => {
  assert.equal(CHANNEL_STATUS.in_app, "available");
  assert.equal(CHANNEL_STATUS.email, "not_connected");
  assert.equal(CHANNEL_STATUS.whatsapp, "not_connected");
  assert.equal(CHANNEL_STATUS.push, "not_connected");
  const email = new UnconnectedSink("email").deliver();
  assert.equal(email.sent, false);
  assert.equal(email.accepted, 0);
});
