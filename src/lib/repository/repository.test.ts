/**
 * Repository + validation tests (Phase 08, §45). No real backend writes: the
 * demo adapter wraps the pure catalog, and validation/slug logic is pure. These
 * cover the §49 security cases (bad price/dimensions/category/colour) plus mode
 * selection, catalog-adapter compatibility, cross-supplier isolation, and slugs.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { getAllProducts } from "../catalog";
import { backendMode } from "../backend/config";
import {
  catalogMode,
  repoGetProducts,
  repoGetProductBySlug,
  repoGetProductsBySupplier,
} from "./catalog";
import { getPublicSuppliers, demoSupplierById } from "./index";
import { validateProductInput, validateSupplierApplication, computeConfiguredPrice, isEmail } from "./validation";
import { slugify, uniqueSlug } from "./slug";
import { isPubliclyVisibleProduct } from "../auth/authorization";

// ── Mode selection / adapter compatibility (§26/§34) ──────────────────────────

test("mode: with no Supabase env, backend is demo", () => {
  assert.equal(backendMode(), "demo");
  assert.equal(catalogMode(), "demo");
});

test("adapter: demo repository matches the pure catalog", async () => {
  const all = await repoGetProducts();
  assert.equal(all.length, getAllProducts().length);
  const one = await repoGetProductBySlug("luna-modular-sofa");
  assert.ok(one);
  assert.equal(one!.slug, "luna-modular-sofa");
  assert.equal(await repoGetProductBySlug("HACKED-FAKE"), null);
});

test("suppliers: only active are public; demo suppliers are flagged", async () => {
  const suppliers = await getPublicSuppliers();
  assert.ok(suppliers.length > 0);
  assert.ok(suppliers.every((s) => s.status === "active"));
  assert.ok(suppliers.every((s) => s.isDemo === true && s.verified === false));
});

test("isolation: products resolve to their own supplier only (no cross-supplier)", async () => {
  const a = demoSupplierById("demo-athathi-studio")!;
  const b = demoSupplierById("demo-furniture-lab")!;
  const aProducts = await repoGetProductsBySupplier(a.id);
  const bProducts = await repoGetProductsBySupplier(b.id);
  const aSlugs = new Set(aProducts.map((p) => p.slug));
  // No product appears under both suppliers.
  assert.ok(bProducts.every((p) => !aSlugs.has(p.slug)));
});

// ── Product validation (§31/§49) ──────────────────────────────────────────────

function goodProduct() {
  return {
    name: "Test Sofa",
    nameAr: "كنبة اختبار",
    category: "sofas",
    basePrice: 199.5,
    dimensions: { widthCm: 200, depthCm: 90, heightCm: 80 },
    styleTags: ["warm-modern", "not-a-style"],
    roomTypes: ["living-room"],
    colors: ["beige", "not-a-colour"],
    materials: ["linen"],
    inventoryStatus: "in_stock",
    status: "active",
  };
}

test("product: a valid payload normalizes; bad taxonomy values are dropped", () => {
  const r = validateProductInput(goodProduct());
  assert.ok(r.ok);
  assert.equal(r.value.basePrice, 199.5);
  assert.deepEqual(r.value.styleTags, ["warm-modern"]); // junk dropped
  assert.deepEqual(r.value.colors, ["beige"]);
  assert.equal(r.value.status, "active");
});

test("product: negative / huge / NaN prices are rejected", () => {
  for (const basePrice of [-5, 0, Number.NaN, 5_000_000, "abc"]) {
    const r = validateProductInput({ ...goodProduct(), basePrice });
    assert.equal(r.ok, false, `price ${basePrice} should be invalid`);
  }
});

test("product: negative / zero / missing dimensions are rejected", () => {
  const neg = validateProductInput({ ...goodProduct(), dimensions: { widthCm: -1, depthCm: 90, heightCm: 80 } });
  assert.equal(neg.ok, false);
  const zero = validateProductInput({ ...goodProduct(), dimensions: { widthCm: 0, depthCm: 90, heightCm: 80 } });
  assert.equal(zero.ok, false);
  const huge = validateProductInput({ ...goodProduct(), dimensions: { widthCm: 99999, depthCm: 90, heightCm: 80 } });
  assert.equal(huge.ok, false);
});

test("product: unknown category is rejected; missing names rejected", () => {
  assert.equal(validateProductInput({ ...goodProduct(), category: "spaceships" }).ok, false);
  assert.equal(validateProductInput({ ...goodProduct(), name: "" }).ok, false);
  assert.equal(validateProductInput({ ...goodProduct(), nameAr: "" }).ok, false);
});

test("product: status defaults to draft (not public) when unspecified", () => {
  const r = validateProductInput({ ...goodProduct(), status: undefined });
  assert.ok(r.ok);
  assert.equal(r.value.status, "draft");
  assert.equal(isPubliclyVisibleProduct(r.value.status), false); // draft is never public
  assert.equal(isPubliclyVisibleProduct("active"), true);
});

test("price: configured price is deterministic 3-decimal OMR (business logic, not AI)", () => {
  assert.equal(computeConfiguredPrice(100, [20, 15.5]), 135.5);
  assert.equal(computeConfiguredPrice(100.001, [0.002]), 100.003);
});

// ── Supplier application ──────────────────────────────────────────────────────

test("application: valid passes; bad email / missing name fail", () => {
  const ok = validateSupplierApplication({
    businessName: "Muscat Furnishings", type: "showroom", location: "Muscat", contactEmail: "hi@example.com",
  });
  assert.ok(ok.ok);
  assert.equal(validateSupplierApplication({ businessName: "X", type: "showroom", location: "Muscat", contactEmail: "not-an-email" }).ok, false);
  assert.equal(validateSupplierApplication({ businessName: "", type: "showroom", location: "Muscat", contactEmail: "a@b.co" }).ok, false);
  assert.equal(validateSupplierApplication({ businessName: "X", type: "spaceship", location: "Muscat", contactEmail: "a@b.co" }).ok, false);
});

test("email: shape check", () => {
  assert.equal(isEmail("a@b.co"), true);
  assert.equal(isEmail("no-at"), false);
  assert.equal(isEmail("a@b"), false);
});

// ── Slugs (§32) ───────────────────────────────────────────────────────────────

test("slug: URL-safe, unique, and safe for Arabic-only names", () => {
  assert.equal(slugify("Luna Modular Sofa!"), "luna-modular-sofa");
  const existing = new Set(["luna-modular-sofa"]);
  assert.equal(uniqueSlug("Luna Modular Sofa", existing), "luna-modular-sofa-2");
  // Arabic-only name → deterministic non-empty stub (never collides blindly).
  const s = uniqueSlug("كنبة لونا", new Set(), "sofas");
  assert.ok(s.length > 0);
  assert.match(s, /^[a-z0-9-]+$/);
  // Same Arabic input → same stub (stable machine id).
  assert.equal(uniqueSlug("كنبة لونا", new Set(), "sofas"), s);
});
