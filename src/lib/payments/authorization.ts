/**
 * Payment authorization (Phase 10B, §21/§22/§25/§27). Pure mirrors of the RLS
 * policies (`supabase/migrations/0009_payments_rls.sql`): only the order-owning
 * customer may create/verify/retry/read a payment; a supplier may see ONLY a
 * safe payment-status summary of an order that includes their group (never
 * method/attempts/provider metadata); the Agent has read-only summarization.
 * Unit-tested; dependency-free.
 */

import type { Order } from "@/lib/orders";
import type { PaymentIntent, PaymentStatus } from "./types";

export interface PaymentPrincipal {
  userId: string;
  supplierIds: string[];
}

/** Only the order-owning customer may create/verify/retry/read the payment. */
export function canPayOrder(principal: Pick<PaymentPrincipal, "userId">, order: Pick<Order, "customerId">): boolean {
  return principal.userId === order.customerId;
}

/** Only the owning customer may read the full intent. */
export function canReadIntent(principal: Pick<PaymentPrincipal, "userId">, intent: Pick<PaymentIntent, "customerId">): boolean {
  return principal.userId === intent.customerId;
}

/**
 * A supplier may see only a SAFE payment-status summary of an order that includes
 * their group — Paid / Awaiting payment — and nothing else (§25). Returns null
 * when the supplier has no group in the order.
 */
export function supplierPaymentView(
  order: Pick<Order, "groups">,
  supplierIds: readonly string[],
  status: PaymentStatus,
): { paid: boolean } | null {
  const hasGroup = order.groups.some((g) => supplierIds.includes(g.supplierId));
  if (!hasGroup) return null;
  return { paid: status === "paid" };
}

/**
 * The Agent's authority over payments is READ-ONLY (§27): it may summarize
 * status but may never create/verify/complete a payment or change the method.
 * There is no "agent can pay" path — this constant documents + tests the boundary.
 */
export const AGENT_CAN_PAY = false as const;
