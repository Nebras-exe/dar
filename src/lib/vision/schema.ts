/**
 * The trust boundary for model output.
 *
 * Model output is NEVER trusted directly. `parseRoomAnalysis` takes arbitrary
 * unknown JSON and returns a fully-normalized `RoomAnalysis` or an error — it
 * clamps confidences to [0,1], drops values outside the supported taxonomy,
 * sanitises free-text labels, caps list lengths, and HARD-GUARANTEES that
 * `dimensionsStatus` is always `"unknown"` (no numeric dimensions can ever pass
 * through, even if the model tries to supply them).
 *
 * Dependency-free by design (no zod): consistent with the project's hand-built
 * utilities, and keeps the validator itself auditable.
 */

import {
  colorIds,
  isColorId,
  isMaterialId,
  isStyleTag,
  materialIds,
  styleTags,
} from "@/lib/catalog";
import { getCategories } from "@/lib/catalog";
import type {
  ArchitecturalFeature,
  DetectedColor,
  ExistingFurnitureItem,
  RoomAnalysis,
  StyleEstimate,
} from "./types";
import type {
  CategorySlug,
  ColorId,
  MaterialId,
  StyleTag,
} from "@/lib/catalog";
import type { DesignRoomType, FurnitureDisposition } from "@/lib/design";

export const PROMPT_VERSION = "room-analysis-v1";

const ROOM_TYPES: DesignRoomType[] = [
  "living-room",
  "bedroom",
  "majlis",
  "dining-room",
  "office",
  "kids-room",
  "outdoor",
];

const DISPOSITIONS: FurnitureDisposition[] = ["keep", "replace", "unsure"];

const ARCH_FEATURES: ArchitecturalFeature[] = [
  "window",
  "door",
  "large-opening",
  "wall-mounted-tv",
  "built-in-cabinetry",
  "ceiling-light",
  "major-empty-wall",
  "walkway",
];

const CATEGORY_SET = new Set(getCategories().map((c) => c.slug));

const MAX_PALETTE = 6;
const MAX_FURNITURE = 12;
const MAX_FEATURES = 8;
const MAX_LABEL_LEN = 60;

// ── primitive coercers ────────────────────────────────────────────────────────

