/**
 * Order snapshot builders (Phase 10A, §6). Turn a checkout SOURCE into immutable
 * supplier-grouped snapshots. Prices/names/dimensions/quote terms are copied here
 * so later catalog or quote changes never alter a historical order. Pure +
 * client-safe (reads the catalog query layer + demo suppliers, same shape a DB
 * query returns). The client never supplies a price — everything is resolved
 * from the catalog / the accepted quote.
 */

import {
  getProductBySlug,
  label,
  type ColorId,
  type Product,
} from "@/lib/catalog";
import { demoSupplierByName, demoSupplierById } from "@/lib/repository";
import type { CustomFurnitureSpec, Quote } from "@/lib/rfq";
import { recomputeGroups } from "./totals";
import type {
  CheckoutDraft,
  OrderCustomSnapshot,
  OrderItemSnapshot,
  SupplierOrderGroup,
} from "./types";

/** A minimal cart line the builder needs (slug + colour + qty). */
export interface CartLineInput {
  slug: string;
  colorId?: ColorId;
  quantity: number;
}

/** Resolve a catalog product to an immutable order-item snapshot. */
function snapshotCatalogItem(product: Product, colorId: ColorId | undefined, quantity: number): OrderItemSnapshot {
  const color = colorId ? product.colors.find((c) => c.id === colorId) : undefined;
  const qty = Math.max(1, Math.floor(quantity));
  return {
    kind: "catalog",
    productId: product.id,
    slug: product.slug,
    name: product.name,
    nameAr: product.nameAr,
    category: product.category,
    colorId: color?.id,
    colorLabel: color ? label(color.label, "en") : undefined,
    colorLabelAr: color ? label(color.label, "ar") : undefined,
    materialId: product.materials[0],
    unitPrice: product.price,
    quantity: qty,
    lineTotal: 0, // recomputed by recomputeGroups
    dimensions: product.dimensions,
  };
}

/**
 * Build a cart checkout draft: resolve each line to a REAL catalog product
 * (fakes dropped), snapshot it, group by supplier, and compute totals. Catalog
 * delivery/installation are 0 (unknown/not-supported — stated honestly in UI).
 */
export function buildCartDraft(lines: readonly CartLineInput[]): CheckoutDraft {
  const bySupplier = new Map<string, SupplierOrderGroup>();
  for (const line of lines) {
    const product = getProductBySlug(line.slug);
    if (!product) continue; // catalog truth — drop fakes
    const supplier = demoSupplierByName(product.supplier);
    const supplierId = supplier?.id ?? `demo-${product.supplier}`;
    const supplierName = supplier?.name ?? product.supplier;
    let group = bySupplier.get(supplierId);
    if (!group) {
      group = {
        supplierId,
        supplierName,
        items: [],
        goodsSubtotal: 0,
        deliveryFee: 0,
        installationFee: 0,
        groupTotal: 0,
        status: "new",
      };
      bySupplier.set(supplierId, group);
    }
    group.items.push(snapshotCatalogItem(product, line.colorId, line.quantity));
  }
  // Deterministic supplier order (by id) for stable rendering + tests.
  const groups = [...bySupplier.values()].sort((a, b) => a.supplierId.localeCompare(b.supplierId));
  const { groups: computed, totals } = recomputeGroups(groups);
  return { source: "cart", groups: computed, totals };
}

/**
 * Build an accepted-RFQ checkout draft from a validated accepted quote + its
 * spec. Snapshots the quote's exact terms (delivery/installation/warranty/days).
 * One supplier group, one custom item. The caller MUST have validated ownership +
 * acceptance (see `validation.validateAcceptedQuote`).
 */
export function buildQuoteDraft(spec: CustomFurnitureSpec, quote: Quote): CheckoutDraft {
  const supplier = demoSupplierById(quote.supplierId);
  const item: OrderCustomSnapshot = {
    kind: "custom",
    requestId: quote.requestId,
    quoteId: quote.id,
    spec,
    basePrice: quote.basePrice,
    deliveryFee: quote.deliveryFee,
    installationFee: quote.installationFee,
    lineTotal: 0,
    quantity: Math.max(1, spec.quantity),
    manufacturingDays: quote.manufacturingDays,
    warrantyText: quote.warrantyText,
  };
  const group: SupplierOrderGroup = {
    supplierId: quote.supplierId,
    supplierName: supplier?.name ?? quote.supplierId,
    items: [item],
    goodsSubtotal: 0,
    deliveryFee: 0,
    installationFee: 0,
    groupTotal: 0,
    status: "new",
  };
  const { groups, totals } = recomputeGroups([group]);
  return { source: "accepted_quote", groups, totals, requestId: quote.requestId, quoteId: quote.id };
}

/** Generate a friendly, unique-ish order number (deterministic given a seed). */
export function makeOrderNumber(seed: number): string {
  const base = (seed >>> 0).toString(36).toUpperCase().padStart(6, "0").slice(-6);
  return `ATH-${base}`;
}
