/**
 * User memory operations (Phase 13). Pure + deterministic so they run identically
 * in the demo store and (later) a server route handler.
 *
 * Invariants enforced here:
 *  1. OPT-IN (§4): writes require `consent.enabled`; nothing is stored otherwise.
 *  2. SUGGESTED ≠ DURABLE (§8/§9): only EXPLICIT entries persist; a suggested
 *     preference is a transient proposal, never auto-saved.
 *  3. DEDUPE (§7): a preference list holds each value once (newest provenance wins).
 *  4. SAFE CONTEXT (§15): the Agent/design context exposes ONLY approved values —
 *     never payment/secret/history data.
 *  5. CLEAR ≠ DISABLE (§37): disabling stops use without deleting; clearing wipes
 *     memory but NEVER touches orders/payments/RFQs (that's the store's job, §38).
 */

import type { StyleTag, ColorId, MaterialId } from "@/lib/catalog";
import type {
  BudgetPreference,
  MemoryCategory,
  MemoryConfidence,
  MemoryContext,
  MemoryEntry,
  MemorySource,
  RoomMemory,
  UserMemoryProfile,
} from "./types";

/** A fresh, empty profile with memory OFF by default (opt-in, §4). */
export function emptyProfile(now = 0): UserMemoryProfile {
  return {
    styles: [], colors: [], materials: [], rooms: [],
    consent: { enabled: false, useInDesign: false, updatedAt: now },
    updatedAt: now,
  };
}

function listFor(profile: UserMemoryProfile, category: MemoryCategory): MemoryEntry[] {
  return category === "style" ? profile.styles : category === "color" ? profile.colors : profile.materials;
}

/**
 * Add or update an EXPLICIT preference. No-op (returns the profile unchanged) when
 * consent is disabled (§4) or the value is empty. Deduplicates by value — re-adding
 * a value refreshes its provenance/timestamp rather than duplicating (§7). Only
 * explicit confidence persists (§9); a suggested confidence is rejected here.
 */
export function rememberPreference(
  profile: UserMemoryProfile,
  category: MemoryCategory,
  value: string,
  source: MemorySource,
  now: number,
  confidence: MemoryConfidence = "explicit",
): UserMemoryProfile {
  if (!profile.consent.enabled) return profile;
  if (!value) return profile;
  if (confidence !== "explicit") return profile; // suggested is never auto-persisted (§9)
  const entry: MemoryEntry = { value, source, confidence: "explicit", at: now };
  const current = listFor(profile, category).filter((e) => e.value !== value);
  const next = [entry, ...current];
  const patch =
    category === "style" ? { styles: next as MemoryEntry<StyleTag>[] }
    : category === "color" ? { colors: next as MemoryEntry<ColorId>[] }
    : { materials: next as MemoryEntry<MaterialId>[] };
  return { ...profile, ...patch, updatedAt: now };
}

/** Remove one preference value from a category. Always allowed (even a delete). */
export function forgetPreference(
  profile: UserMemoryProfile,
  category: MemoryCategory,
  value: string,
  now: number,
): UserMemoryProfile {
  const next = listFor(profile, category).filter((e) => e.value !== value);
  const patch =
    category === "style" ? { styles: next as MemoryEntry<StyleTag>[] }
    : category === "color" ? { colors: next as MemoryEntry<ColorId>[] }
    : { materials: next as MemoryEntry<MaterialId>[] };
  return { ...profile, ...patch, updatedAt: now };
}

/** Set the typical budget RANGE (§7). No-op when disabled; normalises min ≤ max. */
export function rememberBudget(
  profile: UserMemoryProfile,
  min: number,
  max: number,
  source: MemorySource,
  now: number,
): UserMemoryProfile {
  if (!profile.consent.enabled) return profile;
  if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < 0) return profile;
  const lo = Math.min(min, max), hi = Math.max(min, max);
  const budget: BudgetPreference = { typicalMin: lo, typicalMax: hi, currency: "OMR", source, at: now };
  return { ...profile, budget, updatedAt: now };
}

export function forgetBudget(profile: UserMemoryProfile, now: number): UserMemoryProfile {
  const { budget: _drop, ...rest } = profile;
  void _drop;
  return { ...rest, rooms: profile.rooms, updatedAt: now } as UserMemoryProfile;
}

/** Save or update a room/project memory. No-op when disabled (§4). */
export function rememberRoom(profile: UserMemoryProfile, room: RoomMemory): UserMemoryProfile {
  if (!profile.consent.enabled) return profile;
  const rooms = profile.rooms.some((r) => r.id === room.id)
    ? profile.rooms.map((r) => (r.id === room.id ? room : r))
    : [room, ...profile.rooms];
  return { ...profile, rooms, updatedAt: room.updatedAt };
}

export function forgetRoom(profile: UserMemoryProfile, roomId: string, now: number): UserMemoryProfile {
  return { ...profile, rooms: profile.rooms.filter((r) => r.id !== roomId), updatedAt: now };
}

/** Toggle the master consent switch (§4). Turning it off does NOT delete (§37). */
export function setConsentEnabled(profile: UserMemoryProfile, enabled: boolean, now: number): UserMemoryProfile {
  return {
    ...profile,
    consent: { ...profile.consent, enabled, useInDesign: enabled ? profile.consent.useInDesign : false, updatedAt: now },
    updatedAt: now,
  };
}

/** Toggle whether saved memory seeds future designs/agent context (§18). */
export function setUseInDesign(profile: UserMemoryProfile, useInDesign: boolean, now: number): UserMemoryProfile {
  return {
    ...profile,
    consent: { ...profile.consent, useInDesign: useInDesign && profile.consent.enabled, updatedAt: now },
    updatedAt: now,
  };
}

/**
 * Clear ALL saved memory but KEEP consent settings (§37). This wipes preferences +
 * rooms only — it is the memory domain's clear; the store guarantees it never
 * touches orders/payments/RFQs (§38).
 */
export function clearAllMemory(profile: UserMemoryProfile, now: number): UserMemoryProfile {
  return {
    ...emptyProfile(now),
    consent: { ...profile.consent, updatedAt: now },
    updatedAt: now,
  };
}

/**
 * Build the SAFE context for the Agent + design flow (§15). Returns approved
 * values only, and only when consent is enabled AND useInDesign is on — otherwise
 * an empty (disabled) context. NEVER includes payment/secret/history data.
 */
export function buildMemoryContext(profile: UserMemoryProfile): MemoryContext {
  const active = profile.consent.enabled && profile.consent.useInDesign;
  if (!active) {
    return { enabled: profile.consent.enabled, useInDesign: profile.consent.useInDesign,
      preferredStyles: [], preferredColors: [], preferredMaterials: [], savedRoomCount: 0 };
  }
  return {
    enabled: true,
    useInDesign: true,
    preferredStyles: profile.styles.map((e) => e.value),
    preferredColors: profile.colors.map((e) => e.value),
    preferredMaterials: profile.materials.map((e) => e.value),
    ...(profile.budget ? { typicalBudget: { min: profile.budget.typicalMin, max: profile.budget.typicalMax, currency: "OMR" as const } } : {}),
    savedRoomCount: profile.rooms.length,
  };
}

/** True when there's anything to show/use (used to gate "use my saved style" UI). */
export function hasUsableMemory(profile: UserMemoryProfile): boolean {
  return profile.styles.length > 0 || profile.colors.length > 0 || profile.materials.length > 0 || profile.budget !== undefined;
}
