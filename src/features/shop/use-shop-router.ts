"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

/** Keys considered "filters" — cleared by `clearFilters`, unlike `q`/`sort`. */
const FILTER_KEYS = [
  "category",
  "style",
  "color",
  "material",
  "room",
  "availability",
  "min",
  "max",
  "custom",
];

/**
 * Client-side helpers to drive the shop entirely through the URL. Every change
 * is a `router.push` (with `scroll: false`) so the server re-renders results,
 * back/forward works, and links are shareable.
 */
export function useShopRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const commit = React.useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const clone = React.useCallback(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );

  const setParam = React.useCallback(
    (key: string, value: string | null | undefined) => {
      const p = clone();
      if (value) p.set(key, value);
      else p.delete(key);
      commit(p);
    },
    [clone, commit],
  );

  const toggleInList = React.useCallback(
    (key: string, value: string) => {
      const p = clone();
      const set = new Set((p.get(key) ?? "").split(",").filter(Boolean));
      if (set.has(value)) set.delete(value);
      else set.add(value);
      const joined = [...set].join(",");
      if (joined) p.set(key, joined);
      else p.delete(key);
      commit(p);
    },
    [clone, commit],
  );

  const setRange = React.useCallback(
    (min: string | null, max: string | null) => {
      const p = clone();
      if (min) p.set("min", min);
      else p.delete("min");
      if (max) p.set("max", max);
      else p.delete("max");
      commit(p);
    },
    [clone, commit],
  );

  const clearFilters = React.useCallback(() => {
    const p = clone();
    for (const key of FILTER_KEYS) p.delete(key);
    commit(p);
  }, [clone, commit]);

  const isSelected = React.useCallback(
    (key: string, value: string) =>
      (searchParams.get(key) ?? "").split(",").includes(value),
    [searchParams],
  );

  return { searchParams, setParam, toggleInList, setRange, clearFilters, isSelected };
}
