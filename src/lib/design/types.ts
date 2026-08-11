/**
 * Athathi AI Designer — domain contracts (Phase 04).
 *
 * These types describe the *structured* input and output of the design
 * experience. Demo Mode produces a `DesignRecommendation` today; a future AI
 * agent will produce the SAME shape — the result UI consumes structured data,
 * never raw model prose. Kept free of React/UI imports so the recommendation
 * engine runs in a Server Component, a Node test, or a future agent tool.
 */

import type {
  CategorySlug,
  ColorId,
  Localized,
  MaterialId,
  StyleTag,
} from "@/lib/catalog";

/**
 * Room types offered by the wizard. A superset of the catalog's `RoomType`
 * (adds `kids-room`), each mapped to a catalog room for filtering.
 */
export type DesignRoomType =
  | "living-room"
  | "bedroom"
  | "majlis"
  | "dining-room"
  | "office"
  | "kids-room"
  | "outdoor";

/** What the user wants to do with a piece they may already own. */
export type FurnitureDisposition = "keep" | "replace" | "unsure";

/** A per-category decision about existing furniture (chosen by the user). */
export interface FurnitureDecision {
  category: CategorySlug;
  disposition: FurnitureDisposition;
}

/** The complete, structured input a recommendation is computed from. */
export interface DesignInput {
  roomType: DesignRoomType;
  /** Numeric budget in OMR. Never a formatted string. */
  budget: number;
  primaryStyle: StyleTag;
  secondaryStyle?: StyleTag;
  preferredColors: ColorId[];
  preferredMaterials: MaterialId[];
  /** Per-category keep/replace decisions (only categories the user touched). */
  decisions: FurnitureDecision[];
  /** Optional free-text note — stored as user input only, not interpreted. */
  note?: string;
  /** Display-only name of an uploaded room image (image itself never leaves the browser). */
  imageName?: string;
}

/** The three deterministic budget tiers. */
export type DesignTier = "smart-saver" | "balanced" | "premium";

/** One recommended product within a design, resolved from the catalog by slug. */
export interface DesignItem {
  /** Catalog slug — the single source of product truth (price/name resolved live). */
  slug: string;
  category: CategorySlug;
  /** Default colour variant to add to cart. */
  colorId?: ColorId;
  /** Deterministic, bilingual reason this product was chosen. */
  reason: Localized;
}

/** A furniture category the user chose to keep (adds no cost). */
export interface KeptCategory {
  category: CategorySlug;
}

/** Numeric budget breakdown — all values derived from catalog prices. */
export interface BudgetSummary {
  budget: number;
  newFurnitureTotal: number;
  remaining: number;
  /** > 0 only when even the leanest essential bundle exceeds the budget. */
  overBudget: number;
  keptCount: number;
  itemCount: number;
}

/** One complete design option at a given tier. */
export interface DesignOption {
  tier: DesignTier;
  items: DesignItem[];
  kept: KeptCategory[];
  summary: BudgetSummary;
}

/** The full recommendation: the input, all tiers, and a recommended default. */
export interface DesignRecommendation {
  input: DesignInput;
  options: DesignOption[];
  /** Tier recommended by default (the richest option that stays in budget). */
  recommendedTier: DesignTier;
  /** Deterministic progress steps shown honestly in Demo Mode. */
  demoSteps: Localized[];
}

/** Replacement intents for a single item on the result page. */
export type ReplacementMode = "cheaper" | "similar" | "upgrade";
