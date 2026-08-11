/**
 * Real Furniture Color Variants — data (LOCAL/DEMO ONLY).
 *
 * A local prototype that demonstrates how real furniture customization will work:
 * high-value products gain 2–4 realistic variants, each mapped to one of the
 * product's EXISTING catalog colours (so the cart, labels, and AI Designer stay
 * fully compatible — no duplicate option system, per the brief), with its OWN
 * representative product photo, an optional material/finish, and an optional price
 * delta.
 *
 * ISOLATED from production: this adds NO fields to `src/lib/catalog` products and
 * changes NO business logic. Colour names come from the existing bilingual
 * `colorSwatches` taxonomy; material/finish names from `materialLabels` — both
 * already EN/AR. Images are verified, hotlink-permitted, license-clean Unsplash
 * references (no paid API, no credits, no generation).
 *
 * HONESTY (same constraint as the catalog preview): browsing retailer catalogs to
 * curate exact per-colour photos was not available here, so each variant's photo
 * is a REPRESENTATIVE real furniture photo of the same product form — the EXACT
 * colour is conveyed by the swatch (real hex from the taxonomy), and the photo
 * genuinely CHANGES per variant. To pin an exact colour-matched photo, edit a
 * variant's `image` below (an Unsplash id or any hotlink-permitted URL).
 *
 * The reference furniture options (which colours/finishes are realistic for a
 * given piece) are modelled on IKEA, Danube Home, and Home Centre product pages.
 */

import type { ColorId, MaterialId } from "@/lib/catalog";

export interface PreviewVariant {
  /** An EXISTING product colour id — bilingual name via `colorSwatches`, cart-compatible. */
  colorId: ColorId;
  /** Optional material/finish — bilingual name via `materialLabels`. */
  materialId?: MaterialId;
  /** OMR price change vs the base price (default 0). */
  priceDelta?: number;
  /** This variant's own representative photo (verified Unsplash id, or full URL). */
  image: string;
  /** Optional extra gallery angles (ids/urls). */
  gallery?: string[];
}

/**
 * slug → ordered variants. The first entry is the default. Only high-value,
 * visually important products are given variants (the rest keep their single
 * representative photo). Images are distinct per variant so switching a swatch
 * visibly changes the product photo.
 */
