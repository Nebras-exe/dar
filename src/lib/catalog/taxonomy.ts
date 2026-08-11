/**
 * Bilingual taxonomy for the catalog: categories, styles, colours, materials
 * and room types. Keeping entity labels here (rather than in the UI dictionary)
 * makes the catalog self-describing — the future AI can read a colour's label
 * and hex from the same place a filter chip does.
 *
 * Arabic labels are authored in logical Unicode order.
 */

import type {
  Category,
  CategorySlug,
  ColorId,
  Localized,
  MaterialId,
  RoomType,
  StyleTag,
} from "./types";

export const categories: Category[] = [
  {
    slug: "sofas",
    name: { en: "Sofas", ar: "كنب" },
    tagline: {
      en: "Anchor pieces for the living room and majlis.",
      ar: "قطع أساسية لغرفة المعيشة والمجلس.",
    },
    tone: "sand",
  },
  {
    slug: "chairs",
    name: { en: "Chairs", ar: "كراسي" },
    tagline: {
      en: "Accent, lounge and dining seating.",
      ar: "كراسي مميزة للاسترخاء والطعام.",
    },
    tone: "cream",
  },
  {
    slug: "coffee-tables",
    name: { en: "Coffee Tables", ar: "طاولات قهوة" },
    tagline: {
      en: "The centre of the seating arrangement.",
      ar: "قلب جلسة غرفة المعيشة.",
    },
    tone: "stone",
  },
  {
    slug: "side-tables",
    name: { en: "Side Tables", ar: "طاولات جانبية" },
    tagline: {
      en: "Small surfaces that pull a room together.",
      ar: "أسطح صغيرة تكمل تنسيق الغرفة.",
    },
    tone: "sand",
  },
  {
    slug: "dining",
    name: { en: "Dining Tables", ar: "طاولات طعام" },
    tagline: {
      en: "Gather-round tables for everyday and guests.",
      ar: "طاولات تجمع العائلة والضيوف.",
    },
    tone: "walnut",
  },
  {
    slug: "beds",
    name: { en: "Beds", ar: "أسِرّة" },
    tagline: {
      en: "Calm, grounded pieces for the bedroom.",
      ar: "قطع هادئة ومريحة لغرفة النوم.",
    },
    tone: "cream",
  },
  {
    slug: "storage",
    name: { en: "Storage", ar: "تخزين" },
    tagline: {
      en: "Sideboards, shelving and dressers.",
      ar: "بوفيهات ورفوف وخزائن أدراج.",
    },
    tone: "walnut",
  },
  {
    slug: "wardrobes",
    name: { en: "Wardrobes", ar: "دواليب ملابس" },
    tagline: {
      en: "Bedroom storage with a quiet presence.",
      ar: "تخزين لغرفة النوم بحضور هادئ.",
    },
    tone: "stone",
  },
  {
    slug: "tv-units",
    name: { en: "TV Units", ar: "طاولات تلفزيون" },
    tagline: {
      en: "Low consoles that keep the living room tidy.",
      ar: "طاولات منخفضة تحافظ على ترتيب المعيشة.",
    },
    tone: "walnut",
  },
  {
    slug: "desks",
    name: { en: "Desks", ar: "مكاتب" },
    tagline: {
      en: "Focused surfaces for the home office.",
      ar: "أسطح عمل للمكتب المنزلي.",
    },
    tone: "sand",
  },
  {
    slug: "rugs",
    name: { en: "Rugs", ar: "سجاد" },
    tagline: {
      en: "Texture and warmth underfoot.",
      ar: "دفء وملمس تحت الأقدام.",
    },
    tone: "cream",
  },
  {
    slug: "lighting",
    name: { en: "Lighting", ar: "إضاءة" },
    tagline: {
      en: "Floor, table and pendant light.",
      ar: "إضاءة أرضية وطاولة ومعلقة.",
    },
    tone: "sand",
  },
  {
    slug: "mirrors",
    name: { en: "Mirrors", ar: "مرايا" },
    tagline: {
      en: "Light, depth and a finishing touch.",
      ar: "ضوء وعمق ولمسة أخيرة.",
    },
    tone: "stone",
  },
  {
    slug: "decor",
    name: { en: "Decor", ar: "ديكور" },
    tagline: {
      en: "Vases, throws and the small details.",
      ar: "مزهريات وأغطية وتفاصيل صغيرة.",
    },
    tone: "cream",
  },
  {
    slug: "outdoor",
    name: { en: "Outdoor", ar: "خارجي" },
    tagline: {
      en: "Seating and tables for terraces and gardens.",
      ar: "جلسات وطاولات للتراس والحديقة.",
    },
    tone: "stone",
  },
];

export const categoryBySlug = new Map<CategorySlug, Category>(
  categories.map((c) => [c.slug, c]),
);

/** Style tags with bilingual labels. */
export const styleLabels: Record<StyleTag, Localized> = {
  "warm-modern": { en: "Warm Modern", ar: "مودرن دافئ" },
  modern: { en: "Modern", ar: "مودرن" },
  japandi: { en: "Japandi", ar: "جاباندي" },
  minimal: { en: "Minimal", ar: "مينمال" },
  contemporary: { en: "Contemporary", ar: "معاصر" },
  "classic-modern": { en: "Classic Modern", ar: "كلاسيكي عصري" },
  boho: { en: "Boho", ar: "بوهو" },
  scandinavian: { en: "Scandinavian", ar: "إسكندنافي" },
  "mid-century": { en: "Mid-Century", ar: "منتصف القرن" },
  industrial: { en: "Industrial", ar: "صناعي" },
};

