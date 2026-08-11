/**
 * Fulfillment notification abstraction (Phase 11A, §20/§21/§30).
 *
 * ZERO external messaging. This is an ADAPTER/CONTRACT only — no email, SMS,
 * WhatsApp, or push is ever sent, because that would call a billable external
 * service. The Demo/Log adapter RECORDS a notification ("queued in Demo Mode")
 * and returns a receipt; it never delivers. A real provider is wired later behind
 * the same `FulfillmentNotifier` interface with no call-site changes.
 *
 * Copy rule (§30): never claim "Supplier notified by WhatsApp". The demo receipt
 * says "recorded in Demo Mode".
 */

import type { FulfillmentEventType } from "./types";

/** Who a notification is addressed to. */
export type NotificationAudience = "supplier" | "customer";

export interface NotificationInput {
  audience: NotificationAudience;
  fulfillmentId: string;
  orderNumber: string;
  event: FulfillmentEventType;
  /** Safe, already-localised or key-based message — never secrets/PII beyond the order ref. */
  messageKey: string;
}

export interface NotificationReceipt {
  id: string;
  audience: NotificationAudience;
  fulfillmentId: string;
  orderNumber: string;
  event: FulfillmentEventType;
  messageKey: string;
  /** The channel actually used. In this phase, always the demo log. */
  channel: "demo-log";
  /** A real message was NEVER sent — recorded only. */
  delivered: false;
  recorded: true;
  at: number;
}

/** The provider-agnostic contract. A real email/SMS/push provider implements this later. */
export interface FulfillmentNotifier {
  readonly id: string;
  notify(input: NotificationInput): NotificationReceipt;
}

/**
 * Demo/Log notifier — the only implementation this phase. Records to an in-memory
 * ring buffer (and a dev console line) and returns a `delivered:false` receipt.
 * No network, no external service, no credits.
 */
class DemoLogNotifier implements FulfillmentNotifier {
  readonly id = "demo-log";
  private readonly log: NotificationReceipt[] = [];
  private seq = 0;

  notify(input: NotificationInput): NotificationReceipt {
    const at = Date.now();
    const receipt: NotificationReceipt = {
      id: `ntf_${at.toString(36)}_${(this.seq++).toString(36)}`,
      audience: input.audience,
      fulfillmentId: input.fulfillmentId,
      orderNumber: input.orderNumber,
      event: input.event,
      messageKey: input.messageKey,
      channel: "demo-log",
      delivered: false,
      recorded: true,
      at,
    };
    this.log.push(receipt);
    if (this.log.length > 200) this.log.shift();
    // Honest wording (§30): recorded in Demo Mode, not actually sent.
    if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
      console.info(`[fulfillment] notification recorded in Demo Mode → ${input.audience}: ${input.event} (${input.orderNumber})`);
    }
    return receipt;
  }

  /** Read the recorded notifications (tests / a future in-app inbox). */
  recorded(): readonly NotificationReceipt[] {
    return this.log;
  }
}

export const demoNotifier = new DemoLogNotifier();
