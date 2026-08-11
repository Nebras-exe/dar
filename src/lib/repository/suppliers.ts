/**
 * Suppliers repository (Phase 08). Mode-aware read API over suppliers. In demo
 * mode it serves the structured demo suppliers + product counts derived from the
 * Phase 03 catalog; in Supabase mode it would query the DB (gated — no creds in
 * this environment, so the demo path runs).
 *
 * Only ACTIVE + public suppliers are returned to the public marketplace (§35).
 * Demo suppliers stay clearly flagged (`isDemo`).
 */

import { getAllProducts } from "@/lib/catalog";
import { backendMode } from "@/lib/backend/config";
import { demoSuppliers, demoSupplierBySlug, demoSupplierByName } from "./demo-suppliers";
import type { Supplier } from "./types";

export interface SupplierWithStats extends Supplier {
  activeProductCount: number;
}

/** Count catalog products attributed to each supplier name. */
function productCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const p of getAllProducts()) {
    counts.set(p.supplier, (counts.get(p.supplier) ?? 0) + 1);
  }
  return counts;
}

function withStats(s: Supplier, counts: Map<string, number>): SupplierWithStats {
  return { ...s, activeProductCount: counts.get(s.name) ?? 0 };
}

/** Public marketplace listing — active suppliers only. */
export async function getPublicSuppliers(): Promise<SupplierWithStats[]> {
  if (backendMode() === "supabase") {
    // return await supabaseGetPublicSuppliers();  (gated — not configured here)
  }
  const counts = productCounts();
  return demoSuppliers
    .filter((s) => s.status === "active")
    .map((s) => withStats(s, counts));
}

/** A single supplier's public profile, or null. */
export async function getSupplierBySlug(slug: string): Promise<SupplierWithStats | null> {
  if (backendMode() === "supabase") {
    // return await supabaseGetSupplierBySlug(slug);
  }
  const s = demoSupplierBySlug(slug);
  if (!s || s.status !== "active") return null;
  return withStats(s, productCounts());
}

/** Look up the supplier that owns a catalog product (by its supplier name). */
export function supplierForProductName(name: string): Supplier | undefined {
  return demoSupplierByName(name);
}
