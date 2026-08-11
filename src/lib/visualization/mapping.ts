/**
 * Pure, client-safe mapping between the Phase 04 design state and a structured
 * `VisualizationRequest` (Phase 07). The client builds the request from data it
 * already holds; the server re-validates everything. No React / server imports.
 */

import { getProductBySlug, type CategorySlug } from "@/lib/catalog";
import type { DesignInput, DesignItem } from "@/lib/design";
import { designFingerprint } from "./fingerprint";
import type { VisualizationItemRef, VisualizationRequest } from "./types";

/** Resolve design items to real catalog products (dropping any that vanished). */
export function designItemsToRefs(items: readonly DesignItem[]): VisualizationItemRef[] {
  const refs: VisualizationItemRef[] = [];
  for (const item of items) {
    const product = getProductBySlug(item.slug);
    if (!product) continue;
    refs.push({
      slug: product.slug,
      category: product.category,
      colorId: item.colorId,
    });
  }
  return refs;
}

/** The current design's fingerprint, from the working item set + input. */
export function currentDesignFingerprint(
  input: DesignInput,
  items: readonly DesignItem[],
): string {
  return designFingerprint({
    roomType: input.roomType,
    primaryStyle: input.primaryStyle,
    secondaryStyle: input.secondaryStyle,
    items: designItemsToRefs(items).map((r) => ({ slug: r.slug, colorId: r.colorId })),
  });
}

/** Build the structured request the client POSTs to /api/visualization/generate. */
export function buildVisualizationRequest(
  input: DesignInput,
  items: readonly DesignItem[],
  locale: "en" | "ar",
): VisualizationRequest {
  const refs = designItemsToRefs(items);
  const keep: CategorySlug[] = [];
  const replace: CategorySlug[] = [];
  for (const decision of input.decisions) {
    if (decision.disposition === "keep") keep.push(decision.category);
    else if (decision.disposition === "replace") replace.push(decision.category);
  }

  return {
    locale,
    roomType: input.roomType,
    primaryStyle: input.primaryStyle,
    secondaryStyle: input.secondaryStyle,
    items: refs,
    keep,
    replace,
    paletteColors: input.preferredColors,
    designFingerprint: designFingerprint({
      roomType: input.roomType,
      primaryStyle: input.primaryStyle,
      secondaryStyle: input.secondaryStyle,
      items: refs.map((r) => ({ slug: r.slug, colorId: r.colorId })),
    }),
    options: { preserveArchitecture: true },
  };
}
