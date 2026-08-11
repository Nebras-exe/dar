/**
 * Public repository API surface (Phase 08). Import from `@/lib/repository` so the
 * demo↔Supabase adapter layout can evolve without touching call sites.
 */

export * from "./types";
export * from "./slug";
export * from "./validation";
export {
  demoSuppliers,
  demoSupplierBySlug,
  demoSupplierById,
  demoSupplierByName,
  DEMO_SUPPLIER_NAMES,
} from "./demo-suppliers";
export {
  getPublicSuppliers,
  getSupplierBySlug,
  supplierForProductName,
  type SupplierWithStats,
} from "./suppliers";
export {
  catalogMode,
  repoGetProducts,
  repoGetProductBySlug,
  repoSearchProducts,
  repoGetProductsBySupplier,
} from "./catalog";
