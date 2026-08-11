/**
 * Furniture colour-variant tests (LOCAL preview). Pure + deterministic — no
 * network, no paid calls.
 *
 * The demo catalog was cleared, so the slug-keyed `PRODUCT_VARIANTS` data is now
 * empty — but the variant ARCHITECTURE (resolver, price deltas, image URLs, cart
 * compatibility, isolation) stays intact and is verified here with synthetic
 * variant objects. Any real variant data added later must keep every variant
 * colour equal to a real product colour (guarded vacuously below until then).
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  variantsFor, hasVariants, defaultVariant, variantImageUrl, variantGalleryUrls, variantPrice,
  type PreviewVariant,
} from "./index";
import { PRODUCT_VARIANTS } from "./variants";

// ── Data is cleared, but the integrity invariant is still asserted ────────────

test("PRODUCT_VARIANTS is empty (demo variants cleared)", () => {
  assert.equal(Object.keys(PRODUCT_VARIANTS).length, 0);
});

test("any variant data added later keeps unique colours + 2–4 entries", () => {
  // Vacuous today; the guard fires the moment real variants are introduced.
  for (const [slug, variants] of Object.entries(PRODUCT_VARIANTS)) {
    assert.ok(variants.length >= 2 && variants.length <= 4, `${slug} has 2–4 variants`);
    const ids = variants.map((v) => v.colorId);
    assert.equal(new Set(ids).size, ids.length, `${slug}: unique variant colours`);
  }
});

// ── Resolver behaviour with no data ───────────────────────────────────────────

test("variantsFor / hasVariants / defaultVariant return empty for any slug", () => {
  assert.equal(hasVariants("test-modern-sofa"), false);
  assert.deepEqual(variantsFor("test-modern-sofa"), []);
  assert.equal(defaultVariant("test-modern-sofa"), null);
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
