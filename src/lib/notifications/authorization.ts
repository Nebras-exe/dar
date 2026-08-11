/**
 * Notification authorization (Phase 13, §27/§39). Pure mirrors of the RLS policies
 * (`supabase/migrations/0019_notifications_rls.sql`):
 *  - a user may read/update ONLY their own notifications;
 *  - supplier notifications belong to supplier members only (separate feed, §28);
 *  - no cross-user access; no public access.
 * Unit-tested; dependency-free.
 */

import type { Notification } from "./types";

export interface NotificationPrincipal {
  userId: string;
}

export function canReadNotification(principal: NotificationPrincipal, n: Pick<Notification, "userId">): boolean {
  return principal.userId === n.userId;
}

export function canUpdateNotification(principal: NotificationPrincipal, n: Pick<Notification, "userId">): boolean {
  return principal.userId === n.userId;
}
