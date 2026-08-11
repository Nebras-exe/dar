"use client";

import * as React from "react";
import {
  alwaysFalse, alwaysTrue, createPersistentStore,
} from "@/features/shop/persistent-store";
import {
  emptyProfile, rememberPreference, forgetPreference, rememberBudget, forgetBudget,
  rememberRoom, forgetRoom, setConsentEnabled, setUseInDesign, clearAllMemory,
  buildMemoryContext, hasUsableMemory,
  type UserMemoryProfile, type MemoryCategory, type MemorySource, type RoomMemory,
} from "@/lib/memory";

/**
 * Demo memory store (Phase 13, §12). With no backend, a user's memory profile
 * lives here in `localStorage`, per user, clearly browser-local. It enforces the
 * same invariants a server route would: memory is OPT-IN (writes are consent-gated
 * in the pure ops), suggested preferences are never auto-persisted, and **clearing
 * memory touches ONLY this store — never orders/payments/RFQs** (§38; those are
 * separate `athathi.*` keys this store never reads or writes).
 *
 * The store is keyed per user id so two accounts on one browser never share memory.
 */

interface MemoryState {
  profiles: Record<string, UserMemoryProfile>;
}

function validate(value: unknown): MemoryState {
  if (!value || typeof value !== "object" || !("profiles" in value)) return { profiles: {} };
  const p = (value as MemoryState).profiles;
  return { profiles: p && typeof p === "object" ? p : {} };
}

const store = createPersistentStore<MemoryState>("athathi.memory.v1", { profiles: {} }, validate);

function getProfile(userId: string): UserMemoryProfile {
  return store.get().profiles[userId] ?? emptyProfile();
}
function putProfile(userId: string, profile: UserMemoryProfile) {
  const state = store.get();
  store.set({ profiles: { ...state.profiles, [userId]: profile } });
}

/** Non-hook read of the safe memory context (used by the design flow + agent). */
export function readMemoryContext(userId: string) {
  return buildMemoryContext(getProfile(userId));
}

export function useMemory(userId: string) {
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);
  const profile = state.profiles[userId] ?? emptyProfile();

  const now = () => Date.now();

  const api = React.useMemo(() => ({
    setEnabled: (enabled: boolean) => putProfile(userId, setConsentEnabled(getProfile(userId), enabled, now())),
    setUseInDesign: (use: boolean) => putProfile(userId, setUseInDesign(getProfile(userId), use, now())),
    remember: (category: MemoryCategory, value: string, source: MemorySource = "explicit_user_choice") =>
      putProfile(userId, rememberPreference(getProfile(userId), category, value, source, now())),
    forget: (category: MemoryCategory, value: string) =>
      putProfile(userId, forgetPreference(getProfile(userId), category, value, now())),
    setBudget: (min: number, max: number, source: MemorySource = "explicit_user_choice") =>
      putProfile(userId, rememberBudget(getProfile(userId), min, max, source, now())),
    clearBudget: () => putProfile(userId, forgetBudget(getProfile(userId), now())),
    saveRoom: (room: RoomMemory) => putProfile(userId, rememberRoom(getProfile(userId), room)),
    removeRoom: (roomId: string) => putProfile(userId, forgetRoom(getProfile(userId), roomId, now())),
    /** Clear ALL saved memory but keep consent settings — never touches orders (§37/§38). */
    clearAll: () => putProfile(userId, clearAllMemory(getProfile(userId), now())),
  }), [userId]);

  return {
    profile,
    hydrated,
    context: buildMemoryContext(profile),
    hasMemory: hasUsableMemory(profile),
    ...api,
  };
}
