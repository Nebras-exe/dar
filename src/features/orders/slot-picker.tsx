"use client";

import * as React from "react";
import { CalendarClock, Check } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { SLOT_PERIODS, upcomingDays, type DeliverySlotPeriod, type DeliveryWindow } from "@/lib/delivery";

/**
 * Shared demo delivery/installation slot picker (Phase 12, §11/§12/§22). Local
 * deterministic windows only — no live courier/technician availability, no
 * external calendar. Past dates are never offered; selection is keyboard- and
 * screen-reader-friendly. Reused by customer delivery scheduling and supplier
 * installation scheduling.
 */
export function SlotPicker({
  t, locale, onConfirm, onCancel,
}: {
  t: Dictionary["delivery"]["slots"]; locale: Locale;
  onConfirm: (window: DeliveryWindow) => void; onCancel?: () => void;
}) {
  const [days] = React.useState(() => upcomingDays(Date.now(), 7));
  const [date, setDate] = React.useState(days[0]);
  const [period, setPeriod] = React.useState<DeliverySlotPeriod>("morning");

  const fmtDay = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-OM" : "en-GB", {
      weekday: "short", day: "numeric", month: "short",
    }).format(Date.UTC(y, m - 1, d));
  };
  const hours: Record<DeliverySlotPeriod, string> = {
    morning: t.morningHours, afternoon: t.afternoonHours, evening: t.eveningHours,
  };

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4">
      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
        <CalendarClock className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
        {t.title}
      </p>
      <p className="mt-0.5 text-xs text-subtle">{t.demoLabel}</p>

      <fieldset className="mt-3">
        <legend className="text-xs font-medium text-foreground">{t.pickDate}</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {days.map((d) => (
            <label key={d} className={cn(
              "cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition-colors",
              date === d ? "border-brand bg-brand-soft/50 text-foreground" : "border-border bg-elevated text-muted hover:border-taupe",
            )}>
              <input type="radio" name="slot-date" value={d} checked={date === d} onChange={() => setDate(d)} className="sr-only" />
              {fmtDay(d)}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-3">
        <legend className="text-xs font-medium text-foreground">{t.pickPeriod}</legend>
        <div className="mt-2 grid gap-1.5 sm:grid-cols-3">
          {SLOT_PERIODS.map((p) => (
            <label key={p} className={cn(
              "flex cursor-pointer flex-col rounded-lg border px-3 py-2 text-sm transition-colors",
              period === p ? "border-brand bg-brand-soft/50 text-foreground" : "border-border bg-elevated text-muted hover:border-taupe",
            )}>
              <span className="flex items-center gap-2 font-medium">
                <input type="radio" name="slot-period" value={p} checked={period === p} onChange={() => setPeriod(p)} className="size-4 accent-[var(--brand)]" />
                {t[p]}
              </span>
              <span className="ms-6 text-xs text-subtle tabular" dir="ltr">{hours[p]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button"
          onClick={() => onConfirm({ date, period })}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
          <Check className="size-4" strokeWidth={2} aria-hidden="true" />
          {t.confirm}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
            {t.cancel}
          </button>
        )}
      </div>
    </div>
  );
}

/** Format a chosen window for display (date + period label). */
export function formatWindow(window: DeliveryWindow, t: Dictionary["delivery"]["slots"], locale: Locale): string {
  const [y, m, d] = window.date.split("-").map(Number);
  const day = new Intl.DateTimeFormat(locale === "ar" ? "ar-OM" : "en-GB", { day: "numeric", month: "short" }).format(Date.UTC(y, m - 1, d));
  return `${day} · ${t[window.period]}`;
}
