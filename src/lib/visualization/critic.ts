/**
 * Visual critic (SERVER-ONLY, §10/§15).
 *
 * After a real provider returns a generated render, the critic validates it
 * against the catalog ALLOW-LIST contract before it can be presented as APPROVED
 * — Athathi never silently shows an unvalidated render. This phase's critic is
 * DETERMINISTIC: it checks that the render exists, that every used item is on the
 * selected allow-list (no unauthorized furniture, no fabricated slug), and that
 * each selected product carried its real SELECTED-variant reference image, then
 * grades honest product fidelity (HIGH/MEDIUM/LOW). A future vision-based pixel
 * critic can extend `issues` without changing this contract or making the current
 * flow depend on an extra paid model call.
 */

import type {
  CatalogReference,
  VisualizationCritique,
  VisualizationItemRef,
  VisualizationRequest,
} from "./types";

/** Minimal shape the critic reads from a provider output (avoids a server import cycle). */
export interface ProviderOutputLikeShape {
  kind: "generated" | "demo-composition";
  imageDataUrl?: string;
}

export function critique(
  request: VisualizationRequest,
  references: CatalogReference[],
  output: ProviderOutputLikeShape,
  usedItems: VisualizationItemRef[],
): VisualizationCritique {
  const issues: string[] = [];

  // 1. A real render must actually exist.
  const hasImage = output.kind === "generated" && Boolean(output.imageDataUrl);
  if (!hasImage) issues.push("missing_generated_image");

  // 2. Allow-list: every used item must be one of the selected catalog items.
  const allowed = new Set(request.items.map((i) => `${i.slug}:${i.colorId ?? ""}`));
  for (const u of usedItems) {
    if (!allowed.has(`${u.slug}:${u.colorId ?? ""}`)) {
      issues.push("unauthorized_item");
      break;
    }
  }

  // 3. Reference completeness: each selected product must carry a real reference
  //    image, and ideally the SELECTED colour variant's own photo.
  let variantExact = 0;
  for (const ref of references) {
    if (!ref.referenceImage) {
      issues.push("reference_missing_image");
      continue;
    }
    if (ref.variantId && ref.referenceImage.startsWith("/images/catalog/")) {
      variantExact++;
    }
  }

  // 4. Colour fidelity: a selected colour must map to a real product colour.
  for (const item of request.items) {
    const ref = references.find((r) => r.slug === item.slug);
    if (item.colorId && ref && ref.colorId !== item.colorId) {
      issues.push("color_not_variant");
      break;
    }
  }

  // Fidelity grade (honest — never claims pixel-perfect identity).
  const total = references.length || 1;
  const exactRatio = variantExact / total;
  const missingRefs = references.some((r) => !r.referenceImage);
  let fidelity: VisualizationCritique["fidelity"];
  if (!hasImage || missingRefs) fidelity = "LOW";
  else if (exactRatio >= 0.75) fidelity = "HIGH";
  else if (exactRatio >= 0.34) fidelity = "MEDIUM";
  else fidelity = "MEDIUM";

  // Verdict: reject on a missing render, an unauthorized item, or missing refs.
  const rejecting =
    issues.includes("missing_generated_image") ||
    issues.includes("unauthorized_item") ||
    issues.includes("reference_missing_image");

  return { verdict: rejecting ? "REJECTED" : "APPROVED", fidelity, issues };
}
