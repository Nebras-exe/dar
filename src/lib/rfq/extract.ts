/**
 * Deterministic demo spec extraction (Phase 09, §8/§9). Parses explicit, stated
 * facts out of the user's own words into PROPOSED structured fields — the user
 * always reviews/corrects before an RFQ. It is honest: it extracts only values
 * the user actually stated (e.g. "240 cm" → widthCm 240). It NEVER infers a
 * measurement from a reference image, and never fabricates a value.
 *
 * Reuses the Phase 05 colour/material synonym mappers so extraction and vision
 * share one taxonomy. Pure + client-safe. When a real Agent/Vision provider is
 * configured, the Agent can propose the same structured shape server-side; the
 * review step is identical either way.
 */

import { mapColor, mapMaterial } from "@/lib/vision";
import { isStyleTag } from "@/lib/catalog";
import { SHAPE_OPTIONS } from "./spec-fields";
import type { CustomFurnitureSpec } from "./types";

/** A proposed partial spec: only fields the user explicitly stated. */
export type ExtractedSpec = Partial<
  Pick<
    CustomFurnitureSpec,
    "style" | "color" | "material" | "widthCm" | "depthCm" | "heightCm" | "shape" | "seatCount" | "budget" | "firmness"
  >
>;

/** Convert Arabic-Indic digits to ASCII so "٢٤٠" parses like "240". */
function toAscii(s: string): string {
  return s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

const STYLE_WORDS: Record<string, string> = {
  modern: "modern",
  "warm modern": "warm-modern",
  japandi: "japandi",
  minimal: "minimal",
  minimalist: "minimal",
  contemporary: "contemporary",
  classic: "classic-modern",
  boho: "boho",
  scandinavian: "scandinavian",
  "mid-century": "mid-century",
  industrial: "industrial",
  // Arabic
  مودرن: "modern",
  عصري: "contemporary",
  كلاسيكي: "classic-modern",
  بسيط: "minimal",
};

/** Extract proposed fields from free text. Deterministic; same input → same output. */
export function extractSpecFromText(rawText: string): ExtractedSpec {
  const text = toAscii(rawText.toLowerCase());
  const out: ExtractedSpec = {};

  // Dimensions: "width 240", "240 cm wide", "عرض ٢٤٠", "طول 180", "height 90".
  // Explicitly labelled dimensions win; a lone "240 cm" maps to width.
  const dimByLabel: [RegExp, "widthCm" | "depthCm" | "heightCm"][] = [
    [/(?:width|wide|عرض)\D{0,6}(\d{2,3})/, "widthCm"],
    [/(?:depth|deep|عمق)\D{0,6}(\d{2,3})/, "depthCm"],
    [/(?:height|tall|high|ارتفاع|طول)\D{0,6}(\d{2,3})/, "heightCm"],
  ];
  for (const [re, key] of dimByLabel) {
    const m = text.match(re);
    if (m) {
      const n = Number(m[1]);
      if (n >= 1 && n <= 1000) out[key] = n;
    }
  }
  if (out.widthCm === undefined) {
    const generic = text.match(/(\d{2,3})\s*(?:cm|سم)\b/);
    if (generic) {
      const n = Number(generic[1]);
      if (n >= 1 && n <= 1000) out.widthCm = n;
    }
  }

  // Seat count: "4 seats", "٤ مقاعد", "seats 3".
  const seats = text.match(/(\d{1,2})\s*(?:seat|seats|مقعد|مقاعد)|(?:seat|seats|مقاعد)\D{0,3}(\d{1,2})/);
  if (seats) {
    const n = Number(seats[1] ?? seats[2]);
    if (n >= 1 && n <= 20) out.seatCount = n;
  }

  // Budget: "budget 120", "OMR 120", "ميزانية ١٢٠", "ر.ع 120".
  const budget = text.match(/(?:budget|omr|ر\.?ع|ميزانية|بميزانية)\D{0,6}(\d{1,7}(?:\.\d{1,3})?)/);
  if (budget) {
    const n = Number(budget[1]);
    if (n > 0 && n <= 1_000_000) out.budget = n;
  }

  // Shape.
  for (const shape of SHAPE_OPTIONS) {
    const word = shape.replace("-", " ");
    if (text.includes(shape) || text.includes(word)) {
      out.shape = shape;
      break;
    }
  }
  if (!out.shape && (text.includes("l shaped") || text.includes("l-shape") || text.includes("زاوية") || text.includes("حرف l"))) {
    out.shape = "l-shaped";
  }

  // Firmness.
  if (/\bfirm\b|قاسي|صلب/.test(text)) out.firmness = "firm";
  else if (/\bsoft\b|ناعم|طري/.test(text)) out.firmness = "soft";
  else if (/\bmedium\b|متوسط/.test(text)) out.firmness = "medium";

  // Style (longest match first).
  for (const key of Object.keys(STYLE_WORDS).sort((a, b) => b.length - a.length)) {
    if (text.includes(key)) {
      const tag = STYLE_WORDS[key];
      if (isStyleTag(tag)) out.style = tag as ExtractedSpec["style"];
      break;
    }
  }

  // Colour + material via the shared Phase 05 mappers (token-wise).
  for (const tok of text.split(/[\s,./]+/)) {
    if (!out.color) {
      const c = mapColor(tok);
      if (c) out.color = c;
    }
    if (!out.material) {
      const m = mapMaterial(tok);
      if (m) out.material = m;
    }
  }
  // Arabic colour/material words the English mappers miss.
  const arColor: Record<string, ExtractedSpec["color"]> = { أخضر: "green", أزرق: "navy", رمادي: "grey", بيج: "beige", جوزي: "walnut", كحلي: "navy", زيتوني: "olive" };
  const arMat: Record<string, ExtractedSpec["material"]> = { مخمل: "velvet", كتان: "linen", جلد: "leather", خشب: "oak", صوف: "wool", معدن: "metal", رخام: "marble" };
  if (!out.color) for (const [w, c] of Object.entries(arColor)) if (rawText.includes(w)) { out.color = c; break; }
  if (!out.material) for (const [w, m] of Object.entries(arMat)) if (rawText.includes(w)) { out.material = m; break; }

  return out;
}
