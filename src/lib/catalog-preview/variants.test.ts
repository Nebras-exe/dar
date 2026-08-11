/**
 * Real Furniture Color Variants tests (LOCAL preview). Pure + deterministic — no
 * network, no paid calls. Verifies the variant data stays consistent with the
 * production catalog (every variant colour is a real product colour), price deltas
 * apply, defaults resolve, images build valid URLs, and the layer is isolated
 * (a product without variants yields none).
 */

import test from "node:test";
import assert from "node:assert/strict";

import { getAllProducts } from "@/lib/catalog";
import {
  variantsFor, hasVariants, defaultVariant, variantImageUrl, variantGalleryUrls, variantPrice,
} from "./index";
import { PRODUCT_VARIANTS } from "./variants";

// ── Data integrity: every variant colour is a real catalog colour of its product ──

test("every variant colorId is one of the product's catalog colours (cart-compatible)", () => {
  const all = getAllProducts();
  for (const [slug, variants] of Object.entries(PRODUCT_VARIANTS)) {
    const product = all.find((p) => p.slug === slug);
    assert.ok(product, `variant product exists: ${slug}`);
    const colours = new Set(product!.colors.map((c) => c.id));
    assert.ok(variants.length >= 2 && variants.length <= 4, `${slug} has 2–4 variants`);
    for (const v of variants) {
      assert.ok(colours.has(v.colorId), `${slug}: variant colour ${v.colorId} is a real product colour`);
    }
  }
});

test("variant colours are unique per product (no duplicate swatch)", () => {
  for (const [slug, variants] of Object.entries(PRODUCT_VARIANTS)) {
    const ids = variants.map((v) => v.colorId);
    assert.equal(new Set(ids).size, ids.length, `${slug}: unique variant colours`);
  }
});

// ── Resolver behaviour ────────────────────────────────────────────────────────

test("variantsFor / hasVariants / defaultVariant", () => {
  assert.ok(hasVariants("luna-modular-sofa"));
  assert.equal(variantsFor("luna-modular-sofa").length, 3);
  assert.equal(defaultVariant("luna-modular-sofa")?.colorId, variantsFor("luna-modular-sofa")[0].colorId);
  // A product without variants → none (isolation: no accidental coverage).
  assert.equal(hasVariants("salma-ceramic-vase"), false);
  assert.deepEqual(variantsFor("salma-ceramic-vase"), []);
  assert.equal(defaultVariant("salma-ceramic-vase"), null);
});

test("variantPrice applies the delta to the base price", () => {
  const luna = variantsFor("luna-modular-sofa");
  const sage = luna.find((v) => v.colorId === "sage")!; // priceDelta 10
  assert.equal(variantPrice(320, sage), 330);
  const cream = luna.find((v) => v.colorId === "cream")!; // no delta
  assert.equal(variantPrice(320, cream), 320);
});

test("variant images build valid Unsplash URLs; gallery has the main image first", () => {
  const v = variantsFor("luna-modular-sofa")[0];
  const url = variantImageUrl(v, 600);
  assert.match(url, /^https:\/\/images\.unsplash\.com\/photo-/);
  assert.match(url, /w=600/);
  const gallery = variantGalleryUrls(v, 600);
  assert.equal(gallery[0], url);
  assert.ok(gallery.length >= 1);
});

test("a full URL override passes through unchanged", () => {
  // variantImageUrl accepts a full URL as the image (documented override path).
  const url = variantImageUrl({ colorId: "beige", image: "https://example.com/x.jpg" }, 600);
  assert.equal(url, "https://example.com/x.jpg");
});
