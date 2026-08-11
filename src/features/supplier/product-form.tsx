"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  categories,
  colorSwatches,
  colorIds,
  label,
  materialIds,
  materialLabels,
  roomLabels,
  roomTypes,
  styleLabels,
  styleTags,
  type ColorId,
  type MaterialId,
  type StyleTag,
} from "@/lib/catalog";
import {
  validateProductInput,
  type CustomizationOptionInput,
  type FieldError,
  type InventoryStatus,
  type ProductInput,
} from "@/lib/repository";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductPreview } from "./product-preview";

const INVENTORY: InventoryStatus[] = ["in_stock", "low_stock", "out_of_stock", "made_to_order"];
const OPTION_KINDS: CustomizationOptionInput["kind"][] = ["color", "material", "size", "legs", "fabric", "wood", "other"];

function emptyInput(): ProductInput {
  return {
    name: "", nameAr: "", description: "", descriptionAr: "",
    category: "sofas", basePrice: 0,
    dimensions: { widthCm: 0, depthCm: 0, heightCm: 0 },
    dimensionSource: "supplier_verified",
    styleTags: [], roomTypes: [], colors: [], materials: [],
    inventoryStatus: "made_to_order", stockStatus: "made-to-order",
    customizable: false, customizationOptions: [], status: "draft",
  };
}

/**
 * Sectioned supplier product form (§21/§22). Reuses the design system; validates
 * client-side with the SAME `validateProductInput` the server uses, then saves
 * (demo: local store; Supabase: DB). RTL-correct via logical properties.
 */
