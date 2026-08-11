/**
 * Manufacturing authorization (Phase 11B, §25/§26). Pure mirrors of the RLS
 * policies (`supabase/migrations/0013_manufacturing_rls.sql`):
 *  - the owning CUSTOMER may READ a customer-safe view of their own job (never write);
 *  - a SUPPLIER MEMBER may read AND update ONLY jobs of their own supplier — supplier
 *    A can never read or mutate supplier B's job;
 *  - the AGENT is READ-ONLY (§23) — it may summarize, never start/complete/pass/fail/ready;
 *  - PUBLIC has no access.
 * Unit-tested; dependency-free.
 */

import type { ManufacturingJob } from "./types";

export interface ManufacturingPrincipal {
  userId: string;
  supplierIds: string[];
}

/** Customer reads own job (safe view); supplier reads its own supplier's jobs. */
export function canReadManufacturing(
  principal: ManufacturingPrincipal,
  job: Pick<ManufacturingJob, "customerId" | "supplierId">,
): boolean {
  if (principal.userId === job.customerId) return true;
  return principal.supplierIds.includes(job.supplierId);
}

/**
 * Only a member of the job's OWN supplier may update it (start/complete/QC/rework/
 * ready). The customer never writes (§25); a supplier never writes another
 * supplier's job.
 */
export function canManageManufacturing(
  principal: Pick<ManufacturingPrincipal, "supplierIds">,
  job: Pick<ManufacturingJob, "supplierId">,
): boolean {
  return principal.supplierIds.includes(job.supplierId);
}

/** The customer may never mutate manufacturing state (§25) — writes are supplier-only. */
export function canCustomerWriteManufacturing(): boolean {
  return false;
}

/**
 * The Agent's authority over manufacturing is READ-ONLY (§23): it may summarize
 * and explain, but may never start/complete manufacturing, pass/fail QC, or mark
 * ready for delivery. This constant documents + tests the boundary.
 */
export const AGENT_CAN_MANAGE_MANUFACTURING = false as const;
