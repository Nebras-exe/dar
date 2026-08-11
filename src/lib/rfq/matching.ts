/**
 * Deterministic supplier matching for an RFQ (Phase 09, §17/§19). Uses ACTUAL
 * supplier data (status, capabilities). It NEVER routes an RFQ to an inactive or
 * suspended supplier, or one that doesn't handle the requested category. Every
 * match carries transparent, data-backed reasons — no opaque score.
 *
 * Pure + client-safe (reads the suppliers repository's demo data / the same
 * shape a DB query returns).
 */

import type { Supplier } from "@/lib/repository";
import type { CustomFurnitureSpec, MatchReason, RFQRecipient } from "./types";

export interface SupplierMatch {
  supplier: Supplier;
  reasons: MatchReason[];
  /** Deterministic ordering hint (higher = stronger fit). Not shown as a score. */
  rank: number;
}

/**
 * Score a single supplier against a spec. Returns null when the supplier is not
 * eligible at all (inactive/suspended, no custom, or wrong category) — such
 * suppliers are never RFQ recipients.
 */
export function matchSupplier(supplier: Supplier, spec: CustomFurnitureSpec): SupplierMatch | null {
  // Hard gates (§17): only active suppliers that accept custom work in this category.
  if (supplier.status !== "active") return null;
  const caps = supplier.capabilities;
  if (!caps || !caps.acceptsCustom) return null;
  if (!caps.customCategories.includes(spec.category)) return null;

  const reasons: MatchReason[] = [];
  let rank = 0;

  reasons.push({ code: "handles-category", value: spec.category });
  rank += 2;

  if (spec.material && caps.materials.includes(spec.material)) {
    reasons.push({ code: "works-with-material", value: spec.material });
    rank += 2;
  }
  if (caps.serviceRegions.length > 0) {
    reasons.push({ code: "located-in", value: caps.serviceRegions[0] });
    rank += 1;
  }
  reasons.push({ code: "accepts-custom" });
  if (supplier.verified) {
    reasons.push({ code: "verified" });
    rank += 1;
  }

  return { supplier, reasons, rank };
}

/** All eligible suppliers for a spec, strongest fit first (deterministic tie-break by id). */
export function matchSuppliers(suppliers: readonly Supplier[], spec: CustomFurnitureSpec): SupplierMatch[] {
  return suppliers
    .map((s) => matchSupplier(s, spec))
    .filter((m): m is SupplierMatch => m !== null)
    .sort((a, b) => b.rank - a.rank || a.supplier.id.localeCompare(b.supplier.id));
}

/** Build RFQ recipients from a chosen set of supplier ids, validating eligibility. */
export function buildRecipients(
  suppliers: readonly Supplier[],
  spec: CustomFurnitureSpec,
  chosenIds: readonly string[],
): RFQRecipient[] {
  const matches = new Map(matchSuppliers(suppliers, spec).map((m) => [m.supplier.id, m]));
  const recipients: RFQRecipient[] = [];
  for (const id of chosenIds) {
    const m = matches.get(id);
    if (m) recipients.push({ supplierId: id, matchReasons: m.reasons }); // ineligible ids dropped
  }
  return recipients;
}
