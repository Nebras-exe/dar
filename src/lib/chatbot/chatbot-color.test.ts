/**
 * Chatbot strict colour filtering + normalization. Pure/deterministic — no paid
 * API. Injects a fixture catalog. Verifies: AR/EN colour synonyms map to catalog
 * ColorIds; a colour search returns only products with that real variant (and
 * tags the card with the colour so its variant photo shows); no match → an honest
 * message with NO cards and NO silent relaxation; multiple constraints AND.
 */

import test, { before, after } from "node:test";
import assert from "node:assert/strict";

import { __setCatalogProductsForTests, __resetCatalogProductsForTests } from "../catalog/queries";
import { makeProduct } from "../catalog/test-fixtures";
import { detectColor, extractSlots } from "./intents";
import { demoRespond } from "./demo-engine";
import type { ChatMessage } from "./types";

const CATALOG = [
  // A chair available in red + beige + black.
  makeProduct({ slug: "aria-chair", name: "Aria Chair", category: "chairs", price: 40, colors: ["red", "beige", "black"], materials: ["oak"], styleTags: ["modern"], roomTypes: ["living-room"] }),
  // A chair with NO red variant (beige/grey only).
  makeProduct({ slug: "noor-chair", name: "Noor Chair", category: "chairs", price: 45, colors: ["beige", "grey"], materials: ["oak"], styleTags: ["modern"], roomTypes: ["living-room"] }),
  // A red SOFA (must NOT satisfy a "red chair" request).
  makeProduct({ slug: "rua-sofa", name: "Rua Sofa", category: "sofas", price: 300, colors: ["red", "beige"], materials: ["linen"], styleTags: ["modern"], roomTypes: ["living-room"] }),
];

before(() => __setCatalogProductsForTests(CATALOG));
after(() => __resetCatalogProductsForTests());

function user(content: string): ChatMessage[] {
  return [{ role: "user", content }];
}

// ── Colour normalization (§13) ────────────────────────────────────────────────

test("colour synonyms map to catalog ColorIds (AR + EN)", () => {
  const n = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[ً-ٰٟ]/g, "");
  assert.equal(detectColor(n("أريد كرسي أحمر")), "red");
  assert.equal(detectColor(n("كنبة بيج")), "beige");
  assert.equal(detectColor(n("طاولة سكري")), "cream");   // synonym → cream
  assert.equal(detectColor(n("كرسي زيتي")), "olive");    // synonym → olive
  assert.equal(detectColor(n("an ivory piece")), "ivory");
  assert.equal(detectColor(n("رمادي")), "grey");
  assert.equal(detectColor(n("something plain")), undefined); // never invents
});

test("extractSlots reads category + colour from a natural request", () => {
  const s = extractSlots("أريد كرسي أحمر");
  assert.equal(s.category, "chairs");
  assert.equal(s.color, "red");
});

// ── Strict colour filtering (§2/§3/§6) ────────────────────────────────────────

test("'red chair' returns ONLY chairs with a real red variant — tagged with the colour", () => {
  const res = demoRespond(user("أريد كرسي أحمر"), "ar");
  const slugs = res.cards.map((c) => c.slug);
  assert.ok(slugs.includes("aria-chair"), "the chair that has a red variant is returned");
  assert.ok(!slugs.includes("noor-chair"), "a chair with no red variant is excluded");
  assert.ok(!slugs.includes("rua-sofa"), "a red SOFA does not satisfy a red CHAIR request");
  // Every card carries the requested colour so the RED variant image is shown.
  for (const c of res.cards) assert.equal(c.colorId, "red");
});

test("no red chair → honest specific message, NO cards, NO silent relaxation", () => {
  const noRed = [
    makeProduct({ slug: "beige-chair", category: "chairs", price: 40, colors: ["beige", "grey"], materials: ["oak"], styleTags: ["modern"], roomTypes: ["living-room"] }),
  ];
  __setCatalogProductsForTests(noRed);
  try {
    const ar = demoRespond(user("أريد كرسي أحمر"), "ar");
    assert.equal(ar.cards.length, 0, "no fabricated / relaxed results");
    assert.match(ar.message, /لا توجد/); // "there are no …"
    assert.match(ar.message, /دار/);
    const en = demoRespond(user("I want a red chair"), "en");
    assert.equal(en.cards.length, 0);
    assert.match(en.message, /no red chairs/i);
    assert.match(en.message, /DAR/);
  } finally {
    __setCatalogProductsForTests(CATALOG);
  }
});

// ── Multiple constraints = AND (§4) ───────────────────────────────────────────

test("'red chair under 50 OMR' applies category AND colour AND price", () => {
  const res = demoRespond(user("كرسي أحمر أقل من 50 ريال"), "ar");
  const slugs = res.cards.map((c) => c.slug);
  // aria-chair (chair, has red, 40 ≤ 50) qualifies; the red sofa (300) doesn't.
  assert.ok(slugs.includes("aria-chair"));
  assert.ok(!slugs.includes("rua-sofa"));
});

test("a price constraint that nothing meets returns no cards (not a relaxed result)", () => {
  const res = demoRespond(user("كرسي أحمر أقل من 20 ريال"), "ar");
  assert.equal(res.cards.length, 0, "no chair ≤ 20 OMR → honest empty, not widened");
});
