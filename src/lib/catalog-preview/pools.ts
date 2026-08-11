/**
 * Real Catalog Preview — verified image pools (LOCAL/DEMO ONLY).
 *
 * This module is ISOLATED from the production catalog (`src/lib/catalog`): it adds
 * NO fields to any product and changes NO business logic. It only supplies
 * representative, real-world furniture photography for LOCAL visual evaluation of
 * how Athathi looks with real product photos instead of the generated studio art.
 *
 * Source: Unsplash (Unsplash License — free for commercial + non-commercial use,
 * no permission or attribution required; hotlinking the Unsplash CDN is permitted).
 * No paid API, no image-generation, no credits. No access controls are bypassed.
 *
 * HONESTY: these are REPRESENTATIVE, category/subcategory-accurate references —
 * NOT exact per-product retailer photos (browsing retailer catalogs to curate
 * exact photos was not available in this environment). Every id below was
 * HTTP-verified to return a live `image/jpeg` from the Unsplash CDN. Each id is
 * used in a single pool so the subject stays category-correct (a chair pool never
 * feeds a sofa). Products whose "kind" has no confident pool fall back to the
 * existing category-accurate generated art — so the preview is never broken and
 * never wildly off-subject. To pin an EXACT photo for a product, add its slug to
 * `PREVIEW_OVERRIDES` in `overrides.ts` (no code change needed).
 */

/** Pool key → verified Unsplash photo ids. Each id lives in exactly one pool. */
export const PREVIEW_POOLS: Record<string, string[]> = {
  // Seating
  sofa: [
    "1555041469-a586c61ea9bc",
    "1493663284031-b7e3aefcae8e",
    "1567016432779-094069958ea5",
    "1550226891-ef816aed4a98",
    "1540574163026-643ea20ade25",
  ],
  sectional: [
    "1584622650111-993a426fbf0a",
    "1631679706909-1844bbd07221",
  ],
  armchair: [
    "1592078615290-033ee584e267",
    "1506439773649-6e0eb8cfb237",
    "1567538096630-e0c55bd6374c",
  ],
  "dining-chair": [
    "1519947486511-46149fa0a254",
    "1503602642458-232111445657",
    "1580480055273-228ff5388ef8",
  ],
  "office-chair": [
    "1598300042247-d088f8ab3a91",
  ],
  stool: [
    "1503431128871-cd250803fa41",
  ],

  // Tables
  "coffee-table": [
    "1533090481720-856c6e3c1fdc",
    "1449247709967-d4461a6a6103",
  ],
  "side-table": [
    "1499933374294-4584851497cc",
  ],
  "dining-table": [
    "1538688525198-9b88f6f53126",
    "1617806118233-18e1de247200",
  ],
  desk: [
    "1616486338812-3dadae4b4ace",
    "1518455027359-f3f8164ba6bd",
  ],

  // Bedroom
  bed: [
    "1595428774223-ef52624120d2",
    "1522771739844-6a9f6d5f14af",
  ],
  nightstand: [
    "1532372320572-cda25653a26d",
    "1595515106969-1ce29566ff1c",
  ],
  wardrobe: [
    "1610701596007-11502861dcfa",
  ],

  // Storage
  sideboard: [
    "1594026112284-02bb6f3352fe",
    "1616627561950-9f746e330187",
  ],
  bookshelf: [
    "1594620302200-9a762244a156",
    "1507842217343-583bb7270b66",
  ],
  cabinet: [
    "1558997519-83ea9252edf8",
  ],
  "tv-unit": [
    "1601760561441-16420502c7e0",
    "1615873968403-89e068629265",
  ],

  // Surfaces / decor with confident references
  rug: [
    "1524758631624-e2822e304c36",
    "1600166898405-da9535204843",
  ],
  mirror: [
    "1618220179428-22790b461013",
    "1596079890744-c1a0462d0975",
  ],
  lighting: [
    "1507473885765-e6ed057f782c",
    "1517705008128-361805f42e86",
    "1540932239986-30128078f3c5",
  ],

  // Outdoor
  "outdoor-sofa": [
    "1600210492486-724fe5c67fb0",
    "1595429035839-c99c298ffdde",
  ],
  // Generic styled interior — used only where a more specific pool isn't confident.
  interior: [
    "1600607687920-4e2a09cf159d",
  ],
};

/** Every id, for the QA/verification report. */
export const ALL_PREVIEW_IDS: string[] = Object.values(PREVIEW_POOLS).flat();
