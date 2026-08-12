/**
 * Athathi catalog — typed product model.
 *
 * This is the structured source of truth that the future Athathi AI Agent will
 * query. It is deliberately kept free of framework/UI imports so the same data
 * and query layer can run in a Node script, an edge function, or a test.
 *
 * Design rules:
 * - Everything filterable is a stable machine value (slug/enum + number),
 *   never free text. Human-readable labels live alongside as `{ en, ar }`.
 * - Numeric values (price, dimensions) are numbers, so totals and fit checks
 *   are deterministic — formatted strings are derived, never stored.
 */

/** A bilingual label. Arabic is authored in logical Unicode order. */
export interface Localized {
  en: string;
  ar: string;
}

/** Stable English category slugs — used directly in URLs. */
export type CategorySlug =
  | "sofas"
  | "chairs"
  | "coffee-tables"
  | "side-tables"
  | "dining"
  | "beds"
  | "storage"
  | "wardrobes"
  | "tv-units"
  | "desks"
  | "rugs"
  | "lighting"
  | "mirrors"
  | "decor"
  | "outdoor";

/** Style tags drive future AI style-matching. */
export type StyleTag =
  | "warm-modern"
  | "modern"
  | "japandi"
  | "minimal"
  | "contemporary"
  | "classic-modern"
  | "boho"
  | "scandinavian"
  | "mid-century"
  | "industrial";

/** Where a piece works — structured demo metadata, not an algorithmic claim. */
export type RoomType =
  | "living-room"
  | "majlis"
  | "bedroom"
  | "dining-room"
  | "office"
  | "entryway"
  | "outdoor";

/** Colour families used for filtering; the swatch hex lives in the taxonomy. */
export type ColorId =
  | "ivory"
  | "beige"
  | "cream"
  | "sand"
  | "taupe"
  | "grey"
  | "charcoal"
  | "black"
  | "white"
  | "walnut"
  | "oak"
  | "terracotta"
  | "rust"
  | "sage"
  | "olive"
  | "navy"
  | "blue"
  | "brass"
  | "green"
  // Extended families needed by imported real-world catalogs (e.g. IKEA Oman).
  | "brown"
  | "red"
  | "orange"
  | "yellow"
  | "pink"
  | "natural"
  | "clear"
  | "multi";

/** Material families used for filtering; labels live in the taxonomy. */
export type MaterialId =
  | "boucle"
  | "linen"
  | "velvet"
  | "wool"
  | "cotton"
  | "leather"
  | "walnut"
  | "oak"
  | "ash"
  | "teak"
  | "rattan"
  | "metal"
  | "brass"
  | "steel"
  | "glass"
  | "marble"
  | "travertine"
  | "ceramic"
  | "stone";

/**
 * Demo availability. `made-to-order` is honest for demo custom pieces and does
 * not imply a real delivery guarantee.
 */
export type StockStatus = "in-stock" | "made-to-order" | "out-of-stock";

/** Clearly-fictional demo suppliers — never a real company. */
export type DemoSupplier =
  | "DAR Studio Collection"
  | "DAR Demo Supplier"
  | "Demo Furniture Lab";

/** Structured dimensions in centimetres — the basis for future room-fit checks. */
export interface Dimensions {
  widthCm: number;
  depthCm: number;
  heightCm: number;
  /** Seat height for seating, when relevant. */
  seatHeightCm?: number;
  /** Seat depth for seating, when relevant. */
  seatDepthCm?: number;
  /** Diameter for round pieces (rugs, round tables) — an alternative to W×D. */
  diameterCm?: number;
}

/** A selectable colour variant. `id` filters; `label` displays; `hex` renders. */
export interface ColorOption {
  id: ColorId;
  label: Localized;
  hex: string;
}

/**
 * The core catalog entity. Every field a future deterministic filter needs is a
 * machine value; presentation strings are localized pairs.
 */
export interface Product {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;

  category: CategorySlug;
  /** Optional finer grouping within a category (machine value). */
  subcategory?: string;

  /**
   * Real product photography, when it exists. Empty in this prototype — the
   * `ProductImage` component renders generated art as a stand-in and switches
   * to `next/image` the moment real `images` are provided, so wiring real
   * photography later is a data change, not a code change.
   */
  images?: string[];

  /** Numeric price in OMR — the single source for all money math. */
  price: number;
  currency: "OMR";

  /**
   * Whether `price` is an official source price or a deterministic demo ESTIMATE.
   * Imported reference products (no reliable retail price) are `"estimated"` and
   * must be shown to the user as such ("Estimated" / "تقديري"). Absent ⇒ treated
   * as a normal demo price (the original cleared-catalog behaviour).
   */
  priceType?: "estimated" | "source";
  /** Provenance label for imported reference data (e.g. "IKEA Oman (reference)"). */
  sourceLabel?: string;
  /** The source product-page URL the reference item was imported from. */
  sourceUrl?: string;
  /** Original vendor model code preserved for imported products (e.g. "MALM"). */
  model?: string;
  /**
   * False when the source did not expose real dimensions (they are category
   * defaults). The UI shows "dimensions unknown" rather than implying precision.
   */
  dimensionsKnown?: boolean;

  /** Clearly-labelled demo supplier. */
  supplier: DemoSupplier;
  /** Always true in this prototype — every item is sample data. */
  isDemo: true;

  stockStatus: StockStatus;

  dimensions: Dimensions;
  materials: MaterialId[];
  colors: ColorOption[];
  styleTags: StyleTag[];
  roomTypes: RoomType[];

  /** Short bilingual feature bullets. */
  features: Localized[];

  customizable: boolean;
  /** Machine values (e.g. "size", "fabric") for later customization UIs. */
  customizationOptions?: string[];

  /**
   * Deterministic sort/recency metadata — an ISO date. Not a real inventory
   * timestamp; it exists only to make "Recently added" ordering meaningful.
   */
  addedAt: string;
  /** Curated default ("Recommended") ordering weight — lower shows first. */
  featuredRank?: number;
}

/** A catalog category with a localized name and a representative accent. */
export interface Category {
  slug: CategorySlug;
  name: Localized;
  /** One-line bilingual description for category headers. */
  tagline: Localized;
  /** Palette tone used by the placeholder art system for visual variety. */
  tone: "sand" | "cream" | "stone" | "walnut";
}
