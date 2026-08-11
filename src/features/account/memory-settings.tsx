"use client";

import * as React from "react";
import {
  Brain, Check, Info, Palette, Sofa, Trash2, Wallet, X,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { formatOmr, styleTags, colorIds, materialIds } from "@/lib/catalog";
import type { MemoryCategory } from "@/lib/memory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMemory } from "./memory-store";

/**
 * Account → Design memory & preferences (Phase 13, §13/§36). Premium, calm,
 * transparent: an opt-in master switch, a use-in-design switch, editable chips for
 * styles/colours/materials, a budget range, and clear separation of "Clear all"
 * vs "Turn off". Honest privacy copy; never claims encryption. Browser-local in
 * Demo Mode. Clearing memory NEVER touches orders (§38 — separate stores).
 */
export function MemorySettings({
  t, locale, userId,
}: {
  t: Dictionary["memory"]; locale: Locale; userId: string;
}) {
  const m = useMemory(userId);
  const [confirm, setConfirm] = React.useState<null | "clear" | "disable">(null);
  if (!m.hydrated) return <div className="h-40 animate-pulse rounded-xl bg-surface" aria-hidden="true" />;

  const enabled = m.profile.consent.enabled;

  return (
    <section aria-labelledby="memory-heading">
      <h2 id="memory-heading" className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Brain className="size-5 text-brand" strokeWidth={1.75} aria-hidden="true" />
        {t.title}
      </h2>
      <p className="mt-1 max-w-prose text-sm text-muted">{t.subtitle}</p>

      {/* Consent switches */}
      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border-subtle bg-elevated p-4">
        <Toggle
          checked={enabled}
          onChange={(v) => { if (!v) setConfirm("disable"); else m.setEnabled(true); }}
          label={t.enable}
          hint={t.enableHint}
        />
        <Toggle
          checked={m.profile.consent.useInDesign}
          disabled={!enabled}
          onChange={(v) => m.setUseInDesign(v)}
          label={t.useInDesign}
          hint={t.useInDesignHint}
        />
        <p className="flex items-start gap-1.5 rounded-lg bg-surface px-3 py-2 text-xs text-subtle">
          <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {t.localNote} {t.safety}
        </p>
      </div>

      {enabled && (
        <div className="mt-4 flex flex-col gap-4">
          <PreferenceEditor category="style" icon={Sofa} title={t.sections.styles} empty={t.empty.styles}
            values={m.profile.styles.map((e) => e.value)} options={styleTags} t={t}
            onAdd={(v) => m.remember("style", v)} onRemove={(v) => m.forget("style", v)} />
          <PreferenceEditor category="color" icon={Palette} title={t.sections.colors} empty={t.empty.colors}
            values={m.profile.colors.map((e) => e.value)} options={colorIds} t={t}
            onAdd={(v) => m.remember("color", v)} onRemove={(v) => m.forget("color", v)} />
          <PreferenceEditor category="material" icon={Sofa} title={t.sections.materials} empty={t.empty.materials}
            values={m.profile.materials.map((e) => e.value)} options={materialIds} t={t}
            onAdd={(v) => m.remember("material", v)} onRemove={(v) => m.forget("material", v)} />

          <BudgetEditor t={t} locale={locale}
            budget={m.profile.budget ? { min: m.profile.budget.typicalMin, max: m.profile.budget.typicalMax } : null}
            onSave={(min, max) => m.setBudget(min, max)} onClear={() => m.clearBudget()} />

          {/* Clear all (separate from disable — §37) */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface p-4">
            <p className="text-sm text-muted">{t.clearAll}</p>
            <Button size="sm" variant="outline" onClick={() => setConfirm("clear")}
              iconStart={<Trash2 className="size-4" strokeWidth={1.75} />}>{t.clearAll}</Button>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm === "clear" ? t.clearAllConfirm : t.disableConfirm}
          confirmLabel={confirm === "clear" ? t.clearAllConfirmYes : t.disable}
          cancelLabel={t.cancel}
          onConfirm={() => { if (confirm === "clear") m.clearAll(); else m.setEnabled(false); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </section>
  );
}

function Toggle({
  checked, onChange, label, hint, disabled,
}: {
  checked: boolean; onChange: (v: boolean) => void; label: string; hint: string; disabled?: boolean;
}) {
  return (
    <label className={cn("flex items-start justify-between gap-3", disabled && "opacity-50")}>
      <span className="min-w-0">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="mt-0.5 block text-xs text-muted">{hint}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          checked ? "bg-brand" : "bg-border",
        )}
      >
        <span className={cn("inline-block size-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0.5 rtl:-translate-x-0.5")} />
      </button>
    </label>
  );
}

function PreferenceEditor({
  category, icon: Icon, title, empty, values, options, t, onAdd, onRemove,
}: {
  category: MemoryCategory; icon: React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>;
  title: string; empty: string; values: string[]; options: readonly string[];
  t: Dictionary["memory"]; onAdd: (v: string) => void; onRemove: (v: string) => void;
}) {
  const [adding, setAdding] = React.useState(false);
  const available = options.filter((o) => !values.includes(o));
  return (
    <div className="rounded-xl border border-border-subtle bg-elevated p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon className="size-4 text-brand" strokeWidth={1.75} aria-hidden={true} />
          {title}
        </p>
        {available.length > 0 && (
          <button type="button" onClick={() => setAdding((v) => !v)}
            className="rounded-md text-xs font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
            {t.add}
          </button>
        )}
      </div>
      {values.length === 0 ? (
        <p className="mt-2 text-xs text-muted">{empty}</p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {values.map((v) => (
            <li key={v}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface py-1 pe-1 ps-3 text-sm text-foreground">
                {labelFor(category, v)}
                <button type="button" onClick={() => onRemove(v)} aria-label={`${t.remove} ${labelFor(category, v)}`}
                  className="inline-flex size-5 items-center justify-center rounded-full text-subtle hover:bg-elevated hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  <X className="size-3.5" strokeWidth={2} aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      {adding && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border-subtle pt-3">
          {available.map((o) => (
            <button key={o} type="button" onClick={() => { onAdd(o); setAdding(false); }}
              className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted transition-colors hover:border-brand hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
              {labelFor(category, o)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Title-case a taxonomy id for display (labels live in the taxonomy; this is a light fallback). */
function labelFor(_category: MemoryCategory, value: string): string {
  return value.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function BudgetEditor({
  t, locale, budget, onSave, onClear,
}: {
  t: Dictionary["memory"]; locale: Locale; budget: { min: number; max: number } | null;
  onSave: (min: number, max: number) => void; onClear: () => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [min, setMin] = React.useState(String(budget?.min ?? ""));
  const [max, setMax] = React.useState(String(budget?.max ?? ""));
  return (
    <div className="rounded-xl border border-border-subtle bg-elevated p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Wallet className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
          {t.sections.budget}
        </p>
        {!editing && (
          <button type="button" onClick={() => setEditing(true)}
            className="rounded-md text-xs font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
            {budget ? t.edit : t.add}
          </button>
        )}
      </div>
      {editing ? (
        <form className="mt-3 flex flex-wrap items-end gap-2" onSubmit={(e) => {
          e.preventDefault();
          const lo = Number(min), hi = Number(max);
          if (Number.isFinite(lo) && Number.isFinite(hi)) { onSave(lo, hi); setEditing(false); }
        }}>
          <label className="text-xs">
            <span className="font-medium text-foreground">{t.budgetMin}</span>
            <input type="number" min={0} value={min} onChange={(e) => setMin(e.target.value)} dir="ltr"
              className="mt-1 h-9 w-28 rounded-lg border border-border bg-surface px-2 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25" />
          </label>
          <label className="text-xs">
            <span className="font-medium text-foreground">{t.budgetMax}</span>
            <input type="number" min={0} value={max} onChange={(e) => setMax(e.target.value)} dir="ltr"
              className="mt-1 h-9 w-28 rounded-lg border border-border bg-surface px-2 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25" />
          </label>
          <Button type="submit" size="sm" iconStart={<Check className="size-4" strokeWidth={2} />}>{t.save}</Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>{t.cancel}</Button>
        </form>
      ) : budget ? (
        <p className="mt-2 flex items-center gap-2 text-sm text-foreground tabular">
          <Badge tone="neutral">{formatOmr(budget.min, locale)} – {formatOmr(budget.max, locale)}</Badge>
          <button type="button" onClick={onClear} className="text-xs text-subtle hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">{t.remove}</button>
        </p>
      ) : (
        <p className="mt-2 text-xs text-muted">{t.empty.budget}</p>
      )}
    </div>
  );
}

function ConfirmDialog({
  title, confirmLabel, cancelLabel, onConfirm, onCancel,
}: {
  title: string; confirmLabel: string; cancelLabel: string; onConfirm: () => void; onCancel: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onCancel(); }
    document.addEventListener("keydown", onKey);
    ref.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" role="presentation" onClick={onCancel}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-border-subtle bg-elevated p-5 shadow-[var(--shadow-lg)] focus:outline-none">
        <p className="text-sm text-foreground">{title}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
          <Button size="sm" variant="destructive" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
