"use client";

import * as React from "react";
import {
  computeItemCount,
  computeSubtotal,
  getProductBySlug,
  type ColorId,
  type Product,
} from "@/lib/catalog";
import {
  alwaysFalse,
  alwaysTrue,
  createPersistentStore,
} from "@/features/shop/persistent-store";

/**
 * Local demo cart. Persists to `localStorage` via an external store and stores
 * only the minimal intent (slug + colour + quantity) — price and naming are
 * always derived from the catalog at render, so totals can never drift from a
 * stale snapshot, and this whole store can later be swapped for an
 * authenticated backend cart behind the same hook.
 */

export interface CartLine {
  slug: string;
  colorId?: ColorId;
  quantity: number;
}

export interface ResolvedCartLine extends CartLine {
  key: string;
  product: Product;
  lineTotal: number;
}

function validate(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (l): l is CartLine =>
      Boolean(l) &&
      typeof l.slug === "string" &&
      Number.isFinite(l.quantity) &&
      l.quantity > 0 &&
      Boolean(getProductBySlug(l.slug)),
  );
}

const cartStore = createPersistentStore<CartLine[]>(
  "athathi.cart.v1",
  [],
  validate,
);

function lineKey(slug: string, colorId?: ColorId): string {
  return `${slug}::${colorId ?? ""}`;
}

function sameLine(a: CartLine, slug: string, colorId?: ColorId): boolean {
  return a.slug === slug && (a.colorId ?? undefined) === (colorId ?? undefined);
}

interface CartContextValue {
  lines: CartLine[];
  resolved: ResolvedCartLine[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  add: (slug: string, opts?: { colorId?: ColorId; quantity?: number }) => void;
  remove: (slug: string, colorId?: ColorId) => void;
  setQuantity: (slug: string, colorId: ColorId | undefined, quantity: number) => void;
  clear: () => void;
  isInCart: (slug: string) => boolean;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = React.useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const hydrated = React.useSyncExternalStore(
    cartStore.subscribe,
    alwaysTrue,
    alwaysFalse,
  );

  const add = React.useCallback<CartContextValue["add"]>((slug, opts) => {
    const quantity = Math.max(1, Math.floor(opts?.quantity ?? 1));
    const colorId = opts?.colorId;
    if (!getProductBySlug(slug)) return;
    const prev = cartStore.get();
    const idx = prev.findIndex((l) => sameLine(l, slug, colorId));
    if (idx === -1) {
      cartStore.set([...prev, { slug, colorId, quantity }]);
    } else {
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
      cartStore.set(next);
    }
  }, []);

  const remove = React.useCallback<CartContextValue["remove"]>((slug, colorId) => {
    cartStore.set(cartStore.get().filter((l) => !sameLine(l, slug, colorId)));
  }, []);

  const setQuantity = React.useCallback<CartContextValue["setQuantity"]>(
    (slug, colorId, quantity) => {
      const q = Math.floor(quantity);
      const prev = cartStore.get();
      if (q <= 0) {
        cartStore.set(prev.filter((l) => !sameLine(l, slug, colorId)));
        return;
      }
      cartStore.set(
        prev.map((l) => (sameLine(l, slug, colorId) ? { ...l, quantity: q } : l)),
      );
    },
    [],
  );

  const clear = React.useCallback(() => cartStore.set([]), []);

  const resolved = React.useMemo<ResolvedCartLine[]>(() => {
    return lines
      .map((l) => {
        const product = getProductBySlug(l.slug);
        if (!product) return null;
        return {
          ...l,
          key: lineKey(l.slug, l.colorId),
          product,
          lineTotal: computeSubtotal([{ price: product.price, quantity: l.quantity }]),
        };
      })
      .filter((x): x is ResolvedCartLine => x !== null);
  }, [lines]);

  const subtotal = React.useMemo(
    () =>
      computeSubtotal(
        resolved.map((l) => ({ price: l.product.price, quantity: l.quantity })),
      ),
    [resolved],
  );

  const count = React.useMemo(() => computeItemCount(lines), [lines]);

  const isInCart = React.useCallback(
    (slug: string) => lines.some((l) => l.slug === slug),
    [lines],
  );

  const value: CartContextValue = {
    lines,
    resolved,
    count,
    subtotal,
    hydrated,
    add,
    remove,
    setQuantity,
    clear,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
