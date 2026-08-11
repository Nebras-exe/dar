"use client";

import * as React from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  ARM_STYLE_OPTIONS, FINISH_OPTIONS, FIRMNESS_OPTIONS, LEG_STYLE_OPTIONS,
  MATTRESS_SIZE_OPTIONS, SHAPE_OPTIONS, STORAGE_LAYOUT_OPTIONS,
  fieldsForCategory, DIMENSION_FIELDS, validateSpec,
  type CustomFurnitureSpec, type CustomSpecFieldKey,
} from "@/lib/rfq";
import {
  colorSwatches, colorIds, label, materialIds, materialLabels,
  styleLabels, styleTags, type ColorId, type MaterialId, type StyleTag,
} from "@/lib/catalog";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import { StepNav } from "../custom-experience";

/**
 * Category-specific spec form (§6/§7/§11). Progressive disclosure: only the
 * fields relevant to the chosen category are shown. Dimensions support an
 * explicit "ask the supplier" value so the customer is never forced to invent a
 * measurement. Validated with the shared `validateSpec` before continuing.
 */
export function SpecStep({
  t, locale, spec, patchSpec, onBack, onNext,
}: {
  t: Dictionary["custom"];
  locale: Locale;
  spec: CustomFurnitureSpec;
  patchSpec: (patch: Partial<CustomFurnitureSpec>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const ts = t.spec;
  const fields = fieldsForCategory(spec.category);
  const [showErrors, setShowErrors] = React.useState(false);
  const result = validateSpec(spec);
  const errs = !result.ok ? result.errors : [];
  const errFor = (f: string) => errs.some((e) => e.field === f);

  const proceed = () => {
    if (result.ok) onNext();
    else setShowErrors(true);
  };

  return (
    <div>
      <div className="max-w-2xl">
        <h2 className="text-2xl">{ts.title}</h2>
        <p className="mt-2 text-muted">{ts.subtitle}</p>
      </div>

      {showErrors && errs.length > 0 && (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-danger" role="alert">
          {ts.errorsTitle}
          {errFor("needs-detail") && <> — {ts.errors["needs-detail"]}</>}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-6">
        {/* Quantity + budget (always shown) */}
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="qty" label={ts.quantity} value={spec.quantity} min={1}
            onChange={(n) => patchSpec({ quantity: n ?? 1 })}
            error={showErrors && errFor("quantity") ? ts.errors.quantity : undefined}
          />
          <NumberField
            id="budget" label={ts.budget} value={spec.budget} min={0} allowEmpty decimal
            hint={ts.budgetHint}
            onChange={(n) => patchSpec({ budget: n })}
            error={showErrors && errFor("budget") ? ts.errors.budget : undefined}
          />
        </div>

        {/* Category-specific fields */}
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((f) => (
            <Field key={f} fieldKey={f} ts={ts} locale={locale} spec={spec} patchSpec={patchSpec} />
          ))}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="cust-notes" className="text-sm font-medium text-foreground">{ts.notes}</label>
          <textarea
            id="cust-notes" rows={3} value={spec.notes ?? ""} maxLength={2000}
            onChange={(e) => patchSpec({ notes: e.target.value || undefined })}
            placeholder={ts.notesPlaceholder}
            className="mt-1.5 w-full resize-y rounded-lg border border-border bg-elevated px-4 py-2.5 text-[0.95rem] leading-relaxed text-foreground shadow-[var(--shadow-xs)] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
          />
        </div>
      </div>

      <StepNav onBack={onBack} onNext={proceed} nextLabel={ts.continue} backLabel={t.review.edit} />
    </div>
  );
}

function Field({
  fieldKey, ts, locale, spec, patchSpec,
}: {
  fieldKey: CustomSpecFieldKey;
  ts: Dictionary["custom"]["spec"];
  locale: Locale;
  spec: CustomFurnitureSpec;
  patchSpec: (patch: Partial<CustomFurnitureSpec>) => void;
}) {
  const fieldLabel = ts.fields[fieldKey];

  // Dimensions: number + "ask the supplier" toggle.
  if (DIMENSION_FIELDS.includes(fieldKey)) {
    const val = spec[fieldKey as "widthCm" | "depthCm" | "heightCm"];
    const isUnknown = val === "unknown";
    return (
      <div>
        <div className="flex items-center justify-between gap-2">
          <label htmlFor={`f-${fieldKey}`} className="text-sm font-medium text-foreground">{fieldLabel}</label>
          <label className="flex items-center gap-1.5 text-xs text-subtle">
            <input
              type="checkbox" checked={isUnknown}
              onChange={(e) => patchSpec({ [fieldKey]: e.target.checked ? "unknown" : undefined } as Partial<CustomFurnitureSpec>)}
              className="size-3.5 rounded border-border accent-brand"
            />
            {ts.askSupplier}
          </label>
        </div>
        <input
          id={`f-${fieldKey}`} inputMode="numeric" dir="ltr" disabled={isUnknown}
          value={typeof val === "number" ? String(val) : ""}
          onChange={(e) => {
            const n = Number(e.target.value.replace(/[^\d.]/g, ""));
            patchSpec({ [fieldKey]: Number.isFinite(n) && n > 0 ? n : undefined } as Partial<CustomFurnitureSpec>);
          }}
          className={cn(
            "mt-1.5 h-11 w-full rounded-lg border border-border bg-elevated px-4 text-[0.95rem] text-foreground shadow-[var(--shadow-xs)] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25",
            isUnknown && "opacity-50",
          )}
        />
      </div>
    );
  }

  switch (fieldKey) {
    case "style":
      return (
        <SelectField id="style" label={fieldLabel} value={spec.style ?? ""} onChange={(v) => patchSpec({ style: (v || undefined) as StyleTag | undefined })}
          options={styleTags.map((s) => ({ value: s, label: label(styleLabels[s], locale) }))} placeholder={ts.unknown} />
      );
    case "color":
      return (
        <div>
          <p className="text-sm font-medium text-foreground">{fieldLabel}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label={fieldLabel}>
            {colorIds.map((c: ColorId) => {
              const selected = spec.color === c;
              return (
                <button key={c} type="button" aria-pressed={selected} aria-label={label(colorSwatches[c].label, locale)} title={label(colorSwatches[c].label, locale)}
                  onClick={() => patchSpec({ color: selected ? undefined : c })}
                  className={cn("size-7 rounded-full ring-1 ring-inset ring-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand", selected && "ring-2 ring-brand ring-offset-1 ring-offset-elevated")}
                  style={{ backgroundColor: colorSwatches[c].hex }} />
              );
            })}
          </div>
        </div>
      );
    case "material":
      return (
        <div>
          <p className="text-sm font-medium text-foreground">{fieldLabel}</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {materialIds.map((m: MaterialId) => (
              <Chip key={m} selected={spec.material === m} onClick={() => patchSpec({ material: spec.material === m ? undefined : m })}>
                {label(materialLabels[m], locale)}
              </Chip>
            ))}
          </div>
        </div>
      );
    case "seatCount":
      return <NumberField id="seats" label={fieldLabel} value={spec.seatCount} min={1} allowEmpty onChange={(n) => patchSpec({ seatCount: n })} />;
    case "shape":
      return <OptionChips label={fieldLabel} value={spec.shape} options={SHAPE_OPTIONS} tOpts={ts.shapeOptions} onChange={(v) => patchSpec({ shape: v })} />;
    case "legStyle":
      return <OptionChips label={fieldLabel} value={spec.legStyle} options={LEG_STYLE_OPTIONS} tOpts={ts.legOptions} onChange={(v) => patchSpec({ legStyle: v })} />;
    case "armStyle":
      return <OptionChips label={fieldLabel} value={spec.armStyle} options={ARM_STYLE_OPTIONS} tOpts={ts.armOptions} onChange={(v) => patchSpec({ armStyle: v })} />;
    case "firmness":
      return <OptionChips label={fieldLabel} value={spec.firmness} options={FIRMNESS_OPTIONS} tOpts={ts.firmnessOptions} onChange={(v) => patchSpec({ firmness: v as CustomFurnitureSpec["firmness"] })} />;
    case "finish":
      return <OptionChips label={fieldLabel} value={spec.finish} options={FINISH_OPTIONS} tOpts={ts.finishOptions} onChange={(v) => patchSpec({ finish: v })} />;
    case "mattressSize":
      return <OptionChips label={fieldLabel} value={spec.mattressSize} options={MATTRESS_SIZE_OPTIONS} tOpts={ts.mattressOptions} onChange={(v) => patchSpec({ mattressSize: v })} />;
    case "storageLayout":
      return <OptionChips label={fieldLabel} value={spec.storageLayout} options={STORAGE_LAYOUT_OPTIONS} tOpts={ts.storageOptions} onChange={(v) => patchSpec({ storageLayout: v })} />;
    default:
      return null;
  }
}

function OptionChips({
  label: l, value, options, tOpts, onChange,
}: {
  label: string; value: string | undefined; options: readonly string[];
  tOpts: Record<string, string>; onChange: (v: string | undefined) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-foreground">{l}</p>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {options.map((o) => (
          <Chip key={o} selected={value === o} onClick={() => onChange(value === o ? undefined : o)}>
            {tOpts[o] ?? o}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function SelectField({
  id, label, value, options, placeholder, onChange,
}: {
  id: string; label: string; value: string; placeholder: string;
  options: { value: string; label: string }[]; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-11 w-full rounded-lg border border-border bg-elevated px-3 text-[0.95rem] text-foreground shadow-[var(--shadow-xs)] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25">
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function NumberField({
  id, label, value, min, allowEmpty, decimal, hint, error, onChange,
}: {
  id: string; label: string; value: number | "unknown" | undefined; min: number;
  allowEmpty?: boolean; decimal?: boolean; hint?: string; error?: string;
  onChange: (n: number | undefined) => void;
}) {
  const shown = typeof value === "number" ? String(value) : "";
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      <input
        id={id} inputMode={decimal ? "decimal" : "numeric"} dir="ltr" value={shown}
        aria-invalid={Boolean(error)}
        onChange={(e) => {
          const cleaned = e.target.value.replace(decimal ? /[^\d.]/g : /[^\d]/g, "");
          if (cleaned === "") { onChange(allowEmpty ? undefined : min); return; }
          const n = Number(cleaned);
          onChange(Number.isFinite(n) ? n : undefined);
        }}
        className={cn("mt-1.5 h-11 w-full rounded-lg border bg-elevated px-4 text-[0.95rem] text-foreground shadow-[var(--shadow-xs)] tabular focus:outline-none focus:ring-2 focus:ring-brand/25", error ? "border-danger" : "border-border focus:border-brand")}
      />
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : hint ? <p className="mt-1.5 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}
