"use client";

import * as React from "react";
import {
  alwaysFalse,
  alwaysTrue,
  createPersistentStore,
} from "@/features/shop/persistent-store";

/**
 * Local favourites — a set of product slugs persisted to `localStorage` via an
 * external store (UI/local-only; no account or wishlist backend this phase).
 */

function validate(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((s): s is string => typeof s === "string");
}

const favoritesStore = createPersistentStore<string[]>(
  "athathi.favorites.v1",
  [],
  validate,
);

interface FavoritesContextValue {
  favorites: string[];
  hydrated: boolean;
  isFavorite: (slug: string) => boolean;
  toggle: (slug: string) => void;
  count: number;
}

const FavoritesContext = React.createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const favorites = React.useSyncExternalStore(
    favoritesStore.subscribe,
    favoritesStore.getSnapshot,
    favoritesStore.getServerSnapshot,
  );
  const hydrated = React.useSyncExternalStore(
    favoritesStore.subscribe,
    alwaysTrue,
    alwaysFalse,
  );

  const toggle = React.useCallback((slug: string) => {
    const prev = favoritesStore.get();
    favoritesStore.set(
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }, []);

  const isFavorite = React.useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites],
  );

  const value: FavoritesContextValue = {
    favorites,
    hydrated,
    isFavorite,
    toggle,
    count: favorites.length,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = React.useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within <FavoritesProvider>");
  return ctx;
}
