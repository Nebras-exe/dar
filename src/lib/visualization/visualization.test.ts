/**
 * Visualization layer tests — Node's built-in runner (`npm test`). No external /
 * paid API calls: no real image provider exists; the service runs the
 * deterministic demo composition, and the live path is exercised with an
 * injected mock provider. Fingerprint, request validation and mapping are pure.
 */

import test, { before, after } from "node:test";
import assert from "node:assert/strict";

import { __setCatalogProductsForTests, __resetCatalogProductsForTests } from "../catalog";
import { makeProduct } from "../catalog/test-fixtures";
import { designFingerprint, isPreviewStale, canonicalDesignString } from "./fingerprint";
import { parseVisualizationRequest, resolveItem } from "./schema";
import { buildVisualizationRequest, currentDesignFingerprint } from "./mapping";
import { buildDemoScheme } from "./providers/demo";
import { generateVisualization } from "./service";
import { buildVisualizationPrompt, VISUALIZATION_PROMPT_VERSION } from "./prompt";
import { buildCatalogReferences, buildCatalogReference, VISUALIZATION_NEGATIVE_CONSTRAINTS } from "./references";
import { critique } from "./critic";
import { externalImageProvider } from "./providers/external";
import * as clientBarrel from "./index";
import type { VisualizationProvider } from "./providers/types";
import type { CatalogReference, VisualizationRequest } from "./types";
import type { DesignInput, DesignItem } from "../design";

// The real catalog is empty; inject fixtures (the source of truth for grounding).
const SOFA = "test-viz-sofa"; // colours: cream, beige, sage
const SOFA2 = "test-viz-sofa-2";
const RUG = "test-viz-rug"; // colours: beige, sand, ivory
const SOFA_NAME = "Test Viz Sofa";

before(() => __setCatalogProductsForTests([
  makeProduct({ slug: SOFA, name: SOFA_NAME, category: "sofas", price: 300, colors: ["cream", "beige", "sage"], materials: ["boucle"], styleTags: ["warm-modern", "contemporary"], roomTypes: ["living-room"] }),
  makeProduct({ slug: SOFA2, name: "Test Viz Sofa Two", category: "sofas", price: 280, colors: ["beige", "grey"], materials: ["linen"], styleTags: ["modern"], roomTypes: ["living-room"] }),
  makeProduct({ slug: RUG, name: "Test Viz Rug", category: "rugs", price: 90, colors: ["beige", "sand", "ivory"], materials: ["wool"], styleTags: ["boho", "warm-modern"], roomTypes: ["living-room"] }),
]));
after(() => __resetCatalogProductsForTests());

const INPUT: DesignInput = {
  roomType: "living-room",
  budget: 500,
  primaryStyle: "warm-modern",
  secondaryStyle: "contemporary",
  preferredColors: ["beige", "walnut"],
  preferredMaterials: ["linen"],
  decisions: [
    { category: "sofas", disposition: "keep" },
    { category: "rugs", disposition: "replace" },
  ],
};

const ITEMS: DesignItem[] = [
  { slug: SOFA, category: "sofas", colorId: "beige", reason: { en: "", ar: "" } },
  { slug: RUG, category: "rugs", colorId: "sand", reason: { en: "", ar: "" } },
];

function validRequest(): VisualizationRequest {
  return buildVisualizationRequest(INPUT, ITEMS, "en");
}

// ── Fingerprint (§18) ────────────────────────────────────────────────────────

test("fingerprint: stable — same design → same fingerprint", () => {
  const a = currentDesignFingerprint(INPUT, ITEMS);
  const b = currentDesignFingerprint(INPUT, [...ITEMS]);
  assert.equal(a, b);
  assert.match(a, /^df1_[0-9a-f]{8}$/);
});

test("fingerprint: changes after a product replacement", () => {
  const before = currentDesignFingerprint(INPUT, ITEMS);
  const replaced: DesignItem[] = [
    ITEMS[0],
    { slug: SOFA2, category: "sofas", colorId: "beige", reason: { en: "", ar: "" } },
  ];
  const after = currentDesignFingerprint(INPUT, replaced);
  assert.notEqual(before, after);
});

test("fingerprint: changes after a colour change", () => {
  const before = currentDesignFingerprint(INPUT, ITEMS);
  const recolored: DesignItem[] = [{ ...ITEMS[0], colorId: "cream" }, ITEMS[1]];
  const after = currentDesignFingerprint(INPUT, recolored);
  assert.notEqual(before, after);
});

