/**
 * Demo visualization provider (Phase 07, §6/§7).
 *
 * When no real image-generation credential is configured, Athathi does NOT
 * pretend an AI render occurred. Instead this provider builds a DETERMINISTIC
 * composition scheme from the validated request — real catalog products, a
 * floor plan built from their REAL dimensions and the user's room size, and a
 * mood palette derived from the design's own colours — which the client renders
 * honestly OVER the room photo as a clearly-labelled "Demo Preview".
 *
 * It never looks at the room image, calls no network, and reads no secrets. The
 * result is stable: same design → same scheme.
 */

import { colorSwatches } from "@/lib/catalog";
import { getProductBySlug } from "@/lib/catalog";
import { canonicalDesignString } from "../fingerprint";
import { planRoomLayout } from "../layout";
import type { DemoScheme, VisualizationRequest } from "../types";
import type { ProviderOutput, VisualizationProvider } from "./types";

/** FNV-1a 32-bit → unsigned int, for deterministic scheme derivation. */
function seedFrom(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Build the deterministic composition scheme (pure, exported for tests). */
export function buildDemoScheme(request: VisualizationRequest): DemoScheme {
  const seed = seedFrom(canonicalDesignString({
    roomType: request.roomType,
    primaryStyle: request.primaryStyle,
    secondaryStyle: request.secondaryStyle,
    items: request.items.map((i) => ({ slug: i.slug, colorId: i.colorId })),
  }));

  // Mood palette: the user's preferred catalog colours first, then the dominant
  // swatches of the featured products — all REAL catalog hex values, de-duped.
  const palette: string[] = [];
  const pushHex = (hex: string | undefined) => {
    if (hex && !palette.includes(hex) && palette.length < 6) palette.push(hex);
  };
  for (const colorId of request.paletteColors) pushHex(colorSwatches[colorId]?.hex);
  for (const item of request.items) {
    const product = getProductBySlug(item.slug);
    if (!product) continue;
    const chosen = item.colorId
      ? product.colors.find((c) => c.id === item.colorId)
      : product.colors[0];
    pushHex(chosen?.hex ?? product.colors[0]?.hex);
  }
  // A warm neutral fallback so the wash always has something to work with.
  if (palette.length === 0) palette.push("#E3D4BD");

  return {
    items: request.items,
    palette,
    overlayAngle: seed % 360,
    // A restrained wash (0.14–0.30) so the room stays clearly visible.
    washStrength: 0.14 + ((seed >> 9) % 17) / 100,
    // The floor plan the client draws over the photo: real catalog dimensions
    // arranged in the user's own room footprint (or a labelled default).
    plan: planRoomLayout(request.roomType, request.items, request.roomSpace),
  };
}

export const demoVisualizationProvider: VisualizationProvider = {
  name: "demo",
  model: "demo-composition",
  isConfigured: () => true,
  async generate(request: VisualizationRequest): Promise<ProviderOutput> {
    return { kind: "demo-composition", scheme: buildDemoScheme(request) };
  },
};
