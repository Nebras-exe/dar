/**
 * Deterministic natural-language intent parsing (EN + AR) for the Demo Agent.
 *
 * Pure text → structured intent + parameters. No model, no side effects. Arabic
 * and English keywords are supported, plus Arabic-Indic digit parsing for
 * budgets. Category targets resolve to the Phase 03 taxonomy and are
 * disambiguated against the categories actually present in the current design.
 */

import type { CategorySlug, ColorId, MaterialId } from "@/lib/catalog";
import { mapCategory, mapColor, mapMaterial } from "@/lib/vision";
import type { AgentIntent } from "./types";

export interface ParsedIntent {
  intent: AgentIntent;
  category?: CategorySlug;
  targetBudget?: number;
  material?: MaterialId;
  color?: ColorId;
}

/** Convert Arabic-Indic / Extended-Arabic digits to ASCII for number parsing. */
export function toAsciiDigits(s: string): string {
  return s.replace(/[٠-٩۰-۹]/g, (d) => {
    const code = d.charCodeAt(0);
    const base = code >= 0x06f0 ? 0x06f0 : 0x0660;
    return String(code - base);
  });
}

function norm(s: string): string {
  return toAsciiDigits(s).toLowerCase().trim();
}

// Arabic + English category lexicon (longest phrases first for disambiguation).
const CATEGORY_WORDS: { words: string[]; category: CategorySlug }[] = [
  { words: ["coffee table", "طاولة القهوة", "طاولة قهوة"], category: "coffee-tables" },
  { words: ["side table", "bedside", "nightstand", "طاولة جانبية", "كومودينو"], category: "side-tables" },
  { words: ["dining table", "dining", "طاولة الطعام", "طاولة طعام", "سفرة"], category: "dining" },
  { words: ["tv unit", "tv console", "media unit", "tv stand", "تلفزيون", "التلفاز"], category: "tv-units" },
  { words: ["sofa", "couch", "sectional", "كنبة", "الكنبة", "كنب", "أريكة"], category: "sofas" },
  { words: ["armchair", "accent chair", "chair", "كرسي", "الكرسي", "كراسي"], category: "chairs" },
  { words: ["rug", "carpet", "سجادة", "السجادة", "سجاد"], category: "rugs" },
  { words: ["lamp", "lighting", "light", "مصباح", "المصباح", "إضاءة", "الإضاءة", "لمبة"], category: "lighting" },
  { words: ["bed", "سرير", "السرير"], category: "beds" },
  { words: ["wardrobe", "closet", "دولاب", "خزانة ملابس"], category: "wardrobes" },
  { words: ["desk", "مكتب", "المكتب"], category: "desks" },
  { words: ["mirror", "مرآة", "المرآة"], category: "mirrors" },
  { words: ["storage", "shelf", "shelving", "sideboard", "dresser", "cabinet", "رف", "رفوف", "بوفيه", "تخزين"], category: "storage" },
  { words: ["decor", "vase", "cushion", "throw", "art", "ديكور", "مزهرية", "وسادة", "لوحة"], category: "decor" },
  { words: ["outdoor", "خارجي", "الحديقة", "التراس"], category: "outdoor" },
  // Bare "table" resolved last, disambiguated against the design.
  { words: ["table", "طاولة", "الطاولة"], category: "coffee-tables" },
];

/** Resolve a category mentioned in the text, preferring one present in the design. */
export function resolveCategory(
  message: string,
  present: CategorySlug[] = [],
): CategorySlug | undefined {
  const m = norm(message);
  const presentSet = new Set(present);
  const hits: CategorySlug[] = [];
  for (const entry of CATEGORY_WORDS) {
    if (entry.words.some((w) => m.includes(w))) hits.push(entry.category);
  }
  // Prefer a hit that is actually in the current design.
  const inDesign = hits.find((c) => presentSet.has(c));
  if (inDesign) return inDesign;
  // "table" ambiguity: if the design has a dining/side table, prefer it.
  if (hits.includes("coffee-tables")) {
    if (presentSet.has("dining")) return "dining";
    if (presentSet.has("side-tables")) return "side-tables";
  }
  if (hits[0]) return hits[0];
  // Fall back to the vision synonym mapper.
  return mapCategory(message) ?? undefined;
}