test("fingerprint: changes with room/style; canonical string is order-sensitive", () => {
  const base = designFingerprint({ roomType: "living-room", primaryStyle: "warm-modern", items: [{ slug: SOFA }] });
  const room = designFingerprint({ roomType: "bedroom", primaryStyle: "warm-modern", items: [{ slug: SOFA }] });
  const style = designFingerprint({ roomType: "living-room", primaryStyle: "japandi", items: [{ slug: SOFA }] });
  assert.notEqual(base, room);
  assert.notEqual(base, style);
  const s1 = canonicalDesignString({ roomType: "living-room", primaryStyle: "modern", items: [{ slug: "a" }, { slug: "b" }] });
  const s2 = canonicalDesignString({ roomType: "living-room", primaryStyle: "modern", items: [{ slug: "b" }, { slug: "a" }] });
  assert.notEqual(s1, s2);
});

test("stale detection: differing fingerprints are stale; null preview is never stale", () => {
  assert.equal(isPreviewStale("df1_aaaaaaaa", "df1_bbbbbbbb"), true);
  assert.equal(isPreviewStale("df1_aaaaaaaa", "df1_aaaaaaaa"), false);
  assert.equal(isPreviewStale("df1_aaaaaaaa", null), false);
  assert.equal(isPreviewStale("df1_aaaaaaaa", undefined), false);
});

// ── Request validation / catalog truth (§16/§25) ──────────────────────────────

test("schema: valid request resolves real products + authoritative fingerprint", () => {
  const parsed = parseVisualizationRequest(validRequest());
  assert.ok(parsed.ok);
  assert.equal(parsed.request.items.length, 2);
  assert.equal(parsed.request.items[0].slug, SOFA);
  assert.equal(parsed.request.items[0].category, "sofas"); // from catalog
  assert.equal(parsed.request.designFingerprint, currentDesignFingerprint(INPUT, ITEMS));
  assert.deepEqual(parsed.request.keep, ["sofas"]);
  assert.deepEqual(parsed.request.replace, ["rugs"]);
});

test("schema: fake slugs are dropped (catalog truth)", () => {
  const req = validRequest();
  const withFake = {
    ...req,
    items: [...req.items, { slug: "HACKED-FAKE-PRODUCT", category: "sofas", colorId: "beige" }],
  };
  const parsed = parseVisualizationRequest(withFake);
  assert.ok(parsed.ok);
  assert.equal(parsed.request.items.length, 2); // fake dropped
  assert.ok(!parsed.request.items.some((i) => i.slug === "HACKED-FAKE-PRODUCT"));
});

test("schema: a colour that isn't a real variant of the product is dropped", () => {
  // 'navy' is not a variant of the sofa (cream/beige/sage) → colour dropped, item kept.
  const item = resolveItem({ slug: SOFA, colorId: "navy" });
  assert.ok(item);
  assert.equal(item!.colorId, undefined);
  // A real variant is kept.
  const ok = resolveItem({ slug: SOFA, colorId: "sage" });
  assert.equal(ok!.colorId, "sage");
  // A non-taxonomy colour string is ignored safely.
  const junk = resolveItem({ slug: SOFA, colorId: "not-a-colour" });
  assert.equal(junk!.colorId, undefined);
});

test("schema: category/type spoofing is ignored — category comes from the catalog", () => {
  const item = resolveItem({ slug: RUG, category: "sofas" });
  assert.equal(item!.category, "rugs"); // real category wins
});

test("schema: bad room/style/empty items are rejected as invalid-request", () => {
  const req = validRequest();
  assert.equal(parseVisualizationRequest({ ...req, roomType: "garage" }).ok, false);
  assert.equal(parseVisualizationRequest({ ...req, primaryStyle: "steampunk" }).ok, false);
  assert.equal(parseVisualizationRequest({ ...req, items: [] }).ok, false);
  assert.equal(parseVisualizationRequest({ ...req, items: [{ slug: "nope" }] }).ok, false);
  assert.equal(parseVisualizationRequest(null).ok, false);
  assert.equal(parseVisualizationRequest("x").ok, false);
});

