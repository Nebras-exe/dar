/**
 * Google Gemini image provider (SERVER-ONLY, §2/§5/§6/§7).
 *
 * Produces the REAL "After" render for a room using Google's Gemini image model
 * (default `gemini-3.1-flash-image`) via the Generative Language REST API — no
 * SDK dependency. Claude stays the reasoning/vision/selection provider; Google is
 * responsible ONLY for the final image. The request edits the ORIGINAL uploaded
 * room photo and introduces ONLY the selected Athathi catalog products, whose
 * ACTUAL selected-variant reference photos are sent inline (never "imagine
 * olive"). The returned inline image is parsed into a data URL for the service.
 *
 * SECRET RULES:
 * - `GOOGLE_AI_API_KEY` is read here only, sent solely as the `key` query param to
 *   Google, and never logged, returned, embedded in output, or exposed to the
 *   client. No NEXT_PUBLIC.
 * - When the key is absent `isConfigured()` is false, the service never selects
 *   this provider, and the deterministic Demo path runs — no paid call happens.
 * - A network (paid) call is made ONLY when `generate()` runs at request time with
 *   the key present. It is never called during `npm test` or the build (mocked).
 */

import fs from "node:fs";
import path from "node:path";
import { buildVisualizationPrompt } from "../prompt";
import { buildCatalogReferences, VISUALIZATION_NEGATIVE_CONSTRAINTS } from "../references";
import { toBase64 } from "./codec";
import type { CatalogReference, VisualizationRequest } from "../types";
import type {
  ProviderOutput,
  VisualizationImageInput,
  VisualizationProvider,
} from "./types";

const OFFICIAL_MODEL = "gemini-3.1-flash-image";
/** Max catalog reference images sent inline (bounds payload + cost). */
const MAX_REFERENCES = 6;

/** The documented, single server-side Google key variable (§1). */
export function googleApiKey(): string | undefined {
  return process.env.GOOGLE_AI_API_KEY;
}

/** Resolve the image model, guarding against a non-model placeholder in env. */
export function googleImageModel(): string {
  const raw = process.env.IMAGE_MODEL?.trim();
  return raw && /^[a-z0-9.\-]+$/i.test(raw) ? raw : OFFICIAL_MODEL;
}

interface InlineImage {
  mimeType: string;
  base64: string;
}

function mimeFromPath(p: string): string {
  const ext = p.toLowerCase().split(".").pop();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}

/** Load a catalog reference image (local public path or remote URL) as base64. */
async function loadReferenceImage(ref: CatalogReference, signal: AbortSignal): Promise<InlineImage | null> {
  const src = ref.referenceImage;
  if (!src) return null;
  try {
    if (src.startsWith("/")) {
      const abs = path.join(process.cwd(), "public", src.replace(/^\//, ""));
      const bytes = new Uint8Array(fs.readFileSync(abs));
      return { mimeType: mimeFromPath(src), base64: toBase64(bytes) };
    }
    if (src.startsWith("http")) {
      const res = await fetch(src, { signal });
      if (!res.ok) return null;
      const mimeType = res.headers.get("content-type") || "image/jpeg";
      const bytes = new Uint8Array(await res.arrayBuffer());
      return { mimeType, base64: toBase64(bytes) };
    }
  } catch {
    return null; // a missing reference is skipped, never fatal
  }
  return null;
}

/** The strict editing instruction (§7) prepended to the structured prompt. */
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

/** Extract the first inline image part from a Gemini generateContent response. */
export function extractInlineImage(data: unknown): InlineImage | null {
  const candidates = (data as { candidates?: unknown[] })?.candidates;
  if (!Array.isArray(candidates)) return null;
  for (const c of candidates) {
    const parts = (c as { content?: { parts?: unknown[] } })?.content?.parts;
    if (!Array.isArray(parts)) continue;
    for (const p of parts) {
      const inline =
        (p as { inlineData?: { mimeType?: string; data?: string } }).inlineData ??
        (p as { inline_data?: { mime_type?: string; data?: string } }).inline_data;
      const b64 = (inline as { data?: string })?.data;
      if (typeof b64 === "string" && b64.length > 0) {
        const mimeType =
          (inline as { mimeType?: string })?.mimeType ??
          (inline as { mime_type?: string })?.mime_type ??
          "image/png";
        return { mimeType, base64: b64 };
      }
    }
  }
  return null;
}

export const googleImageProvider: VisualizationProvider = {
  name: "google",
  get model() {
    return googleImageModel();
  },
  isConfigured(): boolean {
    return Boolean(googleApiKey()) && (process.env.IMAGE_PROVIDER?.trim() || "") === "google";
  },

  async generate(
    request: VisualizationRequest,
    image: VisualizationImageInput | null,
    signal: AbortSignal,
  ): Promise<ProviderOutput> {
    const apiKey = googleApiKey();
    if (!apiKey) throw new Error("google: not configured");
    if (!image || image.bytes.length === 0) throw new Error("google: missing room image");

    const model = googleImageModel();
    const references = buildCatalogReferences(request).slice(0, MAX_REFERENCES);
    const roomBase64 = toBase64(image.bytes);

    // Build the multimodal parts: instruction → ORIGINAL room photo → each
    // selected catalog reference image (the authoritative furniture selection).
    const parts: Array<Record<string, unknown>> = [
      { text: editingInstruction(references) + "\n\n" + buildVisualizationPrompt(request) },
      { inline_data: { mime_type: image.mimeType, data: roomBase64 } },
    ];
    for (const ref of references) {
      const img = await loadReferenceImage(ref, signal);
      if (!img) continue;
      parts.push({ text: `Catalog reference — ${ref.nameEn}${ref.colorLabelEn ? ` (${ref.colorLabelEn})` : ""}:` });
      parts.push({ inline_data: { mime_type: img.mimeType, data: img.base64 } });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: "POST",
      signal,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
      }),
    });

    if (!res.ok) {
      // Never surface the raw provider body; the service maps this to a safe code.
      throw new Error(`google: http ${res.status}`);
    }

    const data = await res.json();
    const inline = extractInlineImage(data);
    if (!inline || !inline.base64) {
      // Text-only / no-image response — the service rejects it (never the original).
      throw new Error("google: no image returned");
    }
    // Guard §3/§9: a real edit must differ from the input; reject an echoed input.
    if (inline.base64 === roomBase64) {
      throw new Error("google: returned the original image");
    }

    return { kind: "generated", imageDataUrl: `data:${inline.mimeType};base64,${inline.base64}` };
  },
};
