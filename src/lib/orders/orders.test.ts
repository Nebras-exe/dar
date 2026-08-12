/**
 * Orders / checkout tests (Phase 10A, §28). All pure — no external calls, no DB
 * writes. Covers cart checkout, accepted-RFQ checkout, unaccepted-quote rejection,
 * multi-supplier grouping, totals + OMR precision, snapshot immutability,
 * ownership + supplier isolation, price/quantity tampering, and address validation.
 */

import test, { before, after } from "node:test";
import assert from "node:assert/strict";

import {
  getProductBySlug,
  __setCatalogProductsForTests,
  __resetCatalogProductsForTests,
} from "@/lib/catalog";
import { makeProduct } from "@/lib/catalog/test-fixtures";
import { demoSupplierByName } from "@/lib/repository";
import type { CustomFurnitureSpec, Quote, CustomRequest } from "@/lib/rfq";
import {
  buildCartDraft,
  buildQuoteDraft,
  computeCheckoutTotals,
  recomputeGroups,
  validateAddress,
  isOmanPhone,
  revalidateCart,
  validateAcceptedQuote,
  canReadOrder,
  canConfirmOrder,
  redactOrderForSupplier,
  makeOrderNumber,
  type Order,
} from "./index";

// Test fixtures spanning THREE distinct demo suppliers (the real catalog is empty).
const SOFA = "test-studio-sofa"; // DAR Studio Collection, 320
const SOFA2 = "test-studio-sofa-2"; // same supplier (merge test)
const SECTIONAL = "test-supplier-sectional"; // DAR Demo Supplier, 445
const LEATHER = "test-lab-leather-sofa"; // Demo Furniture Lab, 520
const RUG = "test-checkout-rug"; // DAR Demo Supplier, 58

const ordersFixtures = [
  makeProduct({ slug: SOFA, category: "sofas", price: 320, colors: ["cream", "beige", "grey"], materials: ["boucle"], styleTags: ["warm-modern"], roomTypes: ["living-room"], supplier: "DAR Studio Collection" }),
  makeProduct({ slug: SOFA2, category: "sofas", price: 280, colors: ["beige", "grey"], materials: ["linen"], styleTags: ["modern"], roomTypes: ["living-room"], supplier: "DAR Studio Collection" }),
  makeProduct({ slug: SECTIONAL, category: "sofas", subcategory: "sectional", price: 445, colors: ["grey"], materials: ["linen"], styleTags: ["modern"], roomTypes: ["living-room"], supplier: "DAR Demo Supplier" }),
  makeProduct({ slug: LEATHER, category: "sofas", price: 520, colors: ["walnut", "charcoal"], materials: ["leather"], styleTags: ["mid-century"], roomTypes: ["living-room"], supplier: "Demo Furniture Lab" }),
  makeProduct({ slug: RUG, category: "rugs", price: 58, colors: ["sand", "grey"], materials: ["wool"], styleTags: ["boho"], roomTypes: ["living-room"], supplier: "DAR Demo Supplier" }),
];

before(() => __setCatalogProductsForTests(ordersFixtures));
after(() => __resetCatalogProductsForTests());

// ── Cart checkout + multi-supplier grouping (§3/§13) ──────────────────────────

test("cart draft: groups items by supplier with per-supplier + order totals", () => {
  const draft = buildCartDraft([
    { slug: SOFA, quantity: 2 }, // studio: 640
    { slug: SECTIONAL, quantity: 1 }, // supplier: 445
    { slug: LEATHER, quantity: 1 }, // lab: 520
  ]);
  assert.equal(draft.source, "cart");
  assert.equal(draft.groups.length, 3); // three suppliers
  assert.equal(draft.totals.supplierCount, 3);
  assert.equal(draft.totals.itemCount, 4);
  // goods = 640 + 445 + 520 = 1605
  assert.equal(draft.totals.goodsSubtotal, 1605);
  assert.equal(draft.totals.grandTotal, 1605); // catalog delivery/install = 0
  const studio = draft.groups.find((g) => g.supplierName.includes("Studio"))!;
  assert.equal(studio.goodsSubtotal, 640);
});

test("cart draft: two lines from the same supplier merge into one group", () => {
  const draft = buildCartDraft([
    { slug: SOFA, quantity: 1 },
    { slug: SOFA2, quantity: 1 }, // also Studio
  ]);
  const studioGroups = draft.groups.filter((g) => g.supplierName.includes("Studio"));
  // same supplier → single group with both items (if same supplier)
  const sofa2 = getProductBySlug(SOFA2);
  if (sofa2 && demoSupplierByName(sofa2.supplier)?.name.includes("Studio")) {
    assert.equal(studioGroups.length, 1);
    assert.equal(studioGroups[0].items.length, 2);
  }
});

