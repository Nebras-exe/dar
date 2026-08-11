"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { useShopRouter } from "./use-shop-router";

/**
 * Debounced catalog search bound to the `q` URL param. A real `role=search`
 * form so it also works on submit for keyboard/no-JS-timing users.
 */
export function SearchBar({ t }: { t: Dictionary["shop"] }) {
  const { searchParams, setParam } = useShopRouter();
  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = React.useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = React.useState(urlQuery);
  const debounce = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reflect external URL changes (clear all, back button) without an effect —
  // React's "adjust state while rendering" pattern.
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setValue(urlQuery);
  }

  const push = React.useCallback(
    (next: string) => setParam("q", next.trim() || null),
    [setParam],
  );

  const onChange = (next: string) => {
    setValue(next);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => push(next), 300);
  };

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (debounce.current) clearTimeout(debounce.current);
        push(value);
      }}
      className="relative flex-1"
    >
      <Search
        className="pointer-events-none absolute start-3.5 top-1/2 size-4.5 -translate-y-1/2 text-subtle"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.search.placeholder}
        aria-label={t.search.label}
        className="h-11 w-full rounded-full border border-border bg-elevated ps-11 pe-10 text-[0.95rem] text-foreground shadow-[var(--shadow-xs)] placeholder:text-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            push("");
          }}
          aria-label={t.search.clear}
          className="absolute end-2.5 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      )}
    </form>
  );
}
