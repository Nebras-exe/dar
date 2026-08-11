import type { NextRequest } from "next/server";
import { analyzeRoomImage, isVisionConfigured } from "@/lib/vision/service";
import type { VisionErrorCode } from "@/lib/vision/types";

/**
 * POST /api/vision/analyze — server-side room-image analysis.
 *
 * Security posture:
 * - Runs on the Node runtime; provider API keys are read here and NEVER sent to
 *   the client (not in responses, not in logs).
 * - Validates the uploaded image (presence, MIME allow-list, magic-byte sniff,
 *   size cap, non-empty) before any provider call.
 * - Returns only stable, user-safe error CODES — never raw provider errors.
 * - `GET` reports whether a live provider is configured (a boolean only), so the
 *   UI can message honestly without exposing anything sensitive.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 12 * 1024 * 1024; // 12 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function fail(code: VisionErrorCode, status = 200): Response {
  return json({ ok: false, code }, status);
}

/** Confirm the bytes actually look like the claimed image type (defense in depth). */
function sniffMime(bytes: Uint8Array): string | null {
  if (bytes.length < 12) return null;
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  // WEBP: "RIFF"...."WEBP"
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

export async function GET(): Promise<Response> {
  // Boolean only — never reveals which provider or any credential.
  return json({ configured: isVisionConfigured() });
}

export async function POST(request: NextRequest): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("invalid-image", 400);
  }

  const mode = form.get("mode") === "demo" ? "demo" : "auto";

  // The labelled sample analysis does not read the image, so an upload is not
  // required for demo mode (the result is clearly marked as not from the photo).
  if (mode === "demo") {
    const result = await analyzeRoomImage(
      { bytes: new Uint8Array(0), mimeType: "image/png" },
      { mode: "demo" },
    );
    return json(result);
  }

  const file = form.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return fail("invalid-image", 400);
  }
  if (file.size > MAX_BYTES) {
    return fail("invalid-image", 413);
  }
  if (!ALLOWED.has(file.type)) {
    return fail("invalid-image", 415);
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const sniffed = sniffMime(bytes);
  // The real bytes must match an allowed type and agree with the declared MIME.
  if (!sniffed || sniffed !== file.type) {
    return fail("invalid-image", 415);
  }

  const result = await analyzeRoomImage({ bytes, mimeType: sniffed }, { mode });

  // Always 200 with a discriminated body; the client renders code → friendly text.
  return json(result);
}