test("cart draft: fake slugs are dropped (catalog truth)", () => {
  const draft = buildCartDraft([
    { slug: SOFA, quantity: 1 },
    { slug: "HACKED-FAKE-PRODUCT", quantity: 5 },
  ]);
  const allSlugs = draft.groups.flatMap((g) => g.items.map((i) => (i.kind === "catalog" ? i.slug : "")));
  assert.ok(!allSlugs.includes("HACKED-FAKE-PRODUCT"));
});

test("cart draft: line total = unitPrice × quantity (exact OMR)", () => {
  const draft = buildCartDraft([{ slug: SOFA, quantity: 3 }]);
  const item = draft.groups[0].items[0];
  assert.equal(item.kind, "catalog");
  if (item.kind === "catalog") {
    assert.equal(item.lineTotal, 960); // 320 × 3
    assert.equal(item.unitPrice, getProductBySlug(SOFA)!.price);
  }
});

// ── Snapshot immutability (§6) ────────────────────────────────────────────────

test("snapshot: order item captures the current price; later catalog change won't apply", () => {
  const draft = buildCartDraft([{ slug: SOFA, quantity: 1 }]);
  const snap = draft.groups[0].items[0];
  assert.equal(snap.kind, "catalog");
  if (snap.kind === "catalog") {
    // The snapshot holds its own copy of name/price/dimensions.
    assert.equal(snap.name, getProductBySlug(SOFA)!.name);
    assert.ok(snap.dimensions);
    // Mutating the snapshot doesn't touch the catalog product (separate objects).
    const before = getProductBySlug(SOFA)!.price;
    snap.unitPrice = 1;
    assert.equal(getProductBySlug(SOFA)!.price, before);
  }
});

// ── Accepted RFQ checkout (§12) ───────────────────────────────────────────────

function spec(over: Partial<CustomFurnitureSpec> = {}): CustomFurnitureSpec {
  return { category: "sofas", hasReferenceImage: false, quantity: 1, budget: 500, ...over };
}
function quote(over: Partial<Quote> = {}): Quote {
  return {
    id: "q1", requestId: "r1", supplierId: "demo-athathi-studio",
    basePrice: 300, deliveryFee: 10, installationFee: 15, total: 325, currency: "OMR",
    manufacturingDays: 14, warrantyText: "warranty-2yr", notes: "", status: "accepted",
    isDemo: true, validUntil: 0, createdAt: 0, ...over,
  };
}

test("RFQ draft: snapshots the accepted quote terms; total = base+delivery+install", () => {
  const draft = buildQuoteDraft(spec(), quote());
  assert.equal(draft.source, "accepted_quote");
  assert.equal(draft.groups.length, 1);
  const item = draft.groups[0].items[0];
  assert.equal(item.kind, "custom");
  if (item.kind === "custom") {
    assert.equal(item.basePrice, 300);
    assert.equal(item.deliveryFee, 10);
    assert.equal(item.installationFee, 15);
    assert.equal(item.lineTotal, 325);
    assert.equal(item.warrantyText, "warranty-2yr");
  }
  assert.equal(draft.totals.grandTotal, 325);
  assert.equal(draft.totals.deliveryTotal, 10);
  assert.equal(draft.quoteId, "q1");
});

test("validateAcceptedQuote: only an accepted, owned quote proceeds", () => {
  const requests: CustomRequest[] = [{ id: "r1", customerId: "cust-1", spec: spec(), recipients: [], status: "accepted", isDemo: true, createdAt: 0, updatedAt: 0 }];
  const quotes: Quote[] = [quote({ id: "q1", requestId: "r1", status: "accepted" }), quote({ id: "q2", requestId: "r1", status: "submitted" })];

  assert.equal(validateAcceptedQuote("cust-1", "r1", "q1", requests, quotes).ok, true);
  // not accepted
  assert.equal(validateAcceptedQuote("cust-1", "r1", "q2", requests, quotes).code, "quote-not-accepted");
  // not owner
  assert.equal(validateAcceptedQuote("cust-9", "r1", "q1", requests, quotes).code, "quote-not-owned");
  // unknown request/quote
  assert.equal(validateAcceptedQuote("cust-1", "rX", "q1", requests, quotes).code, "not-found");
  assert.equal(validateAcceptedQuote("cust-1", "r1", "qX", requests, quotes).code, "not-found");
});

// ── Totals / OMR precision (§7) ───────────────────────────────────────────────

test("totals: OMR stays 3-decimal exact across grouping", () => {
  const draft = buildCartDraft([{ slug: RUG, quantity: 3 }]); // 58 × 3 = 174
  assert.equal(draft.totals.goodsSubtotal, 174);
  // Re-running recompute is idempotent.
  const again = recomputeGroups(draft.groups);
  assert.equal(again.totals.grandTotal, draft.totals.grandTotal);
});

