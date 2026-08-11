import type { NextRequest } from "next/server";
import {
  isCategorySlug,
  isColorId,
  isMaterialId,
  isStyleTag,
  getProductBySlug,
} from "@/lib/catalog";
import type {
  CategorySlug,
  ColorId,
  MaterialId,
  StyleTag,
} from "@/lib/catalog";
import type {
  DesignInput,
  DesignItem,
  DesignRoomType,
  FurnitureDecision,
  FurnitureDisposition,
} from "@/lib/design";
import { agentMode, runAgent } from "@/lib/agent/service";
import type { AgentErrorCode, AgentRequest } from "@/lib/agent/types";

/**
 * POST /api/agent — the Athathi Agent (server-side).
 *
 * Security posture: provider keys live only in the service/providers (never sent
 * to the client). The request envelope is validated (message length, payload
 * size, taxonomy-checked design state); the client cannot name tools or mutate
 * hidden state — it sends only a natural-language message + its current design.
 * Errors return stable codes, never raw provider errors. `GET` reports the mode
 * ("provider" | "demo") and whether a live provider is configured — booleans only.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_CHARS = 24_000;
const MAX_MESSAGE_LEN = 1_000;
const MAX_ITEMS = 30;
const MAX_LIST = 30;

const ROOM_TYPES = new Set<DesignRoomType>([
  "living-room",
  "bedroom",
  "majlis",
  "dining-room",
  "office",
  "kids-room",
  "outdoor",
]);
const DISPOSITIONS = new Set<FurnitureDisposition>(["keep", "replace", "unsure"]);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
function fail(code: AgentErrorCode, status = 200): Response {
  return json({ ok: false, code }, status);
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

/** Validate + normalise the request envelope; reject anything malformed/oversized. */
function parseRequest(raw: unknown): AgentRequest | { error: AgentErrorCode } {
  if (!raw || typeof raw !== "object") return { error: "invalid-request" };
  const o = raw as Record<string, unknown>;

  const locale = o.locale === "ar" ? "ar" : "en";
  const message = typeof o.message === "string" ? o.message.trim() : "";
  if (!message) return { error: "invalid-request" };
  if (message.length > MAX_MESSAGE_LEN) return { error: "message-too-long" };

  const state = o.state as Record<string, unknown> | undefined;
  if (!state || typeof state !== "object") return { error: "invalid-request" };

  const inputRaw = state.input as Record<string, unknown> | undefined;
  if (!inputRaw || typeof inputRaw !== "object") return { error: "invalid-request" };

  const roomType = inputRaw.roomType as DesignRoomType;
  if (typeof roomType !== "string" || !ROOM_TYPES.has(roomType)) {
    return { error: "invalid-request" };
  }
  const budget = Number(inputRaw.budget);
  if (!Number.isFinite(budget) || budget <= 0 || budget > 1_000_000) {
    return { error: "invalid-request" };
  }
  const primaryStyle = inputRaw.primaryStyle;
  if (typeof primaryStyle !== "string" || !isStyleTag(primaryStyle)) {
    return { error: "invalid-request" };
  }
  const secondaryStyle =
    typeof inputRaw.secondaryStyle === "string" && isStyleTag(inputRaw.secondaryStyle)
      ? (inputRaw.secondaryStyle as StyleTag)
      : undefined;

  const preferredColors = asArray(inputRaw.preferredColors)
    .filter((x): x is ColorId => typeof x === "string" && isColorId(x))
    .slice(0, MAX_LIST);
  const preferredMaterials = asArray(inputRaw.preferredMaterials)
    .filter((x): x is MaterialId => typeof x === "string" && isMaterialId(x))
    .slice(0, MAX_LIST);

  const decisions: FurnitureDecision[] = asArray(inputRaw.decisions)
    .map((d) => (d ?? {}) as Record<string, unknown>)
    .filter(
      (d) =>
        typeof d.category === "string" &&
        isCategorySlug(d.category) &&
        typeof d.disposition === "string" &&
        DISPOSITIONS.has(d.disposition as FurnitureDisposition),
    )
    .slice(0, MAX_LIST)
    .map((d) => ({
      category: d.category as CategorySlug,
      disposition: d.disposition as FurnitureDisposition,
    }));

  const input: DesignInput = {
    roomType,
    budget,
    primaryStyle: primaryStyle as StyleTag,
    secondaryStyle,
    preferredColors,
    preferredMaterials,
    decisions,
    note: typeof inputRaw.note === "string" ? inputRaw.note.slice(0, 400) : undefined,
  };

  // Items: keep only slugs that resolve to real catalog products (catalog truth).
  const items: DesignItem[] = asArray(state.items)
    .slice(0, MAX_ITEMS)
    .map((r) => (r ?? {}) as Record<string, unknown>)
    .map((r) => {
      const slug = typeof r.slug === "string" ? r.slug : "";
      const p = getProductBySlug(slug);
      if (!p) return null;
      const colorId =
        typeof r.colorId === "string" && isColorId(r.colorId) ? (r.colorId as ColorId) : p.colors[0]?.id;
      return { slug, category: p.category, colorId, reason: { en: "", ar: "" } } as DesignItem;
    })
    .filter((x): x is DesignItem => x !== null);

  return { locale, message, state: { input, items } };
}

export async function GET(): Promise<Response> {
  const mode = agentMode();
  return json({ mode, configured: mode === "provider" });
}

export async function POST(request: NextRequest): Promise<Response> {
  let text: string;
  try {
    text = await request.text();
  } catch {
    return fail("invalid-request", 400);
  }
  if (text.length > MAX_BODY_CHARS) return fail("state-too-large", 413);

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return fail("invalid-request", 400);
  }

  const parsed = parseRequest(body);
  if ("error" in parsed) return fail(parsed.error, 400);

  const result = await runAgent(parsed);
  return json(result);
}
