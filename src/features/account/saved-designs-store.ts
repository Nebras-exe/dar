"use client";

import * as React from "react";
import { getProductBySlug, type ColorId } from "@/lib/catalog";
import {
  alwaysFalse,
  alwaysTrue,
  createPersistentStore,
} from "@/features/shop/persistent-store";

/**
 * Demo saved-designs store (Phase 08, §17). When no backend is configured, a
 * user's saved designs live here in `localStorage` — clearly a local/demo store.
 * When Supabase is configured, `saved_designs` in the DB is the source of truth
 * (owner-only via RLS); this store is the honest local fallback with the SAME
 * shape, so the account UI is unchanged.
 */

export interface SavedDesignItem {
  slug: string;
  colorId?: ColorId;
}

export interface SavedDesign {
  id: string;
  label: string;
  roomType: string;
  primaryStyle: string;
  secondaryStyle?: string;
  budget: number;
  newFurnitureTotal: number;
  items: SavedDesignItem[];
  createdAt: number;
}

function validate(value: unknown): SavedDesign[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (d): d is SavedDesign =>
      Boolean(d) &&
      typeof d.id === "string" &&
      Array.isArray(d.items) &&
      // Drop designs whose items no longer resolve to catalog products.
      d.items.every((i: SavedDesignItem) => i && typeof i.slug === "string"),
  );
}

const store = createPersistentStore<SavedDesign[]>("athathi.savedDesigns.v1", [], validate);

export function useSavedDesigns() {
  const designs = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);

  const save = React.useCallback((design: Omit<SavedDesign, "id" | "createdAt">) => {
    const entry: SavedDesign = {
      ...design,
      id: `d_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now(),
    };
    store.set([entry, ...store.get()]);
    return entry.id;
  }, []);

  const remove = React.useCallback((id: string) => {
    store.set(store.get().filter((d) => d.id !== id));
  }, []);

  // Only surface designs whose items still resolve (catalog truth).
  const resolved = React.useMemo(
    () => designs.map((d) => ({ ...d, items: d.items.filter((i) => getProductBySlug(i.slug)) })),
    [designs],
  );

  return { designs: resolved, hydrated, save, remove };
}