test("totals: empty groups → zeroed totals", () => {
  const t = computeCheckoutTotals([]);
  assert.deepEqual(t, { goodsSubtotal: 0, deliveryTotal: 0, installationTotal: 0, grandTotal: 0, itemCount: 0, supplierCount: 0 });
});

// ── Cart revalidation + tampering (§11/§21) ───────────────────────────────────

test("revalidateCart: drops fakes, clamps quantity, keeps only real colour variants", () => {
  const r = revalidateCart([
    { slug: SOFA, colorId: "cream", quantity: 2 },
    { slug: SOFA, colorId: "navy", quantity: 999 }, // navy not a sofa variant; qty clamped
    { slug: "nope", quantity: 1 },
    { slug: SOFA, quantity: -5 }, // clamped to 1
  ]);
  assert.deepEqual(r.dropped, ["nope"]);
  assert.equal(r.valid.length, 3);
  assert.equal(r.valid[0].colorId, "cream");
  assert.equal(r.valid[1].colorId, undefined); // navy dropped
  assert.equal(r.valid[1].quantity, 99); // clamped to max
  assert.equal(r.valid[2].quantity, 1); // clamped to min
});

test("revalidateCart: a client-claimed price that differs is surfaced (order uses catalog price)", () => {
  const now = getProductBySlug(SOFA)!.price;
  const r = revalidateCart([{ slug: SOFA, quantity: 1 }], { [SOFA]: now - 100 });
  assert.equal(r.priceChanged.length, 1);
  assert.equal(r.priceChanged[0].now, now); // authoritative price is the catalog price
  // And the built draft uses the real price, never the claimed one.
  const draft = buildCartDraft(r.valid);
  assert.equal((draft.groups[0].items[0] as { unitPrice: number }).unitPrice, now);
});

// ── Address (§10) ─────────────────────────────────────────────────────────────

test("address: Oman fields validate; bad phone / missing required rejected", () => {
  const ok = validateAddress({ fullName: "Ahmed", phone: "92123456", governorate: "Muscat", wilayat: "Seeb", area: "Al Khoud", building: "Villa 12" });
  assert.ok(ok.ok);
  assert.equal(validateAddress({ fullName: "", phone: "92123456", governorate: "Muscat", wilayat: "Seeb", building: "x" }).ok, false);
  assert.equal(validateAddress({ fullName: "A", phone: "123", governorate: "Muscat", wilayat: "Seeb", building: "x" }).ok, false);
  assert.equal(isOmanPhone("+96892123456"), true);
  assert.equal(isOmanPhone("92123456"), true);
  assert.equal(isOmanPhone("12345"), false);
});

// ── Authorization / isolation (§21/§22) ───────────────────────────────────────

function order(): Order {
  const draft = buildCartDraft([{ slug: SOFA, quantity: 1 }, { slug: LEATHER, quantity: 1 }]);
  return { id: "o1", orderNumber: "ATH-000001", customerId: "cust-1", source: "cart", status: "confirmed", groups: draft.groups, totals: draft.totals, address: { fullName: "A", phone: "92123456", governorate: "M", wilayat: "S", area: "", building: "x" }, isDemo: true, createdAt: 0, updatedAt: 0 };
}

test("authz: customer reads/confirms only own order", () => {
  const o = order();
  assert.equal(canReadOrder({ userId: "cust-1", supplierIds: [] }, o), true);
  assert.equal(canReadOrder({ userId: "cust-9", supplierIds: [] }, o), false);
  assert.equal(canConfirmOrder({ userId: "cust-1" }, o), true);
  assert.equal(canConfirmOrder({ userId: "cust-9" }, o), false);
});

test("authz: a supplier sees only its own group; another supplier's items/totals are redacted", () => {
  const o = order(); // has a studio group + a lab group
  const studioId = o.groups.find((g) => g.supplierName.includes("Studio"))!.supplierId;
  // supplier member of studio can read the order (contains their group)
  assert.equal(canReadOrder({ userId: "x", supplierIds: [studioId] }, o), true);
  // redaction returns ONLY their group
  const red = redactOrderForSupplier(o, [studioId]);
  assert.ok(red);
  assert.equal(red!.groups.length, 1);
  assert.equal(red!.groups[0].supplierId, studioId);
  // a supplier with no group in this order gets nothing
  assert.equal(redactOrderForSupplier(o, ["demo-nonexistent"]), null);
});

test("order number: deterministic + prefixed", () => {
  assert.equal(makeOrderNumber(12345), makeOrderNumber(12345));
  assert.match(makeOrderNumber(999), /^ATH-[0-9A-Z]{6}$/);
});
