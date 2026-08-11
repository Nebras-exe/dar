/**
 * RFQ validation (Phase 09, §6/§11/§45). Pure, server-usable, dependency-free.
 * Validates the customer's `CustomFurnitureSpec` and a supplier's `Quote` input:
 * bounds every number, rejects the §33/§49 attack cases (negative/huge price,
 * negative dimensions), enforces the taxonomy, and encodes the minimum fields
 * required for a valid RFQ. Dimensions may be "unknown" — the customer is never
 * forced to invent a measurement.
 */

import {
  isColorId,
  isMaterialId,
  isStyleTag,
  roundOmr,
} from "@/lib/catalog";
import type { FieldError, ValidationResult } from "@/lib/repository/types";
import { isCustomCategory } from "./spec-fields";
import type { CustomFurnitureSpec, UnknownableNumber } from "./types";

export const MAX_PRICE_OMR = 1_000_000;
export const MAX_DIM_CM = 1000;
export const MAX_QTY = 999;
export const MAX_NOTES = 2000;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function boundedNumber(v: unknown, min: number, max: number): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  if (!Number.isFinite(n) || n < min || n > max) return null;
  return n;
}

/** A dimension value: a positive bounded number, "unknown", or undefined. */
function dimension(v: unknown): UnknownableNumber {
  if (v === "unknown") return "unknown";
  if (v === undefined || v === null || v === "") return undefined;
  const n = boundedNumber(v, 1, MAX_DIM_CM);
  return n === null ? undefined : n;
}

/** Does the spec carry at least one useful detail (or a reference image)? (§11) */
export function hasUsefulDetail(spec: CustomFurnitureSpec): boolean {
  if (spec.hasReferenceImage || spec.basedOnSlug) return true;
  const dims = [spec.widthCm, spec.depthCm, spec.heightCm].some(
    (d) => typeof d === "number",
  );
  return Boolean(
    spec.style || spec.color || spec.material || spec.shape || spec.seatCount ||
    spec.finish || spec.mattressSize || spec.storageLayout || spec.notes || dims,
  );
}

/**
 * Validate + normalize a raw spec into a `CustomFurnitureSpec`. Minimum for a
 * ready RFQ: a valid category, quantity ≥ 1, and at least one useful spec OR a
 * reference image. Budget is optional (recommended). Never throws.
 */
export function validateSpec(raw: unknown): ValidationResult<CustomFurnitureSpec> {
  const errors: FieldError[] = [];
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  const category = str(body.category);
  if (!isCustomCategory(category)) errors.push({ field: "category", code: "unknown-category" });

  const quantityRaw = boundedNumber(body.quantity, 1, MAX_QTY);
  const quantity = quantityRaw === null ? NaN : Math.floor(quantityRaw);
  if (!Number.isFinite(quantity) || quantity < 1) errors.push({ field: "quantity", code: "invalid-quantity" });

  // Budget optional; when present it must be positive + bounded.
  let budget: number | undefined;
  if (body.budget !== undefined && body.budget !== null && body.budget !== "") {
    const b = boundedNumber(body.budget, 0.001, MAX_PRICE_OMR);
    if (b === null) errors.push({ field: "budget", code: "invalid-budget" });
    else budget = roundOmr(b);
  }

  const style = isStyleTag(str(body.style)) ? (str(body.style) as CustomFurnitureSpec["style"]) : undefined;
  const color = isColorId(str(body.color)) ? (str(body.color) as CustomFurnitureSpec["color"]) : undefined;
  const material = isMaterialId(str(body.material)) ? (str(body.material) as CustomFurnitureSpec["material"]) : undefined;

  const seatRaw = boundedNumber(body.seatCount, 1, 20);
  const seatCount = seatRaw === null ? undefined : Math.floor(seatRaw);

  const firmnessStr = str(body.firmness);
  const firmness = ["soft", "medium", "firm"].includes(firmnessStr)
    ? (firmnessStr as CustomFurnitureSpec["firmness"])
    : undefined;

  const spec: CustomFurnitureSpec = {
    category: category as CustomFurnitureSpec["category"],
    basedOnSlug: str(body.basedOnSlug) || undefined,
    hasReferenceImage: Boolean(body.hasReferenceImage),
    style,
    color,
    material,
    widthCm: dimension(body.widthCm),
    depthCm: dimension(body.depthCm),
    heightCm: dimension(body.heightCm),
    shape: str(body.shape) || undefined,
    seatCount,
    legStyle: str(body.legStyle) || undefined,
    armStyle: str(body.armStyle) || undefined,
    firmness,
    finish: str(body.finish) || undefined,
    mattressSize: str(body.mattressSize) || undefined,
    storageLayout: str(body.storageLayout) || undefined,
    quantity: Number.isFinite(quantity) && quantity >= 1 ? quantity : 1,
    budget,
    notes: str(body.notes).slice(0, MAX_NOTES) || undefined,
  };

  if (errors.length === 0 && !hasUsefulDetail(spec)) {
    errors.push({ field: "spec", code: "needs-detail" });
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: spec };
}

// ── Quote (supplier-authored) validation (§15/§38) ────────────────────────────

export interface QuoteInput {
  basePrice: number;
  deliveryFee: number;
  installationFee: number;
  manufacturingDays: number;
  warrantyText: string;
  notes: string;
  validDays: number;
}

export function validateQuoteInput(raw: unknown): ValidationResult<QuoteInput> {
  const errors: FieldError[] = [];
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  const basePrice = boundedNumber(body.basePrice, 0.001, MAX_PRICE_OMR);
  if (basePrice === null) errors.push({ field: "basePrice", code: "invalid-price" });

  // Delivery/installation may be 0 (free) but never negative or absurd.
  const deliveryFee = boundedNumber(body.deliveryFee, 0, MAX_PRICE_OMR);
  if (deliveryFee === null) errors.push({ field: "deliveryFee", code: "invalid-fee" });
  const installationFee = boundedNumber(body.installationFee, 0, MAX_PRICE_OMR);
  if (installationFee === null) errors.push({ field: "installationFee", code: "invalid-fee" });

  const manufacturingDays = boundedNumber(body.manufacturingDays, 1, 3650);
  if (manufacturingDays === null) errors.push({ field: "manufacturingDays", code: "invalid-days" });

  const validDays = boundedNumber(body.validDays, 1, 365) ?? 30;

  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      basePrice: roundOmr(basePrice!),
      deliveryFee: roundOmr(deliveryFee!),
      installationFee: roundOmr(installationFee!),
      manufacturingDays: Math.floor(manufacturingDays!),
      warrantyText: str(body.warrantyText).slice(0, 500),
      notes: str(body.notes).slice(0, MAX_NOTES),
      validDays: Math.floor(validDays),
    },
  };
}