/** Room types with bilingual labels. */
export const roomLabels: Record<RoomType, Localized> = {
  "living-room": { en: "Living Room", ar: "غرفة المعيشة" },
  majlis: { en: "Majlis", ar: "مجلس" },
  bedroom: { en: "Bedroom", ar: "غرفة النوم" },
  "dining-room": { en: "Dining Room", ar: "غرفة الطعام" },
  office: { en: "Office", ar: "مكتب" },
  entryway: { en: "Entryway", ar: "مدخل" },
  outdoor: { en: "Outdoor", ar: "خارجي" },
};

/** Colour swatches — label + hex, families used for filtering. */
export const colorSwatches: Record<ColorId, { label: Localized; hex: string }> =
  {
    ivory: { label: { en: "Ivory", ar: "عاجي" }, hex: "#F3ECDE" },
    beige: { label: { en: "Beige", ar: "بيج" }, hex: "#DCCBB0" },
    cream: { label: { en: "Cream", ar: "كريمي" }, hex: "#EADFC9" },
    sand: { label: { en: "Sand", ar: "رملي" }, hex: "#D8C09A" },
    taupe: { label: { en: "Taupe", ar: "بني رمادي" }, hex: "#A99C8C" },
    grey: { label: { en: "Grey", ar: "رمادي" }, hex: "#9B968E" },
    charcoal: { label: { en: "Charcoal", ar: "فحمي" }, hex: "#3A352F" },
    black: { label: { en: "Black", ar: "أسود" }, hex: "#211E1A" },
    white: { label: { en: "White", ar: "أبيض" }, hex: "#F7F4EF" },
    walnut: { label: { en: "Walnut", ar: "جوزي" }, hex: "#6B4A32" },
    oak: { label: { en: "Oak", ar: "بلوطي" }, hex: "#C3A579" },
    terracotta: { label: { en: "Terracotta", ar: "طيني" }, hex: "#B5674A" },
    rust: { label: { en: "Rust", ar: "صدئي" }, hex: "#9A5B3B" },
    sage: { label: { en: "Sage", ar: "مريمي" }, hex: "#9AA588" },
    olive: { label: { en: "Olive", ar: "زيتوني" }, hex: "#5E6A53" },
    navy: { label: { en: "Navy", ar: "كحلي" }, hex: "#2E3A4B" },
    blue: { label: { en: "Blue", ar: "أزرق" }, hex: "#5B7285" },
    brass: { label: { en: "Brass", ar: "نحاسي" }, hex: "#B08D57" },
    green: { label: { en: "Green", ar: "أخضر" }, hex: "#4F6F52" },
  };

/** Material families with bilingual labels. */
export const materialLabels: Record<MaterialId, Localized> = {
  boucle: { en: "Bouclé", ar: "بوكليه" },
  linen: { en: "Linen", ar: "كتان" },
  velvet: { en: "Velvet", ar: "مخمل" },
  wool: { en: "Wool", ar: "صوف" },
  cotton: { en: "Cotton", ar: "قطن" },
  leather: { en: "Leather", ar: "جلد" },
  walnut: { en: "Walnut", ar: "خشب الجوز" },
  oak: { en: "Oak", ar: "خشب البلوط" },
  ash: { en: "Ash", ar: "خشب الدردار" },
  teak: { en: "Teak", ar: "خشب الساج" },
  rattan: { en: "Rattan", ar: "روطان" },
  metal: { en: "Metal", ar: "معدن" },
  brass: { en: "Brass", ar: "نحاس" },
  steel: { en: "Steel", ar: "فولاذ" },
  glass: { en: "Glass", ar: "زجاج" },
  marble: { en: "Marble", ar: "رخام" },
  travertine: { en: "Travertine", ar: "ترافرتين" },
  ceramic: { en: "Ceramic", ar: "سيراميك" },
  stone: { en: "Stone", ar: "حجر" },
};

/** Ordered value lists (used to render filter options in a stable order). */
export const styleTags = Object.keys(styleLabels) as StyleTag[];
export const roomTypes = Object.keys(roomLabels) as RoomType[];
export const colorIds = Object.keys(colorSwatches) as ColorId[];
export const materialIds = Object.keys(materialLabels) as MaterialId[];
export const stockStatuses = [
  "in-stock",
  "made-to-order",
  "out-of-stock",
] as const;

export function isStyleTag(v: string): v is StyleTag {
  return (styleTags as string[]).includes(v);
}
export function isRoomType(v: string): v is RoomType {
  return (roomTypes as string[]).includes(v);
}
export function isColorId(v: string): v is ColorId {
  return (colorIds as string[]).includes(v);
}
export function isMaterialId(v: string): v is MaterialId {
  return (materialIds as string[]).includes(v);
}
export function isStockStatus(
  v: string,
): v is (typeof stockStatuses)[number] {
  return (stockStatuses as readonly string[]).includes(v);
}

/** Helper: pick the label for a locale. */
export function label(pair: Localized, locale: string): string {
  return locale === "ar" ? pair.ar : pair.en;
}
