/**
 * Public catalog API. Import from `@/lib/catalog` throughout the app so the
 * underlying module layout can evolve (e.g. swap the local demo source for a
 * real backend) without touching call sites.
 */

export * from "./types";
export * from "./taxonomy";
export * from "./queries";
export * from "./pricing";
export { products } from "./products";
