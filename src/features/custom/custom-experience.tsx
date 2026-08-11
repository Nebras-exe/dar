"use client";

import * as React from "react";
import {
  ArrowLeft, ArrowRight, Check, Hammer, Image as ImageIcon,
  PencilRuler, Sparkles, Wand2,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CUSTOM_CATEGORIES,
  type CustomCategory,
  type CustomFurnitureSpec,
} from "@/lib/rfq";
import { categoryBySlug, label } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { IdeaStep } from "./steps/idea-step";
import { SpecStep } from "./steps/spec-step";
import { ReviewStep } from "./steps/review-step";
import { SuppliersStep } from "./steps/suppliers-step";
import { QuotesStep } from "./steps/quotes-step";

type Phase = "start" | "idea" | "spec" | "review" | "suppliers" | "quotes";

const CATEGORY_ICON: Record<CustomCategory, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  sofas: Hammer, chairs: Hammer, dining: Hammer, beds: Hammer,
  storage: Hammer, "tv-units": Hammer, desks: Hammer, "coffee-tables": Hammer,
};

/**
 * The Custom Furniture experience (Phase 09). A guided flow: pick a start →
 * describe your idea (deterministic demo extraction) → confirm a category-specific
 * spec → review → match real suppliers → send RFQ → compare Demo Quotes → accept.
 * AI/demo proposes; the user reviews and holds final authority; the app validates.
 */
