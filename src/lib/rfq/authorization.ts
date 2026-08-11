/**
 * RFQ authorization rules (Phase 09, §33/§34). Pure, deterministic mirrors of the
 * RLS policies (`supabase/migrations/0005_rfq_rls.sql`), so the same isolation
 * holds whether a mutation runs through a demo-mode server action or Postgres
 * RLS. Unit-tested; dependency-free.
 *
 * The rules: a customer reads/accepts only their OWN request + its quotes; a
 * supplier reads only RFQs ADDRESSED to a supplier it belongs to, and quotes only
 * AS that supplier; an accepted quote is locked (never overwritten in place).
 */

import type { QuoteStatus } from "./types";

/** The acting principal: their user id + the supplier ids they are a member of. */
export interface RFQPrincipal {
  userId: string;
  supplierIds: string[];
}

/** The minimal request facts the rules need (owner + addressed suppliers). */
export interface RequestRef {
  customerId: string;
  recipientIds: string[];
}

/** The owning customer, or a supplier the RFQ is addressed to, may read it. */
export function canReadRequest(principal: RFQPrincipal, req: RequestRef): boolean {
  if (principal.userId === req.customerId) return true;
  return principal.supplierIds.some((sid) => req.recipientIds.includes(sid));
}

/**
 * A supplier member may submit a quote only (a) as a supplier they belong to and
 * (b) for a request that supplier was actually addressed. Supplier A can never
 * quote as Supplier B, and a non-addressed supplier can't quote at all.
 */
export function canQuoteRequest(
  principal: RFQPrincipal,
  req: RequestRef,
  asSupplierId: string,
): boolean {
  if (!principal.supplierIds.includes(asSupplierId)) return false; // not your supplier
  return req.recipientIds.includes(asSupplierId); // must be an addressed recipient
}

/** Only the owning customer may accept a quote on their request. */
export function canAcceptQuote(principal: RFQPrincipal, req: RequestRef): boolean {
  return principal.userId === req.customerId;
}

/** An accepted quote is immutable in place (§16 — versioning deferred). */
export function isAcceptedLocked(status: QuoteStatus): boolean {
  return status === "accepted";
}
