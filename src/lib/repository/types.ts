/**
 * Repository domain contracts (Phase 08). These describe the marketplace
 * entities the database becomes the source of truth for. They are kept free of
 * server/React imports so the same types back the demo adapter, the Supabase
 * adapter, Node tests, and the UI.
 */

import type {
  CategorySlug,
  ColorId,
  Dimensions,
  MaterialId,
  StockStatus,
  StyleTag,
} from "@/lib/catalog";

// ── Suppliers ────────────────────────────────────────────────────────────────

export type SupplierType =
  | "showroom"
  | "factory"
  | "workshop"
  | "importer"
  | "studio";

/** New suppliers are NEVER auto-activated or auto-verified (§7). */
export type SupplierStatus = "pending" | "active" | "suspended";

export interface Supplier {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  /** Free-text governorate/city (bilingual). */
  location: string;
  locationAr: string;
  type: SupplierType;
  status: SupplierStatus;
  /** Trust flag — only ever true for genuinely verified suppliers. */
  verified: boolean;
  /** Sample/demo supplier — always clearly labelled in the UI. */
  isDemo: boolean;
  createdAt: string;
  /** Custom-furniture capabilities (Phase 09) — used for RFQ supplier matching. */
  capabilities?: SupplierCapabilities;
}

/** What a supplier can make to order (Phase 09, §18). Drives RFQ matching. */
export interface SupplierCapabilities {
  acceptsCustom: boolean;
  /** Catalog category slugs this supplier can custom-make. */
  customCategories: CategorySlug[];
  /** Material families this supplier works with. */
  materials: MaterialId[];
  /** Governorates/regions served (free text, bilingual pairs kept simple here). */
  serviceRegions: string[];
  /** Typical manufacturing lead time range in days. */
  leadTimeDaysMin: number;
  leadTimeDaysMax: number;
}

export type SupplierMemberRole = "owner" | "manager" | "staff";

export interface SupplierMember {
  supplierId: string;
  userId: string;
  role: SupplierMemberRole;
}

// ── Supplier application (§18) ───────────────────────────────────────────────

export interface SupplierApplicationInput {
  businessName: string;
  businessNameAr: string;
  type: SupplierType;
  location: string;
  contactEmail: string;
  contactPhone?: string;
  description: string;
}

// ── Products (supplier-authored) ─────────────────────────────────────────────

export type ProductStatus = "draft" | "active" | "archived";

/** Structured inventory state — never fake urgency (§13). */
export type InventoryStatus =
  | "in_stock"
  | "low_stock"
  | "out_of_stock"
  | "made_to_order";

/** Dimension trust source (§11) — AI must never overwrite supplier-verified dims. */
export type DimensionSource = "supplier_verified" | "demo" | "unknown";

export interface ProductInput {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: CategorySlug;
  /** Numeric OMR (3-decimal). Never a formatted string. */
  basePrice: number;
  dimensions: Dimensions;
  dimensionSource: DimensionSource;
  styleTags: StyleTag[];
  roomTypes: string[];
  colors: ColorId[];
  materials: MaterialId[];
  inventoryStatus: InventoryStatus;
  stockStatus: StockStatus;
  customizable: boolean;
  customizationOptions: CustomizationOptionInput[];
  status: ProductStatus;
}

/** A basic selectable customization option with a deterministic price delta (§24/§25). */
export interface CustomizationOptionInput {
  kind: "color" | "material" | "size" | "legs" | "fabric" | "wood" | "other";
  label: string;
  labelAr: string;
  /** OMR delta added to the base price. Business logic owns this — never AI. */
  priceDelta: number;
}

// ── Validation results ───────────────────────────────────────────────────────

export interface FieldError {
  field: string;
  code: string;
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: FieldError[] };
