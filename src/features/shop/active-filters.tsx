"use client";

import * as React from "react";
import { X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  colorSwatches,
  formatOmr,
  label,
  materialLabels,
  roomLabels,
  styleLabels,
  getCategory,
} from "@/lib/catalog";
import type { ShopState } from "./url-state";
import { useShopRouter } from "./use-shop-router";

interface Pill {
  key: string;
  text: string;
  onRemove: () => void;
}

/** Removable chips summarising every active filter, below the toolbar. */
export function ActiveFilters({
  state,
  t,
  locale,
  hasLockedCategory,
}: {
  state: ShopState;
  t: Dictionary["shop"];
  locale: Locale;
  hasLockedCategory: boolean;
}) {
  const { toggleInList, setRange, setParam, clearFilters } = useShopRouter();

  const pills: Pill[] = [];

  if (!hasLockedCategory) {
    for (const c of state.categories) {
      const cat = getCategory(c);
      pills.push({
        key: `category-${c}`,
        text: cat ? label(cat.name, locale) : c,
        onRemove: () => toggleInList("category", c),
      });
    }
  }
  for (const s of state.styles)
    pills.push({
      key: `style-${s}`,
      text: label(styleLabels[s], locale),
      onRemove: () => toggleInList("style", s),
    });
  for (const c of state.colors)
    pills.push({
      key: `color-${c}`,
      text: label(colorSwatches[c].label, locale),
      onRemove: () => toggleInList("color", c),
    });
  for (const m of state.materials)
    pills.push({
      key: `material-${m}`,
      text: label(materialLabels[m], locale),
      onRemove: () => toggleInList("material", m),
    });
  for (const r of state.rooms)
    pills.push({
      key: `room-${r}`,
      text: label(roomLabels[r], locale),
      onRemove: () => toggleInList("room", r),
    });
  for (const a of state.availability)
    pills.push({
      key: `availability-${a}`,
      text: t.availability[a],
      onRemove: () => toggleInList("availability", a),
    });
  if (state.minPrice != null)
    pills.push({
      key: "min",
      text: `${t.filters.minPrice} ${formatOmr(state.minPrice, locale)}`,
      onRemove: () => setRange(null, state.maxPrice != null ? String(state.maxPrice) : null),
    });
  if (state.maxPrice != null)
    pills.push({
      key: "max",
      text: `${t.filters.maxPrice} ${formatOmr(state.maxPrice, locale)}`,
      onRemove: () => setRange(state.minPrice != null ? String(state.minPrice) : null, null),
    });
  if (state.customizable)
    pills.push({
      key: "custom",
      text: t.filters.customizable,
      onRemove: () => setParam("custom", null),
    });

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pills.map((p) => (
        <button
          key={p.key}
          type="button"
          onClick={p.onRemove}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface py-1 ps-3 pe-2 text-sm text-foreground hover:border-taupe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {p.text}
          <X className="size-3.5 text-muted" strokeWidth={2} aria-hidden="true" />
          <span className="sr-only">{t.filters.clear}</span>
        </button>
      ))}
      {pills.length > 1 && (
        <button
          type="button"
          onClick={() => clearFilters()}
          className="rounded-md px-2 py-1 text-sm font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {t.filters.clearAll}
        </button>
      )}
    </div>
  );
}
