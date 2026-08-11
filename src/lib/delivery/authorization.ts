/**
 * Delivery authorization (Phase 12, §33/§34). Pure mirrors of the RLS policies
 * (`supabase/migrations/0015_delivery_rls.sql`):
 *  - the owning CUSTOMER may READ delivery/installation status for their own order
 *    (never write, and never another customer's);
 *  - a SUPPLIER MEMBER may read AND update ONLY deliveries of their own supplier
 *    group — supplier A can never read or mutate supplier B's delivery (incl. the
 *    customer phone/address on it);
 *  - the AGENT is READ-ONLY (§31);
 *  - PUBLIC has no access.
 * Unit-tested; dependency-free.
 */

import type { Delivery } from "./types";

export interface DeliveryPrincipal {
  userId: string;
  supplierIds: string[];
}

/** Customer reads own delivery; supplier reads its own supplier's deliveries. */
export function canReadDelivery(
  principal: DeliveryPrincipal,
  delivery: Pick<Delivery, "customerId" | "supplierId">,
): boolean {
  if (principal.userId === delivery.customerId) return true;
  return principal.supplierIds.includes(delivery.supplierId);
}

/**
 * Only a member of the delivery's OWN supplier may update it (schedule/assign/
 * out-for-delivery/failed/reschedule/delivered/installation/handover). The
 * customer never writes operational status (§33); a supplier never writes another
 * supplier's delivery.
 */
export function canManageDelivery(
  principal: Pick<DeliveryPrincipal, "supplierIds">,
  delivery: Pick<Delivery, "supplierId">,
): boolean {
  return principal.supplierIds.includes(delivery.supplierId);
}

/**
 * Scheduling the delivery WINDOW is a customer choice (§11) — but only for their
 * own order, and only the slot (never the operational status). Everything else is
 * supplier-only.
 */
export function canCustomerScheduleDelivery(
  principal: Pick<DeliveryPrincipal, "userId">,
  delivery: Pick<Delivery, "customerId">,
): boolean {
  return principal.userId === delivery.customerId;
}

/** The customer may never mutate supplier operational status (§33). */
export function canCustomerWriteDeliveryStatus(): boolean {
  return false;
}

/**
 * The Agent's authority over delivery is READ-ONLY (§31): it may summarize status
 * / window / next step, but never schedules, assigns, marks out-for-delivery /
 * delivered, completes installation, or confirms handover. Documents + tests the
 * boundary.
 */
export const AGENT_CAN_MANAGE_DELIVERY = false as const;
