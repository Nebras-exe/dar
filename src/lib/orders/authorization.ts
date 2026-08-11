/**
 * Order authorization rules (Phase 10A, §21/§22). Pure, deterministic mirrors of
 * the RLS policies (`supabase/migrations/0007_orders_rls.sql`): a customer reads
 * only their OWN orders; a supplier reads only the order GROUP(s) belonging to a
 * supplier it is a member of, and never another supplier's items or totals.
 * Unit-tested; dependency-free.
 */

import type { Order, SupplierOrderGroup } from "./types";

export interface OrderPrincipal {
  userId: string;
  /** Supplier ids the user is a member of (usually 0–1 this phase). */
  supplierIds: string[];
}

/** The owning customer may read/act on the whole order. */
export function canReadOrder(principal: OrderPrincipal, order: Pick<Order, "customerId" | "groups">): boolean {
  if (principal.userId === order.customerId) return true;
  // A supplier member may read the order only if it contains their group.
  return order.groups.some((g) => principal.supplierIds.includes(g.supplierId));
}

/** Only the owning customer confirms/cancels the order. */
export function canConfirmOrder(principal: Pick<OrderPrincipal, "userId">, order: Pick<Order, "customerId">): boolean {
  return principal.userId === order.customerId;
}

/** A supplier member may update only a group belonging to their supplier. */
export function canManageGroup(principal: OrderPrincipal, group: Pick<SupplierOrderGroup, "supplierId">): boolean {
  return principal.supplierIds.includes(group.supplierId);
}

/**
 * Redact an order to only the group(s) a supplier may see — used when presenting
 * an order to a supplier, so another supplier's items/totals are never exposed.
 * Returns null if the supplier has no group in this order.
 */
export function redactOrderForSupplier(
  order: Order,
  supplierIds: readonly string[],
): { order: Pick<Order, "id" | "orderNumber" | "status" | "createdAt" | "address" | "isDemo" | "source">; groups: SupplierOrderGroup[] } | null {
  const groups = order.groups.filter((g) => supplierIds.includes(g.supplierId));
  if (groups.length === 0) return null;
  return {
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      address: order.address,
      isDemo: order.isDemo,
      source: order.source,
    },
    groups,
  };
}
