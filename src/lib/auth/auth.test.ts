/**
 * Authorization tests (Phase 08, §45/§49). The pure authz rules mirror the RLS
 * policies: a member manages only their OWN supplier, a customer manages none,
 * publishing needs a manager, and users own only their own resources.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  canManageSupplier,
  canManageProduct,
  canPublishProduct,
  ownsResource,
  membershipIn,
  isPubliclyVisibleProduct,
  type Principal,
} from "./authorization";

const SUP_A = "supplier-a";
const SUP_B = "supplier-b";

const customer: Principal = { userId: "u-cust", role: "customer", memberships: [] };
const staffA: Principal = { userId: "u-a", role: "supplier", memberships: [{ supplierId: SUP_A, role: "staff" }] };
const managerA: Principal = { userId: "u-am", role: "supplier", memberships: [{ supplierId: SUP_A, role: "manager" }] };
const ownerA: Principal = { userId: "u-ao", role: "supplier", memberships: [{ supplierId: SUP_A, role: "owner" }] };
const admin: Principal = { userId: "u-admin", role: "admin", memberships: [] };

test("customer manages no supplier or product", () => {
  assert.equal(canManageSupplier(customer, SUP_A), false);
  assert.equal(canManageProduct(customer, SUP_A), false);
});

test("member manages ONLY their own supplier (no cross-supplier)", () => {
  assert.equal(canManageSupplier(staffA, SUP_A), true);
  assert.equal(canManageSupplier(staffA, SUP_B), false); // Supplier A can't touch B
  assert.equal(canManageProduct(staffA, SUP_B), false);
});

test("publishing requires at least a manager", () => {
  assert.equal(canPublishProduct(staffA, SUP_A), false);
  assert.equal(canPublishProduct(managerA, SUP_A), true);
  assert.equal(canPublishProduct(ownerA, SUP_A), true);
});

test("role rank: owner ≥ manager ≥ staff", () => {
  assert.equal(canManageSupplier(staffA, SUP_A, "manager"), false);
  assert.equal(canManageSupplier(managerA, SUP_A, "manager"), true);
  assert.equal(canManageSupplier(ownerA, SUP_A, "owner"), true);
  assert.equal(canManageSupplier(managerA, SUP_A, "owner"), false);
});

test("admin can manage any supplier", () => {
  assert.equal(canManageSupplier(admin, SUP_A), true);
  assert.equal(canManageSupplier(admin, SUP_B, "owner"), true);
});

test("resource ownership: a user owns only their own", () => {
  assert.equal(ownsResource(customer, "u-cust"), true);
  assert.equal(ownsResource(customer, "someone-else"), false);
});

test("membershipIn resolves the correct membership", () => {
  assert.equal(membershipIn(managerA, SUP_A)?.role, "manager");
  assert.equal(membershipIn(managerA, SUP_B), null);
});

test("public visibility: only active products", () => {
  assert.equal(isPubliclyVisibleProduct("active"), true);
  assert.equal(isPubliclyVisibleProduct("draft"), false);
  assert.equal(isPubliclyVisibleProduct("archived"), false);
});
