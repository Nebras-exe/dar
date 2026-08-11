/**
 * Catalog logic tests — runnable with Node's built-in runner (no extra deps):
 *   node --test
 *
 * The production catalog is now POPULATED from the imported IKEA Oman reference
 * gallery, so these tests do two things: (1) assert the shipped catalog is well-
 * formed and every surface works, and (2) inject a synthetic fixture catalog to
 * exercise the deterministic query layer exactly as the app/Agent would call it.
 */

import test, { before, after, describe } from "node:test";
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
  __setCatalogProductsForTests,
  __resetCatalogProductsForTests,
} from "./queries";
import { computeItemCount, computeSubtotal, formatOmr, roundOmr } from "./pricing";
import { sampleCatalog } from "./test-fixtures";

// ── Populated production catalog (imported reference furniture) ───────────────

test("the shipped catalog is populated and well-formed", () => {
  assert.ok(products.length > 100, "many imported products");
  assert.equal(getAllProducts().length, products.length);

  const slugs = new Set(products.map((p) => p.slug));
  assert.equal(slugs.size, products.length, "slugs are globally unique");
  const ids = new Set(products.map((p) => p.id));
  assert.equal(ids.size, products.length, "ids are globally unique");

  const known = new Set(getCategories().map((c) => c.slug));
  for (const p of products) {
    assert.ok(known.has(p.category), `${p.slug} → ${p.category} is a real category`);
    assert.ok(p.price > 0, `${p.slug} has a positive price`);
    assert.ok(p.colors.length > 0, `${p.slug} has at least one colour`);
    assert.ok(p.nameAr.trim().length > 0, `${p.slug} has an Arabic name`);
    assert.ok(p.dimensions.widthCm > 0, `${p.slug} has a width`);
    // Every imported product image is a local public path, never a remote URL.
    for (const img of p.images ?? []) {
      assert.ok(img.startsWith("/images/catalog/"), `${p.slug} image is local: ${img}`);
    }
  }
  // Imported reference products are flagged as estimated prices.
  assert.ok(products.every((p) => p.priceType === "estimated"), "prices are estimated");

  // Query surfaces work against the real catalog.
  assert.ok(getProductsByCategory("sofas").length > 0);
  assert.ok(searchProducts("chair").length > 0);
  const bounds = getPriceBounds();
  assert.ok(bounds.min > 0 && bounds.max >= bounds.min);
});

test("categories remain available (taxonomy is preserved)", () => {
  const cats = getCategories();
  assert.ok(cats.length >= 10, "category taxonomy is intact");
  assert.equal(getCategory("sofas")?.slug, "sofas");
});

// ── Query layer, exercised against injected fixtures ──────────────────────────

describe("query layer (fixture catalog injected)", () => {
  before(() => __setCatalogProductsForTests(sampleCatalog));
  after(() => __resetCatalogProductsForTests());

  test("fixtures are well-formed", () => {
    const slugs = new Set(sampleCatalog.map((p) => p.slug));
    assert.equal(slugs.size, sampleCatalog.length, "slugs are unique");
    const known = new Set(getCategories().map((c) => c.slug));
    for (const p of getAllProducts()) {
      assert.ok(p.price > 0, `${p.slug} has a positive price`);
      assert.ok(p.colors.length > 0, `${p.slug} has colours`);
      assert.ok(p.materials.length > 0, `${p.slug} has materials`);
      assert.ok(p.dimensions.widthCm > 0, `${p.slug} has a width`);
      assert.ok(p.nameAr.trim().length > 0, `${p.slug} has an Arabic name`);
      assert.ok(known.has(p.category), `${p.slug} → ${p.category} exists`);
    }
  });

  test("getProductBySlug / getProductsByCategory", () => {
    const p = getProductBySlug("test-modern-sofa");
    assert.ok(p);
    assert.equal(p?.category, "sofas");
    assert.equal(getProductBySlug("does-not-exist"), undefined);
    const sofas = getProductsByCategory("sofas");
    assert.ok(sofas.length >= 2);
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

  test("the AI-style compound query returns deterministic results", () => {
    // "sofa, warm-modern, beige, width ≤ 240 cm, under OMR 500, in stock"
    const res = filterProducts({
      categories: ["sofas"],
      styles: ["warm-modern"],
      colors: ["beige"],
      maxWidthCm: 240,
      maxPrice: 500,
      availability: ["in-stock"],
    });
    assert.ok(res.length > 0);
    for (const p of res) {
      assert.equal(p.category, "sofas");
      assert.ok(p.styleTags.includes("warm-modern"));
      assert.ok(p.colors.some((c) => c.id === "beige"));
      assert.ok(p.dimensions.widthCm <= 240);
      assert.ok(p.price <= 500);
      assert.equal(p.stockStatus, "in-stock");
    }
  });

  test("search matches across name, material and colour, both languages", () => {
    assert.ok(searchProducts("walnut").length > 0);
    assert.ok(searchProducts("sofa").length > 0);
    assert.ok(searchProducts("تجريبي").length > 0, "matches Arabic name");
    const res = filterProducts({ query: "oak chair" });
    assert.ok(res.length > 0);
  });

  test("sort: price asc/desc and stability (no mutation)", () => {
    const all = getAllProducts();
    const asc = sortProducts(all, "price-asc");
    for (let i = 1; i < asc.length; i++) assert.ok(asc[i - 1].price <= asc[i].price);
    const desc = sortProducts(all, "price-desc");
    for (let i = 1; i < desc.length; i++) assert.ok(desc[i - 1].price >= desc[i].price);
    assert.equal(all[0].slug, getAllProducts()[0].slug);
  });

  test("sort: newest orders by addedAt descending", () => {
    const newest = sortProducts(getAllProducts(), "newest");
    for (let i = 1; i < newest.length; i++) {
      assert.ok(newest[i - 1].addedAt >= newest[i].addedAt);
    }
  });

  test("related products: relevant, deterministic, excludes self", () => {
    const p = getProductBySlug("test-modern-sofa")!;
    const related = getRelatedProducts(p, 4);
    assert.ok(related.length >= 1 && related.length <= 4);
    assert.ok(!related.some((r) => r.slug === p.slug));
    const again = getRelatedProducts(p, 4).map((r) => r.slug);
    assert.deepEqual(related.map((r) => r.slug), again);
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
    const prices = sampleCatalog.map((p) => p.price);
    assert.ok(min <= Math.min(...prices));
    assert.ok(max >= Math.max(...prices));
  });
});

// ── Pure helpers (catalog-independent) ────────────────────────────────────────

test("pricing: subtotal and count are exact (3-decimal OMR)", () => {
  const items = [
    { price: 185.5, quantity: 2 },
    { price: 42.25, quantity: 1 },
  ];
  assert.equal(computeSubtotal(items), 413.25);
  assert.equal(computeItemCount(items), 3);
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
