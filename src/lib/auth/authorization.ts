/**
 * Pure authorization rules (Phase 08, §28). These are the deterministic checks
 * the server enforces so that hiding a button is NEVER the only defence. They
 * mirror the RLS policies (see `supabase/migrations` + `docs/DATABASE.md`), so
 * the same rules hold whether a mutation runs through a server action (demo) or
 * Postgres RLS (Supabase). Kept pure + dependency-free for testing (§45).
 */

export type UserRole = "customer" | "supplier" | "admin";
export type SupplierMemberRole = "owner" | "manager" | "staff";

export interface Membership {
  supplierId: string;
  role: SupplierMemberRole;
}

export interface Principal {
  userId: string;
  role: UserRole;
  /** Supplier memberships this user holds (usually 0–1 in this phase). */
  memberships: Membership[];
}

const MEMBER_RANK: Record<SupplierMemberRole, number> = {
  owner: 3,
  manager: 2,
  staff: 1,
};

/** The user's membership in a specific supplier, or null. */
export function membershipIn(principal: Principal, supplierId: string): Membership | null {
  return principal.memberships.find((m) => m.supplierId === supplierId) ?? null;
}

/** True when the user belongs to the supplier at ≥ the required member role. */
export function canManageSupplier(
  principal: Principal,
  supplierId: string,
  minRole: SupplierMemberRole = "staff",
): boolean {
  if (principal.role === "admin") return true;
  const m = membershipIn(principal, supplierId);
  if (!m) return false;
  return MEMBER_RANK[m.role] >= MEMBER_RANK[minRole];
}

/**
 * True when the user may manage a specific product. Supplier A can NEVER manage
 * Supplier B's product; a customer can never manage any (§28).
 */
export function canManageProduct(
  principal: Principal,
  productSupplierId: string,
  minRole: SupplierMemberRole = "staff",
): boolean {
  return canManageSupplier(principal, productSupplierId, minRole);
}

/** Publishing/archiving requires at least a manager. */
export function canPublishProduct(principal: Principal, productSupplierId: string): boolean {
  return canManageProduct(principal, productSupplierId, "manager");
}

/** A user may only read/modify their OWN saved design/room/favourite (§29). */
export function ownsResource(principal: Principal, ownerUserId: string): boolean {
  return principal.userId === ownerUserId;
}

/** Whether a product should be visible to the PUBLIC (§9/§28). */
export function isPubliclyVisibleProduct(status: string): boolean {
  return status === "active";
}