/** Extract a target budget from phrases like "under 400", "تحت ٤٠٠", "OMR 500". */
export function parseTargetBudget(message: string): number | undefined {
  const m = norm(message);
  const patterns = [
    /(?:under|below|less than|max(?:imum)?|budget|within|keep it under)\s*(?:omr|ر\.?ع)?\s*([\d]+(?:\.\d+)?)/,
    /(?:تحت|أقل من|بحدود|ميزانية|حد|في حدود)\s*([\d]+(?:\.\d+)?)/,
    /([\d]+(?:\.\d+)?)\s*(?:omr|ر\.?ع|ريال|rial)/,
    /(?:omr|ر\.?ع)\s*([\d]+(?:\.\d+)?)/,
  ];
  for (const re of patterns) {
    const match = m.match(re);
    if (match) {
      const n = Number(match[1]);
      if (Number.isFinite(n) && n > 0) return n;
    }
  }
  return undefined;
}

function has(m: string, ...words: string[]): boolean {
  return words.some((w) => m.includes(w));
}

/** Classify a message into a structured intent + parameters. */
export function parseIntent(message: string, present: CategorySlug[] = []): ParsedIntent {
  const m = norm(message);
  const category = resolveCategory(message, present);
  const targetBudget = parseTargetBudget(message);
  const material = mapMaterial(message) ?? undefined;
  const color = mapColor(message) ?? undefined;

  const wantsCheaper = has(m, "cheaper", "cheap", "save", "reduce", "lower", "budget-friendly", "أرخص", "رخيص", "وفّر", "وفر", "قلل", "خفّض", "خفض");
  const wantsUpgrade = has(m, "upgrade", "premium", "nicer", "better", "high-end", "luxurious", "رقّي", "رقي", "أرقى", "أفضل", "فخم");
  const wantsRemove = has(m, "remove", "delete", "take out", "drop", "get rid", "احذف", "شيل", "أزل", "إزالة", "احذفي", "الغِ", "الغي");
  const wantsKeep = has(m, "keep", "don't change", "dont change", "leave", "احتفظ", "أبقِ", "ابق", "لا تغيّر", "لا تغير", "خل", "خلي");
  const wantsReplace = has(m, "replace", "swap", "change", "switch", "different", "بدّل", "بدل", "غيّر", "غير", "استبدل");
  const wantsCart = has(m, "add to cart", "add the design", "buy", "checkout", "purchase", "order this", "add this design", "cart", "أضف", "السلة", "للسلة", "اشتر", "اشتري", "اطلب");
  const wantsExplain = has(m, "what would you", "explain", "why", "suggest", "recommend", "what should", "ماذا", "لماذا", "وش", "اشرح", "اقترح", "ايش");
  const wantsDesign = has(m, "design this", "design my", "build my", "furnish", "make my", "create a design", "صمّم", "صمم", "أثّث", "اثث", "جهّز");

  // Priority order matters.
  if (wantsCart) return { intent: "prepare_cart" };
  if (wantsKeep && category) return { intent: "keep_item", category };
  if (wantsRemove && category) return { intent: "remove_item", category };

  // "change the table to walnut" / "use more walnut" → material/colour change.
  if ((wantsReplace || has(m, "use", "make it", "make the", "استخدم", "اجعل")) && (material || color) && category) {
    return material
      ? { intent: "change_material", category, material }
      : { intent: "change_color", category, color };
  }

  if (targetBudget !== undefined) return { intent: "set_budget", targetBudget };
  if (wantsCheaper && category) return { intent: "find_cheaper", category };
  if (wantsCheaper) return { intent: "make_cheaper" };
  if (wantsUpgrade && category) return { intent: "upgrade_item", category };
  if (wantsReplace && category) return { intent: "replace_item", category };
  if (wantsExplain) return { intent: "explain" };
  if (wantsDesign) return { intent: "design_room" };

  return { intent: "unknown" };
}
