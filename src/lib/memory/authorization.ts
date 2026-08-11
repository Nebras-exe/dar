/**
 * Memory authorization (Phase 13, §11/§16/§39). Pure mirrors of the RLS policies
 * (`supabase/migrations/0017_user_memory_rls.sql`):
 *  - a USER may read/create/update/delete ONLY their own memory;
 *  - a SUPPLIER has NO access to private user memory;
 *  - PUBLIC has no access;
 *  - the AGENT may READ approved memory only within the user's own authenticated
 *    context, and may NEVER write/change/delete memory silently (§16).
 * Unit-tested; dependency-free.
 */

export interface MemoryPrincipal {
  userId: string;
}

/** Only the owning user may read their memory. */
export function canReadMemory(principal: MemoryPrincipal, ownerId: string): boolean {
  return principal.userId === ownerId;
}

/** Only the owning user may write (add/update/remove/clear) their memory. */
export function canWriteMemory(principal: MemoryPrincipal, ownerId: string): boolean {
  return principal.userId === ownerId;
}

/**
 * The Agent's authority over memory is READ-ONLY (§16): it may read APPROVED
 * memory in the user's own context and SUGGEST updates, but it may never create,
 * change, or delete memory silently — persistence is always an explicit user
 * action in deterministic app code. Documents + tests the boundary.
 */
export const AGENT_CAN_WRITE_MEMORY = false as const;
