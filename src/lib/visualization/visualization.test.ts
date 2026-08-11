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
import type { VisualizationProvider } from "./providers/types";
import type { VisualizationRequest } from "./types";
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
