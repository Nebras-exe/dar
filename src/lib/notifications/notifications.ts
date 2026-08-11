/**
 * Notification operations (Phase 13). Pure + deterministic so they run identically
 * in the demo store and (later) a server route handler.
 *
 * Invariants enforced here:
 *  1. ALLOWLISTED EVENTS (§39): only mapped event keys become notifications; a
 *     fabricated event/priority is rejected (the client can't forge a high-priority
 *     system notification).
 *  2. DEDUPE (§25): identity is `(userId, sourceType, sourceId, eventKey)` — the
 *     same event re-ingested (page reload / rehydration) never duplicates.
 *  3. STRUCTURED PAYLOAD (§26): localization keys + safe params, not rendered text.
 *  4. OWNERSHIP (§27): every operation is scoped to a userId; cross-user reads/
 *     writes are impossible through this API.
 */

import { eventMeta, isNotificationEvent, priorityRank } from "./mapping";
import type {
  Notification,
  NotificationGroups,
  NotificationInput,
} from "./types";

/** A stable dedupe key for an event occurrence (§25). */
export function notificationKey(userId: string, sourceType: string, sourceId: string, eventKey: string): string {
  return `${userId}::${sourceType}::${sourceId}::${eventKey}`;
}

/**
 * Build a notification from an input, or null if the event is not allowlisted
 * (§39). The id IS the dedupe key so re-ingesting the same event is idempotent.
 */
export function buildNotification(input: NotificationInput): Notification | null {
  if (!isNotificationEvent(input.eventKey)) return null;
  if (!input.userId || !input.sourceId) return null;
  const meta = eventMeta(input.eventKey);
  return {
    id: notificationKey(input.userId, input.sourceType, input.sourceId, input.eventKey),
    userId: input.userId,
    audience: input.audience,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    eventKey: input.eventKey,
    category: meta.category,
    priority: meta.priority,
    titleKey: meta.titleKey,
    bodyKey: meta.bodyKey,
    params: input.params ?? {},
    ...(input.link ? { link: input.link } : {}),
    readAt: null,
    createdAt: input.at,
  };
}

/**
 * Ingest a batch of inputs into an existing list, deduplicated (§25). Existing
 * notifications (by id) are preserved (read state kept); only genuinely new events
 * are appended. Returns the merged, newest-first list.
 */
export function ingest(existing: readonly Notification[], inputs: readonly NotificationInput[]): Notification[] {
  const byId = new Map(existing.map((n) => [n.id, n]));
  for (const input of inputs) {
    const built = buildNotification(input);
    if (!built) continue;
    if (byId.has(built.id)) continue; // dedupe — keep the existing (with its read state)
    byId.set(built.id, built);
  }
  return [...byId.values()].sort((a, b) => b.createdAt - a.createdAt);
}

/** Notifications for a user (ownership-scoped, §27). */
export function forUser(all: readonly Notification[], userId: string): Notification[] {
  return all.filter((n) => n.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
}

export function unreadCount(all: readonly Notification[], userId: string): number {
  return all.reduce((n, x) => (x.userId === userId && x.readAt === null ? n + 1 : n), 0);
}

/** Mark one notification read (owner only). Returns a new list. */
export function markRead(all: readonly Notification[], userId: string, id: string, now: number): Notification[] {
  return all.map((n) => (n.id === id && n.userId === userId && n.readAt === null ? { ...n, readAt: now } : n));
}

/** Mark all of a user's notifications read. */
export function markAllRead(all: readonly Notification[], userId: string, now: number): Notification[] {
  return all.map((n) => (n.userId === userId && n.readAt === null ? { ...n, readAt: now } : n));
}

/** Remove one notification (owner only). */
export function dismiss(all: readonly Notification[], userId: string, id: string): Notification[] {
  return all.filter((n) => !(n.id === id && n.userId === userId));
}

const DAY = 86_400_000;

/** Group a user's notifications into Today / Earlier for the center (§24). */
export function groupForUser(all: readonly Notification[], userId: string, now: number): NotificationGroups {
  const mine = forUser(all, userId);
  const startOfToday = now - (now % DAY);
  const today: Notification[] = [];
  const earlier: Notification[] = [];
  for (const n of mine) (n.createdAt >= startOfToday ? today : earlier).push(n);
  return { today, earlier, unreadCount: mine.reduce((c, n) => (n.readAt === null ? c + 1 : c), 0) };
}

/** The highest-priority unread notification for a user (drives the agent hint). */
export function topUnread(all: readonly Notification[], userId: string): Notification | null {
  const unread = forUser(all, userId).filter((n) => n.readAt === null);
  if (unread.length === 0) return null;
  return unread.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || b.createdAt - a.createdAt)[0];
}
