/**
 * User memory tests (Phase 13, §39/§47). All pure + deterministic — no external
 * or paid calls. Covers: opt-in consent, memory disabled, save/edit/remove/clear,
 * clear preserves consent (and never touches orders — see the store), style/colour/
 * material categories, budget range, room memory, provenance, suggested ≠ durable,
 * the safe agent context, validation, ownership, and the agent-cannot-write boundary.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  emptyProfile, rememberPreference, forgetPreference, rememberBudget, forgetBudget,
  rememberRoom, forgetRoom, setConsentEnabled, setUseInDesign, clearAllMemory,
  buildMemoryContext, hasUsableMemory,
  isValidMemoryValue, isMemoryCategory,
  canReadMemory, canWriteMemory, AGENT_CAN_WRITE_MEMORY,
  type UserMemoryProfile, type RoomMemory,
} from "./index";

function enabled(now = 1000): UserMemoryProfile {
  return setUseInDesign(setConsentEnabled(emptyProfile(now), true, now), true, now);
}

// ── Opt-in consent (§4) ───────────────────────────────────────────────────────

test("memory is opt-in: writes are ignored while consent is disabled", () => {
  const p = emptyProfile(0);
  assert.equal(p.consent.enabled, false);
  const attempted = rememberPreference(p, "style", "modern", "explicit_user_choice", 1);
  assert.equal(attempted.styles.length, 0); // nothing stored
});

test("enabling consent lets preferences save; useInDesign gates context use", () => {
  let p = setConsentEnabled(emptyProfile(0), true, 1);
  assert.equal(p.consent.enabled, true);
  assert.equal(p.consent.useInDesign, false);
  p = rememberPreference(p, "style", "modern", "explicit_user_choice", 2);
  assert.equal(p.styles.length, 1);
  // Context is empty until useInDesign is on (§18).
  assert.equal(buildMemoryContext(p).preferredStyles.length, 0);
  p = setUseInDesign(p, true, 3);
  assert.deepEqual(buildMemoryContext(p).preferredStyles, ["modern"]);
});

// ── Save / edit / remove / categories (§7/§47) ────────────────────────────────

test("style / colour / material preferences save, dedupe, and remove", () => {
  let p = enabled();
  p = rememberPreference(p, "style", "modern", "explicit_user_choice", 2);
  p = rememberPreference(p, "color", "walnut", "explicit_user_choice", 2);
  p = rememberPreference(p, "material", "linen", "explicit_user_choice", 2);
  assert.deepEqual(buildMemoryContext(p).preferredStyles, ["modern"]);
  assert.deepEqual(buildMemoryContext(p).preferredColors, ["walnut"]);
  assert.deepEqual(buildMemoryContext(p).preferredMaterials, ["linen"]);
  // Re-adding the same value dedupes (newest provenance wins) — no duplicate.
  p = rememberPreference(p, "style", "modern", "approved_design", 5);
  assert.equal(p.styles.length, 1);
  assert.equal(p.styles[0].source, "approved_design");
  // Remove one.
  p = forgetPreference(p, "style", "modern", 6);
  assert.equal(p.styles.length, 0);
});

// ── Budget range (§7) ─────────────────────────────────────────────────────────

test("budget is a normalised range, not one arbitrary value", () => {
  let p = enabled();
  p = rememberBudget(p, 800, 400, "explicit_user_choice", 2); // reversed input
  assert.equal(p.budget?.typicalMin, 400);
  assert.equal(p.budget?.typicalMax, 800);
  assert.equal(p.budget?.currency, "OMR");
  assert.deepEqual(buildMemoryContext(p).typicalBudget, { min: 400, max: 800, currency: "OMR" });
  p = forgetBudget(p, 3);
  assert.equal(p.budget, undefined);
});

// ── Room memory (§19) ─────────────────────────────────────────────────────────

test("room memory saves user-supplied context; removable", () => {
  let p = enabled();
  const room: RoomMemory = {
    id: "r1", name: "Living room", roomType: "living-room", style: "modern",
    budget: 1200, widthCm: 400, source: "room_project", createdAt: 2, updatedAt: 2,
  };
  p = rememberRoom(p, room);
  assert.equal(p.rooms.length, 1);
  assert.equal(buildMemoryContext(p).savedRoomCount, 1);
  p = forgetRoom(p, "r1", 3);
  assert.equal(p.rooms.length, 0);
});

// ── Clear vs disable (§37/§38) ────────────────────────────────────────────────

test("clearAll wipes memory but KEEPS consent settings (§37)", () => {
  let p = enabled();
  p = rememberPreference(p, "style", "modern", "explicit_user_choice", 2);
  p = rememberBudget(p, 400, 800, "explicit_user_choice", 2);
  p = clearAllMemory(p, 5);
  assert.equal(p.styles.length, 0);
  assert.equal(p.budget, undefined);
  assert.equal(p.rooms.length, 0);
  // Consent preserved — the user didn't ask to disable, only to clear.
  assert.equal(p.consent.enabled, true);
  assert.equal(p.consent.useInDesign, true);
});

test("disabling consent stops use but does NOT delete (§37)", () => {
  let p = enabled();
  p = rememberPreference(p, "style", "modern", "explicit_user_choice", 2);
  p = setConsentEnabled(p, false, 5);
  assert.equal(p.consent.enabled, false);
  assert.equal(p.consent.useInDesign, false); // turning off master also stops design use
  assert.equal(p.styles.length, 1); // still stored, just not used
  assert.equal(buildMemoryContext(p).preferredStyles.length, 0); // not used while disabled
});

// ── Provenance + suggested-not-persisted (§8/§9) ──────────────────────────────

test("every saved preference carries a source (provenance)", () => {
  const p = rememberPreference(enabled(), "material", "walnut", "completed_purchase", 2);
  assert.equal(p.materials[0].source, "completed_purchase");
  assert.equal(p.materials[0].confidence, "explicit");
});

test("a SUGGESTED preference is never auto-persisted (§9)", () => {
  const p = rememberPreference(enabled(), "style", "japandi", "approved_design", 2, "suggested");
  assert.equal(p.styles.length, 0); // suggested confidence is rejected by the durable store
});

// ── Validation (§8) ───────────────────────────────────────────────────────────

test("only real taxonomy values are valid to store", () => {
  assert.equal(isValidMemoryValue("style", "modern"), true);
  assert.equal(isValidMemoryValue("style", "not-a-style"), false);
  assert.equal(isValidMemoryValue("color", "walnut"), true);
  assert.equal(isValidMemoryValue("material", "linen"), true);
  assert.equal(isValidMemoryValue("material", "kryptonite"), false);
  assert.equal(isMemoryCategory("style"), true);
  assert.equal(isMemoryCategory("nope"), false);
});

// ── Authorization + agent boundary (§11/§16) ──────────────────────────────────

test("authorization: owner only; agent cannot write", () => {
  assert.equal(canReadMemory({ userId: "u1" }, "u1"), true);
  assert.equal(canReadMemory({ userId: "u1" }, "u2"), false);
  assert.equal(canWriteMemory({ userId: "u1" }, "u1"), true);
  assert.equal(canWriteMemory({ userId: "u1" }, "u2"), false);
  assert.equal(AGENT_CAN_WRITE_MEMORY, false);
});

test("hasUsableMemory reflects stored content", () => {
  assert.equal(hasUsableMemory(enabled()), false);
  assert.equal(hasUsableMemory(rememberPreference(enabled(), "style", "modern", "explicit_user_choice", 2)), true);
});
