"use client";

import * as React from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { sortKeys, type SortKey } from "@/lib/catalog";
import { useShopRouter } from "./use-shop-router";

/** Accessible native-select sort control bound to the `sort` URL param. */
export function SortSelect({ t }: { t: Dictionary["shop"] }) {
  const { searchParams, setParam } = useShopRouter();
  const current = (searchParams.get("sort") as SortKey) ?? "recommended";
  const selectId = React.useId();

  const optionLabel: Record<SortKey, string> = {
    recommended: t.sort.recommended,
    "price-asc": t.sort.priceAsc,
    "price-desc": t.sort.priceDesc,
    newest: t.sort.newest,
    "name-asc": t.sort.nameAsc,
  };

  return (
    <div className="relative inline-flex items-center">
      <label htmlFor={selectId} className="sr-only">
        {t.sort.label}
      </label>
      <ArrowUpDown
        className="pointer-events-none absolute start-3.5 size-4 text-muted"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <select
        id={selectId}
        value={current}
        onChange={(e) =>
          setParam("sort", e.target.value === "recommended" ? null : e.target.value)
        }
        className="h-11 appearance-none rounded-full border border-border bg-elevated ps-10 pe-10 text-sm font-medium text-foreground shadow-[var(--shadow-xs)] hover:border-taupe focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
      >
        {sortKeys.map((key) => (
          <option key={key} value={key}>
            {optionLabel[key]}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute end-3.5 size-4 text-muted"
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </div>
  );
}
