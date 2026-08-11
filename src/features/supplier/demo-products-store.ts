"use client";

import * as React from "react";
import {
  alwaysFalse,
  alwaysTrue,
  createPersistentStore,
} from "@/features/shop/persistent-store";
import { uniqueSlug } from "@/lib/repository/slug";
import type { ProductInput, ProductStatus } from "@/lib/repository";

/**
 * Demo supplier-products store (Phase 08). When no backend is configured, a
 * supplier's own products live here in `localStorage`, scoped by supplier id —
 * clearly a LOCAL draft workspace ("saved locally in this browser"). When
 * Supabase is configured, the `products` table (RLS-scoped to the supplier) is
 * the source of truth; this store is the honest local fallback with the same
 * `ProductInput` shape, so the dashboard UI is unchanged.
 */

export interface LocalProduct extends ProductInput {
  id: string;
  slug: string;
  supplierId: string;
  createdAt: number;
  updatedAt: number;
}

function validate(value: unknown): LocalProduct[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (p): p is LocalProduct =>
      Boolean(p) && typeof p.id === "string" && typeof p.supplierId === "string",
  );
}

const store = createPersistentStore<LocalProduct[]>("athathi.supplierProducts.v1", [], validate);

export function useSupplierProducts(supplierId: string) {
  const all = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);

  const products = React.useMemo(
    () => all.filter((p) => p.supplierId === supplierId).sort((a, b) => b.updatedAt - a.updatedAt),
    [all, supplierId],
  );

  const create = React.useCallback(
    (input: ProductInput) => {
      const existing = new Set(store.get().map((p) => p.slug));
      const slug = uniqueSlug(input.name, existing, input.category);
      const now = Date.now();
      const entry: LocalProduct = {
        ...input,
        id: `p_${now.toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        slug,
        supplierId,
        createdAt: now,
        updatedAt: now,
      };
      store.set([entry, ...store.get()]);
      return entry;
    },
    [supplierId],
  );

  const update = React.useCallback(
    (id: string, input: ProductInput) => {
      store.set(
        store.get().map((p) =>
          p.id === id && p.supplierId === supplierId
            ? { ...p, ...input, updatedAt: Date.now() }
            : p,
        ),
      );
    },
    [supplierId],
  );

  const setStatus = React.useCallback(
    (id: string, status: ProductStatus) => {
      store.set(
        store.get().map((p) =>
          p.id === id && p.supplierId === supplierId ? { ...p, status, updatedAt: Date.now() } : p,
        ),
      );
    },
    [supplierId],
  );

  const remove = React.useCallback(
    (id: string) => {
      store.set(store.get().filter((p) => !(p.id === id && p.supplierId === supplierId)));
    },
    [supplierId],
  );

  const byId = React.useCallback((id: string) => products.find((p) => p.id === id) ?? null, [products]);

  return { products, hydrated, create, update, setStatus, remove, byId };
}
