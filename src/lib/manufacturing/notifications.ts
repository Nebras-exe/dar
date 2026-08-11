/**
 * Manufacturing notification abstraction (Phase 11B, §24).
 *
 * ZERO external messaging. This is an ADAPTER/CONTRACT only — no email, SMS,
 * WhatsApp, or push is ever sent, because that would call a billable external
 * service. The Demo/Log adapter RECORDS a notification and returns a receipt; it
 * never delivers. A real provider is wired later behind the same interface.
 */

import type { ManufacturingEventType } from "./types";

export type NotificationAudience = "supplier" | "customer";

export interface ManufacturingNotificationInput {
  audience: NotificationAudience;
  jobId: string;
  orderNumber: string;
  event: ManufacturingEventType;
  messageKey: string;
}

export interface ManufacturingNotificationReceipt {
  id: string;
  audience: NotificationAudience;
  jobId: string;
  orderNumber: string;
  event: ManufacturingEventType;
  messageKey: string;
  channel: "demo-log";
  delivered: false;
  recorded: true;
  at: number;
}

export interface ManufacturingNotifier {
  readonly id: string;
  notify(input: ManufacturingNotificationInput): ManufacturingNotificationReceipt;
}

class DemoLogNotifier implements ManufacturingNotifier {
  readonly id = "demo-log";
  private readonly log: ManufacturingNotificationReceipt[] = [];
  private seq = 0;

  notify(input: ManufacturingNotificationInput): ManufacturingNotificationReceipt {
    const at = Date.now();
    const receipt: ManufacturingNotificationReceipt = {
      id: `mntf_${at.toString(36)}_${(this.seq++).toString(36)}`,
      audience: input.audience, jobId: input.jobId, orderNumber: input.orderNumber,
      event: input.event, messageKey: input.messageKey,
      channel: "demo-log", delivered: false, recorded: true, at,
    };
    this.log.push(receipt);
    if (this.log.length > 200) this.log.shift();
    if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
      console.info(`[manufacturing] notification recorded in Demo Mode → ${input.audience}: ${input.event} (${input.orderNumber})`);
    }
    return receipt;
  }

  recorded(): readonly ManufacturingNotificationReceipt[] {
    return this.log;
  }
}

export const manufacturingNotifier = new DemoLogNotifier();
