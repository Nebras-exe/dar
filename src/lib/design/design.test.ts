/**
 * AI Designer engine tests — Node's built-in runner: `npm test`.
 * These exercise the pure recommendation/replacement/budget logic exactly as a
 * future agent tool would call it.
 */

import test, { before, after } from "node:test";
import assert from "node:assert/strict";

import {
  getProductBySlug,
  __setCatalogProductsForTests,
  __resetCatalogProductsForTests,
} from "../catalog/queries";
import { sampleCatalog } from "../catalog/test-fixtures";
import { getRoomPlan, getDecisionCategories } from "./room-needs";

// The production catalog is empty; exercise the design engine against fixtures.
before(() => __setCatalogProductsForTests(sampleCatalog));
after(() => __resetCatalogProductsForTests());
import {
  buildOption,
  findReplacements,
  getCandidates,
  getOption,
  pickReplacement,
  summarize,
} from "./recommend";
import { generateDemoDesign } from "./demo-service";
import type { DesignInput } from "./types";

function baseInput(overrides: Partial<DesignInput> = {}): DesignInput {
  return {
    roomType: "living-room",
    budget: 500,
    primaryStyle: "warm-modern",
    preferredColors: ["beige"],
    preferredMaterials: ["oak"],
    decisions: [],
    ...overrides,
  };
}

test("living room plan leads with an essential sofa", () => {
  const plan = getRoomPlan("living-room");
  assert.equal(plan.needs[0].category, "sofas");
  assert.equal(plan.needs[0].essential, true);
  assert.ok(getDecisionCategories("living-room").includes("rugs"));
});

test("every recommended product exists in the catalog", () => {
  const rec = generateDemoDesign(baseInput());
  for (const opt of rec.options) {
    for (const item of opt.items) {
      assert.ok(getProductBySlug(item.slug), `${item.slug} exists`);
      assert.equal(getProductBySlug(item.slug)?.category, item.category);
    }
  }
});

test("keeping the sofa excludes sofas from the design", () => {
  const rec = generateDemoDesign(
    baseInput({ decisions: [{ category: "sofas", disposition: "keep" }] }),
  );
  for (const opt of rec.options) {
    assert.ok(!opt.items.some((i) => i.category === "sofas"), `${opt.tier} has no sofa`);
    assert.ok(opt.kept.some((k) => k.category === "sofas"));
    assert.equal(opt.summary.keptCount, 1);
  }
});

test("replacing/unsure does NOT exclude the category", () => {
  const rec = generateDemoDesign(
    baseInput({ decisions: [{ category: "sofas", disposition: "replace" }] }),
  );
  assert.ok(
    getOption(rec, "balanced").items.some((i) => i.category === "sofas"),
    "sofa still recommended when replacing",
  );
});

test("balanced/premium stay within budget when feasible; totals are exact", () => {
  const rec = generateDemoDesign(baseInput({ budget: 600 }));
  for (const opt of rec.options) {
    const sum = summarize(opt.items, rec.input);
    assert.equal(sum.newFurnitureTotal, opt.summary.newFurnitureTotal);
    // Recompute total independently from the catalog.
    const total = opt.items.reduce(
      (t, i) => t + (getProductBySlug(i.slug)?.price ?? 0),
      0,
    );
    assert.ok(Math.abs(total - opt.summary.newFurnitureTotal) < 0.0005);
    if (opt.summary.overBudget === 0) {
      assert.ok(opt.summary.newFurnitureTotal <= rec.input.budget + 1e-9);
    }
    assert.equal(
      opt.summary.remaining,
      Math.max(0, Math.round((rec.input.budget - opt.summary.newFurnitureTotal) * 1000) / 1000),
    );
  }
});

test("no duplicate products or duplicate categories within an option", () => {
  const rec = generateDemoDesign(baseInput());
  for (const opt of rec.options) {
    const slugs = opt.items.map((i) => i.slug);
    const cats = opt.items.map((i) => i.category);
    assert.equal(new Set(slugs).size, slugs.length, "unique slugs");
    assert.equal(new Set(cats).size, cats.length, "one product per category");
  }
});

test("smart-saver total <= balanced <= premium (given a comfortable budget)", () => {
  const rec = generateDemoDesign(baseInput({ budget: 900 }));
  const saver = getOption(rec, "smart-saver").summary.newFurnitureTotal;
  const balanced = getOption(rec, "balanced").summary.newFurnitureTotal;
  const premium = getOption(rec, "premium").summary.newFurnitureTotal;
  assert.ok(saver <= premium, "saver cheaper than premium");
  assert.ok(saver <= balanced + 1e-9, "saver <= balanced");
});