function clamp01(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

/** Sanitise a free-text label: string, trimmed, length-capped, control chars & angle brackets removed. */
function cleanLabel(v: unknown): string {
  if (typeof v !== "string") return "";
  let out = "";
  for (const ch of v) {
    const code = ch.codePointAt(0)!;
    // Replace C0/C1 control characters and angle brackets with a space.
    out += code < 0x20 || code === 0x7f || ch === "<" || ch === ">" ? " " : ch;
  }
  return out.replace(/\s+/g, " ").trim().slice(0, MAX_LABEL_LEN);
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function asObject(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}

// ── taxonomy mappers (raw string → catalog machine value | null) ──────────────

/** Common synonyms → catalog colour ids (best-effort; unknowns → null). */
const COLOR_SYNONYMS: Record<string, ColorId> = {
  "warm white": "ivory",
  "warm-white": "ivory",
  offwhite: "ivory",
  "off white": "ivory",
  "off-white": "ivory",
  cream: "cream",
  beige: "beige",
  tan: "beige",
  sand: "sand",
  ivory: "ivory",
  taupe: "taupe",
  greige: "taupe",
  grey: "grey",
  gray: "grey",
  "light grey": "grey",
  "dark grey": "charcoal",
  charcoal: "charcoal",
  black: "black",
  white: "white",
  walnut: "walnut",
  brown: "walnut",
  "dark brown": "walnut",
  wood: "oak",
  oak: "oak",
  "light wood": "oak",
  natural: "oak",
  terracotta: "terracotta",
  rust: "rust",
  clay: "terracotta",
  sage: "sage",
  "sage green": "sage",
  olive: "olive",
  green: "green",
  navy: "navy",
  "navy blue": "navy",
  blue: "blue",
  brass: "brass",
  gold: "brass",
};

export function mapColor(raw: string): ColorId | null {
  const key = raw.toLowerCase().trim();
  if (isColorId(key)) return key;
  if (COLOR_SYNONYMS[key]) return COLOR_SYNONYMS[key];
  // token-wise fallback: first token that resolves
  for (const tok of key.split(/[\s/,-]+/)) {
    if (isColorId(tok)) return tok;
    if (COLOR_SYNONYMS[tok]) return COLOR_SYNONYMS[tok];
  }
  return null;
}

const MATERIAL_SYNONYMS: Record<string, MaterialId> = {
  fabric: "linen",
  upholstery: "linen",
  cloth: "cotton",
  wood: "oak",
  timber: "oak",
  wooden: "oak",
  metal: "metal",
  steel: "steel",
  iron: "metal",
  glass: "glass",
  marble: "marble",
  stone: "stone",
  leather: "leather",
  velvet: "velvet",
  linen: "linen",
  cotton: "cotton",
  wool: "wool",
  rattan: "rattan",
  cane: "rattan",
  boucle: "boucle",
  walnut: "walnut",
  oak: "oak",
  ash: "ash",
  teak: "teak",
  brass: "brass",
  ceramic: "ceramic",
  travertine: "travertine",
};

export function mapMaterial(raw: string): MaterialId | null {
  const key = raw.toLowerCase().trim();
  if (isMaterialId(key)) return key;
  if (MATERIAL_SYNONYMS[key]) return MATERIAL_SYNONYMS[key];
  for (const tok of key.split(/[\s/,-]+/)) {
    if (isMaterialId(tok)) return tok;
    if (MATERIAL_SYNONYMS[tok]) return MATERIAL_SYNONYMS[tok];
  }
  return null;
}

const CATEGORY_SYNONYMS: Record<string, CategorySlug> = {
  sofa: "sofas",
  couch: "sofas",
  sectional: "sofas",
  settee: "sofas",
  chair: "chairs",
  armchair: "chairs",
  "accent chair": "chairs",
  stool: "chairs",
  "coffee table": "coffee-tables",
  "center table": "coffee-tables",
  "centre table": "coffee-tables",
  "side table": "side-tables",
  "end table": "side-tables",
  nightstand: "side-tables",
  "bedside table": "side-tables",
  "dining table": "dining",
  "dining set": "dining",
  bed: "beds",
  headboard: "beds",
  wardrobe: "wardrobes",
  closet: "wardrobes",
  "tv unit": "tv-units",
  "tv console": "tv-units",
  "media unit": "tv-units",
  "tv stand": "tv-units",
  desk: "desks",
  rug: "rugs",
  carpet: "rugs",
  lamp: "lighting",
  light: "lighting",
  lighting: "lighting",
  pendant: "lighting",
  chandelier: "lighting",
  mirror: "mirrors",
  shelf: "storage",
  shelving: "storage",
  bookshelf: "storage",
  sideboard: "storage",
  dresser: "storage",
  cabinet: "storage",
  storage: "storage",
  vase: "decor",
  decor: "decor",
  art: "decor",
  plant: "decor",
  cushion: "decor",
  curtain: "decor",
  curtains: "decor",
};

export function mapCategory(raw: string): CategorySlug | null {
  const key = raw.toLowerCase().trim();
  if (CATEGORY_SET.has(key as CategorySlug)) return key as CategorySlug;
  if (CATEGORY_SYNONYMS[key]) return CATEGORY_SYNONYMS[key];
  // longest-match on contained synonym phrases
  for (const [phrase, cat] of Object.entries(CATEGORY_SYNONYMS)) {
    if (key.includes(phrase)) return cat;
  }
  return null;
}

function mapStyle(v: unknown): StyleTag | null {
  if (typeof v !== "string") return null;
  const key = v.toLowerCase().trim().replace(/\s+/g, "-");
  return isStyleTag(key) ? key : null;
}

// ── field normalizers ─────────────────────────────────────────────────────────

function normRoomType(v: unknown): DesignRoomType | "unknown" {
  if (typeof v !== "string") return "unknown";
  const key = v.toLowerCase().trim().replace(/\s+/g, "-");
  return (ROOM_TYPES as string[]).includes(key)
    ? (key as DesignRoomType)
    : "unknown";
}

function normStyle(v: unknown): StyleEstimate {
  const o = asObject(v);
  const primary = mapStyle(o.primary);
  let secondary = mapStyle(o.secondary);
  if (secondary && secondary === primary) secondary = null;
  return { primary, secondary, confidence: clamp01(o.confidence) };
}

function normPalette(v: unknown): DetectedColor[] {
  return asArray(v)
    .slice(0, MAX_PALETTE)
    .map((item): DetectedColor => {
      const o = asObject(item);
      const raw = cleanLabel(o.raw ?? o.color ?? o.name);
      return {
        raw,
        mappedColorId: raw ? mapColor(raw) : null,
        confidence: clamp01(o.confidence),
      };
    })
    .filter((c) => c.raw.length > 0);
}

function normFurniture(v: unknown): ExistingFurnitureItem[] {
  const seen = new Set<string>();
  return asArray(v)
    .slice(0, MAX_FURNITURE)
    .map((item): ExistingFurnitureItem => {
      const o = asObject(item);
      const rawLabel = cleanLabel(o.category ?? o.rawLabel ?? o.label ?? o.name);
      const category = rawLabel ? mapCategory(rawLabel) : null;
      const color = cleanLabel(o.approximateColor ?? o.color);
      const material = cleanLabel(o.approximateMaterial ?? o.material);
      const suggestionRaw =
        typeof o.suggestion === "string" ? o.suggestion.toLowerCase().trim() : "";
      const suggestion: FurnitureDisposition = (
        DISPOSITIONS as string[]
      ).includes(suggestionRaw)
        ? (suggestionRaw as FurnitureDisposition)
        : "unsure";
      return {
        category,
        rawLabel,
        confidence: clamp01(o.confidence),
        approximateColorId: color ? mapColor(color) : null,
        approximateMaterialId: material ? mapMaterial(material) : null,
        suggestion,
      };
    })
    .filter((f) => {
      if (f.rawLabel.length === 0) return false;
      // de-duplicate by mapped category (keep the first / highest-listed).
      const key = f.category ?? f.rawLabel;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function normFeatures(v: unknown): ArchitecturalFeature[] {
  const out: ArchitecturalFeature[] = [];
  for (const item of asArray(v)) {
    const key =
      typeof item === "string"
        ? item.toLowerCase().trim().replace(/\s+/g, "-")
        : "";
    if ((ARCH_FEATURES as string[]).includes(key) && !out.includes(key as ArchitecturalFeature)) {
      out.push(key as ArchitecturalFeature);
    }
    if (out.length >= MAX_FEATURES) break;
  }
  return out;
}

export interface ParseResult {
  ok: boolean;
  analysis?: RoomAnalysis;
}

/**
 * Parse + normalize arbitrary model output into a safe `RoomAnalysis`.
 * `meta` carries trusted provenance (never from the model).
 */
export function parseRoomAnalysis(
  raw: unknown,
  meta: { source: RoomAnalysis["source"]; provider: string; model?: string },
): ParseResult {
  if (raw === null || typeof raw !== "object") return { ok: false };
  const o = raw as Record<string, unknown>;

  const analysis: RoomAnalysis = {
    roomType: normRoomType(o.roomType ?? o.room ?? o.room_type),
    roomTypeConfidence: clamp01(o.roomTypeConfidence ?? o.confidence),
    style: normStyle(o.style ?? o.styleEstimate),
    palette: normPalette(o.palette ?? o.detectedPalette ?? o.colors),
    existingFurniture: normFurniture(
      o.existingFurniture ?? o.furniture ?? o.detectedFurniture,
    ),
    architecturalFeatures: normFeatures(
      o.architecturalFeatures ?? o.features,
    ),
    // Hard guarantee: scale is never inferred from an ordinary photo.
    dimensionsStatus: "unknown",
    source: meta.source,
    provider: meta.provider,
    promptVersion: PROMPT_VERSION,
    model: meta.model,
  };

  // A result with nothing usable is treated as a validation failure.
  const hasSignal =
    analysis.roomType !== "unknown" ||
    analysis.style.primary !== null ||
    analysis.palette.length > 0 ||
    analysis.existingFurniture.length > 0;
  if (!hasSignal) return { ok: false };

  return { ok: true, analysis };
}

/** Re-exported for tests / callers that want the raw enum lists. */
export const supported = {
  roomTypes: ROOM_TYPES,
  styleTags,
  colorIds,
  materialIds,
  architecturalFeatures: ARCH_FEATURES,
};
