import type { NextRequest } from "next/server";
import { isStyleTag, isColorId, isMaterialId, type StyleTag, type ColorId, type MaterialId } from "@/lib/catalog";
import type { DesignRoomType } from "@/lib/design";
import { runInteriorDesign } from "@/lib/interior-agents/orchestrator";
import { interiorDesignerMode } from "@/lib/interior-agents/provider";
import { IMAGE_LIMITS } from "@/lib/interior-agents/config";
import type { InteriorMemoryContext, InteriorRunInput, RunErrorCode } from "@/lib/interior-agents/types";

/**
 * POST /api/interior-agent/run — the multi-agent interior engine boundary.
 *
 * Runs the full pipeline server-side: Vision → Designer (Claude or Demo) → catalog
 * grounding → budget + layout validation → render spec. All catalog truth, money,
 * and fit are deterministic; the model only plans. The `ANTHROPIC_API_KEY` is read
 * only inside the providers and is NEVER returned, logged, or exposed here — the
 * response carries only a provider MODE enum + model name, never a credential. The
 * uploaded image is validated (MIME allow-list + size + magic-byte sniff) and never
 * logged. Errors return stable safe codes only.
 *
 * NOTE: with no key set, the whole run uses the deterministic Demo path — no
 * external API call is made.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROOM_TYPES = new Set<DesignRoomType>([
  "living-room", "bedroom", "majlis", "dining-room", "office", "kids-room", "outdoor",
]);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}
function fail(code: RunErrorCode, status = 200): Response {
  return json({ ok: false, code }, status);
}

function sniffMime(bytes: Uint8Array): string | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "image/webp";
  return null;
}

/** Capability only — enum + booleans, never a credential. */
export async function GET(): Promise<Response> {
  return json({ designerMode: interiorDesignerMode() });
}

export async function POST(request: NextRequest): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("invalid-input", 400);
  }

  // ── Validate the structured inputs (client truth is never trusted) ─────────
  const roomTypeRaw = String(form.get("roomType") ?? "");
  if (!ROOM_TYPES.has(roomTypeRaw as DesignRoomType)) return fail("invalid-input", 400);
  const roomType = roomTypeRaw as DesignRoomType;

  const budget = Number(form.get("budget"));
  if (!Number.isFinite(budget) || budget <= 0 || budget > 1_000_000) return fail("invalid-input", 400);

  const styleRaw = String(form.get("primaryStyle") ?? "");
  if (!isStyleTag(styleRaw)) return fail("invalid-input", 400);
  const primaryStyle = styleRaw as StyleTag;

  const secRaw = String(form.get("secondaryStyle") ?? "");
  const secondaryStyle = isStyleTag(secRaw) ? (secRaw as StyleTag) : undefined;

  const locale = form.get("locale") === "ar" ? "ar" : "en";
  const instructions = String(form.get("instructions") ?? "").slice(0, 1000) || undefined;

  const widthRaw = Number(form.get("knownWidthCm"));
  const knownWidthCm = Number.isFinite(widthRaw) && widthRaw > 0 && widthRaw < 3000 ? widthRaw : undefined;

  // Approved memory (optional) — parsed defensively, values re-validated below.
  let memory: InteriorMemoryContext | undefined;
  const memRaw = form.get("memory");
  if (typeof memRaw === "string" && memRaw.length > 0 && memRaw.length < 4000) {
    try {
      const m = JSON.parse(memRaw) as Record<string, unknown>;
      memory = {
        preferredStyles: (Array.isArray(m.preferredStyles) ? m.preferredStyles : []).filter((x): x is StyleTag => typeof x === "string" && isStyleTag(x)),
        preferredColors: (Array.isArray(m.preferredColors) ? m.preferredColors : []).filter((x): x is ColorId => typeof x === "string" && isColorId(x)),
        preferredMaterials: (Array.isArray(m.preferredMaterials) ? m.preferredMaterials : []).filter((x): x is MaterialId => typeof x === "string" && isMaterialId(x)),
        ...(m.typicalBudget && typeof m.typicalBudget === "object"
          ? { typicalBudget: { min: Number((m.typicalBudget as Record<string, unknown>).min) || 0, max: Number((m.typicalBudget as Record<string, unknown>).max) || 0 } }
          : {}),
      };
    } catch {
      memory = undefined; // malformed memory is ignored, never fatal
    }
  }

  const input: InteriorRunInput = {
    locale, roomType, budget, primaryStyle,
    ...(secondaryStyle ? { secondaryStyle } : {}),
    ...(instructions ? { instructions } : {}),
    ...(memory ? { memory } : {}),
    ...(knownWidthCm ? { knownWidthCm } : {}),
  };

  // ── Validate the optional room image (never logged) ────────────────────────
  let image: { bytes: Uint8Array; mimeType: string } | undefined;
  const file = form.get("image");
  if (file instanceof File && file.size > 0) {
    if (file.size > IMAGE_LIMITS.maxBytes) return fail("invalid-image", 413);
    if (!(IMAGE_LIMITS.allowedMime as readonly string[]).includes(file.type)) return fail("invalid-image", 415);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const sniffed = sniffMime(bytes);
    if (!sniffed || sniffed !== file.type) return fail("invalid-image", 415);
    image = { bytes, mimeType: file.type };
  }

  // ── Run the engine (never throws; safe codes only) ─────────────────────────
  try {
    const run = await runInteriorDesign(input, image ? { image } : {});
    if (run.status === "failed") return json({ ok: false, code: run.error ?? "unknown" });
    return json({ ok: true, run });
  } catch {
    return fail("unknown");
  }
}
