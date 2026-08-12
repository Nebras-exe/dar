/**
 * Deterministic intent detection + slot extraction (EN + AR).
 *
 * Powers the Demo engine and acts as a safe fallback when the model is
 * unavailable or returns an unusable plan. Pure keyword/number matching over the
 * REAL catalog taxonomy — it never fabricates values.
 */

import {
  categories,
  styleTags,
  colorIds,
  materialIds,
  colorSwatches,
  styleLabels,
  materialLabels,
  type CategorySlug,
  type ColorId,
  type MaterialId,
  type StyleTag,
} from "@/lib/catalog";
import type { ChatIntent } from "./types";

export interface ExtractedSlots {
  category?: CategorySlug;
  style?: StyleTag;
  color?: ColorId;
  material?: MaterialId;
  budget?: number;
}

function norm(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[ً-ٰٟ]/g, "");
}

/** Arabic + English keyword sets per intent. First match wins (ordered). */
const INTENT_KEYWORDS: [ChatIntent, string[]][] = [
  ["design_handoff", ["design my", "design a room", "design the", "redesign", "صمم", "غرفتي", "أصمم", "الصالة", "المجلس"]],
  ["custom_rfq", ["custom", "made to order", "bespoke", "rfq", "quote", "تفصيل", "مخصص", "حسب الطلب", "عرض سعر"]],
  ["order_status", ["my order", "track", "where is my", "order status", "طلبي", "أين طلبي", "تتبع", "حالة الطلب"]],
  ["manufacturing_status", ["manufacturing", "being made", "in production", "quality", "تصنيع", "الجودة", "قيد التصنيع"]],
  ["delivery_status", ["delivery", "deliver", "arrive", "shipping", "install", "توصيل", "التسليم", "يصل", "تركيب"]],
  ["compare_products", ["compare", "difference between", "vs", "which is better", "قارن", "الفرق", "أيهما أفضل"]],
  ["find_variants", ["colour", "color", "colours", "colors", "variant", "finish", "ألوان", "لون", "خيارات", "تشطيب"]],
  ["explain_customization", ["customise", "customize", "customisation", "options", "تخصيص", "خيارات التخصيص"]],
  ["budget_recommend", ["budget", "under", "less than", "cheap", "afford", "ميزانية", "أقل من", "تحت", "رخيص"]],
  ["choose_style", ["style", "modern", "japandi", "boho", "minimal", "classic", "أسلوب", "ستايل", "طراز"]],
  ["cart_help", ["cart", "basket", "checkout", "السلة", "العربة", "الدفع"]],
  ["find_furniture", ["find", "show me", "looking for", "need a", "want a", "أبحث", "أريد", "أحتاج", "اعرض"]],
  ["choose_color", ["what colour", "which color", "أي لون"]],
  ["greeting", ["hi", "hello", "hey", "salam", "مرحبا", "السلام", "أهلا", "هاي"]],
  ["help", ["help", "what can you", "how do", "مساعدة", "ماذا يمكنك", "كيف"]],
];

/** Category keywords (EN + a few AR) → catalog slug. */
const CATEGORY_HINTS: [CategorySlug, string[]][] = [
  ["sofas", ["sofa", "couch", "sectional", "settee", "كنب", "كنبة", "أريكة"]],
  ["chairs", ["chair", "armchair", "stool", "seat", "كرسي", "كراسي"]],
  ["coffee-tables", ["coffee table", "طاولة قهوة", "طاولة وسط"]],
  ["side-tables", ["side table", "nightstand", "bedside", "طاولة جانبية", "كومودينو"]],
  ["dining", ["dining table", "dining", "طاولة طعام", "سفرة"]],
  ["beds", ["bed", "mattress", "سرير"]],
  ["wardrobes", ["wardrobe", "closet", "خزانة ملابس", "دولاب"]],
  ["storage", ["storage", "shelf", "shelving", "sideboard", "cabinet", "تخزين", "رفوف", "بوفيه"]],
  ["tv-units", ["tv unit", "tv console", "media", "طاولة تلفاز", "وحدة تلفزيون"]],
  ["desks", ["desk", "office table", "مكتب", "طاولة مكتب"]],
  ["rugs", ["rug", "carpet", "سجادة", "سجاد"]],
  ["lighting", ["lamp", "light", "pendant", "chandelier", "إضاءة", "مصباح", "ثريا"]],
  ["mirrors", ["mirror", "مرآة"]],
  ["decor", ["decor", "vase", "cushion", "art", "ديكور", "مزهرية", "وسادة"]],
  ["outdoor", ["outdoor", "garden", "patio", "خارجي", "حديقة"]],
];