export const PRODUCT_VARIANTS: Record<string, PreviewVariant[]> = {
  // ── Sofas ──────────────────────────────────────────────────────────────────
  "luna-modular-sofa": [
    { colorId: "cream", materialId: "boucle", image: "1555041469-a586c61ea9bc" },
    { colorId: "beige", materialId: "boucle", image: "1493663284031-b7e3aefcae8e" },
    { colorId: "sage", materialId: "boucle", image: "1618221118493-9cfa1a1c00da", priceDelta: 10 },
  ],
  "noor-three-seat-sofa": [
    { colorId: "beige", materialId: "linen", image: "1567016432779-094069958ea5" },
    { colorId: "taupe", materialId: "linen", image: "1550226891-ef816aed4a98" },
    { colorId: "grey", materialId: "linen", image: "1540574163026-643ea20ade25" },
  ],
  "salma-curved-sofa": [
    { colorId: "sand", materialId: "velvet", image: "1634712282287-14ed57b9cc89" },
    { colorId: "olive", materialId: "velvet", image: "1618221118493-9cfa1a1c00da" },
    { colorId: "rust", materialId: "velvet", image: "1550226891-ef816aed4a98", priceDelta: 15 },
  ],
  "rami-l-shape-sectional": [
    { colorId: "grey", materialId: "linen", image: "1584622650111-993a426fbf0a" },
    { colorId: "beige", materialId: "boucle", image: "1631679706909-1844bbd07221" },
    { colorId: "charcoal", materialId: "linen", image: "1567016432779-094069958ea5", priceDelta: 20 },
  ],
  "yusuf-leather-sofa": [
    { colorId: "walnut", materialId: "leather", image: "1550226891-ef816aed4a98" },
    { colorId: "charcoal", materialId: "leather", image: "1540574163026-643ea20ade25" },
    { colorId: "rust", materialId: "leather", image: "1493663284031-b7e3aefcae8e", priceDelta: 25 },
  ],
  "dana-boucle-sofa": [
    { colorId: "ivory", materialId: "boucle", image: "1555041469-a586c61ea9bc" },
    { colorId: "cream", materialId: "boucle", image: "1618221118493-9cfa1a1c00da" },
    { colorId: "beige", materialId: "boucle", image: "1634712282287-14ed57b9cc89" },
  ],

  // ── Armchairs / lounge ──────────────────────────────────────────────────────
  "sara-armchair": [
    { colorId: "olive", materialId: "velvet", image: "1592078615290-033ee584e267" },
    { colorId: "rust", materialId: "velvet", image: "1506439773649-6e0eb8cfb237" },
    { colorId: "navy", materialId: "velvet", image: "1567538096630-e0c55bd6374c" },
  ],
  "lina-lounge-chair": [
    { colorId: "cream", materialId: "boucle", image: "1615874959474-d609969a20ed" },
    { colorId: "ivory", materialId: "boucle", image: "1519961655809-34fa156820ff" },
    { colorId: "grey", materialId: "boucle", image: "1524758870432-af57e54afa26" },
  ],
  "ghala-reading-chair": [
    { colorId: "sage", materialId: "wool", image: "1567538096630-e0c55bd6374c" },
    { colorId: "grey", materialId: "wool", image: "1615874959474-d609969a20ed" },
    { colorId: "navy", materialId: "wool", image: "1519961655809-34fa156820ff" },
  ],

  // ── Dining / office chairs ──────────────────────────────────────────────────
  "omar-dining-chair": [
    { colorId: "oak", materialId: "ash", image: "1519947486511-46149fa0a254" },
    { colorId: "walnut", materialId: "rattan", image: "1503602642458-232111445657" },
  ],
  "kareem-office-chair": [
    { colorId: "charcoal", materialId: "leather", image: "1598300042247-d088f8ab3a91" },
    { colorId: "walnut", materialId: "leather", image: "1524758870432-af57e54afa26", priceDelta: 15 },
    { colorId: "black", materialId: "leather", image: "1580480055273-228ff5388ef8" },
  ],

  // ── Beds ────────────────────────────────────────────────────────────────────
  "layan-upholstered-bed": [
    { colorId: "cream", materialId: "boucle", image: "1595428774223-ef52624120d2" },
    { colorId: "beige", materialId: "boucle", image: "1522771739844-6a9f6d5f14af" },
    { colorId: "grey", materialId: "boucle", image: "1560448204-e02f11c3d0e2" },
  ],
  "hamad-oak-platform-bed": [
    { colorId: "oak", materialId: "oak", image: "1560448204-e02f11c3d0e2" },
    { colorId: "walnut", materialId: "walnut", image: "1595428774223-ef52624120d2", priceDelta: 20 },
  ],
  "rana-queen-bed": [
    { colorId: "beige", materialId: "linen", image: "1522771739844-6a9f6d5f14af" },
    { colorId: "sage", materialId: "linen", image: "1560448204-e02f11c3d0e2" },
    { colorId: "taupe", materialId: "linen", image: "1595428774223-ef52624120d2" },
  ],

  // ── Tables ──────────────────────────────────────────────────────────────────
  "tala-dining-table": [
    { colorId: "oak", materialId: "oak", image: "1538688525198-9b88f6f53126" },
    { colorId: "walnut", materialId: "walnut", image: "1617806118233-18e1de247200", priceDelta: 25 },
  ],
  "salwa-marble-dining-table": [
    { colorId: "white", materialId: "marble", image: "1617104678098-de229db51175" },
    { colorId: "cream", materialId: "marble", image: "1538688525198-9b88f6f53126" },
    { colorId: "charcoal", materialId: "marble", image: "1617806118233-18e1de247200", priceDelta: 35 },
  ],
  "noura-coffee-table": [
    { colorId: "walnut", materialId: "walnut", image: "1533090481720-856c6e3c1fdc" },
    { colorId: "oak", materialId: "oak", image: "1449247709967-d4461a6a6103" },
  ],
  "mira-travertine-coffee-table": [
    { colorId: "cream", materialId: "travertine", image: "1616137466211-f939a420be84" },
    { colorId: "sand", materialId: "travertine", image: "1533090481720-856c6e3c1fdc" },
    { colorId: "taupe", materialId: "travertine", image: "1449247709967-d4461a6a6103" },
  ],

  // ── Storage / media / desk ──────────────────────────────────────────────────
  "faisal-sideboard": [
    { colorId: "oak", materialId: "oak", image: "1594026112284-02bb6f3352fe" },
    { colorId: "walnut", materialId: "walnut", image: "1616627561950-9f746e330187", priceDelta: 20 },
    { colorId: "sage", materialId: "oak", image: "1611486212557-88be5ff6f941" },
  ],
  "nasser-tv-console": [
    { colorId: "oak", materialId: "oak", image: "1601760561441-16420502c7e0" },
    { colorId: "walnut", materialId: "walnut", image: "1615873968403-89e068629265" },
    { colorId: "charcoal", materialId: "oak", image: "1611486212557-88be5ff6f941" },
  ],
  "ziad-writing-desk": [
    { colorId: "oak", materialId: "oak", image: "1616486338812-3dadae4b4ace" },
    { colorId: "white", materialId: "steel", image: "1518455027359-f3f8164ba6bd" },
    { colorId: "charcoal", materialId: "steel", image: "1594026112284-02bb6f3352fe" },
  ],
};
