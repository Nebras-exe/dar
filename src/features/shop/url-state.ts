/**
 * The shop's URL is its state. This module is the single, framework-agnostic
 * bridge between query-string parameters and the deterministic catalog filter —
 * used by server pages (to parse `searchParams` into results) and by client
 * controls (to serialise changes back into the URL). Keeping it here means
 * shareable links, working back/forward, and refresh-persistence all come free.
 */

import {
  isColorId,
  isMaterialId,
  isRoomType,
  isStockStatus,
  isStyleTag,
} from "@/lib/catalog";
import {
  isCategorySlug,
  isSortKey,
  type ProductFilter,
  type SortKey,
} from "@/lib/catalog";
import type {
  CategorySlug,
  ColorId,
  MaterialId,
  RoomType,
  StockStatus,
  StyleTag,
} from "@/lib/catalog";

/** Raw query object as delivered by Next `searchParams`. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

/** A normalised view of every shop parameter, ready for both UI and filtering. */
export interface ShopState {
  q: string;
  categories: CategorySlug[];
  styles: StyleTag[];
  colors: ColorId[];
  materials: MaterialId[];
  rooms: RoomType[];
  availability: StockStatus[];
  minPrice?: number;
  maxPrice?: number;
  customizable: boolean;
  sort: SortKey;
}

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function list(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(",") : (value ?? "");
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function numberOrUndefined(value: string): number | undefined {
  if (value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Parse raw search params into a validated {@link ShopState}. Unknown or
 * malformed values are dropped, so a hand-edited URL can never crash a page.
 * When `lockedCategory` is provided (the `/shop/[category]` route) it wins and
 * any `category` query param is ignored.
 */
export function parseShopState(
  params: RawSearchParams,
  lockedCategory?: CategorySlug,
): ShopState {
  const categories = lockedCategory
    ? [lockedCategory]
    : list(params.category).filter(isCategorySlug);

  const sortRaw = first(params.sort);

  return {
    q: first(params.q),
    categories,
    styles: list(params.style).filter(isStyleTag),
    colors: list(params.color).filter(isColorId),
    materials: list(params.material).filter(isMaterialId),
    rooms: list(params.room).filter(isRoomType),
    availability: list(params.availability).filter(isStockStatus),
    minPrice: numberOrUndefined(first(params.min)),
    maxPrice: numberOrUndefined(first(params.max)),
    customizable: first(params.custom) === "1",
    sort: isSortKey(sortRaw) ? sortRaw : "recommended",
  };
}

/** Convert a {@link ShopState} into the deterministic catalog filter. */
export function stateToFilter(state: ShopState): ProductFilter {
  return {
    query: state.q || undefined,
    categories: state.categories.length ? state.categories : undefined,
    styles: state.styles.length ? state.styles : undefined,
    colors: state.colors.length ? state.colors : undefined,
    materials: state.materials.length ? state.materials : undefined,
    rooms: state.rooms.length ? state.rooms : undefined,
    availability: state.availability.length ? state.availability : undefined,
    minPrice: state.minPrice,
    maxPrice: state.maxPrice,
    customizable: state.customizable || undefined,
  };
}

/** How many facet selections are active (drives the "N active" badge). */
export function countActiveFilters(state: ShopState, hasLockedCategory: boolean): number {
  return (
    (hasLockedCategory ? 0 : state.categories.length) +
    state.styles.length +
    state.colors.length +
    state.materials.length +
    state.rooms.length +
    state.availability.length +
    (state.minPrice != null ? 1 : 0) +
    (state.maxPrice != null ? 1 : 0) +
    (state.customizable ? 1 : 0)
  );
}
