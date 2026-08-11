/**
 * Public In-App Notifications API surface (Phase 13). Client-safe: types, the
 * deterministic event mapping (category/priority/keys), dedupe + ingest + read-
 * state operations, grouping for the center, authorization, and the sink adapter
 * contract (in-app only; future channels shown as "not connected"). A REAL in-app
 * system — never external messaging.
 */

export * from "./types";
export {
  isNotificationEvent,
  eventMeta,
  priorityRank,
} from "./mapping";
export {
  notificationKey,
  buildNotification,
  ingest,
  forUser,
  unreadCount,
  markRead,
  markAllRead,
  dismiss,
  groupForUser,
  topUnread,
} from "./notifications";
export {
  canReadNotification,
  canUpdateNotification,
  type NotificationPrincipal,
} from "./authorization";
export {
  CHANNEL_STATUS,
  UnconnectedSink,
  type NotificationChannel,
  type NotificationSink,
} from "./adapter";
