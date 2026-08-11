/**
 * Fulfillment authorization (Phase 11A, §26/§27). Pure mirrors of the RLS
 * policies (`supabase/migrations/0011_fulfillment_rls.sql`):
 *  - the owning CUSTOMER may READ the fulfillment of their own order (never write);
 *  - a SUPPLIER MEMBER may read AND update ONLY fulfillments of their own supplier
 *    groups — supplier A can never mutate (or read) supplier B's fulfillment;
 *  - the AGENT is READ-ONLY (§25) — it may summarize, never accept/decline/prepare/ready;
 *  - PUBLIC has no access.
 * Unit-tested; dependency-free.
 */

import type { Fulfillment } from "./types";

export interface FulfillmentPrincipal {
  userId: string;
  /** Supplier ids the user is a member of (usually 0–1 this phase). */
  supplierIds: string[];
}

/** The owning customer may READ their order's fulfillment. Suppliers may read their own group's. */
export function canReadFulfillment(
  principal: FulfillmentPrincipal,
  fulfillment: Pick<Fulfillment, "customerId" | "supplierId">,
): boolean {
  if (principal.userId === fulfillment.customerId) return true;
  return principal.supplierIds.includes(fulfillment.supplierId);
}

/**
 * Only a member of the fulfillment's OWN supplier may update it (accept/decline/
 * prepare/ready). The customer never writes fulfillment state (§28); a supplier
 * never writes another supplier's fulfillment.
 */
export function canManageFulfillment(
  principal: Pick<FulfillmentPrincipal, "supplierIds">,
  fulfillment: Pick<Fulfillment, "supplierId">,
): boolean {
  return principal.supplierIds.includes(fulfillment.supplierId);
}

/** The customer may never mutate fulfillment status (§28) — writes are supplier-only. */
export function canCustomerWriteFulfillment(): boolean {
  return false;
}

/**
 * The Agent's authority over fulfillment is READ-ONLY (§25): it may summarize and
 * explain the next step, but may never accept, decline, mark preparing, or mark
 * ready. This constant documents + tests the boundary.
 */
export const AGENT_CAN_MANAGE_FULFILLMENT = false as const;