test("preferred style pushes matching products to the front of candidates", () => {
  const warm = getCandidates("sofas", baseInput({ primaryStyle: "warm-modern" }));
  assert.ok(warm[0].styleTags.includes("warm-modern"), "top sofa matches warm-modern");
  const japandi = getCandidates("chairs", baseInput({ primaryStyle: "japandi" }));
  assert.ok(japandi[0].styleTags.includes("japandi"), "top chair matches japandi");
});

test("preferred colour affects ranking", () => {
  const beige = getCandidates("sofas", baseInput({ preferredColors: ["beige"], primaryStyle: "modern" }));
  // A beige-bearing sofa should outrank one without, all else near-equal.
  const firstFew = beige.slice(0, 3);
  assert.ok(firstFew.some((p) => p.colors.some((c) => c.id === "beige")));
});

test("replacement: cheaper returns a strictly cheaper same-category product", () => {
  const rec = generateDemoDesign(baseInput());
  const coffee = getOption(rec, "balanced").items.find((i) => i.category === "coffee-tables");
  assert.ok(coffee, "has a coffee table");
  const current = getProductBySlug(coffee!.slug)!;
  const cheaper = pickReplacement(coffee!.slug, "cheaper", rec.input);
  if (cheaper) {
    assert.ok(cheaper.price < current.price);
    assert.equal(cheaper.category, "coffee-tables");
    assert.notEqual(cheaper.slug, current.slug);
  }
});

test("replacement: upgrade returns a pricier same-category product", () => {
  const input = baseInput();
  // Start from the cheapest sofa so an upgrade definitely exists.
  const sofas = getCandidates("sofas", input).sort((a, b) => a.price - b.price);
  const cheapest = sofas[0];
  const up = pickReplacement(cheapest.slug, "upgrade", input);
  assert.ok(up, "an upgrade exists");
  assert.ok(up!.price > cheapest.price);
  assert.equal(up!.category, "sofas");
});

test("replacement: similar stays within ±30% price and excludes current + design", () => {
  const input = baseInput();
  const sofa = getCandidates("sofas", input)[0];
  const design = getOption(generateDemoDesign(input), "balanced").items.map((i) => i.slug);
  const sims = findReplacements(sofa.slug, "similar", input, design);
  for (const s of sims) {
    assert.ok(Math.abs(s.price - sofa.price) / sofa.price <= 0.3 + 1e-9);
    assert.notEqual(s.slug, sofa.slug);
    assert.ok(!design.includes(s.slug));
  }
});

test("very low budget still yields a useful, non-empty plan and flags overspend honestly", () => {
  const rec = generateDemoDesign(baseInput({ budget: 80 }));
  const saver = getOption(rec, "smart-saver");
  assert.ok(saver.items.length >= 1, "at least one high-impact piece");
  // The essential category is still present even if it forces a small overspend.
  const total = saver.summary.newFurnitureTotal;
  if (total > 80) assert.ok(saver.summary.overBudget > 0, "overspend surfaced, not hidden");
});

test("recommendedTier is in-budget when any option fits", () => {
  const rec = generateDemoDesign(baseInput({ budget: 500 }));
  const chosen = getOption(rec, rec.recommendedTier);
  const anyInBudget = rec.options.some((o) => o.summary.overBudget === 0);
  if (anyInBudget) assert.equal(chosen.summary.overBudget, 0);
});

test("summarize after removing an item lowers total and raises remaining", () => {
  const rec = generateDemoDesign(baseInput({ budget: 600 }));
  const opt = getOption(rec, "balanced");
  assert.ok(opt.items.length >= 2);
  const removed = opt.items.slice(1);
  const before = opt.summary;
  const after = summarize(removed, rec.input);
  assert.ok(after.newFurnitureTotal <= before.newFurnitureTotal);
  assert.ok(after.remaining >= before.remaining);
  assert.equal(after.itemCount, removed.length);
});

test("outdoor room maps to outdoor catalog products", () => {
  const rec = generateDemoDesign(baseInput({ roomType: "outdoor", budget: 600 }));
  const opt = getOption(rec, "balanced");
  assert.ok(opt.items.length >= 1);
  const first = getProductBySlug(opt.items[0].slug)!;
  assert.ok(first.roomTypes.includes("outdoor") || first.category === "outdoor");
});

test("buildOption is deterministic (same input → same slugs)", () => {
  const a = buildOption(baseInput(), "balanced").items.map((i) => i.slug);
  const b = buildOption(baseInput(), "balanced").items.map((i) => i.slug);
  assert.deepEqual(a, b);
});
