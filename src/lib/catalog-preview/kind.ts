/**
 * Real Catalog Preview — map an Athathi product to a photo pool "kind" (LOCAL ONLY).
 *
 * Derives the pool key from the product's real `category` + `subcategory` so the
 * reference stays category/subcategory-accurate (dining chairs → the dining-chair
 * pool, pendants → the lighting pool, sectionals → the sectional pool, …). Returns
 * `null` for kinds where no confident real-photo pool exists (small decor: vases,
 * cushions/throws, wall art, trays, planters) — those keep the existing
 * category-accurate generated art, so the preview never shows a wrong subject.
 */

import type { CategorySlug } from "@/lib/catalog";

export interface PreviewKindInput {
  category: CategorySlug;
  subcategory?: string;
}

/** The pool key for a product, or null to fall back to generated art. */
export function referenceKind({ category, subcategory }: PreviewKindInput): string | null {
  const sub = subcategory ?? "";
  switch (category) {
    case "sofas":
      if (sub === "sectional") return "sectional";
      // modular / majlis floor sofas / loveseats / daybeds → the sofa pool.
      return "sofa";

    case "chairs":
      if (sub === "dining") return "dining-chair";
      if (sub === "office") return "office-chair";
      if (sub === "stool") return "stool";
      // accent / lounge / reading → armchair.
      return "armchair";

    case "coffee-tables":
      return "coffee-table"; // incl. nesting

    case "side-tables":
      if (sub === "nightstand") return "nightstand";
      return "side-table";

    case "dining":
      return "dining-table";

    case "beds":
      return "bed";

    case "desks":
      return "desk";

    case "wardrobes":
      return "wardrobe";

    case "tv-units":
      return "tv-unit";

    case "storage":
      if (sub === "sideboard") return "sideboard";
      if (sub === "shelving") return "bookshelf";
      if (sub === "cabinet") return "cabinet";
      if (sub === "dresser") return "nightstand"; // closest confident bedroom-storage match
      return "sideboard";

    case "rugs":
      return "rug";

    case "mirrors":
      return "mirror";

    case "lighting":
      // pendant / floor / table / wall sconce → the lighting pool.
      return "lighting";

    case "outdoor":
      if (sub === "table") return "interior"; // no confident outdoor-table pool → styled interior
      if (sub === "decor") return null; // planters → generated art
      return "outdoor-sofa"; // seating / loungers

    case "decor":
      // Vases, cushions/throws, wall art, trays: keep the generated art (no
      // confident, category-exact real-photo pool; avoids a wrong-subject photo).
      return null;

    default:
      return null;
  }
}
