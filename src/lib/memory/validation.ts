/**
 * Memory value validation (Phase 13). A stored preference must be a REAL taxonomy
 * value — the Agent (or a tampered client) can never persist an invented
 * "preference" as a fact (§8). Thin wrappers over the catalog taxonomy guards.
 */

import { isStyleTag, isColorId, isMaterialId } from "@/lib/catalog";
import type { MemoryCategory } from "./types";

/** Is `value` a valid value for `category`? */
export function isValidMemoryValue(category: MemoryCategory, value: unknown): boolean {
  if (typeof value !== "string") return false;
  switch (category) {
    case "style": return isStyleTag(value);
    case "color": return isColorId(value);
    case "material": return isMaterialId(value);
    default: return false;
  }
}

export function isMemoryCategory(v: unknown): v is MemoryCategory {
  return v === "style" || v === "color" || v === "material";
}
