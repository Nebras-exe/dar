"use client";

import * as React from "react";
import {
  Sofa,
  BedDouble,
  Users,
  UtensilsCrossed,
  Briefcase,
  Baby,
  Trees,
  Check,
  Pencil,
  Sparkles,
  ImageOff,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  categoryBySlug,
  colorSwatches,
  label,
  materialLabels,
  styleLabels,
  type ColorId,
  type MaterialId,
  type StyleTag,
} from "@/lib/catalog";
import type { DesignRoomType, FurnitureDisposition } from "@/lib/design";
import { detectedKeepItems, type DetectedItem } from "@/lib/vision";
import { Chip } from "@/components/ui/chip";
import { cn, formatNumber } from "@/lib/utils";
import { ImageUpload } from "./image-upload";
import { VisionPanel } from "./vision-panel";
import { useRoomImage } from "./room-image-context";
import {
  MAX_BUDGET,
  MIN_BUDGET,
  parseBudget,
  type WizardAction,
  type WizardState,
} from "./wizard-state";

// ── Shared choice sets (all real machine values from the Phase 03 taxonomy) ──
const ROOM_TYPES: { id: DesignRoomType; icon: LucideIcon }[] = [
  { id: "living-room", icon: Sofa },
  { id: "bedroom", icon: BedDouble },
  { id: "majlis", icon: Users },
  { id: "dining-room", icon: UtensilsCrossed },
  { id: "office", icon: Briefcase },
  { id: "kids-room", icon: Baby },
  { id: "outdoor", icon: Trees },
];

const STYLE_CHOICES: StyleTag[] = [
  "warm-modern",
  "modern",
  "japandi",
  "minimal",
  "contemporary",
  "classic-modern",
  "boho",
];

const COLOR_CHOICES: ColorId[] = [
  "ivory",
  "beige",
  "cream",
  "sand",
  "taupe",
  "grey",
  "charcoal",
  "walnut",
  "oak",
  "terracotta",
  "sage",
  "olive",
  "navy",
];

const MATERIAL_CHOICES: MaterialId[] = [
  "boucle",
  "linen",
  "velvet",
  "wool",
  "leather",
  "walnut",
  "oak",
  "rattan",
  "metal",
  "glass",
  "marble",
];

const BUDGET_QUICK = [200, 350, 500, 750, 1000];

type D = Dictionary["design"];
type StepProps = {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  t: D;
  locale: Locale;
};

function StepHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 max-w-xl">
      <h2 className="text-2xl sm:text-[1.75rem]">{title}</h2>
      {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
    </div>
  );
}

function DemoHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 rounded-lg border border-border-subtle bg-surface px-4 py-3 text-sm text-muted">
      {children}
    </p>
  );
}

function budgetLabel(value: number, locale: Locale): string {
  return locale === "ar"
    ? `${formatNumber(value, "ar")} ر.ع`
    : `OMR ${formatNumber(value, "en")}`;
}

// ── Step 1: Upload + optional room analysis ──────────────────────────────────
export function UploadStep({ state, dispatch, t, locale }: StepProps) {
  // The actual File lives in the session-scoped room-image context (never in the
  // reducer / never persisted). It's what the vision panel sends for analysis and
  // what the Phase 07 before/after preview reuses at the result phase.
  const { file, setFile } = useRoomImage();
  const showVision = Boolean(file) || Boolean(state.analysis);

  return (
    <div>
      <StepHeader title={t.upload.title} subtitle={t.upload.subtitle} />
      <ImageUpload
        t={t.upload}
        imageName={state.draft.imageName}
        onSet={(name) => dispatch({ type: "SET_IMAGE", name })}
        onClear={() => {
          dispatch({ type: "CLEAR_IMAGE" });
          dispatch({ type: "CLEAR_ANALYSIS" });
          setFile(null);
        }}
        onFile={setFile}
      />
      {showVision ? (
        <VisionPanel
          file={file}
          analysis={state.analysis}
          applied={state.analysisApplied}
          design={t}
          locale={locale}
          dispatch={dispatch}
        />
      ) : (
        <>
          <DemoHint>{t.upload.demoNote}</DemoHint>
          <p className="mt-2 text-sm text-subtle">{t.upload.skipNote}</p>
        </>
      )}
    </div>
  );
}

