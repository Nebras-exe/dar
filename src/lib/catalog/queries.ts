/**
 * Deterministic catalog query layer.
 *
 * Every function here is pure and side-effect free, with no framework imports,
 * so it runs identically in a React Server Component, a Node test, or a future
 * AI Agent tool. This is the contract the Athathi Agent will call to answer
 * questions like: "sofa, warm-modern, beige, width ≤ 240 cm, under OMR 300".
 */

import { products } from "./products";
import { categories } from "./taxonomy";
import type {
  Category,
  CategorySlug,
  ColorId,
  MaterialId,
  Product,
  RoomType,
  StockStatus,
  StyleTag,
} from "./types";

/** All demo products in curated ("Recommended") order. */
export function getAllProducts(): readonly Product[] {
  return products;
}

/** All categories, in display order. */
export function getCategories(): readonly Category[] {
  return categories;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function isCategorySlug(value: string): value is CategorySlug {
  return categories.some((c) => c.slug === value);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  return products.filter((p) => p.category === category);
}

/** Count of products in each category (for nav badges / SEO). */
export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
  return counts;
}

// ── Filtering ────────────────────────────────────────────────────────────────

/**
 * The deterministic filter contract. Every field is optional; omitted fields
 * do not constrain. Array fields match if the product satisfies ANY of the
 * requested values (OR within a facet), while different facets combine with AND
 * — the standard ecommerce faceted-search behaviour, and exactly what an AI
 * recommender needs for hard constraints.
 */
export interface ProductFilter {
  categories?: CategorySlug[];
  styles?: StyleTag[];
  colors?: ColorId[];
  materials?: MaterialId[];
  rooms?: RoomType[];
  availability?: StockStatus[];
  /** Inclusive price bounds in OMR. */
  minPrice?: number;
  maxPrice?: number;
  /** Inclusive width bounds in cm — the basis for room-fit checks. */
  minWidthCm?: number;
  maxWidthCm?: number;
  customizable?: boolean;
  /** Free-text query matched across name, category, style, colour, material. */
  query?: string;
}

/** Normalise text for accent/·case-insensitive matching (en + basic ar). */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip Latin diacritics (é → e)
    .replace(/[ً-ْ]/g, "") // strip Arabic harakat
    .trim();
}

/** Build the searchable haystack for a product (both languages). */
function haystack(p: Product): string {
  const parts: string[] = [
    p.name,
    p.nameAr,
    p.category,
    p.subcategory ?? "",
    ...p.styleTags,
    ...p.materials,
    ...p.colors.map((c) => `${c.id} ${c.label.en} ${c.label.ar}`),
    ...p.roomTypes,
    p.supplier,
  ];
  return normalize(parts.join(" "));
}

function matchesQuery(p: Product, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  const hay = haystack(p);
  // Every whitespace-separated token must appear somewhere (AND of tokens).
  return q.split(/\s+/).every((token) => hay.includes(token));
}

function hasAny<T>(requested: T[] | undefined, values: T[]): boolean {
  if (!requested || requested.length === 0) return true;
  return requested.some((r) => values.includes(r));
}

/** Apply a filter to a product list (defaults to the whole catalog). */
export function filterProducts(
  filter: ProductFilter,
  source: readonly Product[] = products,
): Product[] {
  return source.filter((p) => {
    if (!hasAny(filter.categories, [p.category])) return false;
    if (!hasAny(filter.styles, p.styleTags)) return false;
    if (!hasAny(filter.colors, p.colors.map((c) => c.id))) return false;
    if (!hasAny(filter.materials, p.materials)) return false;
    if (!hasAny(filter.rooms, p.roomTypes)) return false;
    if (!hasAny(filter.availability, [p.stockStatus])) return false;
    if (filter.minPrice != null && p.price < filter.minPrice) return false;
    if (filter.maxPrice != null && p.price > filter.maxPrice) return false;
    if (filter.minWidthCm != null && p.dimensions.widthCm < filter.minWidthCm)
      return false;
    if (filter.maxWidthCm != null && p.dimensions.widthCm > filter.maxWidthCm)
      return false;
    if (filter.customizable != null && p.customizable !== filter.customizable)
      return false;
    if (filter.query != null && !matchesQuery(p, filter.query)) return false;
    return true;
  });
}

/** Convenience search over the whole catalog by free text only. */
export function searchProducts(query: string): Product[] {
  return filterProducts({ query });
}

// ── Sorting ──────────────────────────────────────────────────────────────────

export type SortKey =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "name-asc";

export const sortKeys: SortKey[] = [
  "recommended",
  "price-asc",
  "price-desc",
  "newest",
  "name-asc",
];

export function isSortKey(value: string): value is SortKey {
  return (sortKeys as string[]).includes(value);
}

/**
 * Return a new sorted array — never mutates the input. Sorting is stable and
 * deterministic (ties fall back to the curated recommended rank).
 */
export function sortProducts(list: readonly Product[], key: SortKey): Product[] {
  const rank = (p: Product) => p.featuredRank ?? Number.MAX_SAFE_INTEGER;
  const copy = [...list];
  switch (key) {
    case "price-asc":
      copy.sort((a, b) => a.price - b.price || rank(a) - rank(b));
      break;
    case "price-desc":
      copy.sort((a, b) => b.price - a.price || rank(a) - rank(b));
      break;
    case "newest":
      copy.sort(
        (a, b) => b.addedAt.localeCompare(a.addedAt) || rank(a) - rank(b),
      );
      break;
    case "name-asc":
      copy.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "recommended":
    default:
      copy.sort((a, b) => rank(a) - rank(b));
      break;
  }
  return copy;
}

// ── Related products ─────────────────────────────────────────────────────────

/**
 * Deterministic "related" selection — no recommendation AI. Scores other
 * products by shared category, style overlap, room overlap, and price
 * proximity, then returns the top matches. Given the frozen catalog, the same
 * product always yields the same related set.
 */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const scored = products
    .filter((p) => p.slug !== product.slug)
    .map((p) => {
      let score = 0;
      if (p.category === product.category) score += 5;
      score += overlap(p.styleTags, product.styleTags) * 3;
      score += overlap(p.roomTypes, product.roomTypes) * 1;
      // Price proximity: up to +2 when within ~40% of the reference price.
      const ratio = Math.abs(p.price - product.price) / product.price;
      if (ratio <= 0.4) score += 2 - ratio * 5 > 0 ? 2 - ratio * 5 : 0;
      return { p, score };
    })
    .filter((s) => s.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        (a.p.featuredRank ?? 0) - (b.p.featuredRank ?? 0),
    );
  return scored.slice(0, limit).map((s) => s.p);
}

function overlap<T>(a: T[], b: T[]): number {
  return a.filter((x) => b.includes(x)).length;
}

// ── Price bounds (for the price filter UI) ────────────────────────────────────

export function getPriceBounds(source: readonly Product[] = products): {
  min: number;
  max: number;
} {
  let min = Infinity;
  let max = -Infinity;
  for (const p of source) {
    if (p.price < min) min = p.price;
    if (p.price > max) max = p.price;
  }
  if (!isFinite(min)) return { min: 0, max: 0 };
  return { min: Math.floor(min), max: Math.ceil(max) };
}
