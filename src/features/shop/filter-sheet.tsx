"use client";

import * as React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { CategorySlug } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { FilterContent } from "./filter-content";

export interface FilterSheetProps {
  t: Dictionary["shop"];
  locale: Locale;
  lockedCategory?: CategorySlug;
  priceBounds: { min: number; max: number };
  activeCount: number;
}

/**
 * Mobile filter access: a trigger button that opens a full-height drawer
 * containing the same `FilterContent` used by the desktop sidebar. Escape and a
 * backdrop close it; body scroll is locked while open.
 */
export function FilterSheet(props: FilterSheetProps) {
  const { t, activeCount } = props;
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-full border border-border bg-elevated px-4 text-sm font-medium text-foreground",
          "hover:border-taupe hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:hidden",
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <SlidersHorizontal className="size-4.5" strokeWidth={1.75} />
        {t.filters.open}
        {activeCount > 0 && (
          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-semibold text-brand-foreground">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label={t.filters.title}>
          <div
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 end-0 flex w-full max-w-sm flex-col bg-elevated shadow-[var(--shadow-lg)]">
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">
                {t.filters.title}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.filters.close}
                className="inline-flex size-9 items-center justify-center rounded-full text-foreground hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <X className="size-5" strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-2">
              <FilterContent {...props} onDone={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