// ── Step 2: Room type ───────────────────────────────────────────────────────
export function RoomStep({ state, dispatch, t }: StepProps) {
  return (
    <div>
      <StepHeader title={t.room.title} subtitle={t.room.subtitle} />
      <div role="radiogroup" aria-label={t.room.title} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ROOM_TYPES.map(({ id, icon: Icon }) => {
          const selected = state.draft.roomType === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => dispatch({ type: "SET_ROOM", room: id })}
              className={cn(
                "flex flex-col items-start gap-3 rounded-xl border p-4 text-start transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                selected
                  ? "border-brand bg-brand-soft/50 ring-1 ring-brand"
                  : "border-border bg-elevated hover:border-taupe hover:bg-surface",
              )}
            >
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg",
                  selected ? "bg-brand text-brand-foreground" : "bg-surface text-brand",
                )}
              >
                <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span className="text-[0.95rem] font-medium text-foreground">
                {t.room.types[id]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 3: Budget ──────────────────────────────────────────────────────────
export function BudgetStep({ state, dispatch, t, locale }: StepProps) {
  const text = state.draft.budgetText;
  const value = parseBudget(text);
  let error: string | null = null;
  if (text.trim() !== "") {
    if (!Number.isFinite(value) || value <= 0) error = t.budget.errorInvalid;
    else if (value < MIN_BUDGET) error = t.budget.errorTooLow;
    else if (value > MAX_BUDGET) error = t.budget.errorTooHigh;
  }
  const errorId = "budget-error";

  return (
    <div>
      <StepHeader title={t.budget.title} subtitle={t.budget.subtitle} />
      <div className="max-w-sm">
        <label htmlFor="budget-input" className="text-sm font-medium text-foreground">
          {t.budget.label}
        </label>
        <div className="relative mt-1.5">
          <span className="pointer-events-none absolute inset-y-0 start-4 flex items-center text-sm font-medium text-subtle">
            {locale === "ar" ? "ر.ع" : "OMR"}
          </span>
          <input
            id="budget-input"
            type="text"
            inputMode="numeric"
            dir="ltr"
            value={text}
            placeholder={t.budget.placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            onChange={(e) => dispatch({ type: "SET_BUDGET_TEXT", text: e.target.value })}
            className={cn(
              "h-12 w-full rounded-lg border bg-elevated ps-14 pe-4 text-lg text-foreground tabular shadow-[var(--shadow-xs)]",
              "focus:outline-none focus:ring-2 focus:ring-brand/25",
              error ? "border-danger focus:border-danger" : "border-border focus:border-brand",
            )}
          />
        </div>
        {error ? (
          <p id={errorId} className="mt-2 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : (
          <p className="mt-2 text-xs text-subtle">{t.budget.hint}</p>
        )}
      </div>

      <div className="mt-6">
        <p className="mb-2.5 text-sm font-medium text-foreground">{t.budget.quick}</p>
        <div className="flex flex-wrap gap-2">
          {BUDGET_QUICK.map((amount) => (
            <Chip
              key={amount}
              selected={value === amount}
              onClick={() => dispatch({ type: "SET_BUDGET_TEXT", text: String(amount) })}
            >
              {budgetLabel(amount, locale)}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Style ───────────────────────────────────────────────────────────
export function StyleStep({ state, dispatch, t, locale }: StepProps) {
  const { primaryStyle, secondaryStyle, styleMode } = state.draft;
  const ai = t.style.aiRecommend;
  const isAi = styleMode === "ai-recommended";
  // The AI style only exists once the room photo has been analysed.
  const aiStyle = isAi ? primaryStyle : undefined;
  const hasAnalysis = Boolean(state.analysis);

  return (
    <div>
      <StepHeader title={t.style.title} subtitle={t.style.subtitle} />

      {/* Prominent: let DAR recommend the best style from the room photo. */}
      <button
        type="button"
        role="radio"
        aria-checked={isAi}
        onClick={() => dispatch({ type: "SET_STYLE_MODE", mode: "ai-recommended" })}
        className={cn(
          "flex w-full items-start gap-3 rounded-xl border p-4 text-start transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          isAi
            ? "border-brand bg-brand-soft/50 ring-1 ring-brand"
            : "border-border bg-elevated hover:border-taupe hover:bg-surface",
        )}
      >
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", isAi ? "bg-brand text-brand-foreground" : "bg-surface text-brand")}>
          <Sparkles className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-2 text-[0.95rem] font-semibold text-foreground">
            {ai.title}
            {isAi && <Check className="size-4 shrink-0 text-brand" strokeWidth={2.5} aria-hidden="true" />}
          </span>
          <span className="mt-0.5 block text-sm text-muted">{ai.subtitle}</span>
        </span>
      </button>

      {/* AI-recommended feedback: either the chosen style, or a prompt to upload. */}
      {isAi && (
        aiStyle ? (
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-brand/30 bg-brand-soft/40 px-4 py-3 text-sm text-foreground">
            <span className="font-medium">{ai.chosen}</span>
            <span className="font-semibold text-brand">{label(styleLabels[aiStyle], locale)}</span>
            <span className="text-muted">· {ai.changeHint}</span>
          </p>
        ) : (
          <p className="mt-3 flex items-start gap-2 rounded-lg border border-warning/40 bg-warning-soft px-4 py-3 text-sm text-foreground">
            <ImageOff className="mt-0.5 size-4 shrink-0 text-warning" strokeWidth={1.75} aria-hidden="true" />
            {hasAnalysis ? ai.noStyleDetected : ai.needPhoto}
          </p>
        )
      )}

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border-subtle" />
        <span className="text-xs uppercase tracking-wide text-subtle">{ai.orChoose}</span>
        <span className="h-px flex-1 bg-border-subtle" />
      </div>

      <p className="mb-2.5 text-sm font-medium text-foreground">{t.style.primary}</p>
      <div role="radiogroup" aria-label={t.style.primary} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {STYLE_CHOICES.map((s) => {
          const selected = !isAi && primaryStyle === s;
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => dispatch({ type: "SET_PRIMARY_STYLE", style: s })}
              className={cn(
                "flex items-center justify-between gap-2 rounded-xl border px-4 py-3.5 text-start transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                selected
                  ? "border-brand bg-brand-soft/50 ring-1 ring-brand"
                  : "border-border bg-elevated hover:border-taupe hover:bg-surface",
              )}
            >
              <span className="text-[0.95rem] font-medium text-foreground">
                {label(styleLabels[s], locale)}
              </span>
              {selected && <Check className="size-4 shrink-0 text-brand" strokeWidth={2.5} aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <p className="mb-2.5 mt-6 text-sm font-medium text-foreground">{t.style.secondary}</p>
      <div className="flex flex-wrap gap-2">
        <Chip
          selected={!secondaryStyle}
          onClick={() => dispatch({ type: "SET_SECONDARY_STYLE", style: undefined })}
        >
          {t.style.clearSecondary}
        </Chip>
        {STYLE_CHOICES.filter((s) => s !== primaryStyle).map((s) => (
          <Chip
            key={s}
            selected={secondaryStyle === s}
            onClick={() =>
              dispatch({
                type: "SET_SECONDARY_STYLE",
                style: secondaryStyle === s ? undefined : s,
              })
            }
          >
            {label(styleLabels[s], locale)}
          </Chip>
        ))}
      </div>
    </div>
  );
}

// ── Step 5: Existing furniture (ONLY what the room photo actually shows) ──────
const DISPOSITIONS: FurnitureDisposition[] = ["keep", "replace", "unsure"];

/** One detected item's keep/replace/unsure control. */
function KeepRow({
  item,
  state,
  dispatch,
  t,
  locale,
}: StepProps & { item: DetectedItem }) {
  const cat = item.category;
  const name = categoryBySlug.get(cat);
  const catName = name ? label(name.name, locale) : item.rawLabel;
  // Default to the detection's suggestion, else neutral "unsure" — never auto-replace.
  const current = state.draft.decisions[cat] ?? item.suggestion ?? "unsure";
  const dispositionLabel: Record<FurnitureDisposition, string> = {
    keep: t.existing.keep,
    replace: t.existing.replace,
    unsure: t.existing.unsure,
  };
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="flex items-center gap-2 text-[0.95rem] font-medium text-foreground">
        {catName}
        {item.approximateColorId && (
          <span
            className="size-3 rounded-full ring-1 ring-inset ring-black/10"
            style={{ backgroundColor: colorSwatches[item.approximateColorId].hex }}
            aria-hidden="true"
          />
        )}
      </span>
      <div
        role="radiogroup"
        aria-label={catName}
        className="inline-flex rounded-full border border-border bg-elevated p-0.5"
      >
        {DISPOSITIONS.map((disp) => {
          const selected = current === disp;
          return (
            <button
              key={disp}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => dispatch({ type: "SET_DECISION", category: cat, disposition: disp })}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                selected
                  ? disp === "keep"
                    ? "bg-success text-white"
                    : "bg-foreground text-background"
                  : "text-muted hover:text-foreground",
              )}
            >
              {dispositionLabel[disp]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ExistingStep({ state, dispatch, t, locale }: StepProps) {
  // Source of truth: the actual room-photo analysis — never a hardcoded list.
  const { items, maybe } = detectedKeepItems(state.analysis);
  const rowProps = { state, dispatch, t, locale };

  return (
    <div>
      <StepHeader title={t.existing.title} subtitle={t.existing.subtitle} />

      {!state.analysis ? (
        // No photo analysed → we can't know what's in the room. Ask for a photo.
        <p className="flex items-start gap-2 rounded-lg border border-border-subtle bg-surface px-4 py-3.5 text-sm text-muted">
          <ImageOff className="mt-0.5 size-4 shrink-0 text-subtle" strokeWidth={1.75} aria-hidden="true" />
          {t.existing.needPhoto}
        </p>
      ) : items.length === 0 && maybe.length === 0 ? (
        // Analysed, but no furniture detected → honest almost-empty-room state.
        <p className="flex items-start gap-2 rounded-lg border border-border-subtle bg-surface px-4 py-3.5 text-sm text-muted">
          <Check className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={2} aria-hidden="true" />
          {t.existing.emptyRoom}
        </p>
      ) : (
        <>
          {items.length > 0 && (
            <div className="flex flex-col divide-y divide-border-subtle">
              {items.map((item) => (
                <KeepRow key={item.category} item={item} {...rowProps} />
              ))}
            </div>
          )}

          {maybe.length > 0 && (
            <div className="mt-6">
              <p className="mb-1 text-sm font-medium text-foreground">{t.existing.maybeTitle}</p>
              <div className="flex flex-col divide-y divide-border-subtle">
                {maybe.map((item) => (
                  <KeepRow key={item.category} item={item} {...rowProps} />
                ))}
              </div>
            </div>
          )}

          <DemoHint>{t.existing.detectedNote}</DemoHint>
        </>
      )}
    </div>
  );
}

// ── Step 6: Preferences ─────────────────────────────────────────────────────
export function PreferencesStep({ state, dispatch, t, locale }: StepProps) {
  const { preferredColors, preferredMaterials, note } = state.draft;
  return (
    <div>
      <StepHeader title={t.preferences.title} subtitle={t.preferences.subtitle} />

      <fieldset className="mb-6">
        <legend className="mb-2.5 text-sm font-medium text-foreground">
          {t.preferences.colors}{" "}
          <span className="font-normal text-subtle">· {t.preferences.optional}</span>
        </legend>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3">
          {COLOR_CHOICES.map((id) => {
            const selected = preferredColors.includes(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => dispatch({ type: "TOGGLE_COLOR", color: id })}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-start text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                  selected ? "bg-brand-soft text-foreground" : "text-muted hover:bg-surface",
                )}
              >
                <span
                  className={cn(
                    "relative inline-flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-black/10",
                    selected && "ring-2 ring-brand",
                  )}
                  style={{ backgroundColor: colorSwatches[id].hex }}
                >
                  {selected && <Check className="size-3.5 text-white mix-blend-difference" strokeWidth={3} />}
                </span>
                <span className="truncate">{label(colorSwatches[id].label, locale)}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="mb-2.5 text-sm font-medium text-foreground">
          {t.preferences.materials}{" "}
          <span className="font-normal text-subtle">· {t.preferences.optional}</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {MATERIAL_CHOICES.map((m) => (
            <Chip
              key={m}
              selected={preferredMaterials.includes(m)}
              onClick={() => dispatch({ type: "TOGGLE_MATERIAL", material: m })}
            >
              {label(materialLabels[m], locale)}
            </Chip>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="design-note" className="text-sm font-medium text-foreground">
          {t.preferences.note}{" "}
          <span className="font-normal text-subtle">· {t.preferences.optional}</span>
        </label>
        <textarea
          id="design-note"
          rows={3}
          value={note}
          maxLength={400}
          placeholder={t.preferences.notePlaceholder}
          onChange={(e) => dispatch({ type: "SET_NOTE", note: e.target.value })}
          aria-describedby="design-note-hint"
          className="mt-1.5 w-full resize-y rounded-lg border border-border bg-elevated px-4 py-2.5 text-[0.95rem] leading-relaxed text-foreground shadow-[var(--shadow-xs)] placeholder:text-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
        />
        <p id="design-note-hint" className="mt-1.5 text-xs text-subtle">
          {t.preferences.noteHint}
        </p>
      </div>
    </div>
  );
}

// ── Step 7: Review ──────────────────────────────────────────────────────────
export function ReviewStep({ state, dispatch, t, locale }: StepProps) {
  const d = state.draft;
  const budget = parseBudget(d.budgetText);

  const rows: { key: string; label: string; value: string; step: number }[] = [
    {
      key: "room",
      label: t.review.room,
      value: d.roomType ? t.room.types[d.roomType] : t.review.none,
      step: 1,
    },
    {
      key: "budget",
      label: t.review.budget,
      value: Number.isFinite(budget) ? budgetLabel(budget, locale) : t.review.none,
      step: 2,
    },
    {
      key: "style",
      label: t.review.style,
      value: d.primaryStyle
        ? [d.primaryStyle, d.secondaryStyle]
            .filter(Boolean)
            .map((s) => label(styleLabels[s as StyleTag], locale))
            .join(" · ")
        : t.review.none,
      step: 3,
    },
    {
      key: "keeping",
      label: t.review.keeping,
      value:
        Object.entries(d.decisions)
          .filter(([, disp]) => disp === "keep")
          .map(([cat]) => {
            const c = categoryBySlug.get(cat as never);
            return c ? label(c.name, locale) : cat;
          })
          .join("، ") || t.review.none,
      step: 4,
    },
    {
      key: "colors",
      label: t.review.colors,
      value:
        d.preferredColors.map((c) => label(colorSwatches[c].label, locale)).join("، ") ||
        t.review.none,
      step: 5,
    },
    {
      key: "materials",
      label: t.review.materials,
      value:
        d.preferredMaterials.map((m) => label(materialLabels[m], locale)).join("، ") ||
        t.review.none,
      step: 5,
    },
    {
      key: "photo",
      label: t.review.photo,
      value: d.imageName ? t.review.photoAdded : t.review.none,
      step: 0,
    },
  ];
  if (d.note.trim()) {
    rows.push({ key: "note", label: t.review.note, value: d.note.trim(), step: 5 });
  }

  return (
    <div>
      <StepHeader title={t.review.title} subtitle={t.review.subtitle} />
      <dl className="divide-y divide-border-subtle rounded-xl border border-border-subtle bg-surface">
        {rows.map((row) => (
          <div key={row.key} className="flex items-start justify-between gap-4 px-5 py-3.5">
            <div className="min-w-0">
              <dt className="text-xs uppercase tracking-wide text-subtle">{row.label}</dt>
              <dd className="mt-0.5 text-[0.95rem] text-foreground">{row.value}</dd>
            </div>
            <button
              type="button"
              onClick={() => dispatch({ type: "GO_TO_STEP", step: row.step })}
              className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <Pencil className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
              {t.review.edit}
            </button>
          </div>
        ))}
      </dl>
    </div>
  );
}
