/**
 * Athathi Custom Furniture + RFQ — domain contracts (Phase 09).
 *
 * The flow: reference/idea → structured `CustomFurnitureSpec` → match suppliers →
 * `CustomRequest` (RFQ) → `Quote`s → compare → the customer accepts. AI/demo may
 * *propose* structured fields, but the user reviews and the application/DB owns
 * all money and status. Nothing here invents suppliers, prices, or timelines —
 * quotes come only from the DB or the clearly-labelled deterministic demo
 * generator. No payment/manufacturing in this phase.
 *
 * Kept free of server-only / React imports so types + validators + the demo
 * generator run on the client and in Node tests.
 */

import type {
  ColorId,
  MaterialId,
  StyleTag,
} from "@/lib/catalog";

/** Custom furniture is offered for this focused set of categories in Phase 09. */
export type CustomCategory =
  | "sofas"
  | "chairs"
  | "dining"
  | "beds"
  | "storage"
  | "tv-units"
  | "desks"
  | "coffee-tables";

/** A field whose value the user genuinely doesn't know → "ask the supplier". */
export type UnknownableNumber = number | "unknown" | undefined;

/**
 * The structured custom-furniture specification. Category-specific fields are
 * optional; the spec-fields registry (`spec-fields.ts`) decides which apply to a
 * given category (progressive disclosure). Dimensions are never inferred from an
 * image — they stay `undefined`/`"unknown"` unless the user states them.
 */
export interface CustomFurnitureSpec {
  category: CustomCategory;
  /** Optional starting point: an existing catalog product the idea is "like". */
  basedOnSlug?: string;
  /** Reference image was provided (the blob itself is handled separately/privately). */
  hasReferenceImage: boolean;

  style?: StyleTag;
  color?: ColorId;
  material?: MaterialId;

  /** Dimensions in cm; `"unknown"` = the user asked the supplier to advise. */
  widthCm?: UnknownableNumber;
  depthCm?: UnknownableNumber;
  heightCm?: UnknownableNumber;

  // Category-specific (only some apply per category):
  shape?: string; // e.g. "l-shaped", "round"
  seatCount?: number;
  legStyle?: string;
  armStyle?: string;
  firmness?: "soft" | "medium" | "firm";
  finish?: string; // e.g. "matte", "oiled"
  mattressSize?: string; // beds
  storageLayout?: string; // cabinets/tv-units

  quantity: number;
  /** Numeric OMR budget (per the whole request), or undefined if not given. */
  budget?: number;
  /** Free-text note (stored as-is, never interpreted as instructions). */
  notes?: string;
}

/** Which fields a category exposes + which are required for a valid RFQ. */
export interface CategoryFieldSpec {
  category: CustomCategory;
  /** Ordered optional fields shown for this category (progressive disclosure). */
  fields: CustomSpecFieldKey[];
}

export type CustomSpecFieldKey =
  | "style"
  | "color"
  | "material"
  | "widthCm"
  | "depthCm"
  | "heightCm"
  | "shape"
  | "seatCount"
  | "legStyle"
  | "armStyle"
  | "firmness"
  | "finish"
  | "mattressSize"
  | "storageLayout";

// ── RFQ lifecycle ─────────────────────────────────────────────────────────────

export type RFQStatus =
  | "draft"
  | "ready"
  | "submitted"
  | "quotes_received"
  | "customer_review"
  | "accepted"
  | "cancelled"
  | "expired";

export type QuoteStatus =
  | "draft"
  | "submitted"
  | "withdrawn"
  | "accepted"
  | "declined"
  | "expired";

/** A supplier the RFQ is (or would be) addressed to, with deterministic reasons. */
export interface RFQRecipient {
  supplierId: string;
  /** Deterministic, data-backed match reasons (bilingual keys resolved in UI). */
  matchReasons: MatchReason[];
}

/** A machine reason code + the concrete value that justified it (for i18n). */
export interface MatchReason {
  code:
    | "handles-category"
    | "works-with-material"
    | "located-in"
    | "accepts-custom"
    | "verified";
  value?: string;
}

/** The customer's custom request (the RFQ envelope). */
export interface CustomRequest {
  id: string;
  customerId: string;
  spec: CustomFurnitureSpec;
  recipients: RFQRecipient[];
  status: RFQStatus;
  isDemo: boolean;
  createdAt: number;
  updatedAt: number;
}

/** A supplier's quote for a request. Money is exact OMR, computed in code. */
export interface Quote {
  id: string;
  requestId: string;
  supplierId: string;
  /** Furniture (manufacturing) price in OMR — exact 3-decimal. */
  basePrice: number;
  deliveryFee: number;
  installationFee: number;
  /** Derived: basePrice + delivery + installation (computed, never model math). */
  total: number;
  currency: "OMR";
  manufacturingDays: number;
  warrantyText: string;
  notes: string;
  status: QuoteStatus;
  isDemo: boolean;
  validUntil: number;
  createdAt: number;
}

/** How a quote sits against the request budget (deterministic). */
export interface BudgetPosition {
  status: "within" | "over" | "no-budget";
  /** Amount over budget (OMR), 0 when within or no budget set. */
  overBy: number;
}

/** A transparent recommendation — reasons, never an opaque score. */
export interface QuoteRecommendation {
  quoteId: string;
  reasons: RecommendationReason[];
}

export interface RecommendationReason {
  code: "within-budget" | "lowest-total" | "fastest" | "includes-delivery" | "verified-supplier";
  value?: string;
}

export type QuoteSort = "lowest-price" | "fastest" | "within-budget" | "recommended";
