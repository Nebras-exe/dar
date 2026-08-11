/**
 * Local furniture importer (deterministic, offline, no paid APIs).
 *
 * Reads a saved furniture gallery HTML (the IKEA Oman reference gallery in
 * D:\downlading\ikea_furniture_gallery (1).html), extracts its `DATA` object,
 * and converts it into the Athathi catalog:
 *
 *   - one PRODUCT per gallery block (grouped colour/finish VARIANTS),
 *   - variants collapsed to a UNIQUE catalog colour id (extra same-colour photos
 *     fold into the variant gallery — the buy-box keys swatches by colour id),
 *   - fine CATEGORY classification from the product-page href (which carries the
 *     real English product type: chair / coffee-table / bar-stool / day-bed …),
 *   - a deterministic ESTIMATED price band in OMR (clearly flagged),
 *   - best-effort dimensions parsed from labels/hrefs (else marked unknown).
 *
 * Output (single generated source of truth, imported by the app):
 *   src/lib/catalog/ikea-catalog.data.ts     (typed RAW products + variants)
 *   scripts/.import/image-manifest.json       (url → local dest for the downloader)
 *   scripts/.import/import-report.json        (stats for docs + tests)
 *
 * Re-runnable and safe: it is a pure function of the source HTML, so re-running
 * reproduces identical ids/slugs/prices. `--dry` prints stats without writing.
 * NEVER modifies the source folder (treated read-only).
 *
 * Usage:  node scripts/import-local-furniture.mjs [--src "<html>"] [--dry]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const srcIdx = args.indexOf("--src");
const SRC =
  srcIdx >= 0 ? args[srcIdx + 1] : "D:\\downlading\\ikea_furniture_gallery (1).html";

// ── 1. Extract the DATA object from the saved HTML ────────────────────────────
function extractData(file) {
  const html = fs.readFileSync(file, "utf8");
  const i = html.indexOf("const DATA");
  if (i < 0) throw new Error("No `const DATA` found in " + file);
  const brace = html.indexOf("{", i);
  let depth = 0, j = brace, inStr = null;
  for (; j < html.length; j++) {
    const c = html[j];
    if (inStr) {
      if (c === "\\") { j++; continue; }
      if (c === inStr) inStr = null;
    } else if (c === '"' || c === "'" || c === "`") inStr = c;
    else if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) { j++; break; } }
  }
  return eval("(" + html.slice(brace, j) + ")");
}

// ── 2. Vocabulary maps (Arabic-first, English fallback) ───────────────────────
const AR_COLOR = [
  ["عاجي", "ivory"], ["أبيض", "white"], ["ابيض", "white"], ["أسود", "black"],
  ["اسود", "black"], ["فحمي", "charcoal"], ["رمادي", "grey"], ["رمادى", "grey"],
  ["فضي", "grey"], ["بيج", "beige"], ["كريمي", "cream"], ["رملي", "sand"],
  ["طيني", "terracotta"], ["بني", "brown"], ["الجوز", "walnut"], ["جوز", "walnut"],
  ["ساج", "walnut"], ["سنديان", "oak"], ["بلوطي", "oak"], ["بلوط", "oak"],
  ["دردار", "natural"], ["زان", "natural"], ["بتولا", "natural"], ["صنوبر", "natural"],
  ["خيزران", "natural"], ["بامبو", "natural"], ["طبيعي", "natural"], ["كحلي", "navy"],
  ["تركواز", "blue"], ["أزرق", "blue"], ["ازرق", "blue"], ["أخضر", "green"],
  ["اخضر", "green"], ["زيتوني", "olive"], ["مريمي", "sage"], ["أحمر", "red"],
  ["احمر", "red"], ["برتقالي", "orange"], ["أصفر", "yellow"], ["اصفر", "yellow"],
  ["وردي", "pink"], ["ذهبي", "brass"], ["نحاسي", "brass"], ["شفاف", "clear"],
  ["متعدد", "multi"],
];
const EN_COLOR = [
  ["anthracite", "charcoal"], ["red-brown", "brown"], ["dark-blue", "navy"],
  ["off-white", "ivory"], ["oak-effect", "oak"], ["walnut-effect", "walnut"],
  ["white", "white"], ["black", "black"], ["grey", "grey"], ["gray", "grey"],
  ["beige", "beige"], ["cream", "cream"], ["sand", "sand"], ["ivory", "ivory"],
  ["brown", "brown"], ["walnut", "walnut"], ["oak", "oak"], ["birch", "natural"],
  ["pine", "natural"], ["ash", "natural"], ["beech", "natural"], ["bamboo", "natural"],
  ["rattan", "natural"], ["natural", "natural"], ["navy", "navy"], ["turquoise", "blue"],
  ["blue", "blue"], ["green", "green"], ["olive", "olive"], ["red", "red"],
  ["orange", "orange"], ["yellow", "yellow"], ["pink", "pink"], ["gold", "brass"],
  ["brass", "brass"], ["chrome", "grey"], ["transparent", "clear"],
];
function colorIdFor(label, href) {
  for (const [w, id] of AR_COLOR) if (label.includes(w)) return id;
  const h = href.toLowerCase();
  for (const [w, id] of EN_COLOR) if (h.includes(w)) return id;
  return "natural";
}

const MATERIAL = [
  [/جلد|leather/i, "leather"], [/مخمل|velvet/i, "velvet"], [/بوكليه|boucle|bouclé/i, "boucle"],
  [/كتان|linen/i, "linen"], [/قطن|cotton/i, "cotton"], [/صوف|wool/i, "wool"],
  [/خيزران|rattan|bamboo|بامبو/i, "rattan"], [/زجاج|glass/i, "glass"], [/رخام|marble/i, "marble"],
  [/فولاذ|steel/i, "steel"], [/معدن|معدني|metal|chrome/i, "metal"],
  [/الجوز|walnut|جوز(?!ه)/i, "walnut"], [/سنديان|بلوط|\boak\b/i, "oak"],
  [/دردار|\bash\b/i, "ash"], [/ساج|teak/i, "teak"],
];
function materialsFor(label, href) {
  const s = `${label} ${href}`;
  const out = [];
  for (const [re, id] of MATERIAL) if (re.test(s) && !out.includes(id)) out.push(id);
  return out;
}

// href-type → [category, subcategory?, enType, arType]. First match wins.
const TYPE_RULES = [
  [/corner-sofa-bed|sofa-bed/, "sofas", "sofa-bed", "Sofa-bed", "كنبة سرير"],
  [/corner-sofa|crnr-sofa/, "sofas", "corner-sofa", "Corner Sofa", "كنبة زاوية"],
  [/\d-seat|sofa\b|loveseat|sectional/, "sofas", undefined, "Sofa", "كنبة"],
  [/day-bed/, "beds", "day-bed", "Day-bed", "سرير نهاري"],
  [/mattress-base|slatted-mattress/, "beds", "mattress-base", "Mattress Base", "قاعدة مرتبة"],
  [/mattress/, "beds", "mattress", "Mattress", "مرتبة"],
  [/divan-bed/, "beds", "divan-bed", "Divan Bed", "سرير ديفان"],
  [/bunk-bed|loft-bed/, "beds", "bunk-bed", "Bunk Bed", "سرير بطابقين"],
  [/bed-frame|guest-bed|stackable-bed|\bbed\b/, "beds", "bed-frame", "Bed Frame", "هيكل سرير"],
  [/bar-stool|counter/, "chairs", "bar-stool", "Bar Stool", "كرسي بار"],
  [/rocking-chair/, "chairs", "rocking-chair", "Rocking Chair", "كرسي هزّاز"],
  [/swivel-easy-chair|easy-chair|high-back-armchair|wing-chair|armchair/, "chairs", "armchair", "Armchair", "كرسي بذراعين"],
  [/footstool|ottoman|pouffe/, "chairs", "footstool", "Footstool", "مسند قدمين"],
  [/chair-pad|chair-cushion|seat-pad|seat-cushion|cushion/, "decor", "cushion", "Chair Pad", "وسادة كرسي"],
  [/folding-chair/, "chairs", "folding-chair", "Folding Chair", "كرسي قابل للطي"],
  [/seat-shell/, "chairs", undefined, "Chair", "كرسي"],
  [/children.*chair|junior/, "chairs", undefined, "Children's Chair", "كرسي أطفال"],
  [/coffee-table/, "coffee-tables", undefined, "Coffee Table", "طاولة قهوة"],
  [/nest-of-tables|nesting/, "side-tables", "nest", "Nest of Tables", "طاولات متداخلة"],
  [/tray-table/, "side-tables", "tray", "Tray Table", "طاولة صينية"],
  [/bedside|nightstand/, "side-tables", "bedside", "Bedside Table", "طاولة سرير"],
  [/side-table/, "side-tables", undefined, "Side Table", "طاولة جانبية"],
  [/console-table/, "side-tables", "console", "Console Table", "طاولة كونسول"],
  [/trolley|\bcart\b/, "storage", "trolley", "Trolley", "عربة"],
  [/dressing-table|\bdesk\b/, "desks", undefined, "Desk", "مكتب"],
  [/bench/, "dining", "bench", "Bench", "مقعد"],
  [/extendable-table|dining-table|drop-leaf|gateleg|bar-table/, "dining", undefined, "Dining Table", "طاولة طعام"],
  [/\btable\b/, "dining", undefined, "Table", "طاولة"],
  [/\bstool\b/, "chairs", "stool", "Stool", "كرسي بدون ظهر"],
  [/\bchair\b/, "chairs", undefined, "Chair", "كرسي"],
];
function classify(href, section) {
  const h = href.toLowerCase();
  for (const [re, cat, sub, en, ar] of TYPE_RULES) {
    if (re.test(h)) return { category: cat, subcategory: sub, enType: en, arType: ar };
  }
  // Fallback by gallery section.
  if (section === "chairs") return { category: "chairs", enType: "Chair", arType: "كرسي" };
  if (section === "tables") return { category: "dining", enType: "Table", arType: "طاولة" };
  return { category: "beds", subcategory: "bed-frame", enType: "Bed Frame", arType: "هيكل سرير" };
}

// Estimated OMR price bands by [category|subcategory].
const BANDS = {
  "decor|cushion": [3, 14],
  "chairs|bar-stool": [22, 65], "chairs|folding-chair": [9, 22],
  "chairs|rocking-chair": [55, 130], "chairs|armchair": [45, 175],
  "chairs|footstool": [18, 60], "chairs|stool": [10, 35], "chairs": [14, 55],
  "coffee-tables": [22, 120], "side-tables": [12, 70], "storage|trolley": [20, 75],
  "desks": [40, 210], "dining": [45, 280],
  "beds|day-bed": [90, 260], "beds|mattress": [45, 190],
  "beds|mattress-base": [55, 200], "beds|divan-bed": [120, 400],
  "beds|bunk-bed": [90, 300], "beds": [60, 300],
  "sofas|sofa-bed": [160, 640], "sofas|corner-sofa": [220, 700], "sofas": [150, 620],
};
function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function estimatePrice(category, subcategory, slug, widthCm, known) {
  const band = BANDS[`${category}|${subcategory}`] ?? BANDS[category] ?? [20, 120];
  const [min, max] = band;
  let p = min + (hash(slug) % (max - min + 1));
  // Nudge larger pieces up within their class when a real width is known.
  if (known && ["dining", "beds", "sofas"].includes(category) && widthCm) {
    const f = Math.max(0.85, Math.min(1.25, widthCm / 180));
    p = Math.round(p * f);
  }
  return Math.max(min, Math.min(Math.round(p), max * 2));
}

// Default dimensions (cm) per category — used only when nothing is parseable.
const DIM_DEFAULTS = {
  "sofas": { widthCm: 220, depthCm: 95, heightCm: 85 },
  "chairs|armchair": { widthCm: 70, depthCm: 75, heightCm: 90, seatHeightCm: 45 },
  "chairs|bar-stool": { widthCm: 45, depthCm: 45, heightCm: 95, seatHeightCm: 74 },
  "chairs|footstool": { widthCm: 60, depthCm: 50, heightCm: 44 },
  "chairs": { widthCm: 48, depthCm: 55, heightCm: 82, seatHeightCm: 46 },
  "coffee-tables": { widthCm: 110, depthCm: 60, heightCm: 45 },
  "side-tables": { widthCm: 50, depthCm: 50, heightCm: 55 },
  "dining": { widthCm: 140, depthCm: 80, heightCm: 74 },
  "desks": { widthCm: 120, depthCm: 60, heightCm: 74 },
  "storage": { widthCm: 80, depthCm: 40, heightCm: 100 },
  "beds": { widthCm: 160, depthCm: 210, heightCm: 100 },
  "decor": { widthCm: 40, depthCm: 40, heightCm: 5 },
};
function defaultDims(category, subcategory) {
  return { ...(DIM_DEFAULTS[`${category}|${subcategory}`] ?? DIM_DEFAULTS[category] ?? DIM_DEFAULTS.decor) };
}
function parseDims(labels, category, subcategory) {
  const base = defaultDims(category, subcategory);
  const joined = labels.join(" ");
  const wxd = joined.match(/(\d{2,3})\s*[x×]\s*(\d{2,3})(?:\s*[x×]\s*(\d{1,3}))?/);
  if (wxd) {
    const a = +wxd[1], b = +wxd[2], c = wxd[3] ? +wxd[3] : undefined;
    return { dims: { widthCm: a, depthCm: b, heightCm: c ?? base.heightCm }, known: true };
  }
  const hOnly = joined.match(/(\d{2,3})\s*سم/);
  if (hOnly) return { dims: { ...base, heightCm: +hOnly[1] }, known: true };
  return { dims: base, known: false };
}

// ── 3. Build products ─────────────────────────────────────────────────────────
function slugify(s) {
  return s.toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function titleCase(s) {
  return s.toLowerCase().replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

const ROOMS = {
  sofas: ["living-room", "majlis"], chairs: ["living-room", "dining-room"],
  "coffee-tables": ["living-room"], "side-tables": ["living-room", "bedroom"],
  dining: ["dining-room"], beds: ["bedroom"], desks: ["office"],
  storage: ["living-room"], decor: ["living-room"],
};

function build(data) {
  const products = [];
  const usedSlugs = new Map();
  const sections = { chairs: "chairs", tables: "tables", beds: "beds" };
  let order = 0;

  for (const section of Object.keys(sections)) {
    for (const block of data[section] ?? []) {
      const variantsRaw = block.variants ?? [];
      if (variantsRaw.length === 0) continue;
      const first = variantsRaw[0];
      const cls = classify(first.href, section);
      const { category, subcategory, enType, arType } = cls;

      // Slug: model + english type, de-duplicated.
      let base = slugify(`${block.name} ${enType}`);
      let slug = base;
      const n = (usedSlugs.get(base) ?? 0) + 1;
      usedSlugs.set(base, n);
      if (n > 1) slug = `${base}-${n}`;

      // Dimensions from all variant labels.
      const { dims, known } = parseDims(variantsRaw.map((v) => v.label ?? ""), category, subcategory);
      const price = estimatePrice(category, subcategory, slug, dims.widthCm, known);

      // Collapse variants to a unique colour id (extra photos → gallery).
      const byColor = new Map();
      for (const v of variantsRaw) {
        const label = v.label ?? "";
        const colorId = colorIdFor(label, v.href);
        const mats = materialsFor(label, v.href);
        const image = `/images/catalog/${slug}/${colorId}.jpg`;
        if (!byColor.has(colorId)) {
          byColor.set(colorId, {
            variantId: `${slug}-${colorId}`,
            colorId,
            labelEn: enType, // human colour label comes from the taxonomy swatch
            labelAr: arType,
            vendorLabel: label,
            materialId: mats[0],
            image,
            imageSrc: v.img,
            gallery: [],
            gallerySrc: [],
            sourceUrl: v.href,
          });
        } else {
          const existing = byColor.get(colorId);
          const gi = existing.gallery.length + 1;
          const gpath = `/images/catalog/${slug}/${colorId}-${gi}.jpg`;
          existing.gallery.push(gpath);
          existing.gallerySrc.push(v.img);
        }
      }
      const variants = [...byColor.values()];
      const colorIds = variants.map((v) => v.colorId);
      const materials = [...new Set(variants.flatMap((v) => (v.materialId ? [v.materialId] : [])))];

      const nameEn = `${titleCase(block.name)} ${enType}`.replace(/\s+/g, " ").trim();
      const nameAr = `${arType} ${block.name}`.trim();
      const nVar = variants.length;
      const descEn =
        `${nameEn} — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. ` +
        `${nVar} colour/finish option${nVar === 1 ? "" : "s"}. Price is an estimate in OMR.`;
      const descAr =
        `${nameAr} — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. ` +
        `${nVar} خيار لون/تشطيب. السعر تقديري بالريال العُماني.`;

      products.push({
        id: `ikea-${slug}`,
        slug,
        category,
        ...(subcategory ? { subcategory } : {}),
        model: block.name,
        nameEn, nameAr, descEn, descAr,
        price,
        priceType: "estimated",
        sourceLabel: "IKEA Oman (reference)",
        sourceUrl: first.href,
        stockStatus: "in-stock",
        customizable: nVar > 1,
        materials,
        styleTags: ["scandinavian", "modern"],
        roomTypes: ROOMS[category] ?? ["living-room"],
        dimensions: dims,
        dimensionsKnown: known,
        colorIds,
        variants: variants.map((v) => ({
          variantId: v.variantId,
          colorId: v.colorId,
          ...(v.materialId ? { materialId: v.materialId } : {}),
          image: v.image,
          ...(v.gallery.length ? { gallery: v.gallery } : {}),
          priceOmr: price,
          sourceUrl: v.sourceUrl,
        })),
        images: variants.map((v) => v.image),
        addedAt: "2026-08-12",
        featuredRank: order++,
        // download hints (stripped from the emitted TS; used only for the manifest)
        _dl: variants.flatMap((v) => [
          { url: v.imageSrc, dest: v.image },
          ...v.gallery.map((g, i) => ({ url: v.gallerySrc[i], dest: g })),
        ]),
      });
    }
  }
  return products;
}

// ── 4. Emit ───────────────────────────────────────────────────────────────────
function emit(products) {
  const manifest = [];
  const seenDest = new Set();
  for (const p of products) {
    for (const d of p._dl) {
      if (!d.url || seenDest.has(d.dest)) continue;
      seenDest.add(d.dest);
      manifest.push({ url: d.url, dest: d.dest });
    }
    delete p._dl;
  }

  const header =
`/**
 * GENERATED FILE — do not edit by hand.
 * Produced by scripts/import-local-furniture.mjs from the local IKEA Oman
 * reference gallery. Re-run the importer to regenerate. Prices are ESTIMATED
 * (priceType: "estimated"); provenance is recorded in sourceLabel/sourceUrl.
 */
