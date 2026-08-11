"use client";

import * as React from "react";
import type { ColorId } from "@/lib/catalog";
import { variantsFor, variantGalleryUrls, variantPrice, type PreviewVariant } from "@/lib/catalog-preview";

/**
 * Product-scoped variant state (LOCAL preview). Shares the selected furniture
 * variant across the PDP hero — the gallery, the price, and the buy-box all read
 * it — so selecting a swatch updates the image, gallery, label, and price with no
 * reload. When a product has no variants the context is inert and every consumer
 * falls back to its normal behaviour. No business logic is affected.
 */
export interface VariantContextValue {
  variants: PreviewVariant[];
  /** The selected variant, or null when the product has none. */
  selected: PreviewVariant | null;
  selectedIndex: number;
  /** Select by colour id (also used to sync from the plain colour selector). */
  selectByColor: (colorId: ColorId) => void;
  selectByIndex: (i: number) => void;
  /** Gallery image URLs for the current selection (empty when no variants). */
  galleryUrls: (size?: number) => string[];
  /** Final price for the current selection given the base price. */
  priceFor: (basePrice: number) => number | null;
}

const VariantContext = React.createContext<VariantContextValue | null>(null);

export function VariantProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const variants = React.useMemo(() => variantsFor(slug), [slug]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const selectByIndex = React.useCallback((i: number) => {
    setSelectedIndex((prev) => (i >= 0 && i < variants.length ? i : prev));
  }, [variants.length]);

  const selectByColor = React.useCallback((colorId: ColorId) => {
    const i = variants.findIndex((v) => v.colorId === colorId);
    if (i >= 0) setSelectedIndex(i);
  }, [variants]);

  const selected = variants[selectedIndex] ?? null;

  const value = React.useMemo<VariantContextValue>(() => ({
    variants,
    selected,
    selectedIndex,
    selectByColor,
    selectByIndex,
    galleryUrls: (size = 800) => (selected ? variantGalleryUrls(selected, size) : []),
    priceFor: (basePrice: number) => (selected ? variantPrice(basePrice, selected) : null),
  }), [variants, selected, selectedIndex, selectByColor, selectByIndex]);

  return <VariantContext.Provider value={value}>{children}</VariantContext.Provider>;
}

/** Read the variant context. Returns null outside a provider (non-variant pages). */
export function useVariant(): VariantContextValue | null {
  return React.useContext(VariantContext);
}
