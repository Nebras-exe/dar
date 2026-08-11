/**
 * TEST-ONLY product fixtures.
 *
 * The production catalog is intentionally empty (see `./products.ts`). Tests that
 * need to exercise the deterministic query / design / agent / chatbot logic build
 * a synthetic catalog here and inject it via `__setCatalogProductsForTests`. These
 * are clearly-fictional fixtures — never shipped, never referenced by app code.
 *
 * Usage in a test file:
 *   import { __setCatalogProductsForTests, __resetCatalogProductsForTests } from "./queries";
 *   import { sampleCatalog } from "./test-fixtures";
 *   before(() => __setCatalogProductsForTests(sampleCatalog));
 *   after(() => __resetCatalogProductsForTests());
 */

import { colorSwatches } from "./taxonomy";
import type {
  CategorySlug,
  ColorId,
  ColorOption,
  DemoSupplier,
  Dimensions,
  MaterialId,
  Product,
  RoomType,
  StyleTag,
} from "./types";

function colorOptions(ids: ColorId[]): ColorOption[] {
  return ids.map((id) => ({ id, label: colorSwatches[id].label, hex: colorSwatches[id].hex }));
}

export interface FixtureInput {
  slug: string;
  name?: string;
  category: CategorySlug;
  subcategory?: string;
  price: number;
  colors: ColorId[];
  materials: MaterialId[];
  styleTags: StyleTag[];
  roomTypes: RoomType[];
  dimensions?: Partial<Dimensions>;
  customizable?: boolean;
  featuredRank?: number;
  addedAt?: string;
  supplier?: DemoSupplier;
}

/** Build one fully-typed fixture product from a compact spec. */
export function makeProduct(input: FixtureInput): Product {
  const name = input.name ?? input.slug;
  return {
    id: input.slug,
    slug: input.slug,
    name,
    nameAr: `${name} (تجريبي)`,
    description: `Test fixture: ${name}.`,
    descriptionAr: `منتج اختبار: ${name}.`,
    category: input.category,
    subcategory: input.subcategory,
    price: input.price,
    currency: "OMR",
    supplier: input.supplier ?? "Athathi Demo Supplier",
    isDemo: true,
    stockStatus: "in-stock",
    dimensions: {
      widthCm: input.dimensions?.widthCm ?? 100,
      depthCm: input.dimensions?.depthCm ?? 60,
      heightCm: input.dimensions?.heightCm ?? 80,
      ...input.dimensions,
    },
    materials: input.materials,
    colors: colorOptions(input.colors),
    styleTags: input.styleTags,
    roomTypes: input.roomTypes,
    features: [{ en: "Test feature", ar: "ميزة اختبار" }],
    customizable: input.customizable ?? false,
    addedAt: input.addedAt ?? "2026-08-01",
    featuredRank: input.featuredRank,
  };
}

/**
 * A small but representative synthetic catalog: multiple sofas + chairs (for
 * comparison/related), a coffee + dining table, a bed, a rug and a lamp, spanning
 * modern / warm-modern / minimal styles, walnut/beige/grey colours and a spread of
 * prices (for budget maths).
 */