const CATEGORY_SET = new Set(categories.map((c) => c.slug));

/**
 * Colour SYNONYMS (AR + EN) → catalog `ColorId`, for terms the taxonomy label
 * doesn't already cover. Only maps to colours that exist in the catalog taxonomy
 * — never invents a colour. Checked before the label match so a synonym wins.
 */
const COLOR_SYNONYMS: [ColorId, string[]][] = [
  ["cream", ["سكري", "off white", "off-white", "eggshell"]],
  ["ivory", ["عاجي", "عاج", "bone"]],
  ["olive", ["زيتي", "زيتوني فاتح", "olive green"]],
  ["sage", ["ميرمية", "مريمي فاتح"]],
  ["taupe", ["بني رمادي", "بيج غامق", "tan", "greige"]],
  ["charcoal", ["فحمي", "رمادي غامق", "gunmetal"]],
  ["grey", ["رصاصي", "سكني", "gray"]],
  ["terracotta", ["طوبي", "طيني", "clay"]],
  ["walnut", ["جوزي", "بني غامق", "chocolate"]],
  ["brass", ["ذهبي", "نحاسي فاتح", "gold", "golden"]],
  ["navy", ["كحلي", "أزرق غامق", "navy blue"]],
  ["beige", ["بيچ", "بيچي"]],
];

/** Map a message to a catalog colour via synonyms first, else the taxonomy label. */
export function detectColor(normalizedMessage: string): ColorId | undefined {
  for (const [id, syns] of COLOR_SYNONYMS) {
    if (syns.some((s) => normalizedMessage.includes(norm(s)))) return id;
  }
  for (const c of colorIds) {
    if (
      normalizedMessage.includes(c) ||
      normalizedMessage.includes(norm(colorSwatches[c].label.en)) ||
      normalizedMessage.includes(norm(colorSwatches[c].label.ar))
    ) {
      return c as ColorId;
    }
  }
  return undefined;
}

export function detectIntent(message: string): ChatIntent {
  const m = norm(message);
  for (const [intent, keys] of INTENT_KEYWORDS) {
    if (keys.some((k) => m.includes(norm(k)))) return intent;
  }
  return "unknown";
}

export function extractSlots(message: string): ExtractedSlots {
  const m = norm(message);
  const slots: ExtractedSlots = {};

  // Category
  for (const [cat, keys] of CATEGORY_HINTS) {
    if (keys.some((k) => m.includes(norm(k)))) { slots.category = cat; break; }
  }
  // Direct category slug mention.
  if (!slots.category) {
    for (const c of categories) if (m.includes(c.slug.replace("-", " "))) { slots.category = c.slug as CategorySlug; break; }
  }

  // Style — match a taxonomy tag or its localized label.
  for (const s of styleTags) {
    if (m.includes(s.replace("-", " ")) || m.includes(norm(styleLabels[s].en)) || m.includes(norm(styleLabels[s].ar))) {
      slots.style = s as StyleTag; break;
    }
  }
  // Colour — synonyms (سكري/زيتي/…) first, then the taxonomy label.
  const color = detectColor(m);
  if (color) slots.color = color;
  // Material
  for (const mt of materialIds) {
    if (m.includes(mt) || m.includes(norm(materialLabels[mt].en)) || m.includes(norm(materialLabels[mt].ar))) {
      slots.material = mt as MaterialId; break;
    }
  }
  // Budget — first standalone number (supports Arabic-Indic digits).
  const western = message.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
  const num = western.match(/(\d{2,6})/);
  if (num) {
    const val = Number(num[1]);
    if (Number.isFinite(val) && val >= 10 && val <= 100_000) slots.budget = val;
  }

  return slots;
}

export function isCategory(v: string): v is CategorySlug {
  return CATEGORY_SET.has(v as CategorySlug);
}