export function CustomExperience({
  dict,
  locale,
  customerId,
  basedOnSlug,
  initialCategory,
}: {
  dict: Dictionary;
  locale: Locale;
  customerId: string;
  basedOnSlug?: string;
  initialCategory?: CustomCategory;
}) {
  const t = dict.custom;
  const [phase, setPhase] = React.useState<Phase>(initialCategory ? "idea" : "start");
  const [category, setCategory] = React.useState<CustomCategory>(initialCategory ?? "sofas");
  const [spec, setSpec] = React.useState<CustomFurnitureSpec>({
    category: initialCategory ?? "sofas",
    basedOnSlug,
    hasReferenceImage: false,
    quantity: 1,
  });
  const [chosenSuppliers, setChosenSuppliers] = React.useState<string[]>([]);
  const [requestId, setRequestId] = React.useState<string | null>(null);

  const patchSpec = (patch: Partial<CustomFurnitureSpec>) => setSpec((s) => ({ ...s, ...patch }));

  const startFlow = (cat: CustomCategory, withImage: boolean) => {
    setCategory(cat);
    setSpec((s) => ({ ...s, category: cat, hasReferenceImage: withImage }));
    setPhase("idea");
  };

  const stepOrder: Phase[] = ["idea", "spec", "review", "suppliers", "quotes"];
  const currentStep = stepOrder.indexOf(phase);

  return (
    <Section spacing="md">
      <Container width="content">
        {/* Intro */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl">
            <p className="text-eyebrow mb-2 flex items-center gap-2">
              <Wand2 className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
              {t.start.eyebrow}
            </p>
            <h1 className="text-3xl sm:text-4xl">{t.title}</h1>
            <p className="mt-3 text-lg text-muted">{t.subtitle}</p>
          </div>
          <Badge tone="neutral">{t.demoBadge}</Badge>
        </div>

        {/* Progress rail (hidden on start) */}
        {phase !== "start" && (
          <ol className="mb-8 flex flex-wrap gap-x-2 gap-y-1 text-sm" aria-label={t.title}>
            {stepOrder.map((p, i) => {
              const done = i < currentStep;
              const active = i === currentStep;
              return (
                <li key={p} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
                      active ? "bg-brand-soft text-brand font-medium" : done ? "text-foreground" : "text-subtle",
                    )}
                    aria-current={active ? "step" : undefined}
                  >
                    <span className={cn(
                      "inline-flex size-5 items-center justify-center rounded-full text-xs",
                      active ? "bg-brand text-brand-foreground" : done ? "bg-success text-white" : "bg-surface text-subtle",
                    )}>
                      {done ? <Check className="size-3" strokeWidth={3} /> : i + 1}
                    </span>
                    {t.steps[p as keyof typeof t.steps]}
                  </span>
                  {i < stepOrder.length - 1 && <span className="text-border" aria-hidden="true">·</span>}
                </li>
              );
            })}
          </ol>
        )}

        {phase === "start" && (
          <StartPhase t={t} locale={locale} category={category} setCategory={setCategory} onStart={startFlow} />
        )}

        {phase === "idea" && (
          <IdeaStep
            t={t} locale={locale} spec={spec} patchSpec={patchSpec}
            onBack={() => setPhase("start")} onNext={() => setPhase("spec")}
          />
        )}

        {phase === "spec" && (
          <SpecStep
            t={t} locale={locale} spec={spec} patchSpec={patchSpec}
            onBack={() => setPhase("idea")}
            onNext={() => setPhase("review")}
          />
        )}

        {phase === "review" && (
          <ReviewStep
            t={t} locale={locale} spec={spec}
            onEdit={() => setPhase("spec")} onBack={() => setPhase("spec")}
            onNext={() => setPhase("suppliers")}
          />
        )}

        {phase === "suppliers" && (
          <SuppliersStep
            t={t} locale={locale} spec={spec} chosen={chosenSuppliers} setChosen={setChosenSuppliers}
            customerId={customerId}
            onBack={() => setPhase("review")}
            onSent={(id) => { setRequestId(id); setPhase("quotes"); }}
          />
        )}

        {phase === "quotes" && requestId && (
          <QuotesStep
            t={t} locale={locale} customerId={customerId} requestId={requestId} spec={spec}
            onBack={() => setPhase("suppliers")}
          />
        )}
      </Container>
    </Section>
  );

  // ── Start phase ─────────────────────────────────────────────────────────────
  function StartPhase({
    t, locale, category, setCategory, onStart,
  }: {
    t: Dictionary["custom"];
    locale: Locale;
    category: CustomCategory;
    setCategory: (c: CustomCategory) => void;
    onStart: (c: CustomCategory, withImage: boolean) => void;
  }) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-foreground">{t.start.heading}</h2>

        {/* Category picker */}
        <p className="mt-5 mb-2.5 text-sm font-medium text-foreground">{t.start.chooseCategory}</p>
        <div role="radiogroup" aria-label={t.start.chooseCategory} className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {CUSTOM_CATEGORIES.map((c) => {
            const cat = categoryBySlug.get(c);
            const Icon = CATEGORY_ICON[c];
            const selected = category === c;
            return (
              <button
                key={c} type="button" role="radio" aria-checked={selected}
                onClick={() => setCategory(c)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border p-3 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                  selected ? "border-brand bg-brand-soft/50 ring-1 ring-brand" : "border-border bg-elevated hover:border-taupe hover:bg-surface",
                )}
              >
                <Icon className="size-4 shrink-0 text-brand" strokeWidth={1.6} aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">{cat ? label(cat.name, locale) : c}</span>
              </button>
            );
          })}
        </div>

        {/* Start modes */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <StartCard icon={PencilRuler} title={t.start.fromScratch} desc={t.start.fromScratchDesc} onClick={() => onStart(category, false)} />
          <StartCard icon={Sparkles} title={t.start.fromProduct} desc={t.start.fromProductDesc} onClick={() => onStart(category, false)} />
          <StartCard icon={ImageIcon} title={t.start.fromImage} desc={t.start.fromImageDesc} onClick={() => onStart(category, true)} />
        </div>
      </div>
    );
  }

  function StartCard({
    icon: Icon, title, desc, onClick,
  }: {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    title: string; desc: string; onClick: () => void;
  }) {
    return (
      <button
        type="button" onClick={onClick}
        className="flex flex-col items-start gap-2 rounded-xl border border-border-subtle bg-elevated p-5 text-start transition-colors hover:border-taupe hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <span className="flex size-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
        </span>
        <span className="font-medium text-foreground">{title}</span>
        <span className="text-sm text-muted">{desc}</span>
      </button>
    );
  }
}

/** Shared nav row for steps. */
export function StepNav({
  onBack, onNext, nextLabel, nextDisabled, backLabel,
}: {
  onBack: () => void; onNext?: () => void; nextLabel: string; nextDisabled?: boolean; backLabel: string;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3 border-t border-border-subtle pt-6">
      <Button variant="ghost" onClick={onBack} iconStart={<ArrowLeft className="size-4 rtl:rotate-180" strokeWidth={1.75} />}>
        {backLabel}
      </Button>
      {onNext && (
        <Button onClick={onNext} disabled={nextDisabled} iconEnd={<ArrowRight className="size-4 rtl:rotate-180" strokeWidth={1.75} />}>
          {nextLabel}
        </Button>
      )}
    </div>
  );
}
