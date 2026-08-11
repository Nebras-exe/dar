"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface WizardProgressProps {
  names: string[];
  current: number;
  locale: string;
  labels: { step: string; of: string; progress: string };
  onJump?: (step: number) => void;
}

/**
 * Elegant, restrained progress. Desktop: a labelled step rail (numbers →
 * checks). Mobile: a compact "Step n of m" line + a thin progress bar. Visited
 * steps are keyboard-navigable; the current step carries `aria-current`.
 */
export function WizardProgress({
  names,
  current,
  locale,
  labels,
  onJump,
}: WizardProgressProps) {
  const total = names.length;
  const pct = Math.round(((current + 1) / total) * 100);

  return (
    <div>
      {/* Desktop rail */}
      <nav aria-label={labels.progress} className="hidden md:block">
        <ol className="flex items-center">
          {names.map((name, i) => {
            const state = i < current ? "done" : i === current ? "current" : "todo";
            const clickable = i < current && onJump;
            const dot = (
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  state === "done" && "bg-brand text-brand-foreground",
                  state === "current" && "bg-foreground text-background",
                  state === "todo" && "border border-border bg-elevated text-subtle",
                )}
              >
                {state === "done" ? (
                  <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
                ) : (
                  formatNumber(i + 1, locale)
                )}
              </span>
            );
            return (
              <li key={name} className="flex flex-1 items-center last:flex-none">
                {clickable ? (
                  <button
                    type="button"
                    onClick={() => onJump(i)}
                    className="group flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {dot}
                    <span className="text-sm font-medium text-muted group-hover:text-foreground">
                      {name}
                    </span>
                  </button>
                ) : (
                  <span className="flex items-center gap-2" aria-current={state === "current" ? "step" : undefined}>
                    {dot}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        state === "current" ? "text-foreground" : "text-subtle",
                      )}
                    >
                      {name}
                    </span>
                  </span>
                )}
                {i < total - 1 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mx-3 h-px flex-1",
                      i < current ? "bg-brand/50" : "bg-border",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile compact */}
      <div className="md:hidden">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium text-foreground">{names[current]}</p>
          <p className="text-xs text-muted tabular">
            {labels.step} {formatNumber(current + 1, locale)} {labels.of}{" "}
            {formatNumber(total, locale)}
          </p>
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuenow={current + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={labels.progress}
        >
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-[var(--duration-base)] ease-[var(--ease-soft)]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