test("schema: duplicate items are de-duplicated", () => {
  const req = validRequest();
  const dup = { ...req, items: [req.items[0], req.items[0], req.items[1]] };
  const parsed = parseVisualizationRequest(dup);
  assert.ok(parsed.ok);
  assert.equal(parsed.request.items.length, 2);
});

// ── Demo composition (§7) ─────────────────────────────────────────────────────

test("demo scheme: deterministic, real hex palette, restrained wash", () => {
  const req = parseVisualizationRequest(validRequest());
  assert.ok(req.ok);
  const a = buildDemoScheme(req.request);
  const b = buildDemoScheme(req.request);
  assert.deepEqual(a, b); // deterministic
  assert.ok(a.palette.length > 0);
  assert.ok(a.palette.every((h) => /^#[0-9a-fA-F]{6}$/.test(h)));
  assert.ok(a.washStrength >= 0.14 && a.washStrength <= 0.31);
  assert.ok(a.overlayAngle >= 0 && a.overlayAngle < 360);
});

// ── Service (§17) ─────────────────────────────────────────────────────────────

test("service: demo mode → ready demo-composition, real used items, no image needed", async () => {
  const parsed = parseVisualizationRequest(validRequest());
  assert.ok(parsed.ok);
  const result = await generateVisualization(parsed.request, { mode: "demo" });
  assert.ok(result.ok);
  assert.equal(result.mode, "demo");
  assert.equal(result.preview.kind, "demo-composition");
  assert.equal(result.provider, "demo");
  assert.equal(result.promptVersion, VISUALIZATION_PROMPT_VERSION);
  assert.equal(result.designFingerprint, parsed.request.designFingerprint);
  assert.equal(result.usedItems.length, 2);
});

test("service: live mock provider → generated preview when consent + image present", async () => {
  const parsed = parseVisualizationRequest(validRequest());
  assert.ok(parsed.ok);
  const mock: VisualizationProvider = {
    name: "mock",
    model: "mock-1",
    isConfigured: () => true,
    async generate() {
      return { kind: "generated", imageDataUrl: "data:image/png;base64,AAAA" };
    },
  };
  const result = await generateVisualization(parsed.request, {
    mode: "auto",
    providerOverride: mock,
    image: { bytes: new Uint8Array([1, 2, 3]), mimeType: "image/png" },
    consent: true,
  });
  assert.ok(result.ok);
  assert.equal(result.mode, "live");
  assert.equal(result.preview.kind, "generated");
});

test("service: live path requires image and explicit consent", async () => {
  const parsed = parseVisualizationRequest(validRequest());
  assert.ok(parsed.ok);
  const mock: VisualizationProvider = {
    name: "mock",
    model: "mock-1",
    isConfigured: () => true,
    async generate() {
      return { kind: "generated", imageDataUrl: "data:image/png;base64,AAAA" };
    },
  };
  const noImage = await generateVisualization(parsed.request, { providerOverride: mock, consent: true, image: null });
  assert.equal(noImage.ok, false);
  assert.equal((noImage as { code: string }).code, "no-image");

  const noConsent = await generateVisualization(parsed.request, {
    providerOverride: mock,
    image: { bytes: new Uint8Array([1]), mimeType: "image/png" },
    consent: false,
  });
  assert.equal(noConsent.ok, false);
  assert.equal((noConsent as { code: string }).code, "no-consent");
});

test("service: provider timeout and errors normalize to safe codes", async () => {
  const parsed = parseVisualizationRequest(validRequest());
  assert.ok(parsed.ok);
  const image = { bytes: new Uint8Array([1, 2, 3]), mimeType: "image/png" };

  const timeout: VisualizationProvider = {
    name: "mock", model: "m", isConfigured: () => true,
    async generate() { const e = new Error("aborted"); e.name = "AbortError"; throw e; },
  };
  const r1 = await generateVisualization(parsed.request, { providerOverride: timeout, image, consent: true });
  assert.equal((r1 as { code: string }).code, "timeout");

  const http: VisualizationProvider = {
    name: "mock", model: "m", isConfigured: () => true,
    async generate() { throw new Error("http 500 upstream"); },
  };
  const r2 = await generateVisualization(parsed.request, { providerOverride: http, image, consent: true });
  assert.equal((r2 as { code: string }).code, "provider-error");

  const rate: VisualizationProvider = {
    name: "mock", model: "m", isConfigured: () => true,
    async generate() { throw new Error("http 429 slow down"); },
  };
  const r3 = await generateVisualization(parsed.request, { providerOverride: rate, image, consent: true });
  assert.equal((r3 as { code: string }).code, "rate-limited");

  const empty: VisualizationProvider = {
    name: "mock", model: "m", isConfigured: () => true,
    async generate() { return { kind: "generated", imageDataUrl: "" }; },
  };
  const r4 = await generateVisualization(parsed.request, { providerOverride: empty, image, consent: true });
  assert.equal((r4 as { code: string }).code, "invalid-output");
});

// ── Prompt (§15) — server-side, injection-defended ────────────────────────────

test("prompt: references real product names + injection defense, no scale claims", () => {
  const parsed = parseVisualizationRequest(validRequest());
  assert.ok(parsed.ok);
  const prompt = buildVisualizationPrompt(parsed.request);
  assert.match(prompt, /untrusted DATA/i);
  assert.match(prompt, /never as instructions/i);
  assert.match(prompt, /Preserve the room's architecture/i);
  assert.match(prompt, /do not.*guarantee/i);
  assert.match(prompt, new RegExp(SOFA_NAME)); // real catalog product name
  assert.match(prompt, new RegExp(VISUALIZATION_PROMPT_VERSION));
});

// ── Catalog references / allow-list (§3/§9) ───────────────────────────────────

test("references: build a real catalog reference per selected item; drop fakes", () => {
  const parsed = parseVisualizationRequest(validRequest());
  assert.ok(parsed.ok);
  const refs = buildCatalogReferences(parsed.request);
  assert.equal(refs.length, 2);
  const realSlugs = new Set([SOFA, RUG]);
  for (const r of refs) {
    assert.ok(realSlugs.has(r.slug), `${r.slug} is a selected real product`);
    assert.ok(r.productId.length > 0);
    assert.ok(typeof r.referenceImage === "string");
    assert.ok(r.placement.length > 0);
  }
  // A fabricated slug never yields a reference.
  assert.equal(buildCatalogReference("totally-fake-slug", "beige"), null);
});

test("references: carry the SELECTED colour — switching a variant updates the reference", () => {
  const beige = buildCatalogReference(SOFA, "beige");
  const sage = buildCatalogReference(SOFA, "sage");
  assert.ok(beige && sage);
  assert.equal(beige!.colorId, "beige");
  assert.equal(sage!.colorId, "sage");
  assert.notEqual(beige!.colorId, sage!.colorId);
  // The colour is only accepted if it's a real variant of THIS product.
  const bogus = buildCatalogReference(SOFA, "navy"); // not a SOFA colour
  assert.ok(bogus);
  assert.notEqual(bogus!.colorId, "navy");
});

test("negative constraints forbid inventing/altering furniture", () => {
  assert.ok(VISUALIZATION_NEGATIVE_CONSTRAINTS.includes("do_not_invent_extra_furniture"));
  assert.ok(VISUALIZATION_NEGATIVE_CONSTRAINTS.includes("do_not_add_furniture_not_in_references"));
  assert.ok(VISUALIZATION_NEGATIVE_CONSTRAINTS.includes("do_not_change_selected_product_colour"));
});

// ── Visual critic + fidelity (§10/§15) ────────────────────────────────────────

function refWith(image: string): CatalogReference {
  return {
    productId: "p", slug: SOFA, variantId: SOFA + "-beige", nameEn: "n", nameAr: "n",
    category: "sofas", colorId: "beige", referenceImage: image, placement: "x",
  };
}

test("critic: rejects a missing render; approves a produced render with references", () => {
  const parsed = parseVisualizationRequest(validRequest());
  assert.ok(parsed.ok);
  const refs = [refWith("/images/catalog/x/beige.jpg")];

  const missing = critique(parsed.request, refs, { kind: "generated", imageDataUrl: "" }, parsed.request.items);
  assert.equal(missing.verdict, "REJECTED");
  assert.ok(missing.issues.includes("missing_generated_image"));

  const ok = critique(parsed.request, refs, { kind: "generated", imageDataUrl: "data:image/png;base64,AAAA" }, parsed.request.items);
  assert.equal(ok.verdict, "APPROVED");
  assert.equal(ok.fidelity, "HIGH"); // exact local variant reference
});

test("critic: rejects an unauthorized item not on the selected allow-list", () => {
  const parsed = parseVisualizationRequest(validRequest());
  assert.ok(parsed.ok);
  const refs = [refWith("/images/catalog/x/beige.jpg")];
  const used = [...parsed.request.items, { slug: "intruder-sofa", category: "sofas" as const }];
  const c = critique(parsed.request, refs, { kind: "generated", imageDataUrl: "data:img" }, used);
  assert.equal(c.verdict, "REJECTED");
  assert.ok(c.issues.includes("unauthorized_item"));
});

test("critic: LOW fidelity + rejection when a reference image is missing", () => {
  const parsed = parseVisualizationRequest(validRequest());
  assert.ok(parsed.ok);
  const refs = [refWith("")];
  const c = critique(parsed.request, refs, { kind: "generated", imageDataUrl: "data:img" }, parsed.request.items);
  assert.equal(c.fidelity, "LOW");
  assert.equal(c.verdict, "REJECTED");
});

// ── External provider config + provider-missing fallback (§6/§8/§19) ──────────

test("external image provider is NOT configured without env → demo fallback runs", async () => {
  // No IMAGE_API_KEY / IMAGE_PROVIDER in the test env.
  assert.equal(externalImageProvider.isConfigured(), false);
  const parsed = parseVisualizationRequest(validRequest());
  assert.ok(parsed.ok);
  const res = await generateVisualization(parsed.request, {}); // auto → no real provider
  assert.ok(res.ok);
  assert.equal(res.mode, "demo");
  assert.equal(res.preview.kind, "demo-composition");
});

// ── Bounded retry (§11/§18) ───────────────────────────────────────────────────

test("retry: re-renders after an empty output and returns a produced render, bounded", async () => {
  const parsed = parseVisualizationRequest(validRequest());
  assert.ok(parsed.ok);
  let calls = 0;
  const flaky: VisualizationProvider = {
    name: "mock", model: "m", isConfigured: () => true,
    async generate() {
      calls++;
      return calls === 1
        ? { kind: "generated", imageDataUrl: "" }        // empty → does not count as a render, retry
        : { kind: "generated", imageDataUrl: "data:ok" }; // a real render is produced
    },
  };
  const res = await generateVisualization(parsed.request, {
    providerOverride: flaky, image: { bytes: new Uint8Array([1]), mimeType: "image/png" }, consent: true, maxAttempts: 3,
  });
  // A produced render is returned (never the empty one), and retry is bounded.
  assert.ok(res.ok);
  assert.equal(res.preview.kind, "generated");
  assert.ok(calls >= 2, "retried past the empty output");
  assert.ok(calls <= 3, "never exceeds maxAttempts");
  assert.equal(res.attempts, calls);
});

test("retry: is bounded — never exceeds maxAttempts", async () => {
  const parsed = parseVisualizationRequest(validRequest());
  assert.ok(parsed.ok);
  let calls = 0;
  const alwaysEmpty: VisualizationProvider = {
    name: "mock", model: "m", isConfigured: () => true,
    async generate() { calls++; return { kind: "generated", imageDataUrl: "" }; },
  };
  const res = await generateVisualization(parsed.request, {
    providerOverride: alwaysEmpty, image: { bytes: new Uint8Array([1]), mimeType: "image/png" }, consent: true, maxAttempts: 2,
  });
  assert.equal(res.ok, false);
  assert.equal(calls, 2); // no infinite loop
});

// ── Client-safe boundary (§17) ────────────────────────────────────────────────

test("client barrel never exports the server-only service/providers/critic/references", () => {
  const names = Object.keys(clientBarrel);
  for (const forbidden of ["generateVisualization", "buildCatalogReferences", "critique", "externalImageProvider", "buildVisualizationPrompt"]) {
    assert.equal(names.includes(forbidden), false, `${forbidden} must stay server-only`);
  }
});

test("a live result never carries a secret-shaped field", async () => {
  const parsed = parseVisualizationRequest(validRequest());
  assert.ok(parsed.ok);
  const mock: VisualizationProvider = {
    name: "mock", model: "m", isConfigured: () => true,
    async generate() { return { kind: "generated", imageDataUrl: "data:img" }; },
  };
  const res = await generateVisualization(parsed.request, {
    providerOverride: mock, image: { bytes: new Uint8Array([1]), mimeType: "image/png" }, consent: true,
  });
  const serialized = JSON.stringify(res);
  assert.equal(/IMAGE_API_KEY|authorization|x-api-key|sk-ant|bearer /i.test(serialized), false);
});
