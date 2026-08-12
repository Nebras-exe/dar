/**
 * OpenAI image provider (SERVER-ONLY).
 *
 * Produces the real "After" render via OpenAI's image EDIT endpoint
 * (`/v1/images/edits`, default model `gpt-image-1`): it edits the ORIGINAL
 * uploaded room photo and introduces ONLY the selected DAR catalog products,
 * whose actual selected-variant reference photos are sent as additional input
 * images (the catalog allow-list). The returned base64 image becomes a data URL.
 *
 * Claude stays the reasoning/vision/selection provider; OpenAI is responsible
 * only for the final image. This is a minimal adapter added because the current
 * credential is an OpenAI key — it reuses the same `VisualizationProvider`
 * contract, `buildCatalogReferences`, prompt and negative constraints as the
 * other providers; nothing else in the visualization system changes.
 *
 * SECRET RULES: the key is read here only (from `OPENAI_API_KEY`, falling back to
 * `GOOGLE_AI_API_KEY` where the operator currently stores it), sent only in the
 * Authorization header, and never logged, returned, or exposed. No NEXT_PUBLIC.
 * A paid network call happens only when `generate()` runs with the key present —
 * never in tests or the build.
 */

import fs from "node:fs";
import path from "node:path";
import { buildVisualizationPrompt } from "../prompt";
import { buildCatalogReferences, VISUALIZATION_NEGATIVE_CONSTRAINTS } from "../references";
import type { CatalogReference, VisualizationRequest } from "../types";
import type {
  ProviderOutput,
  VisualizationImageInput,
  VisualizationProvider,
} from "./types";

const OFFICIAL_MODEL = "gpt-image-1";
/** Max catalog reference images sent (bounds payload + cost). */
const MAX_REFERENCES = 4;
/** Small, low-cost render for the edit. */
const IMAGE_SIZE = "1024x1024";

/** The single documented server-side OpenAI key (fallback to where it's stored today). */
export function openaiApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY || process.env.GOOGLE_AI_API_KEY;
}

/** Resolve the image model, guarding against a non-OpenAI placeholder in env. */
export function openaiImageModel(): string {
  const raw = process.env.IMAGE_MODEL?.trim();
  return raw && /^gpt-image[a-z0-9.\-]*$/i.test(raw) ? raw : OFFICIAL_MODEL;
}

function mimeFromPath(p: string): string {
  const ext = p.toLowerCase().split(".").pop();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}

/** Build a Blob backed by a fresh ArrayBuffer (type-safe across Node/DOM libs). */
function bytesToBlob(bytes: Uint8Array, type: string): Blob {
  const ab = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(ab).set(bytes);
  return new Blob([ab], { type });
}

/** Load a catalog reference image (local public path or remote URL) as a Blob. */
async function loadReferenceBlob(ref: CatalogReference, signal: AbortSignal): Promise<Blob | null> {
  const src = ref.referenceImage;
  if (!src) return null;
  try {
    if (src.startsWith("/")) {
      const abs = path.join(process.cwd(), "public", src.replace(/^\//, ""));
      const bytes = new Uint8Array(fs.readFileSync(abs));
      return bytesToBlob(bytes, mimeFromPath(src));
    }
    if (src.startsWith("http")) {
      const res = await fetch(src, { signal });
      if (!res.ok) return null;
      const buf = new Uint8Array(await res.arrayBuffer());
      return bytesToBlob(buf, res.headers.get("content-type") || "image/jpeg");
    }
  } catch {
    return null; // a missing reference is skipped, never fatal
  }
  return null;
}

/** The strict editing instruction prepended to the structured prompt. */
function editingInstruction(references: CatalogReference[]): string {
  const list = references
    .map((r) => `- ${r.nameEn}${r.colorLabelEn ? ` (${r.colorLabelEn})` : ""} — ${r.placement}`)
    .join("\n");
  return [
    "Edit the provided ORIGINAL room photograph (the first image).",
    "Preserve the exact room architecture, camera angle, walls, windows, doors, flooring, ceiling and perspective.",
    "Add and arrange ONLY the furniture shown in the supplied catalog reference images (the images that follow).",
    "Treat those reference images as the AUTHORITATIVE furniture selection — match their product, colour and general form as closely as possible.",
    "Do not invent additional furniture. Do not replace a referenced product with a different design. Do not change a selected product's colour.",
    "Keep any furniture already visible in the original room; integrate the new pieces naturally with realistic scale, shadows, perspective and lighting.",
    "The goal is a realistic professional interior-design visualization of the SAME room — not a different room.",
    "",
    "Selected catalog pieces and placement:",
    list || "(none)",
    "",
    `Hard constraints: ${VISUALIZATION_NEGATIVE_CONSTRAINTS.join("; ")}.`,
  ].join("\n");
}

/** Extract the first base64 image from an OpenAI images response. */
export function extractOpenAiImage(data: unknown): string | null {
  const arr = (data as { data?: { b64_json?: string }[] })?.data;
  if (!Array.isArray(arr)) return null;
  for (const d of arr) {
    if (typeof d.b64_json === "string" && d.b64_json.length > 0) return d.b64_json;
  }
  return null;
}

export const openaiImageProvider: VisualizationProvider = {
  name: "openai",
  get model() {
    return openaiImageModel();
  },
  isConfigured(): boolean {
    return Boolean(openaiApiKey()) && (process.env.IMAGE_PROVIDER?.trim() || "") === "openai";
  },

  async generate(
    request: VisualizationRequest,
    image: VisualizationImageInput | null,
    signal: AbortSignal,
  ): Promise<ProviderOutput> {
    const apiKey = openaiApiKey();
    if (!apiKey) throw new Error("openai: not configured");
    if (!image || image.bytes.length === 0) throw new Error("openai: missing room image");

    const model = openaiImageModel();
    const references = buildCatalogReferences(request).slice(0, MAX_REFERENCES);

    const form = new FormData();
    form.set("model", model);
    form.set("prompt", editingInstruction(references) + "\n\n" + buildVisualizationPrompt(request));
    form.set("size", IMAGE_SIZE);
    form.set("n", "1");
    form.set("quality", "low"); // keep the render cheap; the demo is a preview

    // The ORIGINAL room photo first (the base to edit), then each catalog
    // reference image (the authoritative furniture selection) as image[].
    const roomBlob = bytesToBlob(image.bytes, image.mimeType);
    form.append("image[]", roomBlob, "room.png");
    for (let i = 0; i < references.length; i++) {
      const blob = await loadReferenceBlob(references[i], signal);
      if (blob) form.append("image[]", blob, `ref-${i}.png`);
    }

    const res = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      signal,
      headers: { authorization: `Bearer ${apiKey}` },
      body: form,
    });

    if (!res.ok) {
      // Never surface the raw provider body; the service maps this to a safe code.
      throw new Error(`openai: http ${res.status}`);
    }

    const data = await res.json();
    const b64 = extractOpenAiImage(data);
    if (!b64) throw new Error("openai: no image returned");
    return { kind: "generated", imageDataUrl: `data:image/png;base64,${b64}` };
  },
};