export const sampleCatalog: Product[] = [
  makeProduct({
    slug: "test-modern-sofa",
    name: "Test Modern Sofa",
    category: "sofas",
    price: 300,
    colors: ["beige", "grey", "sage"],
    materials: ["boucle", "linen"],
    styleTags: ["modern", "warm-modern"],
    roomTypes: ["living-room", "majlis"],
    dimensions: { widthCm: 220 },
    customizable: true,
    featuredRank: 0,
  }),
  makeProduct({
    slug: "test-compact-sofa",
    name: "Test Compact Sofa",
    category: "sofas",
    price: 260,
    colors: ["grey", "charcoal"],
    materials: ["linen"],
    styleTags: ["minimal", "contemporary"],
    roomTypes: ["living-room"],
    dimensions: { widthCm: 180 },
    featuredRank: 1,
  }),
  makeProduct({
    slug: "test-walnut-armchair",
    name: "Test Walnut Armchair",
    category: "chairs",
    subcategory: "lounge",
    price: 150,
    colors: ["walnut", "olive"],
    materials: ["walnut", "velvet"],
    styleTags: ["mid-century", "modern", "japandi"],
    roomTypes: ["living-room", "office"],
    dimensions: { widthCm: 70 },
    featuredRank: 2,
  }),
  makeProduct({
    slug: "test-dining-chair",
    name: "Test Dining Chair",
    category: "chairs",
    subcategory: "dining",
    price: 45,
    colors: ["oak", "walnut"],
    materials: ["oak", "ash"],
    styleTags: ["scandinavian", "minimal"],
    roomTypes: ["dining-room"],
    dimensions: { widthCm: 45 },
    featuredRank: 3,
  }),
  makeProduct({
    slug: "test-coffee-table",
    name: "Test Coffee Table",
    category: "coffee-tables",
    price: 120,
    colors: ["walnut", "oak"],
    materials: ["walnut"],
    styleTags: ["warm-modern", "modern"],
    roomTypes: ["living-room", "majlis"],
    dimensions: { widthCm: 110 },
    featuredRank: 4,
  }),
  makeProduct({
    slug: "test-dining-table",
    name: "Test Dining Table",
    category: "dining",
    price: 380,
    colors: ["oak", "walnut"],
    materials: ["oak"],
    styleTags: ["scandinavian", "modern"],
    roomTypes: ["dining-room"],
    dimensions: { widthCm: 180 },
    featuredRank: 5,
  }),
  makeProduct({
    slug: "test-upholstered-bed",
    name: "Test Upholstered Bed",
    category: "beds",
    price: 460,
    colors: ["beige", "grey"],
    materials: ["boucle", "linen"],
    styleTags: ["warm-modern", "contemporary"],
    roomTypes: ["bedroom"],
    dimensions: { widthCm: 165 },
    customizable: true,
    featuredRank: 6,
  }),
  makeProduct({
    slug: "test-wool-rug",
    name: "Test Wool Rug",
    category: "rugs",
    price: 70,
    colors: ["sand", "grey"],
    materials: ["wool"],
    styleTags: ["boho", "warm-modern"],
    roomTypes: ["living-room", "bedroom"],
    dimensions: { widthCm: 240 },
    featuredRank: 7,
  }),
  makeProduct({
    slug: "test-floor-lamp",
    name: "Test Floor Lamp",
    category: "lighting",
    subcategory: "floor",
    price: 65,
    colors: ["brass", "black"],
    materials: ["metal", "brass"],
    styleTags: ["mid-century", "modern"],
    roomTypes: ["living-room", "office"],
    dimensions: { widthCm: 35 },
    featuredRank: 8,
  }),
  // A few cheaper alternatives so replace/cheaper/upgrade have real options.
  makeProduct({
    slug: "test-flatweave-rug",
    name: "Test Flatweave Rug",
    category: "rugs",
    price: 55,
    colors: ["sand", "beige"],
    materials: ["cotton"],
    styleTags: ["minimal", "scandinavian"],
    roomTypes: ["living-room", "bedroom"],
    dimensions: { widthCm: 200 },
    featuredRank: 9,
  }),
  makeProduct({
    slug: "test-jute-rug",
    name: "Test Jute Rug",
    category: "rugs",
    price: 60,
    colors: ["sand", "taupe"],
    materials: ["wool"],
    styleTags: ["warm-modern", "boho"],
    roomTypes: ["living-room", "bedroom"],
    dimensions: { widthCm: 220 },
    featuredRank: 12,
  }),
  makeProduct({
    slug: "test-pendant-light",
    name: "Test Pendant Light",
    category: "lighting",
    subcategory: "pendant",
    price: 40,
    colors: ["brass", "black"],
    materials: ["metal"],
    styleTags: ["modern", "contemporary"],
    roomTypes: ["living-room", "dining-room"],
    dimensions: { widthCm: 30 },
    featuredRank: 10,
  }),
  makeProduct({
    slug: "test-round-coffee-table",
    name: "Test Round Coffee Table",
    category: "coffee-tables",
    price: 95,
    colors: ["oak"],
    materials: ["oak"],
    styleTags: ["scandinavian", "minimal"],
    roomTypes: ["living-room", "majlis"],
    dimensions: { widthCm: 90 },
    featuredRank: 11,
  }),
  makeProduct({
    slug: "test-outdoor-sofa",
    name: "Test Outdoor Sofa",
    category: "outdoor",
    subcategory: "seating",
    price: 340,
    colors: ["grey", "sand"],
    materials: ["teak", "cotton"],
    styleTags: ["contemporary", "minimal"],
    roomTypes: ["outdoor"],
    dimensions: { widthCm: 200 },
    featuredRank: 13,
  }),
];
