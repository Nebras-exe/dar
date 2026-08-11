"use client";

import * as React from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatOmr } from "@/lib/catalog";
import type { BudgetSummary } from "@/lib/design";
import { cn, formatNumber } from "@/lib/utils";

/**
 * Accessible budget meter. State is never conveyed by colour alone: the used
 * percentage and remaining/over amounts are always shown as text, and the bar
 * has a `role=progressbar` with value text. Over-budget adds a distinct
 * pattern-free danger fill plus an explicit "Over budget by …" line.
 */
export function BudgetMeter({
  summary,
  t,
  locale,
}: {
  summary: BudgetSummary;
  t: Dictionary["design"]["result"];
  locale: Locale;
}) {
  const over = summary.overBudget > 0;
  const pct = summary.budget > 0
    ? Math.min(100, Math.round((summary.newFurnitureTotal / summary.budget) * 100))
    : 0;

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-5">
      <dl className="flex flex-col gap-2.5">
        <Row label={t.budget} value={formatOmr(summary.budget, locale)} />
        <Row label={t.newFurniture} value={formatOmr(summary.newFurnitureTotal, locale)} strong />
        {summary.keptCount > 0 && (
          <Row label={t.existingKept} value={formatOmr(0, locale)} muted />
        )}
        <div className="my-1 border-t border-border-subtle" />
        {over ? (
          <Row
            label={t.overBudgetBy}
            value={formatOmr(summary.overBudget, locale)}
            danger
          />
        ) : (
          <Row label={t.remaining} value={formatOmr(summary.remaining, locale)} accent />
        )}
      </dl>

      <div className="mt-4">
        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuenow={Math.round(summary.newFurnitureTotal)}
          aria-valuemin={0}
          aria-valuemax={Math.round(summary.budget)}
          aria-label={t.budgetUsed}
        >
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-soft)]",
              over ? "bg-danger" : "bg-brand",
            )}
            style={{ width: `${over ? 100 : pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted tabular">
          {formatNumber(pct, locale)}% {t.budgetUsed}
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  muted,
  accent,
  danger,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={cn("text-sm", muted ? "text-subtle" : "text-muted")}>{label}</dt>
      <dd
        className={cn(
          "tabular text-[0.95rem]",
          strong && "font-semibold text-foreground",
          accent && "font-semibold text-success",
          danger && "font-semibold text-danger",
          !strong && !accent && !danger && "text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
