"use client";

import * as React from "react";
import { CartProvider } from "@/features/cart/cart-context";
import { FavoritesProvider } from "@/features/favorites/favorites-context";

/** Client-side stores available across the app (cart + favourites). */
export function ShopProviders({ children }: { children: React.ReactNode }) {
  return (
    <FavoritesProvider>
      <CartProvider>{children}</CartProvider>
    </FavoritesProvider>
  );
}
