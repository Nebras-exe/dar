/**
 * Furniture colour-variant tests (LOCAL preview). Pure + deterministic — no
 * network, no paid calls.
 *
 * The catalog is now populated from the imported IKEA Oman reference gallery, so
 * `PRODUCT_VARIANTS` holds real per-colour photo sets for the multi-colour
 * products. This verifies the integrity invariant (unique colours per product,
 * local image paths) and the resolver architecture (price deltas, URLs, cart
 * compatibility, isolation) with synthetic variant objects.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  variantsFor, hasVariants, defaultVariant, variantImageUrl, variantGalleryUrls, variantPrice,
  type PreviewVariant,
} from "./index";
import { PRODUCT_VARIANTS } from "./variants";

// ── Real imported variant data: integrity invariants ─────────────────────────

test("PRODUCT_VARIANTS holds multi-colour imported products", () => {
  assert.ok(Object.keys(PRODUCT_VARIANTS).length > 0, "variants were imported");
});

test("every product keeps 2+ variants with UNIQUE colours and local images", () => {
  for (const [slug, variants] of Object.entries(PRODUCT_VARIANTS)) {
    assert.ok(variants.length >= 2, `${slug} has 2+ variants`);
    const ids = variants.map((v) => v.colorId);
    assert.equal(new Set(ids).size, ids.length, `${slug}: unique variant colours`);
    for (const v of variants) {
      assert.ok(v.image.startsWith("/images/catalog/"), `${slug} local image: ${v.image}`);
    }
  }
});

// ── Resolver behaviour for an unknown slug ────────────────────────────────────

test("variantsFor / hasVariants / defaultVariant return empty for an unknown slug", () => {
  assert.equal(hasVariants("no-such-product-xyz"), false);
  assert.deepEqual(variantsFor("no-such-product-xyz"), []);
  assert.equal(defaultVariant("no-such-product-xyz"), null);
});

// ── Pure helpers (architecture, independent of catalog data) ──────────────────

test("variantPrice applies the delta to the base price", () => {
  const withDelta: PreviewVariant = { colorId: "sage", image: "x", priceDelta: 10 };
  assert.equal(variantPrice(320, withDelta), 330);
  const noDelta: PreviewVariant = { colorId: "cream", image: "y" };
  assert.equal(variantPrice(320, noDelta), 320);
});

test("variant images build valid image URLs; gallery has the main image first", () => {
  const v: PreviewVariant = { colorId: "beige", image: "1555041469-a586c61ea9bc" };
  const url = variantImageUrl(v, 600);
  assert.match(url, /^https:\/\/images\.unsplash\.com\/photo-/);
  assert.match(url, /w=600/);
  const gallery = variantGalleryUrls(v, 600);
  assert.equal(gallery[0], url);
  assert.ok(gallery.length >= 1);
});

test("a full URL override passes through unchanged", () => {
  const url = variantImageUrl({ colorId: "beige", image: "https://example.com/x.jpg" }, 600);
  assert.equal(url, "https://example.com/x.jpg");
});
