"use client";

import { Pencil } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import {
  categoryBySlug, colorSwatches, formatOmr, label, materialLabels, styleLabels,
} from "@/lib/catalog";
import { formatNumber } from "@/lib/utils";
import type { CustomFurnitureSpec } from "@/lib/rfq";
import { StepNav } from "../custom-experience";

/**
 * Spec review (§10). Shows the structured specification before any RFQ is sent —
 * "Not specified" / "Ask the supplier" for unset fields, never silently sending
 * incomplete or wrong details. The user can jump back to edit.
 */
export function ReviewStep({
  t, locale, spec, onEdit, onBack, onNext,
}: {
  t: Dictionary["custom"];
  locale: Locale;
  spec: CustomFurnitureSpec;
  onEdit: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const tr = t.review;
  const cat = categoryBySlug.get(spec.category);

  const dim = (v: CustomFurnitureSpec["widthCm"]) =>
    v === "unknown" ? tr.askSupplier : typeof v === "number" ? `${formatNumber(v, locale)} ${locale === "ar" ? "سم" : "cm"}` : tr.notSpecified;
  const text = (v: string | undefined, map?: Record<string, string>) =>
    v ? (map?.[v] ?? v) : tr.notSpecified;

  const rows: { key: string; label: string; value: string }[] = [
    { key: "category", label: t.start.chooseCategory, value: cat ? label(cat.name, locale) : spec.category },
    { key: "quantity", label: tr.quantity, value: formatNumber(spec.quantity, locale) },
    { key: "budget", label: tr.budget, value: spec.budget !== undefined ? formatOmr(spec.budget, locale) : tr.notSpecified },
    { key: "style", label: t.spec.fields.style, value: spec.style ? label(styleLabels[spec.style], locale) : tr.notSpecified },
    { key: "color", label: t.spec.fields.color, value: spec.color ? label(colorSwatches[spec.color].label, locale) : tr.notSpecified },
    { key: "material", label: t.spec.fields.material, value: spec.material ? label(materialLabels[spec.material], locale) : tr.notSpecified },
    { key: "width", label: t.spec.fields.widthCm, value: dim(spec.widthCm) },
    { key: "depth", label: t.spec.fields.depthCm, value: dim(spec.depthCm) },
    { key: "height", label: t.spec.fields.heightCm, value: dim(spec.heightCm) },
    { key: "shape", label: t.spec.fields.shape, value: text(spec.shape, t.spec.shapeOptions) },
    { key: "seats", label: t.spec.fields.seatCount, value: spec.seatCount ? formatNumber(spec.seatCount, locale) : tr.notSpecified },
    { key: "reference", label: tr.reference, value: spec.hasReferenceImage ? tr.referenceAdded : tr.referenceNone },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-2xl">
          <h2 className="text-2xl">{tr.title}</h2>
          <p className="mt-2 text-muted">{tr.subtitle}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit} iconStart={<Pencil className="size-4" strokeWidth={1.75} />}>
          {tr.edit}
        </Button>
      </div>

      <dl className="mt-6 divide-y divide-border-subtle rounded-xl border border-border-subtle bg-surface">
        {rows.map((r) => (
          <div key={r.key} className="flex items-start justify-between gap-4 px-5 py-3">
            <dt className="text-sm text-subtle">{r.label}</dt>
            <dd className="min-w-0 text-end text-[0.95rem] font-medium text-foreground">{r.value}</dd>
          </div>
        ))}
      </dl>

      {spec.notes && (
        <div className="mt-4 rounded-xl border border-border-subtle bg-surface px-5 py-3">
          <dt className="text-sm text-subtle">{t.spec.notes}</dt>
          <dd className="mt-1 text-[0.95rem] text-foreground">{spec.notes}</dd>
        </div>
      )}

      <StepNav onBack={onBack} onNext={onNext} nextLabel={tr.findSuppliers} backLabel={tr.edit} />
    </div>
  );
}
