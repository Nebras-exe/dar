/**
 * Athathi Orders — domain contracts (Phase 10A).
 *
 * ONE order architecture serves TWO checkout sources — a normal catalog cart and
 * an accepted custom RFQ quote. An order is an IMMUTABLE snapshot of the purchase:
 * later catalog/price/quote changes never alter a historical order. An order may
 * span multiple suppliers, so items are grouped into `SupplierOrderGroup`s. All
 * money is exact 3-decimal OMR computed in code — never by an LLM, never stored
 * as a formatted string.
 *
 * **No payment in Phase 10A.** The final action confirms an order (draft/demo);
 * payment states are intentionally absent (they arrive in Phase 10B). Kept free
 * of server/React imports so the types + builders + validators run on the client
 * and in Node tests.
 */

import type {
  CategorySlug,
  ColorId,
  Dimensions,
  MaterialId,
} from "@/lib/catalog";
import type { CustomFurnitureSpec } from "@/lib/rfq";

/** Where the order came from. */
export type OrderSource = "cart" | "accepted_quote";

/** Phase 10A order lifecycle (no payment states — see Phase 10B). */
export type OrderStatus =
  | "draft"
  | "confirmed"
  | "processing"
  | "cancelled"
  | "completed";

/** Per-supplier acknowledgement within an order (Phase 10A supplier actions). */
export type SupplierGroupStatus = "new" | "acknowledged" | "processing";

/**
 * A snapshotted catalog line. Prices/name/dimensions are copied at order time so
 * the historical record is immutable. `unitPrice × quantity = lineTotal`.
 */
export interface OrderItemSnapshot {
  kind: "catalog";
  productId: string;
  slug: string;
  name: string;
  nameAr: string;
  category: CategorySlug;
  colorId?: ColorId;
  colorLabel?: string;
  colorLabelAr?: string;
  materialId?: MaterialId;
  /** Numeric OMR, 3-decimal. */
  unitPrice: number;
  quantity: number;
  /** Derived: roundOmr(unitPrice × quantity). */
  lineTotal: number;
  dimensions?: Dimensions;
}

/**
 * A snapshotted custom (RFQ) line — the accepted quote + its spec, frozen. There
 * is exactly one such item per accepted-quote order group.
 */
export interface OrderCustomSnapshot {
  kind: "custom";
  requestId: string;
  quoteId: string;
  spec: CustomFurnitureSpec;
  /** Manufacturing (furniture) price, OMR. */
  basePrice: number;
  deliveryFee: number;
  installationFee: number;
  /** Derived: base + delivery + installation. */
  lineTotal: number;
  quantity: number;
  manufacturingDays: number;
  warrantyText: string;
}

export type OrderItem = OrderItemSnapshot | OrderCustomSnapshot;

/** All items for one supplier, with that supplier's own subtotal. */
export interface SupplierOrderGroup {
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  /** Sum of the group's line totals (goods only), OMR. */
  goodsSubtotal: number;
  /** Delivery/installation the DATA supports (0 for catalog unless known). */
  deliveryFee: number;
  installationFee: number;
  /** Derived: goods + delivery + installation. */
  groupTotal: number;
  status: SupplierGroupStatus;
}

/** Oman-friendly delivery address (GCC-ready; no Western-only fields). */
export interface DeliveryAddress {
  fullName: string;
  phone: string;
  governorate: string;
  wilayat: string;
  area: string;
  /** Building / house description (free text). */
  building: string;
  notes?: string;
}

/** Deterministic order money breakdown. */
export interface CheckoutTotals {
  goodsSubtotal: number;
  deliveryTotal: number;
  installationTotal: number;
  /** Derived grand total, OMR. */
  grandTotal: number;
  itemCount: number;
  supplierCount: number;
}

/**
 * The validated, ready-to-confirm order intent. The checkout UI builds a draft;
 * the confirm action turns it into an `Order`. The client never sends a total —
 * totals are recomputed from the snapshotted lines.
 */
export interface CheckoutDraft {
  source: OrderSource;
  groups: SupplierOrderGroup[];
  totals: CheckoutTotals;
  /** For accepted_quote source: the originating request/quote ids (validated). */
  requestId?: string;
  quoteId?: string;
}

/** A created order — immutable snapshot. */
export interface Order {
  id: string;
  /** Human-friendly order number (e.g. ATH-2K7QF3). */
  orderNumber: string;
  customerId: string;
  source: OrderSource;
  status: OrderStatus;
  groups: SupplierOrderGroup[];
  totals: CheckoutTotals;
  address: DeliveryAddress;
  /** Demo order (local, no real commerce) — always labelled in the UI. */
  isDemo: boolean;
  createdAt: number;
  updatedAt: number;
}

/** Stable, user-safe error codes for checkout/order operations. */
export type OrderErrorCode =
  | "empty"
  | "invalid-address"
  | "price-changed"
  | "invalid-item"
  | "quote-not-accepted"
  | "quote-not-owned"
  | "not-owner"
  | "not-found"
  | "unknown";
