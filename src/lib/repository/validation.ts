/**
 * Server-side validation for supplier-authored data (Phase 08, §31/§49).
 *
 * NEVER trust form/client input. These pure validators coerce + bound every
 * field against the Phase 03 taxonomy and safe numeric ranges, so the same rules
 * run in server actions, the Supabase adapter, and Node tests. They reject the
 * §49 attack cases: negative/huge prices, negative dimensions, unknown
 * category/colour/material, bad status/inventory, and over-long text.
 */

import {
  isCategorySlug,
  isColorId,
  isMaterialId,
  isStockStatus,
  isStyleTag,
  isRoomType,
  roundOmr,
} from "@/lib/catalog";
import type { Dimensions } from "@/lib/catalog";
import { slugify } from "./slug";
import type {
  CustomizationOptionInput,
  DimensionSource,
  FieldError,
  InventoryStatus,
  ProductInput,
  ProductStatus,
  SupplierApplicationInput,
  SupplierType,
  ValidationResult,
} from "./types";

// Bounds (documented, conservative).
export const MAX_PRICE_OMR = 1_000_000; // 1,000,000.000 OMR ceiling
export const MAX_DIM_CM = 1000; // 10 m — nothing sane is larger
export const MAX_NAME = 120;
export const MAX_DESC = 2000;
export const MAX_OPTIONS = 20;

const PRODUCT_STATUSES: ProductStatus[] = ["draft", "active", "archived"];
const INVENTORY_STATUSES: InventoryStatus[] = [
  "in_stock",
  "low_stock",
  "out_of_stock",
  "made_to_order",
];
const DIM_SOURCES: DimensionSource[] = ["supplier_verified", "demo", "unknown"];
const SUPPLIER_TYPES: SupplierType[] = [
  "showroom",
  "factory",
  "workshop",
  "importer",
  "studio",
];
const OPTION_KINDS: CustomizationOptionInput["kind"][] = [
  "color",
  "material",
  "size",
  "legs",
  "fabric",
  "wood",
  "other",
];

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** A finite number in [min, max]; NaN/Infinity/±out-of-range → null. */
function boundedNumber(v: unknown, min: number, max: number): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  if (!Number.isFinite(n)) return null;
  if (n < min || n > max) return null;
  return n;
}

function uniqFilter<T>(arr: unknown, keep: (v: string) => v is T & string): T[] {
  if (!Array.isArray(arr)) return [];
  const out: T[] = [];
  for (const v of arr) {
    if (typeof v === "string" && keep(v) && !out.includes(v as T)) out.push(v as T);
  }
  return out;
}

