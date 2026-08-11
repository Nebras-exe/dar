# In-App Notifications (Phase 13)

A **real in-app notification system** — never external messaging. Domain events from
the whole pipeline (RFQ / quote / order / payment / fulfillment / manufacturing / QC /
delivery / installation) become a per-user feed with an unread badge, a grouped center,
deep links, and read state. No SMS / WhatsApp / email / push, no external send.

## Sources → events (§21)

Events are DERIVED deterministically from the user's own stores (payment / fulfillment /
manufacturing / delivery). The canonical event keys (allowlisted) map to a category +
priority + localization keys in `mapping.ts`:

| Event | Category | Priority |
|---|---|---|
| `payment_confirmed` | orders | medium |
| `payment_failed` | orders | **high** |
| `supplier_accepted` | orders | medium |
| `supplier_declined` | orders | **high** |
| `preparing_started` / `ready_for_next_stage` | orders | low |
| `manufacturing_started` | orders | low |
| `quality_review` / `manufacturing_ready` | orders | medium |
| `quote_received` | quotes | medium |
| `delivery_scheduled` / `out_for_delivery` / `delivered` | delivery | medium |
| `delivery_reschedule` | delivery | **high** |
| `installation_completed` / `order_completed` | orders / delivery | low |

A high-signal subset (§24) — not every internal state-machine tick — so the feed isn't
noisy.

## Deduplication (§25) — critical

Identity is `(userId, sourceType, sourceId, eventKey)`, and that string **is** the
notification id. Repeated page loads / rehydration re-ingest the same events, and
`ingest` drops any whose id already exists — **preserving the existing read state**. A
second page load never resurrects a read notification as unread. Unit-tested.

## Structured payload (§26)

Notifications store **localization keys + safe params** (e.g.
`{ titleKey: "payment_confirmed.title", params: { orderNumber: "ATH-000001" } }`) — not
pre-rendered strings. The UI interpolates + localizes at render, so EN/AR both read
naturally and the stored data stays small.

## Domain layer — `src/lib/notifications/`

| File | Responsibility |
|---|---|
| `types.ts` | `Notification`, `NotificationInput`, category/priority/source enums, `NotificationLink`, `NotificationGroups`. |
| `mapping.ts` | `isNotificationEvent` (allowlist), `eventMeta` (category/priority/keys), `priorityRank`. |
| `notifications.ts` | `buildNotification`, `ingest` (dedupe), `forUser`, `unreadCount`, `markRead`/`markAllRead`/`dismiss`, `groupForUser` (Today/Earlier), `topUnread`. |
| `authorization.ts` | Owner-only read/update. |
| `adapter.ts` | `NotificationSink` contract + `CHANNEL_STATUS` (in-app available; email/whatsapp/push **not connected**) + `UnconnectedSink` (never sends). |

## Notification center (§23/§24)

A header **bell** with an unread badge (`aria-live` announcement) opens a dropdown
center: grouped **Today / Earlier**, each item showing an icon, localized title + body,
timestamp, an unread dot, mark-read + dismiss controls, and a **deep link** to the
relevant order/design/request. **Mark all as read** at the top. Escape / click-outside
to close. Premium + calm — not a social-media feed.

## Channels (§29) — honest availability

Only **in-app** is connected. Email / WhatsApp / Push are shown as **Not connected** —
there is no toggle that falsely implies real delivery. Future providers implement the
same `NotificationSink` behind the same contract.

## Authorization + RLS (§27/§39)

A user reads/updates **only their own** notifications. Cross-user access is impossible
through the API (every op is userId-scoped), and a **fabricated event key or forged
source is rejected** by the allowlist + the `(user, source, event)` unique key — a
client can't inject a high-priority "system" notification. `0019_notifications_rls.sql`
enforces owner-only select/update/delete/insert.

## Demo Mode

Without Supabase, notifications live in `localStorage` (`athathi.notifications.v1`),
derived from the user's own orders on mount (deduped). This is the **in-app sink** — no
external message is ever sent.

## Persistence

- **Demo (running):** `athathi.notifications.v1` (per browser).
- **Supabase (gated):** `notifications` with `unique(user_id, source_type, source_id,
  event_key)` (dedupe) + owner-only RLS in `0019`.
