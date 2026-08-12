/**
 * Demo supplier records (Phase 08). These give the Phase 03 demo catalog a
 * structured supplier layer WITHOUT claiming any real business exists: every one
 * is `isDemo: true`, `verified: false`, and clearly labelled "Sample / Demo" in
 * the UI (§7/§35). Product↔supplier attribution reuses the existing
 * `Product.supplier` name, so no data is duplicated.
 */

import type { DemoSupplier } from "@/lib/catalog";
import type { Supplier } from "./types";

/** The three demo supplier names used across the Phase 03 catalog. */
export const DEMO_SUPPLIER_NAMES: DemoSupplier[] = [
  "DAR Studio Collection",
  "DAR Demo Supplier",
  "Demo Furniture Lab",
];

export const demoSuppliers: Supplier[] = [
  {
    id: "demo-athathi-studio",
    slug: "athathi-studio-collection",
    name: "DAR Studio Collection",
    nameAr: "مجموعة استوديو دار",
    description:
      "A sample in-house collection used to demonstrate the DAR marketplace. Not a real supplier.",
    descriptionAr:
      "مجموعة داخلية نموذجية لعرض سوق دار. ليست مورّداً حقيقياً.",
    location: "Muscat",
    locationAr: "مسقط",
    type: "studio",
    status: "active",
    verified: false,
    isDemo: true,
    createdAt: "2026-08-01",
    capabilities: {
      acceptsCustom: true,
      customCategories: ["sofas", "chairs", "coffee-tables", "tv-units"],
      materials: ["boucle", "linen", "velvet", "wool", "oak", "walnut"],
      serviceRegions: ["Muscat", "Seeb"],
      leadTimeDaysMin: 10,
      leadTimeDaysMax: 21,
    },
  },
  {
    id: "demo-athathi-supplier",
    slug: "athathi-demo-supplier",
    name: "DAR Demo Supplier",
    nameAr: "مورّد دار التجريبي",
    description:
      "A sample supplier account demonstrating the supplier dashboard and product tools.",
    descriptionAr:
      "حساب مورّد نموذجي لعرض لوحة تحكم المورّد وأدوات المنتجات.",
    location: "Sohar",
    locationAr: "صحار",
    type: "showroom",
    status: "active",
    verified: false,
    isDemo: true,
    createdAt: "2026-08-02",
    capabilities: {
      acceptsCustom: true,
      customCategories: ["beds", "storage", "wardrobes", "desks", "dining"],
      materials: ["oak", "walnut", "ash", "teak", "leather", "linen"],
      serviceRegions: ["Sohar", "Muscat", "Barka"],
      leadTimeDaysMin: 14,
      leadTimeDaysMax: 30,
    },
  },
  {
    id: "demo-furniture-lab",
    slug: "demo-furniture-lab",
    name: "Demo Furniture Lab",
    nameAr: "مختبر الأثاث التجريبي",
    description:
      "A sample workshop used to show made-to-order and customizable pieces. Not a real workshop.",
    descriptionAr:
      "ورشة نموذجية لعرض القطع حسب الطلب والقابلة للتخصيص. ليست ورشة حقيقية.",
    location: "Nizwa",
    locationAr: "نزوى",
    type: "workshop",
    status: "active",
    verified: false,
    isDemo: true,
    createdAt: "2026-08-03",
    capabilities: {
      acceptsCustom: true,
      customCategories: ["dining", "coffee-tables", "desks", "storage", "tv-units", "chairs"],
      materials: ["oak", "walnut", "teak", "ash", "metal", "marble", "glass"],
      serviceRegions: ["Nizwa", "Muscat", "Bahla"],
      leadTimeDaysMin: 7,
      leadTimeDaysMax: 18,
    },
  },
];

const byName = new Map<string, Supplier>(demoSuppliers.map((s) => [s.name, s]));
const bySlug = new Map<string, Supplier>(demoSuppliers.map((s) => [s.slug, s]));
const byId = new Map<string, Supplier>(demoSuppliers.map((s) => [s.id, s]));

export function demoSupplierByName(name: string): Supplier | undefined {
  return byName.get(name);
}
export function demoSupplierBySlug(slug: string): Supplier | undefined {
  return bySlug.get(slug);
}
export function demoSupplierById(id: string): Supplier | undefined {
  return byId.get(id);
}