/** Validate & normalize a product create/update payload. */
export function validateProductInput(raw: unknown): ValidationResult<ProductInput> {
  const errors: FieldError[] = [];
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  const name = str(body.name);
  const nameAr = str(body.nameAr);
  if (!name || name.length > MAX_NAME) errors.push({ field: "name", code: "required-or-too-long" });
  if (!nameAr || nameAr.length > MAX_NAME) errors.push({ field: "nameAr", code: "required-or-too-long" });

  const description = str(body.description).slice(0, MAX_DESC);
  const descriptionAr = str(body.descriptionAr).slice(0, MAX_DESC);

  const category = str(body.category);
  if (!isCategorySlug(category)) errors.push({ field: "category", code: "unknown-category" });

  // Price: positive, bounded, rounded to 3-decimal OMR. Rejects negative/huge/NaN.
  const priceRaw = boundedNumber(body.basePrice, 0.001, MAX_PRICE_OMR);
  const basePrice = priceRaw === null ? NaN : roundOmr(priceRaw);
  if (!Number.isFinite(basePrice) || basePrice <= 0) {
    errors.push({ field: "basePrice", code: "invalid-price" });
  }

  // Dimensions: each positive & bounded. Rejects negative/zero/huge.
  const dimsRaw = (body.dimensions && typeof body.dimensions === "object" ? body.dimensions : {}) as Record<string, unknown>;
  const widthCm = boundedNumber(dimsRaw.widthCm, 1, MAX_DIM_CM);
  const depthCm = boundedNumber(dimsRaw.depthCm, 1, MAX_DIM_CM);
  const heightCm = boundedNumber(dimsRaw.heightCm, 1, MAX_DIM_CM);
  if (widthCm === null || depthCm === null || heightCm === null) {
    errors.push({ field: "dimensions", code: "invalid-dimensions" });
  }
  const seatHeightCm = boundedNumber(dimsRaw.seatHeightCm, 1, MAX_DIM_CM);
  const seatDepthCm = boundedNumber(dimsRaw.seatDepthCm, 1, MAX_DIM_CM);

  const dimensionSource: DimensionSource = DIM_SOURCES.includes(str(body.dimensionSource) as DimensionSource)
    ? (str(body.dimensionSource) as DimensionSource)
    : "supplier_verified";

  const styleTags = uniqFilter(body.styleTags, isStyleTag);
  const roomTypes = uniqFilter(body.roomTypes, isRoomType);
  const colors = uniqFilter(body.colors, isColorId);
  const materials = uniqFilter(body.materials, isMaterialId);

  const status: ProductStatus = PRODUCT_STATUSES.includes(str(body.status) as ProductStatus)
    ? (str(body.status) as ProductStatus)
    : "draft";
  const inventoryStatus: InventoryStatus = INVENTORY_STATUSES.includes(str(body.inventoryStatus) as InventoryStatus)
    ? (str(body.inventoryStatus) as InventoryStatus)
    : "made_to_order";

  const stockRaw = str(body.stockStatus);
  const stockStatus = isStockStatus(stockRaw) ? stockRaw : "made-to-order";

  const customizable = Boolean(body.customizable);
  const customizationOptions = validateOptions(body.customizationOptions);

  if (errors.length > 0) return { ok: false, errors };

  const dimensions: Dimensions = {
    widthCm: widthCm!,
    depthCm: depthCm!,
    heightCm: heightCm!,
    ...(seatHeightCm !== null ? { seatHeightCm } : {}),
    ...(seatDepthCm !== null ? { seatDepthCm } : {}),
  };

  return {
    ok: true,
    value: {
      name,
      nameAr,
      description,
      descriptionAr,
      category: category as ProductInput["category"],
      basePrice,
      dimensions,
      dimensionSource,
      styleTags,
      roomTypes,
      colors,
      materials,
      inventoryStatus,
      stockStatus,
      customizable,
      customizationOptions,
      status,
    },
  };
}

function validateOptions(raw: unknown): CustomizationOptionInput[] {
  if (!Array.isArray(raw)) return [];
  const out: CustomizationOptionInput[] = [];
  for (const o of raw.slice(0, MAX_OPTIONS)) {
    if (!o || typeof o !== "object") continue;
    const rec = o as Record<string, unknown>;
    const kind = str(rec.kind) as CustomizationOptionInput["kind"];
    const label = str(rec.label).slice(0, MAX_NAME);
    const labelAr = str(rec.labelAr).slice(0, MAX_NAME);
    // Price delta may be negative (a discount) but stays bounded + 3-decimal.
    const deltaRaw = boundedNumber(rec.priceDelta, -MAX_PRICE_OMR, MAX_PRICE_OMR);
    if (!OPTION_KINDS.includes(kind) || !label) continue;
    out.push({ kind, label, labelAr, priceDelta: deltaRaw === null ? 0 : roundOmr(deltaRaw) });
  }
  return out;
}

/** Validate a supplier application (§18). Collects no unnecessary sensitive data. */
export function validateSupplierApplication(
  raw: unknown,
): ValidationResult<SupplierApplicationInput> {
  const errors: FieldError[] = [];
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  const businessName = str(body.businessName);
  const businessNameAr = str(body.businessNameAr);
  if (!businessName || businessName.length > MAX_NAME) errors.push({ field: "businessName", code: "required-or-too-long" });

  const type = str(body.type) as SupplierType;
  if (!SUPPLIER_TYPES.includes(type)) errors.push({ field: "type", code: "unknown-type" });

  const location = str(body.location).slice(0, MAX_NAME);
  if (!location) errors.push({ field: "location", code: "required" });

  const contactEmail = str(body.contactEmail);
  if (!isEmail(contactEmail)) errors.push({ field: "contactEmail", code: "invalid-email" });

  const contactPhone = str(body.contactPhone).slice(0, 40) || undefined;
  const description = str(body.description).slice(0, MAX_DESC);

  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: { businessName, businessNameAr, type, location, contactEmail, contactPhone, description },
  };
}

/** Minimal, safe email shape check (never a full RFC parser). */
export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;
}

/** Compute an option-inclusive price deterministically (§25 — never AI). */
export function computeConfiguredPrice(
  basePrice: number,
  selectedDeltas: number[],
): number {
  return roundOmr(selectedDeltas.reduce((sum, d) => roundOmr(sum + d), basePrice));
}

export { slugify };
