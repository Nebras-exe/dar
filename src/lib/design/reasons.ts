/**
 * Deterministic, bilingual product reasons. Every reason is derived from a real
 * matching condition against the user's input — never generated prose. The
 * strongest condition wins, in this priority: style → colour → material →
 * budget → room fit.
 */

import {
  colorSwatches,
  label,
  materialLabels,
  roomLabels,
  styleLabels,
  type Localized,
  type Product,
} from "@/lib/catalog";
import { getCatalogRoom } from "./room-needs";
import type { DesignInput } from "./types";

function make(en: string, ar: string): Localized {
  return { en, ar };
}

export interface ReasonContext {
  /** True when this product was chosen mainly to fit the remaining budget. */
  budgetDriven?: boolean;
}

export function buildReason(
  product: Product,
  input: DesignInput,
  ctx: ReasonContext = {},
): Localized {
  // Style match (primary, then secondary).
  const matchedStyle =
    (product.styleTags.includes(input.primaryStyle) && input.primaryStyle) ||
    (input.secondaryStyle &&
      product.styleTags.includes(input.secondaryStyle) &&
      input.secondaryStyle);
  if (matchedStyle) {
    const s = styleLabels[matchedStyle];
    return make(
      `Matches your ${label(s, "en")} style.`,
      `يناسب طرازك ${label(s, "ar")}.`,
    );
  }

  // Colour preference match.
  const matchedColor = product.colors.find((c) =>
    input.preferredColors.includes(c.id),
  );
  if (matchedColor) {
    const c = colorSwatches[matchedColor.id];
    return make(
      `Fits your ${label(c.label, "en")} colour preference.`,
      `يناسب لونك المفضّل ${label(c.label, "ar")}.`,
    );
  }

  // Material preference match.
  const matchedMaterial = product.materials.find((m) =>
    input.preferredMaterials.includes(m),
  );
  if (matchedMaterial) {
    const m = materialLabels[matchedMaterial];
    return make(
      `Pairs with ${label(m, "en")} in your materials.`,
      `يتناسق مع ${label(m, "ar")} ضمن خاماتك المفضّلة.`,
    );
  }

  // Budget-driven pick.
  if (ctx.budgetDriven) {
    return make(
      "Chosen to keep the design within budget.",
      "اختير لإبقاء التصميم ضمن ميزانيتك.",
    );
  }

  // Room-fit fallback.
  const room = roomLabels[getCatalogRoom(input.roomType)];
  return make(
    `A strong fit for your ${label(room, "en")}.`,
    `خيار مناسب لـ${label(room, "ar")}.`,
  );
}
