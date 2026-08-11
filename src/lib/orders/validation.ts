/**
 * Order/checkout validation (Phase 10A, §11/§12/§21). Pure, server-usable. Never
 * trusts client-supplied prices, totals, ownership, or quote IDs: cart lines are
 * re-resolved against the catalog, addresses are bounded, and an accepted-RFQ
 * checkout is only allowed for a quote the customer owns AND that is accepted.
 */

import { getProductBySlug, isColorId, type ColorId } from "@/lib/catalog";
import type { FieldError, ValidationResult } from "@/lib/repository/types";
import type { CustomRequest, Quote } from "@/lib/rfq";
import type { CartLineInput } from "./snapshot";
import type { DeliveryAddress } from "./types";

const MAX_QTY = 99;
const MAX_TEXT = 120;
const MAX_NOTES = 500;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

// ── Delivery address (§10) ────────────────────────────────────────────────────

/** Minimal, safe Oman phone check (local 8-digit or +968). Not a full parser. */
export function isOmanPhone(v: string): boolean {
  const cleaned = v.replace(/[\s-]/g, "");
  return /^(\+?968)?[279]\d{7}$/.test(cleaned);
}

export function validateAddress(raw: unknown): ValidationResult<DeliveryAddress> {
  const errors: FieldError[] = [];
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  const fullName = str(body.fullName).slice(0, MAX_TEXT);
  const phone = str(body.phone).slice(0, 40);
  const governorate = str(body.governorate).slice(0, MAX_TEXT);
  const wilayat = str(body.wilayat).slice(0, MAX_TEXT);
  const area = str(body.area).slice(0, MAX_TEXT);
  const building = str(body.building).slice(0, MAX_TEXT);
  const notes = str(body.notes).slice(0, MAX_NOTES) || undefined;

  if (!fullName) errors.push({ field: "fullName", code: "required" });
  if (!phone || !isOmanPhone(phone)) errors.push({ field: "phone", code: "invalid-phone" });
  if (!governorate) errors.push({ field: "governorate", code: "required" });
  if (!wilayat) errors.push({ field: "wilayat", code: "required" });
  if (!building) errors.push({ field: "building", code: "required" });

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: { fullName, phone, governorate, wilayat, area, building, notes } };
}

// ── Cart revalidation (§11) ───────────────────────────────────────────────────

export interface CartRevalidationResult {
  /** Lines that still resolve to a real product (fakes/removed dropped). */
  valid: CartLineInput[];
  /** Slugs dropped because they no longer resolve. */
  dropped: string[];
  /**
   * Lines whose current catalog price differs from a client-claimed price.
   * The order always uses the CURRENT catalog price — this only surfaces the
   * change to the customer; the payable total is never silently altered.
   */
  priceChanged: { slug: string; was: number; now: number }[];
}

/**
 * Revalidate cart lines before checkout. `claimedPrices` (optional) lets the UI
 * detect a price change since the cart was built; the authoritative price is
 * always the current catalog price.
 */
export function revalidateCart(
  rawLines: readonly { slug?: unknown; colorId?: unknown; quantity?: unknown }[],
  claimedPrices?: Record<string, number>,
): CartRevalidationResult {
  const valid: CartLineInput[] = [];
  const dropped: string[] = [];
  const priceChanged: CartRevalidationResult["priceChanged"] = [];

  for (const raw of rawLines) {
    const slug = str(raw.slug);
    if (!slug) continue;
    const product = getProductBySlug(slug);
    if (!product) {
      dropped.push(slug);
      continue;
    }
    // Colour valid only if it's a real variant of THIS product.
    let colorId: ColorId | undefined;
    const c = str(raw.colorId);
    if (c && isColorId(c) && product.colors.some((v) => v.id === c)) colorId = c;

    const qtyNum = typeof raw.quantity === "number" ? raw.quantity : Number(raw.quantity);
    const quantity = Number.isFinite(qtyNum) ? Math.min(MAX_QTY, Math.max(1, Math.floor(qtyNum))) : 1;

    if (claimedPrices && typeof claimedPrices[slug] === "number" && claimedPrices[slug] !== product.price) {
      priceChanged.push({ slug, was: claimedPrices[slug], now: product.price });
    }
    valid.push({ slug, colorId, quantity });
  }
  return { valid, dropped, priceChanged };
}

// ── Accepted-quote validation (§12) ───────────────────────────────────────────

export interface AcceptedQuoteResult {
  ok: boolean;
  code?: "quote-not-owned" | "quote-not-accepted" | "not-found";
  quote?: Quote;
  request?: CustomRequest;
}

/**
 * Only an ACCEPTED quote the customer OWNS may proceed to checkout. Never trusts
 * a quote id from the browser: it must belong to a request owned by this
 * customer and carry status "accepted".
 */
export function validateAcceptedQuote(
  customerId: string,
  requestId: string,
  quoteId: string,
  requests: readonly CustomRequest[],
  quotes: readonly Quote[],
): AcceptedQuoteResult {
  const request = requests.find((r) => r.id === requestId);
  if (!request) return { ok: false, code: "not-found" };
  if (request.customerId !== customerId) return { ok: false, code: "quote-not-owned" };
  const quote = quotes.find((q) => q.id === quoteId && q.requestId === requestId);
  if (!quote) return { ok: false, code: "not-found" };
  if (quote.status !== "accepted") return { ok: false, code: "quote-not-accepted" };
  return { ok: true, quote, request };
}
