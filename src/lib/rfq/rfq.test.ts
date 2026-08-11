/**
 * RFQ / custom-furniture tests (Phase 09, §45). All pure — no external calls, no
 * DB writes. Covers spec validation, dimension-unknown, deterministic extraction,
 * supplier matching (incl. inactive rejection + recipient filtering), the
 * deterministic demo quote generator, totals/budget/sorting/recommendation, and
 * the ownership/mutation-protection rules used by the RFQ authorization layer.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { validateSpec, validateQuoteInput, hasUsefulDetail } from "./validation";
import { extractSpecFromText } from "./extract";
import { matchSupplier, matchSuppliers, buildRecipients } from "./matching";
import { demoQuoteFor, generateDemoQuotes } from "./demo-quotes";
import { quoteTotal, budgetPosition, sortQuotes, recommendQuote } from "./quote-calc";
import { demoSuppliers } from "@/lib/repository";
import type { Supplier } from "@/lib/repository";
import type { CustomFurnitureSpec, Quote } from "./types";
import {
  canReadRequest,
  canQuoteRequest,
  canAcceptQuote,
  isAcceptedLocked,
} from "./authorization";

function baseSpec(over: Partial<CustomFurnitureSpec> = {}): CustomFurnitureSpec {
  return {
    category: "sofas",
    hasReferenceImage: false,
    quantity: 1,
    material: "velvet",
    color: "green",
    widthCm: 240,
    seatCount: 4,
    budget: 400,
    ...over,
  };
}

// ── Spec validation (§6/§11) ──────────────────────────────────────────────────

test("spec: valid sofa spec passes and normalizes", () => {
  const r = validateSpec(baseSpec());
  assert.ok(r.ok);
  assert.equal(r.value.category, "sofas");
  assert.equal(r.value.widthCm, 240);
  assert.equal(r.value.budget, 400);
});

test("spec: unknown category / bad quantity rejected", () => {
  assert.equal(validateSpec({ ...baseSpec(), category: "spaceship" }).ok, false);
  assert.equal(validateSpec({ ...baseSpec(), quantity: 0 }).ok, false);
  assert.equal(validateSpec({ ...baseSpec(), quantity: -3 }).ok, false);
});

test("spec: negative / absurd budget rejected", () => {
  assert.equal(validateSpec({ ...baseSpec(), budget: -50 }).ok, false);
  assert.equal(validateSpec({ ...baseSpec(), budget: 9_999_999 }).ok, false);
});

test("spec: dimension 'unknown' is preserved (user asks supplier to advise)", () => {
  const r = validateSpec({ ...baseSpec(), widthCm: "unknown", depthCm: undefined });
  assert.ok(r.ok);
  assert.equal(r.value.widthCm, "unknown");
  assert.equal(r.value.depthCm, undefined);
});

test("spec: needs at least one useful detail or a reference image", () => {
  const bare = { category: "chairs", quantity: 2 };
  const r = validateSpec(bare);
  assert.equal(r.ok, false); // no detail, no image
  assert.ok(validateSpec({ ...bare, hasReferenceImage: true }).ok);
  assert.ok(validateSpec({ ...bare, color: "beige" }).ok);
  assert.equal(hasUsefulDetail({ category: "chairs", hasReferenceImage: false, quantity: 1 }), false);
});

// ── Deterministic extraction (§8/§9) ──────────────────────────────────────────

test("extract: pulls only stated facts (EN)", () => {
  const e = extractSpecFromText("I want an L-shaped sofa, dark green velvet, width 240 cm, 4 seats, budget OMR 120");
  assert.equal(e.shape, "l-shaped");
  assert.equal(e.color, "green");
  assert.equal(e.material, "velvet");
  assert.equal(e.widthCm, 240);
  assert.equal(e.seatCount, 4);
  assert.equal(e.budget, 120);
});

test("extract: Arabic + Arabic-Indic digits", () => {
  const e = extractSpecFromText("أريد نفس هذه الكنبة لكن لون أخضر ومخمل وعرض ٢٤٠ سم");
  assert.equal(e.color, "green");
  assert.equal(e.material, "velvet");
  assert.equal(e.widthCm, 240);
});

test("extract: never invents dimensions when not stated", () => {
  const e = extractSpecFromText("a walnut dining table, matte finish");
  // No measurement was stated → dimensions stay unset (never inferred).
  assert.equal(e.widthCm, undefined);
  assert.equal(e.depthCm, undefined);
  assert.equal(e.heightCm, undefined);
  assert.equal(e.material, "walnut");
});

test("extract: deterministic — same text → same result", () => {
  const t = "green velvet sofa 200 cm 3 seats";
  assert.deepEqual(extractSpecFromText(t), extractSpecFromText(t));
});

// ── Supplier matching (§17/§19) ───────────────────────────────────────────────

test("match: only active custom suppliers in the right category are eligible", () => {
  const spec = baseSpec(); // sofas
  const matches = matchSuppliers(demoSuppliers, spec);
  assert.ok(matches.length >= 1);
  assert.ok(matches.every((m) => m.supplier.status === "active"));
  assert.ok(matches.every((m) => m.supplier.capabilities?.customCategories.includes("sofas")));
  // Reasons are data-backed.
  assert.ok(matches[0].reasons.some((r) => r.code === "handles-category"));
});

test("match: inactive / suspended / non-custom suppliers are rejected", () => {
  const spec = baseSpec();
  const studio = demoSuppliers.find((s) => s.capabilities?.customCategories.includes("sofas"))!;
  assert.equal(matchSupplier({ ...studio, status: "suspended" }, spec), null);
  assert.equal(matchSupplier({ ...studio, status: "pending" }, spec), null);
  const noCaps: Supplier = { ...studio, capabilities: undefined };
  assert.equal(matchSupplier(noCaps, spec), null);
  const wrongCat = baseSpec({ category: "beds" });
  assert.equal(matchSupplier(studio, wrongCat), null); // studio doesn't do beds
});

test("match: material fit adds a reason and rank", () => {
  const withMat = matchSupplier(
    demoSuppliers.find((s) => s.capabilities?.materials.includes("velvet"))!,
    baseSpec({ material: "velvet" }),
  );
  assert.ok(withMat);
  assert.ok(withMat!.reasons.some((r) => r.code === "works-with-material" && r.value === "velvet"));
});

test("recipients: fake / ineligible supplier ids are dropped", () => {
  const spec = baseSpec();
  const eligible = matchSuppliers(demoSuppliers, spec).map((m) => m.supplier.id);
  const recipients = buildRecipients(demoSuppliers, spec, [...eligible, "HACKED-FAKE-SUPPLIER"]);
  assert.equal(recipients.length, eligible.length);
  assert.ok(!recipients.some((r) => r.supplierId === "HACKED-FAKE-SUPPLIER"));
});

// ── Demo quotes (§22/§44) ─────────────────────────────────────────────────────

test("demo quote: deterministic — same request+supplier → identical quote", () => {
  const spec = baseSpec();
  const s = demoSuppliers[0];
  const a = demoQuoteFor("req-1", spec, s, 1_000);
  const b = demoQuoteFor("req-1", spec, s, 1_000);
  assert.deepEqual(a, b);
  assert.equal(a.isDemo, true);
  assert.equal(a.currency, "OMR");
});

test("demo quote: total = base + delivery + installation (exact OMR)", () => {
  const q = demoQuoteFor("req-2", baseSpec(), demoSuppliers[0], 1_000);
  assert.equal(q.total, quoteTotal(q.basePrice, q.deliveryFee, q.installationFee));
  assert.ok(q.basePrice > 0 && q.manufacturingDays >= 1);
});

test("demo quotes: different suppliers → different quotes; within lead-time range", () => {
  const spec = baseSpec();
  const eligible = matchSuppliers(demoSuppliers, spec).map((m) => m.supplier);
  const quotes = generateDemoQuotes("req-3", spec, eligible, 1_000);
  assert.equal(quotes.length, eligible.length);
  const totals = new Set(quotes.map((q) => q.total));
  assert.ok(totals.size >= Math.min(2, quotes.length)); // not all identical
  for (const q of quotes) {
    const caps = eligible.find((s) => s.id === q.supplierId)!.capabilities!;
    assert.ok(q.manufacturingDays >= caps.leadTimeDaysMin && q.manufacturingDays <= caps.leadTimeDaysMax);
  }
});

// ── Quote totals / budget / sorting / recommendation (§37/§38/§39/§27) ─────────

test("quoteTotal + budgetPosition are deterministic", () => {
  assert.equal(quoteTotal(95, 5, 10), 110);
  assert.deepEqual(budgetPosition(110, 120), { status: "within", overBy: 0 });
  assert.deepEqual(budgetPosition(130, 120), { status: "over", overBy: 10 });
  assert.deepEqual(budgetPosition(130, undefined), { status: "no-budget", overBy: 0 });
});

function q(id: string, total: number, days: number, delivery = 5, status: Quote["status"] = "submitted"): Quote {
  return {
    id, requestId: "r", supplierId: id, basePrice: total - delivery, deliveryFee: delivery,
    installationFee: 0, total, currency: "OMR", manufacturingDays: days, warrantyText: "",
    notes: "", status, isDemo: true, validUntil: 0, createdAt: 0,
  };
}

test("sort: lowest-price / fastest are deterministic", () => {
  const qs = [q("a", 110, 7), q("b", 85, 14), q("c", 95, 10)];
  assert.deepEqual(sortQuotes(qs, "lowest-price").map((x) => x.id), ["b", "c", "a"]);
  assert.deepEqual(sortQuotes(qs, "fastest").map((x) => x.id), ["a", "c", "b"]);
});

test("recommend: transparent reasons; cheapest within budget wins", () => {
  const qs = [q("a", 110, 7, 0), q("b", 85, 14, 5), q("c", 95, 10, 5)];
  const rec = recommendQuote(qs, 120);
  assert.ok(rec);
  assert.equal(rec!.quoteId, "b"); // within budget + lowest total
  assert.ok(rec!.reasons.some((r) => r.code === "lowest-total"));
  assert.ok(rec!.reasons.some((r) => r.code === "within-budget"));
});

test("recommend: null on empty; does not crash on no budget", () => {
  assert.equal(recommendQuote([], 100), null);
  assert.ok(recommendQuote([q("a", 100, 5)], undefined));
});

// ── Quote validation (§15/§38) ────────────────────────────────────────────────

test("quote input: negative / absurd values rejected; free delivery allowed", () => {
  assert.equal(validateQuoteInput({ basePrice: -5, deliveryFee: 0, installationFee: 0, manufacturingDays: 10 }).ok, false);
  assert.equal(validateQuoteInput({ basePrice: 100, deliveryFee: -1, installationFee: 0, manufacturingDays: 10 }).ok, false);
  assert.equal(validateQuoteInput({ basePrice: 100, deliveryFee: 0, installationFee: 0, manufacturingDays: 0 }).ok, false);
  const ok = validateQuoteInput({ basePrice: 95.5, deliveryFee: 0, installationFee: 10, manufacturingDays: 14, validDays: 30 });
  assert.ok(ok.ok);
  assert.equal(ok.value.basePrice, 95.5);
});

// ── Authorization / ownership (§33) ───────────────────────────────────────────

test("authz: customer reads only own request; supplier only its addressed RFQ", () => {
  const req = { customerId: "cust-1", recipientIds: ["sup-a", "sup-b"] };
  assert.equal(canReadRequest({ userId: "cust-1", supplierIds: [] }, req), true);
  assert.equal(canReadRequest({ userId: "cust-2", supplierIds: [] }, req), false);
  assert.equal(canReadRequest({ userId: "x", supplierIds: ["sup-a"] }, req), true); // addressed supplier
  assert.equal(canReadRequest({ userId: "x", supplierIds: ["sup-z"] }, req), false); // not addressed
});

test("authz: supplier quotes only as its own supplier for an addressed RFQ", () => {
  const req = { customerId: "c", recipientIds: ["sup-a"] };
  assert.equal(canQuoteRequest({ userId: "x", supplierIds: ["sup-a"] }, req, "sup-a"), true);
  assert.equal(canQuoteRequest({ userId: "x", supplierIds: ["sup-a"] }, req, "sup-b"), false); // A can't quote as B
  assert.equal(canQuoteRequest({ userId: "x", supplierIds: ["sup-b"] }, req, "sup-b"), false); // B not addressed
});

test("authz: only the owning customer accepts; accepted quotes are locked", () => {
  const req = { customerId: "cust-1", recipientIds: ["sup-a"] };
  assert.equal(canAcceptQuote({ userId: "cust-1", supplierIds: [] }, req), true);
  assert.equal(canAcceptQuote({ userId: "cust-9", supplierIds: [] }, req), false);
  assert.equal(isAcceptedLocked("accepted"), true); // can't be overwritten in place
  assert.equal(isAcceptedLocked("submitted"), false);
});