import type { CategorySlug, ColorId, Dimensions, MaterialId, RoomType, StyleTag } from "./types";

export interface RawVariant {
  variantId: string;
  colorId: ColorId;
  materialId?: MaterialId;
  image: string;
  gallery?: string[];
  priceOmr: number;
  sourceUrl: string;
}
export interface RawProduct {
  id: string;
  slug: string;
  category: CategorySlug;
  subcategory?: string;
  model: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  price: number;
  priceType: "estimated";
  sourceLabel: string;
  sourceUrl: string;
  stockStatus: "in-stock";
  customizable: boolean;
  materials: MaterialId[];
  styleTags: StyleTag[];
  roomTypes: RoomType[];
  dimensions: Dimensions;
  dimensionsKnown: boolean;
  colorIds: ColorId[];
  variants: RawVariant[];
  images: string[];
  addedAt: string;
  featuredRank: number;
}

export const RAW_IKEA_PRODUCTS: RawProduct[] = ${JSON.stringify(products, null, 2)};
`;

  const report = {
    generatedAt: new Date().toISOString(),
    source: SRC,
    products: products.length,
    variants: products.reduce((s, p) => s + p.variants.length, 0),
    images: manifest.length,
    byCategory: products.reduce((m, p) => ((m[p.category] = (m[p.category] ?? 0) + 1), m), {}),
    multiVariant: products.filter((p) => p.variants.length >= 2).length,
    estimatedPrices: products.length,
    unknownDimensions: products.filter((p) => !p.dimensionsKnown).length,
  };

  if (DRY) {
    console.log("DRY RUN — no files written.\n", JSON.stringify(report, null, 2));
    return report;
  }
  const outTs = path.join(ROOT, "src/lib/catalog/ikea-catalog.data.ts");
  const outDir = path.join(ROOT, "scripts/.import");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outTs, header);
  fs.writeFileSync(path.join(outDir, "image-manifest.json"), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(outDir, "import-report.json"), JSON.stringify(report, null, 2));
  console.log("Wrote", outTs);
  console.log("Wrote manifest:", manifest.length, "images");
  console.log(JSON.stringify(report, null, 2));
  return report;
}

const data = extractData(SRC);
emit(build(data));
