/**
 * Order money math + supplier grouping (Phase 10A). All arithmetic is here, in
 * exact 3-decimal OMR — never done by an LLM, never derived from a formatted
 * string. Pure + client-safe. These functions are the single source of order
 * totals; the client never asserts a total.
 */

import { roundOmr } from "@/lib/catalog";
import type {
  CheckoutTotals,
  OrderItem,
  SupplierOrderGroup,
} from "./types";

/** Recompute a single item's line total from its snapshot (defensive). */
export function itemLineTotal(item: OrderItem): number {
  if (item.kind === "catalog") {
    return roundOmr(item.unitPrice * item.quantity);
  }
  // Custom: base + delivery + installation are the line total (qty already in price).
  return roundOmr(roundOmr(item.basePrice + item.deliveryFee) + item.installationFee);
}

/** Recompute a supplier group's subtotals from its items (authoritative).
 * Also stamps each item's `lineTotal` so snapshots carry the correct figure. */
export function computeGroupTotals(group: SupplierOrderGroup): SupplierOrderGroup {
  let goods = 0;
  let delivery = group.deliveryFee;
  let installation = group.installationFee;
  const items = group.items.map((item) => {
    const lineTotal = itemLineTotal(item);
    if (item.kind === "catalog") {
      goods = roundOmr(goods + roundOmr(item.unitPrice * item.quantity));
    } else {
      // A custom line carries its own delivery/installation; goods = basePrice.
      goods = roundOmr(goods + item.basePrice);
      delivery = roundOmr(delivery + item.deliveryFee);
      installation = roundOmr(installation + item.installationFee);
    }
    return { ...item, lineTotal };
  });
  const groupTotal = roundOmr(roundOmr(goods + delivery) + installation);
  return { ...group, items, goodsSubtotal: goods, deliveryFee: delivery, installationFee: installation, groupTotal };
}

/** Compute the whole-order totals across all supplier groups. */
export function computeCheckoutTotals(groups: readonly SupplierOrderGroup[]): CheckoutTotals {
  let goods = 0;
  let delivery = 0;
  let installation = 0;
  let itemCount = 0;
  for (const g of groups) {
    goods = roundOmr(goods + g.goodsSubtotal);
    delivery = roundOmr(delivery + g.deliveryFee);
    installation = roundOmr(installation + g.installationFee);
    for (const item of g.items) {
      itemCount += item.kind === "catalog" ? item.quantity : item.quantity;
    }
  }
  return {
    goodsSubtotal: goods,
    deliveryTotal: delivery,
    installationTotal: installation,
    grandTotal: roundOmr(roundOmr(goods + delivery) + installation),
    itemCount,
    supplierCount: groups.length,
  };
}

/** Recompute every group + the order totals (used before confirm). */
export function recomputeGroups(groups: readonly SupplierOrderGroup[]): {
  groups: SupplierOrderGroup[];
  totals: CheckoutTotals;
} {
  const computed = groups.map(computeGroupTotals);
  return { groups: computed, totals: computeCheckoutTotals(computed) };
}
