/**
 * Athathi User Memory / Personalization — domain contracts (Phase 13).
 *
 * Memory lets Athathi remember a user's design preferences WITH EXPLICIT CONSENT,
 * so the AI Designer + Agent can offer continuity later. It is strictly OPT-IN
 * (§4), transparent, editable, and removable. Only useful PRODUCT/DESIGN context
 * is stored — NEVER passwords, card/payment data, tokens, secrets, or raw AI
 * reasoning (§5). Every entry carries a SOURCE (provenance) and a confidence
 * (explicit vs suggested); a SUGGESTED preference is never persisted without
 * explicit user approval (§8/§9). Kept free of server/React imports so the types
 * + operations run on the client and in Node tests.
 */

import type { StyleTag, ColorId, MaterialId, RoomType } from "@/lib/catalog";

/** Where a memory came from — provenance the UI can show honestly (§8). */
export type MemorySource =
  | "explicit_user_choice"  // the user directly picked/typed it
  | "style_onboarding"      // seeded from style onboarding (with consent)
  | "approved_design"       // from a design the user approved/added to cart
  | "completed_purchase"    // from a completed order
  | "room_project";         // from a saved room/project

/** Explicit = the user chose it; suggested = inferred, needs approval to persist (§9). */
export type MemoryConfidence = "explicit" | "suggested";

/** One remembered preference value with its provenance. */
export interface MemoryEntry<T extends string = string> {
  value: T;
  source: MemorySource;
  confidence: MemoryConfidence;
  /** When it was saved (epoch ms). */
  at: number;
}

/** A typed budget preference — a RANGE, never one arbitrary "truth" value (§7). */
export interface BudgetPreference {
  typicalMin: number;
  typicalMax: number;
  currency: "OMR";
  source: MemorySource;
  at: number;
}

/** A saved room/design project (§19). Dimensions are only what the user supplied. */
export interface RoomMemory {
  id: string;
  name: string;
  roomType: RoomType;
  style?: StyleTag;
  /** Numeric OMR budget the user gave for this room, if any. */
  budget?: number;
  /** User-supplied dimensions in cm — never inferred/pretended exact (§19). */
  widthCm?: number;
  depthCm?: number;
  heightCm?: number;
  /** Furniture categories the user chose to keep. */
  keptCategories?: string[];
  /** A design id this room is linked to, when relevant. */
  designId?: string;
  source: MemorySource;
  createdAt: number;
  updatedAt: number;
}

/** The opt-in consent state (§4/§37). Two independent switches. */
export interface MemoryConsent {
  /** Master switch — may Athathi store memory at all? */
  enabled: boolean;
  /** May saved memory be used to seed future designs/agent context? */
  useInDesign: boolean;
  updatedAt: number;
}

/**
 * The whole personalization profile for a user. Preference lists are deduplicated
 * by value; only EXPLICIT entries are durable — suggested ones are transient
 * proposals surfaced in the UI, never stored here until approved.
 */
export interface UserMemoryProfile {
  styles: MemoryEntry<StyleTag>[];
  colors: MemoryEntry<ColorId>[];
  materials: MemoryEntry<MaterialId>[];
  budget?: BudgetPreference;
  rooms: RoomMemory[];
  consent: MemoryConsent;
  updatedAt: number;
}

/** The category of a simple (value-list) preference. */
export type MemoryCategory = "style" | "color" | "material";

/**
 * A SAFE context the Agent + design flow may read (§15). Contains ONLY approved
 * preference values — never payment info, secrets, private supplier data, or
 * unnecessary history. Empty when consent is off.
 */
export interface MemoryContext {
  enabled: boolean;
  useInDesign: boolean;
  preferredStyles: StyleTag[];
  preferredColors: ColorId[];
  preferredMaterials: MaterialId[];
  typicalBudget?: { min: number; max: number; currency: "OMR" };
  savedRoomCount: number;
}

/** A suggested preference the Agent proposes — NOT persisted until approved (§8/§17). */
export interface MemorySuggestion {
  category: MemoryCategory;
  value: string;
  /** Why it's suggested (safe, human text) — e.g. "seen in 3 approved designs". */
  reasonKey: string;
}

/** Stable, user-safe error codes for memory operations. */
export type MemoryErrorCode =
  | "consent-disabled"
  | "invalid-value"
  | "invalid-category"
  | "not-owner"
  | "unknown";
