/**
 * Visualization request validator — the trust boundary (Phase 07, §16/§25).
 *
 * The client sends a STRUCTURED request (never free prose). This dependency-free
 * validator re-checks every value against the Phase 03 catalog + Phase 04
 * taxonomy on the server:
 *  - product slugs are valid ONLY if they resolve to a real catalog product;
 *    fakes are dropped (never echoed);
 *  - the product's category/colour are taken from the CATALOG, not the client —
 *    a client can't relabel a product or invent a colour variant;
 *  - room/style/palette values outside the taxonomy are dropped;
 *  - list lengths are capped.
 *
 * It then recomputes the design fingerprint from the RESOLVED data, so the
 * fingerprint on the result is authoritative rather than client-asserted.
 *
 * Pure + client-safe (uses only the catalog query layer), so the client can
 * defensively re-validate too.
 */

import {
  getProductBySlug,
  isCategorySlug,
  isColorId,
  isStyleTag,
  type CategorySlug,
  type ColorId,
} from "@/lib/catalog";
import type { DesignRoomType } from "@/lib/design";
import { designFingerprint } from "./fingerprint";
import type {
  RoomSpace,
  VisualizationItemRef,
  VisualizationRequest,
} from "./types";

/** The room types the wizard supports (superset of the catalog rooms). */
export const DESIGN_ROOM_TYPES: readonly DesignRoomType[] = [
  "living-room",
  "bedroom",
  "majlis",
  "dining-room",
  "office",
  "kids-room",
  "outdoor",
] as const;

export function isDesignRoomType(v: unknown): v is DesignRoomType {
  return typeof v === "string" && (DESIGN_ROOM_TYPES as readonly string[]).includes(v);
}

const MAX_ITEMS = 24;
const MAX_CATEGORIES = 30;
const MAX_PALETTE = 8;

/**
 * Plausible room bounds in metres. A value outside these is a typo or an
 * attempt to skew the projection, so it is dropped rather than clamped — the
 * preview then falls back to a clearly-labelled assumed room size.
 */
export const MIN_ROOM_M = 1.2;
export const MAX_ROOM_M = 30;
export const MIN_CEILING_M = 1.8;
export const MAX_CEILING_M = 8;

export interface ParseOk {
  ok: true;
  request: VisualizationRequest;
}
export interface ParseErr {
  ok: false;
  code: "invalid-request";
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

/**
 * Resolve a client-sent item to a REAL catalog product. Returns null when the
 * slug doesn't resolve (fake / stale) — the caller drops it. The category always
 * comes from the catalog; the colour is kept only if it's a verified variant of
 * that exact product.
 */
export function resolveItem(raw: unknown): VisualizationItemRef | null {
  if (!raw || typeof raw !== "object") return null;
  const slug = (raw as { slug?: unknown }).slug;
  if (typeof slug !== "string") return null;
  const product = getProductBySlug(slug);
  if (!product) return null; // catalog truth: fakes are dropped

  const rawColor = (raw as { colorId?: unknown }).colorId;
  let colorId: ColorId | undefined;
  if (typeof rawColor === "string" && isColorId(rawColor)) {
    // Only accept a colour that is an actual verified variant of THIS product.
    if (product.colors.some((c) => c.id === rawColor)) {
      colorId = rawColor;
    }
  }

  return { slug: product.slug, category: product.category, colorId };
}

/**
 * Resolve the client-sent room size. Returns undefined for anything missing,
 * non-numeric or out of plausible bounds — the layout planner then uses a
 * labelled default instead of trusting a bad number.
 */
export function resolveRoomSpaceInput(raw: unknown): RoomSpace | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const body = raw as Record<string, unknown>;

  const inRange = (v: unknown, min: number, max: number): number | undefined =>
    typeof v === "number" && Number.isFinite(v) && v >= min && v <= max ? v : undefined;

  const widthM = inRange(body.widthM, MIN_ROOM_M, MAX_ROOM_M);
  const lengthM = inRange(body.lengthM, MIN_ROOM_M, MAX_ROOM_M);
  if (widthM === undefined || lengthM === undefined) return undefined;

  const heightM = inRange(body.heightM, MIN_CEILING_M, MAX_CEILING_M);
  return heightM === undefined ? { widthM, lengthM } : { widthM, lengthM, heightM };
}

function uniqueCategories(v: unknown): CategorySlug[] {
  const out: CategorySlug[] = [];
  for (const c of asArray(v).slice(0, MAX_CATEGORIES)) {
    if (typeof c === "string" && isCategorySlug(c) && !out.includes(c)) {
      out.push(c);
    }
  }
  return out;
}

/**
 * Validate + normalize a raw request body. Never throws; returns a discriminated
 * result. `invalid-request` only when the request is unusable (bad room/style or
 * no resolvable items).
 */
export function parseVisualizationRequest(raw: unknown): ParseOk | ParseErr {
  if (!raw || typeof raw !== "object") return { ok: false, code: "invalid-request" };
  const body = raw as Record<string, unknown>;

  const locale = body.locale === "ar" ? "ar" : "en";

  if (!isDesignRoomType(body.roomType)) return { ok: false, code: "invalid-request" };
  const roomType = body.roomType;

  if (typeof body.primaryStyle !== "string" || !isStyleTag(body.primaryStyle)) {
    return { ok: false, code: "invalid-request" };
  }
  const primaryStyle = body.primaryStyle;

  const secondaryStyle =
    typeof body.secondaryStyle === "string" &&
    isStyleTag(body.secondaryStyle) &&
    body.secondaryStyle !== primaryStyle
      ? body.secondaryStyle
      : undefined;

  const items: VisualizationItemRef[] = [];
  const seen = new Set<string>();
  for (const rawItem of asArray(body.items).slice(0, MAX_ITEMS)) {
    const resolved = resolveItem(rawItem);
    if (!resolved) continue;
    const key = `${resolved.slug}:${resolved.colorId ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(resolved);
  }
  if (items.length === 0) return { ok: false, code: "invalid-request" };

  const keep = uniqueCategories(body.keep);
  const replace = uniqueCategories(body.replace);

  const paletteColors: ColorId[] = [];
  for (const c of asArray(body.paletteColors).slice(0, MAX_PALETTE)) {
    if (typeof c === "string" && isColorId(c) && !paletteColors.includes(c)) {
      paletteColors.push(c);
    }
  }

  // Authoritative fingerprint from the RESOLVED design (ignore any client value).
  const fingerprint = designFingerprint({
    roomType,
    primaryStyle,
    secondaryStyle,
    items: items.map((i) => ({ slug: i.slug, colorId: i.colorId })),
  });

  const request: VisualizationRequest = {
    locale,
    roomType,
    primaryStyle,
    secondaryStyle,
    items,
    keep,
    replace,
    paletteColors,
    roomSpace: resolveRoomSpaceInput(body.roomSpace),
    designFingerprint: fingerprint,
    options: { preserveArchitecture: true },
  };

  return { ok: true, request };
}
