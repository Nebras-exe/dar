/**
 * Product catalog source — INTENTIONALLY EMPTY.
 *
 * The demo furniture catalog was cleared (rollback tag `before-catalog-reset`) so
 * Athathi can be populated with real products from scratch. The entire product
 * SYSTEM stays intact and fully functional — types, taxonomy, queries, filtering,
 * sorting, the variant/customization layer, cart, the deterministic design engine,
 * the AI Designer, the Agent and the chatbot all continue to work; only the
 * inventory is empty. With zero products every catalog surface shows a clean empty
 * state and nothing is ever fabricated.
 *
 * To add real products, append fully-typed `Product` records to this array (see
 * `./types` for the shape, and `./test-fixtures.ts` for a builder used by tests),
 * or swap this module for a backend-backed source behind the same `products`
 * export — no call site needs to change.
 */

import type { Product } from "./types";

/** The catalog. Empty until real products are added. */
export const products: readonly Product[] = Object.freeze<Product[]>([]);
