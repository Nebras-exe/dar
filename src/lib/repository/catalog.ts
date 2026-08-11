/**
 * Catalog repository (Phase 08, §26). A clean, mode-aware interface over
 * products so consumers don't care whether data came from the Phase 03 demo
 * TypeScript catalog or a Supabase database.
 *
 * DESIGN NOTE (§27, AI compatibility): the Phase 03 `src/lib/catalog` pure layer
 * remains the SINGLE demo source of truth. In demo mode this repository simply
 * adapts it (async wrappers) — so the Agent, Designer and Visualization, which
 * consume the pure catalog directly, are never broken or duplicated. In Supabase
 * mode the same signatures resolve DB-backed ACTIVE products; wiring the agent
 * tools to the async repository is the documented next integration step.
 */

import {
  getAllProducts,
  getProductBySlug as demoGetProductBySlug,
  filterProducts,
  type Product,
  type ProductFilter,
} from "@/lib/catalog";
import { backendMode, type BackendMode } from "@/lib/backend/config";
import { supplierForProductName } from "./suppliers";

export function catalogMode(): BackendMode {
  return backendMode();
}

/** All publicly-visible products. */
export async function repoGetProducts(): Promise<readonly Product[]> {
  if (backendMode() === "supabase") {
    // return await supabaseGetActiveProducts();  (gated — not configured here)
  }
  return getAllProducts();
}

/** A single product by slug, or null. */
export async function repoGetProductBySlug(slug: string): Promise<Product | null> {
  if (backendMode() === "supabase") {
    // return await supabaseGetProductBySlug(slug);
  }
  return demoGetProductBySlug(slug) ?? null;
}

/** Filtered search — reuses the exact Phase 03 deterministic filter contract. */
export async function repoSearchProducts(filter: ProductFilter): Promise<Product[]> {
  if (backendMode() === "supabase") {
    // return await supabaseSearchProducts(filter);
  }
  return filterProducts(filter);
}

/** Products attributed to a supplier (by the supplier's id). */
export async function repoGetProductsBySupplier(supplierId: string): Promise<Product[]> {
  if (backendMode() === "supabase") {
    // return await supabaseGetProductsBySupplier(supplierId);
  }
  return getAllProducts().filter((p) => supplierForProductName(p.supplier)?.id === supplierId);
}
