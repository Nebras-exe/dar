/**
 * Render specification builder (DETERMINISTIC).
 *
 * Produces the structured hand-off a FUTURE image-edit provider will consume.
 * Claude prepares the plan; NO image is generated here. The spec preserves the
 * real room (architecture, kept furniture, perspective) and lists the exact real
 * products to insert, plus hard negative constraints — so a later provider edits
 * the photo faithfully instead of hallucinating a new room.
 */

import { designFingerprint } from "@/lib/visualization";
import type { RoomAnalysis } from "@/lib/vision";
import type { CatalogSelection, DesignBrief, RenderSpec } from "./types";

/** Stable negative-constraint keys (the UI/provider renders friendly text). */
export const NEGATIVE_CONSTRAINTS = [
  "do_not_remove_windows",
  "do_not_move_doors",
  "do_not_change_floor",
  "do_not_change_architecture",
  "do_not_invent_extra_furniture",
  "do_not_change_selected_product_colour",
  "preserve_camera_perspective",
] as const;

export function buildRenderSpec(
  roomImageRef: string,
  analysis: RoomAnalysis,
  brief: DesignBrief,
  selections: CatalogSelection[],
  primaryStyle: string,
  secondaryStyle: string | undefined,
): RenderSpec {
  const fingerprint = designFingerprint({
    roomType: analysis.roomType === "unknown" ? "living-room" : analysis.roomType,
    primaryStyle,
    secondaryStyle,
    items: selections.map((s) => ({ slug: s.slug, colorId: s.colorId })),
  });

  return {
    roomImageRef,
    preserveArchitecture: analysis.architecturalFeatures.map(String),
    preserveExistingFurniture: analysis.existingFurniture
      .filter((f) => f.suggestion === "keep" && f.category)
      .map((f) => f.category as string),
    insertProducts: selections.map((s) => ({
      slug: s.slug,
      category: s.category,
      ...(s.colorId ? { colorId: s.colorId } : {}),
      ...(s.imageRef ? { imageRef: s.imageRef } : {}),
    })),
    primaryStyle: primaryStyle as RenderSpec["primaryStyle"],
    ...(secondaryStyle ? { secondaryStyle: secondaryStyle as RenderSpec["secondaryStyle"] } : {}),
    paletteColors: brief.preferredColors,
    negativeConstraints: [...NEGATIVE_CONSTRAINTS],
    designFingerprint: fingerprint,
  };
}