export function ProductForm({
  t,
  tInv,
  locale,
  initial,
  supplierName,
  onSave,
  onCancel,
}: {
  t: Dictionary["supplier"]["form"];
  tInv: Dictionary["supplier"]["inventory"];
  locale: Locale;
  initial: ProductInput | null;
  supplierName: string;
  onSave: (input: ProductInput, publish: boolean) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = React.useState<ProductInput>(initial ?? emptyInput());
  const [errors, setErrors] = React.useState<FieldError[]>([]);
  const errFor = (f: string) => errors.some((e) => e.field === f);

  const set = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) => setForm((s) => ({ ...s, [k]: v }));
  const setDim = (k: "widthCm" | "depthCm" | "heightCm", v: number) =>
    setForm((s) => ({ ...s, dimensions: { ...s.dimensions, [k]: v } }));

  const toggle = <T,>(list: T[], v: T): T[] => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const submit = (publish: boolean) => {
    const candidate: ProductInput = { ...form, status: publish ? "active" : form.status === "archived" ? "archived" : "draft" };
    const parsed = validateProductInput(candidate);
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    setErrors([]);
    onSave(parsed.value, publish);
  };

  return (
    <div className="flex flex-col gap-6">
      {errors.length > 0 && (
        <p className="rounded-lg border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-danger" role="alert">
          {t.errorsTitle}
        </p>
      )}

      {/* Basic */}
      <Fieldset legend={t.sectionBasic}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Text id="name" label={t.name} value={form.name} onChange={(v) => set("name", v)} error={errFor("name") && t.errors.name} />
          <Text id="nameAr" label={t.nameAr} value={form.nameAr} onChange={(v) => set("nameAr", v)} dir="rtl" error={errFor("nameAr") && t.errors.nameAr} />
        </div>
        <div>
          <label htmlFor="category" className="text-sm font-medium text-foreground">{t.category}</label>
          <select
            id="category" value={form.category}
            onChange={(e) => set("category", e.target.value as ProductInput["category"])}
            className="mt-1.5 h-11 w-full rounded-lg border border-border bg-elevated px-3 text-[0.95rem] text-foreground shadow-[var(--shadow-xs)] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
          >
            {categories.map((c) => <option key={c.slug} value={c.slug}>{label(c.name, locale)}</option>)}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Area id="description" label={t.description} value={form.description} onChange={(v) => set("description", v)} />
          <Area id="descriptionAr" label={t.descriptionAr} value={form.descriptionAr} onChange={(v) => set("descriptionAr", v)} dir="rtl" />
        </div>
      </Fieldset>

      {/* Pricing */}
      <Fieldset legend={t.sectionPricing}>
        <Text
          id="basePrice" label={t.basePrice} inputMode="decimal" dir="ltr" hint={t.priceHint}
          value={form.basePrice ? String(form.basePrice) : ""}
          onChange={(v) => set("basePrice", Number(v.replace(/[^\d.]/g, "")) || 0)}
          error={errFor("basePrice") && t.errors.basePrice}
        />
      </Fieldset>

      {/* Images (note only) */}
      <Fieldset legend={t.sectionImages}>
        <p className="rounded-lg border border-border-subtle bg-surface px-3.5 py-2.5 text-xs text-muted">{t.imagesNote}</p>
      </Fieldset>

      {/* Dimensions */}
      <Fieldset legend={t.sectionDimensions}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Text id="w" label={t.widthCm} inputMode="numeric" dir="ltr" value={form.dimensions.widthCm ? String(form.dimensions.widthCm) : ""} onChange={(v) => setDim("widthCm", Number(v.replace(/[^\d.]/g, "")) || 0)} error={errFor("dimensions") && t.errors.dimensions} />
          <Text id="d" label={t.depthCm} inputMode="numeric" dir="ltr" value={form.dimensions.depthCm ? String(form.dimensions.depthCm) : ""} onChange={(v) => setDim("depthCm", Number(v.replace(/[^\d.]/g, "")) || 0)} error={errFor("dimensions") && t.errors.dimensions} />
          <Text id="h" label={t.heightCm} inputMode="numeric" dir="ltr" value={form.dimensions.heightCm ? String(form.dimensions.heightCm) : ""} onChange={(v) => setDim("heightCm", Number(v.replace(/[^\d.]/g, "")) || 0)} error={errFor("dimensions") && t.errors.dimensions} />
        </div>
        <div>
          <label htmlFor="dimSource" className="text-sm font-medium text-foreground">{t.dimensionSource}</label>
          <select
            id="dimSource" value={form.dimensionSource}
            onChange={(e) => set("dimensionSource", e.target.value as ProductInput["dimensionSource"])}
            className="mt-1.5 h-11 w-full rounded-lg border border-border bg-elevated px-3 text-[0.95rem] text-foreground shadow-[var(--shadow-xs)] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 sm:w-64"
          >
            <option value="supplier_verified">{t.sourceVerified}</option>
            <option value="demo">{t.sourceDemo}</option>
            <option value="unknown">{t.sourceUnknown}</option>
          </select>
        </div>
      </Fieldset>

      {/* Materials & colours */}
      <Fieldset legend={t.sectionMaterials}>
        <ChipGroup label={t.styleTags}>
          {styleTags.map((s: StyleTag) => (
            <Chip key={s} selected={form.styleTags.includes(s)} onClick={() => set("styleTags", toggle(form.styleTags, s))}>{label(styleLabels[s], locale)}</Chip>
          ))}
        </ChipGroup>
        <ChipGroup label={t.roomTypes}>
          {roomTypes.map((r) => (
            <Chip key={r} selected={form.roomTypes.includes(r)} onClick={() => set("roomTypes", toggle(form.roomTypes, r))}>{label(roomLabels[r], locale)}</Chip>
          ))}
        </ChipGroup>
        <ChipGroup label={t.colors}>
          {colorIds.map((c: ColorId) => (
            <button
              key={c} type="button" aria-pressed={form.colors.includes(c)} aria-label={label(colorSwatches[c].label, locale)}
              onClick={() => set("colors", toggle(form.colors, c))}
              className={cn("size-7 rounded-full ring-1 ring-inset ring-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand", form.colors.includes(c) && "ring-2 ring-brand ring-offset-1 ring-offset-background")}
              style={{ backgroundColor: colorSwatches[c].hex }}
            />
          ))}
        </ChipGroup>
        <ChipGroup label={t.materials}>
          {materialIds.map((m: MaterialId) => (
            <Chip key={m} selected={form.materials.includes(m)} onClick={() => set("materials", toggle(form.materials, m))}>{label(materialLabels[m], locale)}</Chip>
          ))}
        </ChipGroup>
      </Fieldset>

      {/* Inventory */}
      <Fieldset legend={t.sectionInventory}>
        <div>
          <label htmlFor="inv" className="text-sm font-medium text-foreground">{t.inventoryStatus}</label>
          <select
            id="inv" value={form.inventoryStatus}
            onChange={(e) => {
              const v = e.target.value as InventoryStatus;
              set("inventoryStatus", v);
              set("stockStatus", v === "out_of_stock" ? "out-of-stock" : v === "made_to_order" ? "made-to-order" : "in-stock");
            }}
            className="mt-1.5 h-11 w-full rounded-lg border border-border bg-elevated px-3 text-[0.95rem] text-foreground shadow-[var(--shadow-xs)] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 sm:w-64"
          >
            {INVENTORY.map((s) => <option key={s} value={s}>{tInv[s]}</option>)}
          </select>
        </div>
      </Fieldset>

      {/* Customization */}
      <Fieldset legend={t.sectionCustomization}>
        <label className="flex items-center gap-2.5 text-sm text-foreground">
          <input type="checkbox" checked={form.customizable} onChange={(e) => set("customizable", e.target.checked)} className="size-4 rounded border-border accent-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" />
          {t.customizable}
        </label>
        {form.customizable && (
          <OptionsEditor t={t} options={form.customizationOptions} onChange={(o) => set("customizationOptions", o)} />
        )}
      </Fieldset>

      {/* Preview */}
      <Fieldset legend={t.sectionPreview}>
        <p className="mb-3 text-xs text-subtle">{t.previewNote}</p>
        <div className="max-w-xs">
          <ProductPreview input={form} supplierName={supplierName} locale={locale} />
        </div>
      </Fieldset>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 border-t border-border-subtle pt-5">
        <Button onClick={() => submit(true)}>{t.publish}</Button>
        <Button variant="outline" onClick={() => submit(false)}>{t.saveDraft}</Button>
        <Button variant="ghost" onClick={onCancel}>{t.cancel}</Button>
      </div>
    </div>
  );
}

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border border-border-subtle bg-surface/60 p-4 sm:p-5">
      <legend className="px-1 text-sm font-semibold text-foreground">{legend}</legend>
      <div className="mt-3 flex flex-col gap-4">{children}</div>
    </fieldset>
  );
}

