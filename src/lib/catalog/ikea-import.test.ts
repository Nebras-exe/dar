/**
 * Imported IKEA reference catalog — integrity tests.
 *
 * Verifies the generated catalog (scripts/import-local-furniture.mjs →
 * ikea-catalog.data.ts) is internally consistent and grounded: unique ids,
 * valid categories/colours, on-disk image files, per-colour variant switching,
 * estimated-price flagging, and that the AI grounding surfaces resolve to REAL
 * catalog products (no fabrication).
 */

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { products } from "./products";
import { colorSwatches, isColorId } from "./taxonomy";
import { getProductBySlug, searchProducts } from "./queries";
import { PRODUCT_VARIANTS } from "@/lib/catalog-preview/variants";
import { RAW_IKEA_PRODUCTS } from "./ikea-catalog.data";

const PUBLIC = path.resolve(process.cwd(), "public");

test("every product id and slug is globally unique", () => {
  assert.equal(new Set(products.map((p) => p.id)).size, products.length);
  assert.equal(new Set(products.map((p) => p.slug)).size, products.length);
});

test("every colour on every product is a real taxonomy colour id", () => {
  for (const p of products) {
    for (const c of p.colors) {
      assert.ok(isColorId(c.id), `${p.slug}: ${c.id} is a valid colour`);
      assert.equal(c.hex, colorSwatches[c.id].hex, `${p.slug}: ${c.id} hex matches taxonomy`);
    }
  }
});

test("every imported product is flagged as an estimated price with provenance", () => {
  for (const p of products) {
    assert.equal(p.priceType, "estimated", `${p.slug} price is estimated`);
    assert.ok(p.sourceLabel && p.sourceUrl, `${p.slug} carries provenance`);
  }
});

test("variant colours are unique per product and map to product colours", () => {
  for (const [slug, variants] of Object.entries(PRODUCT_VARIANTS)) {
    const product = getProductBySlug(slug);
    assert.ok(product, `${slug} is a real product`);
    const productColours = new Set(product!.colors.map((c) => c.id));
    const ids = variants.map((v) => v.colorId);
    assert.equal(new Set(ids).size, ids.length, `${slug}: unique variant colours`);
    for (const v of variants) {
      assert.ok(productColours.has(v.colorId), `${slug}: variant ${v.colorId} is a product colour`);
    }
    // Switching variants genuinely changes the photo.
    assert.equal(new Set(variants.map((v) => v.image)).size, variants.length, `${slug}: distinct photos`);
  }
});

test("a representative sample of variant image files exists on disk", () => {
  // Check the first image of each of the first 40 variant products — fast but broad.
  const slugs = Object.keys(PRODUCT_VARIANTS).slice(0, 40);
  let checked = 0;
  for (const slug of slugs) {
    for (const v of PRODUCT_VARIANTS[slug]) {
      const abs = path.join(PUBLIC, v.image.replace(/^\//, ""));
      assert.ok(fs.existsSync(abs), `missing image file: ${v.image}`);
      checked++;
    }
  }
  assert.ok(checked > 40, "checked a broad set of images");
});

test("every product's own images resolve to files that exist on disk", () => {
  // Sample across the whole catalog to keep the test fast.
  const sample = products.filter((_, i) => i % 7 === 0);
  for (const p of sample) {
    const first = p.images?.[0];
    assert.ok(first, `${p.slug} has an image`);
    assert.ok(fs.existsSync(path.join(PUBLIC, first!.replace(/^\//, ""))), `missing ${first}`);
  }
});

test("grounding: search surfaces resolve to real catalog slugs only", () => {
  for (const q of ["chair", "sofa", "table", "bed"]) {
    const results = searchProducts(q);
    assert.ok(results.length > 0, `"${q}" returns results`);
    for (const p of results) assert.ok(getProductBySlug(p.slug), `${p.slug} is real`);
  }
  // An unknown slug is never resolvable (no fabrication).
  assert.equal(getProductBySlug("totally-made-up-slug"), undefined);
});

test("the generated raw data and the mapped catalog agree in size", () => {
  assert.equal(products.length, RAW_IKEA_PRODUCTS.length);
});
