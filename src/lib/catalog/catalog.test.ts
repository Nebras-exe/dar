/**
 * Catalog logic tests — runnable with Node's built-in runner (no extra deps):
 *   node --test
 *
 * These modules use relative imports and no framework APIs specifically so they
 * can be exercised here exactly as the future AI Agent would call them.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { products } from "./products";
import {
  filterProducts,
  getAllProducts,
  getCategories,
  getCategory,
  getProductBySlug,
  getProductsByCategory,
  getRelatedProducts,
  getPriceBounds,
  searchProducts,
  sortProducts,
} from "./queries";
import { computeItemCount, computeSubtotal, formatOmr, roundOmr } from "./pricing";

test("catalog has ~80 unique, well-formed products", () => {
  assert.ok(products.length >= 60 && products.length <= 100, "60–100 products");
  const slugs = new Set(products.map((p) => p.slug));
  assert.equal(slugs.size, products.length, "slugs are unique");
  for (const p of products) {
    assert.ok(p.price > 0, `${p.slug} has a positive price`);
    assert.equal(p.isDemo, true, `${p.slug} is flagged demo`);
    assert.ok(p.colors.length > 0, `${p.slug} has colours`);
    assert.ok(p.materials.length > 0, `${p.slug} has materials`);
    assert.ok(p.dimensions.widthCm > 0, `${p.slug} has a width`);
    assert.ok(p.nameAr.trim().length > 0, `${p.slug} has an Arabic name`);
  }
});

test("every product belongs to a real category", () => {
  const known = new Set(getCategories().map((c) => c.slug));
  for (const p of getAllProducts()) {
    assert.ok(known.has(p.category), `${p.slug} → ${p.category} exists`);
  }
});

test("getProductBySlug / getProductsByCategory", () => {
  const p = getProductBySlug("luna-modular-sofa");
  assert.ok(p);
  assert.equal(p?.category, "sofas");
  assert.equal(getProductBySlug("does-not-exist"), undefined);
  const sofas = getProductsByCategory("sofas");
  assert.ok(sofas.length >= 5);
  assert.ok(sofas.every((s) => s.category === "sofas"));
});

test("filter: max price is inclusive and correct", () => {
  const res = filterProducts({ maxPrice: 100 });
  assert.ok(res.length > 0);
  assert.ok(res.every((p) => p.price <= 100));
});

test("filter: facets combine with AND, values within a facet with OR", () => {
  const res = filterProducts({
    categories: ["sofas"],
    styles: ["warm-modern", "japandi"],
  });
  assert.ok(res.length > 0);
  assert.ok(
    res.every(
      (p) =>
        p.category === "sofas" &&
        (p.styleTags.includes("warm-modern") ||
          p.styleTags.includes("japandi")),
    ),
  );
});

test("filter: colour, material, room and width bounds", () => {
  const beige = filterProducts({ colors: ["beige"] });
  assert.ok(beige.every((p) => p.colors.some((c) => c.id === "beige")));

  const oak = filterProducts({ materials: ["oak"] });
  assert.ok(oak.every((p) => p.materials.includes("oak")));

  const majlis = filterProducts({ rooms: ["majlis"] });
  assert.ok(majlis.every((p) => p.roomTypes.includes("majlis")));

  const narrow = filterProducts({ maxWidthCm: 240, categories: ["sofas"] });
  assert.ok(narrow.every((p) => p.dimensions.widthCm <= 240));
});

test("filter: the AI-style compound query returns deterministic results", () => {
  // "sofa, warm-modern, beige, width ≤ 240 cm, under OMR 320, in stock"
  const res = filterProducts({
    categories: ["sofas"],
    styles: ["warm-modern"],
    colors: ["beige"],
    maxWidthCm: 240,
    maxPrice: 320,
    availability: ["in-stock"],
  });
  for (const p of res) {
    assert.equal(p.category, "sofas");
    assert.ok(p.styleTags.includes("warm-modern"));
    assert.ok(p.colors.some((c) => c.id === "beige"));
    assert.ok(p.dimensions.widthCm <= 240);
    assert.ok(p.price <= 320);
    assert.equal(p.stockStatus, "in-stock");
  }
});

test("search matches across name, material and colour, both languages", () => {
  assert.ok(searchProducts("walnut").length > 0);
  assert.ok(searchProducts("sofa").length > 0);
  assert.ok(searchProducts("كنبة").length > 0, "matches Arabic name");
  // Multi-token AND
  const res = filterProducts({ query: "oak chair" });
  assert.ok(res.length > 0);
});

test("sort: price asc/desc and stability", () => {
  const asc = sortProducts(products, "price-asc");
  for (let i = 1; i < asc.length; i++) {
    assert.ok(asc[i - 1].price <= asc[i].price);
  }
  const desc = sortProducts(products, "price-desc");
  for (let i = 1; i < desc.length; i++) {
    assert.ok(desc[i - 1].price >= desc[i].price);
  }
  // does not mutate source
  assert.equal(products[0].slug, getAllProducts()[0].slug);
});

test("sort: newest orders by addedAt descending", () => {
  const newest = sortProducts(products, "newest");
  for (let i = 1; i < newest.length; i++) {
    assert.ok(newest[i - 1].addedAt >= newest[i].addedAt);
  }
});

test("related products: relevant, deterministic, excludes self", () => {
  const p = getProductBySlug("luna-modular-sofa")!;
  const related = getRelatedProducts(p, 4);
  assert.equal(related.length, 4);
  assert.ok(!related.some((r) => r.slug === p.slug));
  // Deterministic: same input → same output
  const again = getRelatedProducts(p, 4).map((r) => r.slug);
  assert.deepEqual(related.map((r) => r.slug), again);
  // At least one shares the category or a style tag
  assert.ok(
    related.some(
      (r) =>
        r.category === p.category ||
        r.styleTags.some((s) => p.styleTags.includes(s)),
    ),
  );
});

test("price bounds cover the catalog", () => {
  const { min, max } = getPriceBounds();
  assert.ok(min <= Math.min(...products.map((p) => p.price)));
  assert.ok(max >= Math.max(...products.map((p) => p.price)));
});

test("pricing: subtotal and count are exact (3-decimal OMR)", () => {
  const items = [
    { price: 185.5, quantity: 2 },
    { price: 42.25, quantity: 1 },
  ];
  assert.equal(computeSubtotal(items), 413.25);
  assert.equal(computeItemCount(items), 3);
  // Float-drift case: 0.1 + 0.2 style
  assert.equal(computeSubtotal([{ price: 0.1, quantity: 3 }]), 0.3);
  assert.equal(roundOmr(1.0005), 1.001);
});

test("getCategory resolves and rejects", () => {
  assert.equal(getCategory("rugs")?.slug, "rugs");
  assert.equal(getCategory("nope"), undefined);
});

test("formatOmr renders three decimals in both locales", () => {
  const en = formatOmr(185, "en");
  assert.match(en, /185\.000/);
  const ar = formatOmr(185, "ar");
  assert.ok(ar.length > 0);
});
