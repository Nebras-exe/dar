/**
 * Google Gemini image provider tests. NO paid/network calls: `global.fetch` is
 * stubbed to return a fake Gemini response, and the room + reference images are
 * synthetic. Proves: correct model, key stays server-only, the ORIGINAL room
 * image is sent to the provider, an inline image is parsed into a data URL, a
 * text-only / no-image response is rejected, and an echoed original is rejected
 * (After can never equal Before).
 */

import test, { afterEach } from "node:test";
import assert from "node:assert/strict";

import { __setCatalogProductsForTests, __resetCatalogProductsForTests } from "../catalog";
import { makeProduct } from "../catalog/test-fixtures";
import { parseVisualizationRequest } from "./schema";
import { googleImageProvider, googleImageModel, extractInlineImage } from "./providers/google";
import { generateVisualization, visualizationProviderInfo } from "./service";
import type { VisualizationRequest } from "./types";

const SLUG = "test-g-sofa";
__setCatalogProductsForTests([
  makeProduct({ slug: SLUG, name: "G Sofa", category: "sofas", price: 300, colors: ["beige", "sage"], materials: ["linen"], styleTags: ["modern"], roomTypes: ["living-room"] }),
]);

function req(): VisualizationRequest {
  const parsed = parseVisualizationRequest({
    locale: "en", roomType: "living-room", primaryStyle: "modern",
    items: [{ slug: SLUG, colorId: "beige" }], keep: [], replace: [], paletteColors: [],
    designFingerprint: "x", options: { preserveArchitecture: true },
  });
  if (!parsed.ok) throw new Error("bad request");
  return parsed.request;
}

const ROOM = { bytes: new Uint8Array([1, 2, 3, 4, 5]), mimeType: "image/png" };

const origFetch = global.fetch;
const origEnv = { ...process.env };
afterEach(() => {
  global.fetch = origFetch;
  process.env = { ...origEnv };
});
process.on("exit", () => __resetCatalogProductsForTests());

/** Build a fake Gemini generateContent response with a given base64 image. */
function geminiImageResponse(b64: string) {
  return {
    ok: true,
    status: 200,
    async json() {
      return { candidates: [{ content: { parts: [{ text: "Here is your room." }, { inlineData: { mimeType: "image/png", data: b64 } }] } }] };
    },
    headers: new Map(),
  } as unknown as Response;
}

test("model resolves to the official id, guarding a non-model placeholder", () => {
  process.env.IMAGE_MODEL = "gemini-3.1-flash-image";
  assert.equal(googleImageModel(), "gemini-3.1-flash-image");
  process.env.IMAGE_MODEL = "اسم_placeholder"; // non-ASCII placeholder
  assert.equal(googleImageModel(), "gemini-3.1-flash-image");
  delete process.env.IMAGE_MODEL;
  assert.equal(googleImageModel(), "gemini-3.1-flash-image");
});

test("isConfigured only when the Google key + provider=google are set", () => {
  process.env.IMAGE_PROVIDER = "google";
  delete process.env.GOOGLE_AI_API_KEY;
  assert.equal(googleImageProvider.isConfigured(), false);
  process.env.GOOGLE_AI_API_KEY = "test-key";
  assert.equal(googleImageProvider.isConfigured(), true);
  process.env.IMAGE_PROVIDER = "other";
  assert.equal(googleImageProvider.isConfigured(), false);
});

