"use client";

import * as React from "react";
import { Check } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  categories as allCategories,
  colorIds,
  colorSwatches,
  label,
  materialIds,
  materialLabels,
  roomTypes,
  roomLabels,
  stockStatuses,
  styleLabels,
  styleTags,
  type CategorySlug,
} from "@/lib/catalog";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useShopRouter } from "./use-shop-router";

export interface FilterContentProps {
  t: Dictionary["shop"];
  locale: Locale;
  lockedCategory?: CategorySlug;
  priceBounds: { min: number; max: number };
  activeCount: number;
  /** Called after "clear all" / when the sheet should close on mobile. */
  onDone?: () => void;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-border-subtle py-5 first:border-t-0 first:pt-0">
      <legend className="mb-3 text-sm font-semibold text-foreground">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export function FilterContent({
  t,
  locale,
  lockedCategory,
  priceBounds,
  activeCount,
  onDone,
}: FilterContentProps) {
  const { searchParams, toggleInList, setRange, setParam, clearFilters, isSelected } =
    useShopRouter();

  const urlMin = searchParams.get("min") ?? "";
  const urlMax = searchParams.get("max") ?? "";
  const [minPrice, setMinPrice] = React.useState(urlMin);
  const [maxPrice, setMaxPrice] = React.useState(urlMax);
  const [syncedRange, setSyncedRange] = React.useState(`${urlMin}|${urlMax}`);

  // Keep local price inputs in sync when the URL changes elsewhere (e.g. clear)
  // using React's "adjust state while rendering" pattern rather than an effect.
  if (syncedRange !== `${urlMin}|${urlMax}`) {
    setSyncedRange(`${urlMin}|${urlMax}`);
    setMinPrice(urlMin);
    setMaxPrice(urlMax);
  }

  const commitPrice = () => setRange(minPrice || null, maxPrice || null);
  const customOn = searchParams.get("custom") === "1";

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-base font-semibold text-foreground">{t.filters.title}</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => {
              clearFilters();
              onDone?.();
            }}
            className="rounded-md text-sm font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {t.filters.clearAll}
          </button>
        )}
      </div>

      {!lockedCategory && (
        <Section title={t.filters.category}>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((c) => (
              <Chip
                key={c.slug}
                selected={isSelected("category", c.slug)}
                onClick={() => toggleInList("category", c.slug)}
                className="h-9 px-3.5 text-[0.8rem]"
              >
                {label(c.name, locale)}
              </Chip>
            ))}
          </div>
        </Section>
      )}

      <Section title={t.filters.price}>
        <div className="flex items-end gap-3">
          <label className="flex-1 text-xs text-muted">
            {t.filters.minPrice}
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={minPrice}
              placeholder={String(priceBounds.min)}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={commitPrice}
              onKeyDown={(e) => e.key === "Enter" && commitPrice()}
              className="mt-1 w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-foreground tabular focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
            />
          </label>
          <span aria-hidden="true" className="pb-2 text-subtle">
            –
          </span>
          <label className="flex-1 text-xs text-muted">
            {t.filters.maxPrice}
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={maxPrice}
              placeholder={String(priceBounds.max)}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={commitPrice}
              onKeyDown={(e) => e.key === "Enter" && commitPrice()}
              className="mt-1 w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-foreground tabular focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-subtle">{t.filters.priceRangeHint}</p>
      </Section>

      <Section title={t.filters.style}>
        <div className="flex flex-wrap gap-2">
          {styleTags.map((s) => (
            <Chip
              key={s}
              selected={isSelected("style", s)}
              onClick={() => toggleInList("style", s)}
              className="h-9 px-3.5 text-[0.8rem]"
            >
              {label(styleLabels[s], locale)}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title={t.filters.color}>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3">
          {colorIds.map((id) => {
            const selected = isSelected("color", id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleInList("color", id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-start text-[0.8rem]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                  selected
                    ? "bg-brand-soft text-foreground"
                    : "text-muted hover:bg-surface",
                )}
              >
                <span
                  className={cn(
                    "relative inline-flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-black/10",
                    selected && "ring-2 ring-brand",
                  )}
                  style={{ backgroundColor: colorSwatches[id].hex }}
                >
                  {selected && (
                    <Check
                      className="size-3.5 text-white mix-blend-difference"
                      strokeWidth={3}
                    />
                  )}
                </span>
                <span className="truncate">{label(colorSwatches[id].label, locale)}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title={t.filters.material}>
        <div className="flex flex-wrap gap-2">
          {materialIds.map((m) => (
            <Chip
              key={m}
              selected={isSelected("material", m)}
              onClick={() => toggleInList("material", m)}
              className="h-9 px-3.5 text-[0.8rem]"
            >
              {label(materialLabels[m], locale)}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title={t.filters.room}>
        <div className="flex flex-wrap gap-2">
          {roomTypes.map((r) => (
            <Chip
              key={r}
              selected={isSelected("room", r)}
              onClick={() => toggleInList("room", r)}
              className="h-9 px-3.5 text-[0.8rem]"
            >
              {label(roomLabels[r], locale)}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title={t.filters.availability}>
        <div className="flex flex-col gap-2.5">
          {stockStatuses.map((s) => (
            <label
              key={s}
              className="flex items-center gap-2.5 text-sm text-foreground"
            >
              <input
                type="checkbox"
                checked={isSelected("availability", s)}
                onChange={() => toggleInList("availability", s)}
                className="size-4 rounded border-border text-brand accent-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              />
              {t.availability[s]}
            </label>
          ))}
          <label className="mt-1 flex items-center gap-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={customOn}
              onChange={() => setParam("custom", customOn ? null : "1")}
              className="size-4 rounded border-border text-brand accent-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            />
            {t.filters.customizable}
          </label>
        </div>
      </Section>

      {onDone && (
        <div className="sticky bottom-0 -mx-5 mt-2 border-t border-border-subtle bg-elevated px-5 py-4 lg:hidden">
          <Button className="w-full" onClick={onDone}>
            {t.filters.apply}
          </Button>
        </div>
      )}
    </div>
  );
}
