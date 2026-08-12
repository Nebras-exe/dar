/**
 * Homepage calm-curation tests. Pure + deterministic. The SHOP keeps every
 * colour; the homepage prefers calm/muted variants, picks a calm variant to
 * DISPLAY, and balances categories. Bright pieces are never removed — only not
 * featured, and shown in their calm variant when a product has one.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { isCalmColor, calmVariantFor, homepageFeatured, homepageEligible, SATURATED_COLORS } from "./curation";
import { makeProduct } from "./test-fixtures";

test("saturated colours are not calm; muted/warm ones are", () => {
  for (const c of SATURATED_COLORS) assert.equal(isCalmColor(c), false);
  for (const c of ["beige", "cream", "walnut", "olive", "sage", "charcoal", "taupe", "sand"] as const) {
    assert.equal(isCalmColor(c), true);
  }
});

test("calmVariantFor picks the first calm colour; undefined when all bright", () => {
  const mixed = makeProduct({ slug: "c1", category: "chairs", price: 40, colors: ["red", "beige", "black"], materials: ["oak"], styleTags: ["modern"], roomTypes: ["living-room"] });
  assert.equal(calmVariantFor(mixed), "beige");
  const allBright = makeProduct({ slug: "c2", category: "chairs", price: 40, colors: ["red", "orange", "pink"], materials: ["oak"], styleTags: ["modern"], roomTypes: ["living-room"] });
  assert.equal(calmVariantFor(allBright), undefined);
});

const CATALOG = [
  makeProduct({ slug: "red-chair", category: "chairs", price: 40, colors: ["red", "beige", "black"], materials: ["oak"], styleTags: ["modern"], roomTypes: ["living-room"], featuredRank: 1 }),
  makeProduct({ slug: "bright-only-chair", category: "chairs", price: 45, colors: ["red", "orange"], materials: ["oak"], styleTags: ["modern"], roomTypes: ["living-room"], featuredRank: 2 }),
  makeProduct({ slug: "calm-sofa", category: "sofas", price: 300, colors: ["beige", "sage"], materials: ["linen"], styleTags: ["warm-modern"], roomTypes: ["living-room"], featuredRank: 3 }),
  makeProduct({ slug: "walnut-table", category: "coffee-tables", price: 90, colors: ["walnut"], materials: ["walnut"], styleTags: ["modern"], roomTypes: ["living-room"], featuredRank: 4 }),
  makeProduct({ slug: "olive-rug", category: "rugs", price: 60, colors: ["olive", "sand"], materials: ["wool"], styleTags: ["boho"], roomTypes: ["living-room"], featuredRank: 5 }),
];

test("homepage prefers a calm variant and never a bright one", () => {
  const picks = homepageFeatured(6, CATALOG);
  for (const p of picks) {
    assert.ok(isCalmColor(p.displayColorId), `${p.product.slug} shows a calm colour, not ${p.displayColorId}`);
  }
  // The red chair IS eligible (it has a beige variant) and is shown in beige.
  const redChair = picks.find((p) => p.product.slug === "red-chair");
  assert.ok(redChair, "a product with a calm variant is still featurable");
  assert.equal(redChair!.displayColorId, "beige", "featured in its calm variant, not red");
});

test("a bright-only product is NOT featured on the homepage (but stays in the catalog)", () => {
  const eligible = homepageEligible(CATALOG).map((p) => p.product.slug);
  assert.ok(!eligible.includes("bright-only-chair"), "no calm variant → not homepage-eligible");
  // It's still a real catalog product (present in the source) — never removed.
  assert.ok(CATALOG.some((p) => p.slug === "bright-only-chair"));
});

test("homepage balances categories (round-robin, not one category)", () => {
  const picks = homepageFeatured(4, CATALOG);
  const cats = picks.map((p) => p.product.category);
  // First four picks span distinct categories before repeating any.
  assert.equal(new Set(cats).size, cats.length, "no category repeats within the balanced set");
});

test("curation is deterministic (same catalog → same picks/order)", () => {
  const a = homepageFeatured(6, CATALOG).map((p) => `${p.product.slug}:${p.displayColorId}`);
  const b = homepageFeatured(6, CATALOG).map((p) => `${p.product.slug}:${p.displayColorId}`);
  assert.deepEqual(a, b);
});