function ChipGroup({ label: l, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">{l}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Text({
  id, label: l, value, onChange, error, hint, className, ...props
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; error?: string | false; hint?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">{l}</label>
      <input
        id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)}
        className={cn("mt-1.5 h-11 w-full rounded-lg border bg-elevated px-4 text-[0.95rem] text-foreground shadow-[var(--shadow-xs)] focus:outline-none focus:ring-2 focus:ring-brand/25", error ? "border-danger" : "border-border focus:border-brand", className)}
        {...props}
      />
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : hint ? <p className="mt-1.5 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}

function Area({ id, label: l, value, onChange, dir }: { id: string; label: string; value: string; onChange: (v: string) => void; dir?: "rtl" | "ltr" }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">{l}</label>
      <textarea id={id} dir={dir} rows={3} value={value} maxLength={2000} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full resize-y rounded-lg border border-border bg-elevated px-4 py-2.5 text-[0.95rem] leading-relaxed text-foreground shadow-[var(--shadow-xs)] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25" />
    </div>
  );
}

function OptionsEditor({
  t, options, onChange,
}: {
  t: Dictionary["supplier"]["form"];
  options: CustomizationOptionInput[];
  onChange: (o: CustomizationOptionInput[]) => void;
}) {
  const add = () => onChange([...options, { kind: "fabric", label: "", labelAr: "", priceDelta: 0 }]);
  const upd = (i: number, patch: Partial<CustomizationOptionInput>) =>
    onChange(options.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));
  const del = (i: number) => onChange(options.filter((_, idx) => idx !== i));

  return (
    <div className="mt-2 flex flex-col gap-3">
      {options.map((o, i) => (
        <div key={i} className="flex flex-wrap items-end gap-2 rounded-lg border border-border-subtle bg-elevated p-3">
          <label className="text-xs text-subtle">
            {t.optionKind}
            <select value={o.kind} onChange={(e) => upd(i, { kind: e.target.value as CustomizationOptionInput["kind"] })}
              className="mt-1 block h-9 rounded-md border border-border bg-elevated px-2 text-sm">
              {OPTION_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </label>
          <label className="flex-1 text-xs text-subtle">
            {t.optionLabel}
            <input value={o.label} onChange={(e) => upd(i, { label: e.target.value })}
              className="mt-1 block h-9 w-full rounded-md border border-border bg-elevated px-2 text-sm" />
          </label>
          <label className="text-xs text-subtle" dir="ltr">
            {t.optionPriceDelta}
            <input inputMode="decimal" value={o.priceDelta ? String(o.priceDelta) : ""} onChange={(e) => upd(i, { priceDelta: Number(e.target.value.replace(/[^\d.-]/g, "")) || 0 })}
              className="mt-1 block h-9 w-24 rounded-md border border-border bg-elevated px-2 text-sm tabular" />
          </label>
          <button type="button" onClick={() => del(i)} aria-label={t.removeOption}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
            <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-fit" onClick={add} iconStart={<Plus className="size-4" strokeWidth={2} />}>
        {t.addOption}
      </Button>
    </div>
  );
}
