/**
 * Notification sink adapters (Phase 13, §22/§29). The prior phases' Demo/Log
 * notifiers RECORD domain events; Phase 13 adds an IN-APP sink behind the same
 * conceptual interface, feeding the notification center. Future providers
 * (Email / WhatsApp / Push) implement the SAME `NotificationSink` — but Phase 13
 * ships ONLY the in-app sink. No external send, ever, here.
 *
 * The in-app sink is intentionally a thin contract: the demo store implements it
 * over `localStorage`; a server route would implement it over the `notifications`
 * table. Both go through `ingest` (dedupe + allowlist), so neither can duplicate
 * or forge notifications.
 */

import type { NotificationInput } from "./types";

/** Channel availability (§29). Only in-app is connected in Phase 13. */
export type NotificationChannel = "in_app" | "email" | "whatsapp" | "push";

export const CHANNEL_STATUS: Record<NotificationChannel, "available" | "not_connected"> = {
  in_app: "available",
  email: "not_connected",
  whatsapp: "not_connected",
  push: "not_connected",
};

/** A sink receives domain events. In-app persists them; future sinks would send. */
export interface NotificationSink {
  readonly channel: NotificationChannel;
  /** Deliver a batch. In-app returns how many NEW notifications were persisted. */
  deliver(inputs: readonly NotificationInput[]): { channel: NotificationChannel; accepted: number; sent: false };
}

/**
 * A no-op/log sink used to represent a NOT-CONNECTED future channel honestly. It
 * never sends and accepts nothing — the UI shows it as "Not connected" (§29), so
 * there's no toggle that falsely implies real delivery.
 */
export class UnconnectedSink implements NotificationSink {
  readonly channel: NotificationChannel;
  constructor(channel: NotificationChannel) {
    this.channel = channel;
  }
  deliver(): { channel: NotificationChannel; accepted: 0; sent: false } {
    return { channel: this.channel, accepted: 0, sent: false };
  }
}
