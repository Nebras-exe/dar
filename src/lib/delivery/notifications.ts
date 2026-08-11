/**
 * Delivery notification abstraction + demo assignment (Phase 12, §15/§32).
 *
 * ZERO external messaging. No SMS/WhatsApp/email/push, no courier API. The
 * Demo/Log notifier RECORDS a notification and returns a receipt; it never
 * delivers. The demo assignee is a clearly-labelled fictional team — never a
 * fabricated real driver identity. Real providers wire in later behind the same
 * interfaces.
 */

import type { DeliveryAssignment, DeliveryEventType } from "./types";

export type NotificationAudience = "supplier" | "customer";

export interface DeliveryNotificationInput {
  audience: NotificationAudience;
  deliveryId: string;
  orderNumber: string;
  event: DeliveryEventType;
  messageKey: string;
}

export interface DeliveryNotificationReceipt {
  id: string;
  audience: NotificationAudience;
  deliveryId: string;
  orderNumber: string;
  event: DeliveryEventType;
  messageKey: string;
  channel: "demo-log";
  delivered: false;
  recorded: true;
  at: number;
}

export interface DeliveryNotifier {
  readonly id: string;
  notify(input: DeliveryNotificationInput): DeliveryNotificationReceipt;
}

class DemoLogNotifier implements DeliveryNotifier {
  readonly id = "demo-log";
  private readonly log: DeliveryNotificationReceipt[] = [];
  private seq = 0;

  notify(input: DeliveryNotificationInput): DeliveryNotificationReceipt {
    const at = Date.now();
    const receipt: DeliveryNotificationReceipt = {
      id: `dntf_${at.toString(36)}_${(this.seq++).toString(36)}`,
      audience: input.audience, deliveryId: input.deliveryId, orderNumber: input.orderNumber,
      event: input.event, messageKey: input.messageKey,
      channel: "demo-log", delivered: false, recorded: true, at,
    };
    this.log.push(receipt);
    if (this.log.length > 200) this.log.shift();
    if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
      console.info(`[delivery] notification recorded in Demo Mode → ${input.audience}: ${input.event} (${input.orderNumber})`);
    }
    return receipt;
  }

  recorded(): readonly DeliveryNotificationReceipt[] {
    return this.log;
  }
}

export const deliveryNotifier = new DemoLogNotifier();

/**
 * A DEMO delivery assignment (§15). The provider/assignee is fictional and always
 * labelled Demo in the UI — no real courier is contacted, no real driver named.
 * A real `DeliveryProvider` implements this shape later.
 */
export function demoAssignment(now: number): DeliveryAssignment {
  return { providerId: "demo-team", assigneeName: "Demo Delivery Team", isDemo: true, at: now };
}