test("generate sends the ORIGINAL room image and parses the returned inline image", async () => {
  process.env.IMAGE_PROVIDER = "google";
  process.env.GOOGLE_AI_API_KEY = "test-key";
  process.env.IMAGE_MODEL = "gemini-3.1-flash-image";

  const generatedB64 = Buffer.from("A-NEW-GENERATED-IMAGE").toString("base64");
  let sentBody = "";
  let calledUrl = "";
  global.fetch = (async (url: string, init?: RequestInit) => {
    calledUrl = String(url);
    sentBody = String(init?.body ?? "");
    return geminiImageResponse(generatedB64);
  }) as typeof fetch;

  const out = await googleImageProvider.generate(req(), ROOM, new AbortController().signal);
  assert.equal(out.kind, "generated");
  if (out.kind !== "generated") return;
  assert.match(out.imageDataUrl, /^data:image\/png;base64,/);
  assert.ok(out.imageDataUrl.includes(generatedB64), "returns the generated image, not the original");

  // The request targeted the official model and carried the ORIGINAL room image.
  assert.match(calledUrl, /gemini-3\.1-flash-image:generateContent/);
  const roomB64 = Buffer.from(ROOM.bytes).toString("base64");
  assert.ok(sentBody.includes(roomB64), "original room image was sent to the provider");
  // The API key is only ever a query param to Google — never in the body.
  assert.equal(sentBody.includes("test-key"), false);
});

test("a text-only response (no image) is rejected — never the original", async () => {
  process.env.IMAGE_PROVIDER = "google";
  process.env.GOOGLE_AI_API_KEY = "test-key";
  global.fetch = (async () => ({
    ok: true, status: 200, headers: new Map(),
    async json() { return { candidates: [{ content: { parts: [{ text: "I cannot do that." }] } }] }; },
  })) as unknown as typeof fetch;
  await assert.rejects(() => googleImageProvider.generate(req(), ROOM, new AbortController().signal), /no image returned/);
});

test("an echoed original image is rejected (After must differ from Before)", async () => {
  process.env.IMAGE_PROVIDER = "google";
  process.env.GOOGLE_AI_API_KEY = "test-key";
  const roomB64 = Buffer.from(ROOM.bytes).toString("base64");
  global.fetch = (async () => geminiImageResponse(roomB64)) as typeof fetch;
  await assert.rejects(() => googleImageProvider.generate(req(), ROOM, new AbortController().signal), /returned the original/);
});

test("extractInlineImage handles camelCase and snake_case, ignores text", () => {
  assert.equal(extractInlineImage({ candidates: [{ content: { parts: [{ text: "hi" }] } }] }), null);
  const camel = extractInlineImage({ candidates: [{ content: { parts: [{ inlineData: { mimeType: "image/png", data: "AAA" } }] } }] });
  assert.deepEqual(camel, { mimeType: "image/png", base64: "AAA" });
  const snake = extractInlineImage({ candidates: [{ content: { parts: [{ inline_data: { mime_type: "image/webp", data: "BBB" } }] } }] });
  assert.deepEqual(snake, { mimeType: "image/webp", base64: "BBB" });
});

test("service selects the google provider + reports it when configured", () => {
  process.env.IMAGE_PROVIDER = "google";
  process.env.GOOGLE_AI_API_KEY = "test-key";
  process.env.IMAGE_MODEL = "gemini-3.1-flash-image";
  const info = visualizationProviderInfo();
  assert.equal(info.provider, "google");
  assert.equal(info.model, "gemini-3.1-flash-image");
});

test("service live run via google (stubbed) returns a generated AI result, not demo", async () => {
  process.env.IMAGE_PROVIDER = "google";
  process.env.GOOGLE_AI_API_KEY = "test-key";
  process.env.IMAGE_MODEL = "gemini-3.1-flash-image";
  const generatedB64 = Buffer.from("SERVICE-LEVEL-NEW-IMAGE").toString("base64");
  global.fetch = (async () => geminiImageResponse(generatedB64)) as typeof fetch;

  const res = await generateVisualization(req(), { image: ROOM, consent: true });
  assert.ok(res.ok);
  if (!res.ok) return;
  assert.equal(res.mode, "live");
  assert.equal(res.provider, "google");
  assert.equal(res.preview.kind, "generated");
  if (res.preview.kind === "generated") {
    assert.ok(res.preview.imageDataUrl.includes(generatedB64));
  }
  const serialized = JSON.stringify(res);
  assert.equal(/test-key|GOOGLE_AI_API_KEY|x-api-key/i.test(serialized), false);
});
