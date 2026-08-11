/**
 * Deterministic demo quote generator (Phase 09, §21/§22/§44). When no backend is
 * configured, the RFQ flow stays judge-demo-ready by producing clearly-labelled
 * **Demo Quotes** — never presented as real factory quotations. Values derive
 * DETERMINISTICALLY from the spec (category, quantity, material, size) + each
 * supplier's profile (lead-time range, base multipliers), so the same request to
 * the same supplier always yields the same quote. No `Math.random`.
 *
 * All money is computed with the exact OMR helpers (`quoteTotal`), never an LLM.
 * Pure + client-safe.
 */

import { roundOmr } from "@/lib/catalog";
import type { Supplier } from "@/lib/repository";
import { quoteTotal } from "./quote-calc";
import type { CustomFurnitureSpec, Quote } from "./types";

/** Base OMR price by category (a plausible starting point for demo pieces). */
const CATEGORY_BASE: Record<string, number> = {
  sofas: 240,
  chairs: 60,
  dining: 180,
  beds: 200,
  storage: 150,
  "tv-units": 120,
  desks: 110,
  "coffee-tables": 70,
};

/** Material multiplier (premium materials cost more — deterministic). */
const MATERIAL_MULT: Record<string, number> = {
  velvet: 1.15, leather: 1.35, walnut: 1.3, teak: 1.4, marble: 1.5, oak: 1.2,
  boucle: 1.1, linen: 1.05, wool: 1.1, ash: 1.15, glass: 1.1, metal: 1.05,
};

/** FNV-1a → unsigned int, for deterministic per-(request,supplier) variance. */
function seed(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Generate one deterministic demo quote from a supplier for a request. Exported
 * for tests. `requestId` + supplier id make it reproducible and unique.
 */
export function demoQuoteFor(
  requestId: string,
  spec: CustomFurnitureSpec,
  supplier: Supplier,
  createdAt: number,
): Quote {
  const s = seed(`${requestId}:${supplier.id}`);

  const base = CATEGORY_BASE[spec.category] ?? 120;
  const materialMult = spec.material ? MATERIAL_MULT[spec.material] ?? 1 : 1;

  // Size factor: larger stated width costs more; unknown → neutral 1.0.
  const width = typeof spec.widthCm === "number" ? spec.widthCm : 0;
  const sizeMult = width > 0 ? 1 + Math.min(0.6, Math.max(0, (width - 120) / 120) * 0.25) : 1;

  const seatMult = spec.seatCount && spec.seatCount > 3 ? 1 + (spec.seatCount - 3) * 0.08 : 1;

  // Per-supplier variance in ±12% (deterministic), + quantity.
  const supplierMult = 0.88 + ((s % 25) / 100); // 0.88..1.12
  const qty = Math.max(1, spec.quantity);

  const basePrice = roundOmr(base * materialMult * sizeMult * seatMult * supplierMult * qty);

  // Delivery/installation deterministically vary by supplier; some include delivery free.
  const deliveryFee = (s >> 3) % 3 === 0 ? 0 : roundOmr(5 + ((s >> 4) % 3) * 2.5);
  const installationFee = spec.category === "beds" || spec.category === "storage" || spec.category === "tv-units"
    ? roundOmr(10 + ((s >> 6) % 3) * 5)
    : roundOmr(((s >> 6) % 3) * 5);

  const total = quoteTotal(basePrice, deliveryFee, installationFee);

  // Manufacturing days: within the supplier's own range, deterministic.
  const caps = supplier.capabilities;
  const lo = caps?.leadTimeDaysMin ?? 10;
  const hi = caps?.leadTimeDaysMax ?? 21;
  const manufacturingDays = lo + ((s >> 8) % Math.max(1, hi - lo + 1));

  const warrantyKeys = ["warranty-1yr", "warranty-2yr", "warranty-structural-5yr"];
  const warrantyText = warrantyKeys[(s >> 10) % warrantyKeys.length];

  return {
    id: `dq_${requestId}_${supplier.id}`,
    requestId,
    supplierId: supplier.id,
    basePrice,
    deliveryFee,
    installationFee,
    total,
    currency: "OMR",
    manufacturingDays,
    warrantyText,
    notes: "",
    status: "submitted",
    isDemo: true,
    validUntil: createdAt + 14 * 24 * 60 * 60 * 1000,
    createdAt,
  };
}

/** Generate a demo quote from each recipient supplier (deterministic set). */
export function generateDemoQuotes(
  requestId: string,
  spec: CustomFurnitureSpec,
  suppliers: readonly Supplier[],
  createdAt: number,
): Quote[] {
  return suppliers
    .map((s) => demoQuoteFor(requestId, spec, s, createdAt))
    .sort((a, b) => a.total - b.total || a.id.localeCompare(b.id));
}
