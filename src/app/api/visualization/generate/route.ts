import type { NextRequest } from "next/server";
import {
  generateVisualization,
  visualizationMode,
  isVisualizationConfigured,
  visualizationProviderInfo,
} from "@/lib/visualization/service";
import { parseVisualizationRequest } from "@/lib/visualization/schema";
import type { VisualizationErrorCode } from "@/lib/visualization/types";

/**
 * POST /api/visualization/generate — server-side before/after visualization.
 *
 * Two modes, one endpoint:
 *  - DEMO (application/json): the deterministic composition. The room photo
 *    NEVER leaves the browser — only the STRUCTURED, catalog-validated request is
 *    sent. Returns a `demo-composition` the client renders over the local photo.
 *  - LIVE (multipart/form-data): a real image provider (none configured here).
 *    Requires the room image + explicit consent; the image is validated (MIME
 *    allow-list, size cap, magic-byte sniff) and processed transiently.
 *
 * Security posture: provider keys + the system prompt live only in the service /
 * providers / prompt (never sent to the client). The client sends STRUCTURED data
 * only — never prose, never a tool/provider name. Fake catalog slugs are dropped
 * (catalog truth). Errors return stable CODES, never raw provider errors. `GET`
 * reports capability (booleans/enum only).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_JSON_BYTES = 32 * 1024; // structured request only — small
const MAX_IMAGE_BYTES = 12 * 1024 * 1024; // 12 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function fail(code: VisualizationErrorCode, status = 200): Response {
  return json({ ok: false, code }, status);
}

/** Confirm the bytes actually look like the claimed image type (defense in depth). */
function sniffMime(bytes: Uint8Array): string | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "image/png";
  }
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

export async function GET(): Promise<Response> {
  // Capability only — the provider name + model id are safe (non-secret); the
  // credential is never read here or returned.
  const info = visualizationProviderInfo();
  return json({
    configured: isVisualizationConfigured(),
    mode: visualizationMode(),
    provider: info.provider,
    model: info.model,
  });
}

export async function POST(request: NextRequest): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";

  // ── LIVE path: multipart with the room image (real provider) ────────────────
  if (contentType.includes("multipart/form-data")) {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return fail("invalid-request", 400);
    }

    const rawRequest = form.get("request");
    if (typeof rawRequest !== "string") return fail("invalid-request", 400);
    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(rawRequest);
    } catch {
      return fail("invalid-request", 400);
    }
    const parsed = parseVisualizationRequest(parsedBody);
    if (!parsed.ok) return fail("invalid-request", 400);

    const consent = form.get("consent") === "true";
    const file = form.get("image");
    if (!(file instanceof File) || file.size === 0) return fail("no-image", 400);
    if (file.size > MAX_IMAGE_BYTES) return fail("invalid-image", 413);
    if (!ALLOWED.has(file.type)) return fail("invalid-image", 415);

    const bytes = new Uint8Array(await file.arrayBuffer());
    const sniffed = sniffMime(bytes);
    if (!sniffed || sniffed !== file.type) return fail("invalid-image", 415);

    const result = await generateVisualization(parsed.request, {
      mode: "auto",
      image: { bytes, mimeType: sniffed },
      consent,
    });
    return json(result);
  }

  // ── DEMO path: JSON structured request; the photo stays in the browser ──────
  const bodyText = await request.text();
  if (bodyText.length > MAX_JSON_BYTES) return fail("invalid-request", 413);

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(bodyText);
  } catch {
    return fail("invalid-request", 400);
  }

  const parsed = parseVisualizationRequest(parsedBody);
  if (!parsed.ok) return fail("invalid-request", 400);

  // Force demo mode on the JSON path — a real provider needs the image, which is
  // only ever sent over the multipart/consent path above.
  const result = await generateVisualization(parsed.request, { mode: "demo" });
  return json(result);
}
