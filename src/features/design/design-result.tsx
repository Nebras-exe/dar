"use client";

import * as React from "react";
import {
  Check,
  CheckCircle2,
  Info,
  RotateCcw,
  Save,
  ShoppingBag,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { categoryBySlug, formatOmr, getAllProducts, label, styleLabels } from "@/lib/catalog";
import {
  getOption,
  type DesignRecommendation,
  type DesignTier,
} from "@/lib/design";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart } from "@/features/cart/cart-context";
import { useSavedDesigns } from "@/features/account/saved-designs-store";
import { cn } from "@/lib/utils";
import type { WizardAction, WizardState } from "./wizard-state";
import { currentSummary } from "./wizard-state";
import { BudgetMeter } from "./budget-meter";
import { DesignItemCard } from "./design-item-card";
import { AgentPanel } from "./agent-panel";
import { RoomAgentPanel } from "./room-agent-panel";
import { VisualizationSection } from "./visualization-section";

const TIER_ORDER: DesignTier[] = ["smart-saver", "balanced", "premium"];

/**
 * The design result. A real-feeling plan built from catalog products: tier
 * selector, kept furniture, a per-item list with reasons + replace/remove, an
 * accessible budget meter, and the flagship "Add entire design to cart" which
 * reuses the Phase 03 cart (no duplicated cart logic).
 */
export function DesignResult({
  state,
  dispatch,
  recommendation,
  t,
  tRoom,
  locale,
}: {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  recommendation: DesignRecommendation;
  t: Dictionary["design"];
  tRoom: Dictionary["design"]["room"]["types"];
  locale: Locale;
}) {
  const tr = t.result;
  const cart = useCart();
  const savedDesigns = useSavedDesigns();
  const summary = currentSummary(state);
  const items = state.items;
  const input = recommendation.input;
  const roomName = tRoom[input.roomType];
  const styleName = label(styleLabels[input.primaryStyle], locale);
  const itemSlugs = items.map((i) => i.slug);

  const addAll = () => {
    for (const item of items) {
      cart.add(item.slug, { colorId: item.colorId, quantity: 1 });
    }
    dispatch({ type: "MARK_ADDED" });
  };

  const save = () => {
    // Persist to the saved-designs store (demo: local; Supabase: DB, owner-only).
    savedDesigns.save({
      label: "",
      roomType: input.roomType,
      primaryStyle: input.primaryStyle,
      secondaryStyle: input.secondaryStyle,
      budget: input.budget,
      newFurnitureTotal: summary?.newFurnitureTotal ?? 0,
      items: items.map((i) => ({ slug: i.slug, colorId: i.colorId })),
    });
    dispatch({ type: "MARK_SAVED" });
  };

  const isLowBudget = input.budget < 150;
  // When the whole catalog is empty, the engine can't ground any product — say so
  // honestly rather than showing an empty plan (it never fabricates products).
  const catalogEmpty = getAllProducts().length === 0;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-border-subtle pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-eyebrow mb-2">{tr.eyebrow}</p>
          <h1 className="text-3xl sm:text-4xl">{tr.title}</h1>
          <p className="mt-2 text-muted">
            {roomName} · {styleName}
          </p>
        </div>
        <Badge tone="neutral" className="w-fit">
          {t.demoMode}
        </Badge>
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-lg border border-border-subtle bg-surface px-4 py-3 text-sm text-muted">
        <Info className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
        {tr.demoNotice}
      </p>

      {/* Tier selector */}
      <div className="mt-6">
        <p className="mb-2.5 text-sm font-medium text-foreground">{tr.chooseOption}</p>
        <div
          role="radiogroup"
          aria-label={tr.chooseOption}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {TIER_ORDER.map((tier) => {
            const option = getOption(recommendation, tier);
            const selected = state.selectedTier === tier;
            const recommended = recommendation.recommendedTier === tier;
            const over = option.summary.overBudget > 0;
            return (
              <button
                key={tier}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => dispatch({ type: "SELECT_TIER", tier })}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-xl border p-4 text-start transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                  selected
                    ? "border-brand bg-brand-soft/50 ring-1 ring-brand"
                    : "border-border bg-elevated hover:border-taupe hover:bg-surface",
                )}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-[0.95rem] font-medium text-foreground">
                    {tr.tiers[tier]}
                  </span>
                  {selected && <Check className="size-4 text-brand" strokeWidth={2.5} aria-hidden="true" />}
                </div>
                <span className="text-lg font-semibold text-foreground tabular">
                  {formatOmr(option.summary.newFurnitureTotal, locale)}
                </span>
                <span className="text-xs text-subtle">{tr.tierNotes[tier]}</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {recommended && <Badge tone="brand">{tr.recommended}</Badge>}
                  {over && (
                    <Badge tone="warning">
                      {tr.overBudgetBy} {formatOmr(option.summary.overBudget, locale)}
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {isLowBudget && (
        <p className="mt-4 rounded-lg border border-border-subtle bg-surface px-4 py-3 text-sm text-muted">
          {tr.lowBudgetNote}
        </p>
      )}

      {/* Room Image Catalog Agent — analyse the uploaded room and ground every
          recommendation in the REAL catalog (Claude Vision-ready; demo by default). */}
      <div className="mt-8">
        <RoomAgentPanel input={input} design={t} locale={locale} />
      </div>

      {/* Before / After — see the design in the user's room (Phase 07) */}
      <div className="mt-8">
        <VisualizationSection
          input={input}
          items={items}
          t={t}
          locale={locale}
          dispatch={dispatch}
        />
      </div>

      {/* Athathi Agent — ask to adjust this design in natural language */}
      <div className="mt-6">
        <AgentPanel
          input={input}
          items={items}
          design={t}
          locale={locale}
          dispatch={dispatch}
        />
      </div>

      {/* Body: items + summary */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          {/* Kept furniture */}
          {getOption(recommendation, state.selectedTier).kept.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-foreground">{tr.keepingTitle}</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {getOption(recommendation, state.selectedTier).kept.map((k) => {
                  const cat = categoryBySlug.get(k.category);
                  return (
                    <li
                      key={k.category}
                      className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-surface px-4 py-3"
                    >
                      <span className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="size-4 text-success" strokeWidth={2.5} aria-hidden="true" />
                        {cat ? label(cat.name, locale) : k.category}
                      </span>
                      <Badge tone="success">{formatOmr(0, locale)}</Badge>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-xs text-subtle">{tr.keepingNote}</p>
            </section>
          )}

          {/* Custom furniture nudge — an alternative when the catalog isn't enough */}
          <p className="flex flex-wrap items-center gap-2 rounded-lg border border-border-subtle bg-surface px-4 py-3 text-sm text-muted">
            {tr.customPrompt}
            <a
              href={`/${locale}/custom`}
              className="font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {tr.customLink} <span aria-hidden="true" className="rtl:-scale-x-100">→</span>
            </a>
          </p>

          {/* Recommended items */}
          <section>
            <h2 className="text-base font-semibold text-foreground">{tr.itemsTitle}</h2>
            {items.length === 0 ? (
              <div className="mt-3">
                <EmptyState
                  icon={<ShoppingBag className="size-5" strokeWidth={1.75} />}
                  title={catalogEmpty ? tr.emptyCatalog : tr.empty}
                  action={
                    <Button variant="outline" onClick={() => dispatch({ type: "RESET" })}>
                      {tr.startOver}
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-3">
                {items.map((item, i) => (
                  <DesignItemCard
                    key={`${item.slug}-${i}`}
                    slug={item.slug}
                    reason={item.reason}
                    index={i}
                    input={input}
                    otherSlugs={itemSlugs.filter((_, idx) => idx !== i)}
                    t={tr}
                    colorsTitle={tr.colourLabel}
                    locale={locale}
                    colorId={item.colorId}
                    onReplace={(index, newSlug) =>
                      dispatch({ type: "REPLACE_ITEM", index, slug: newSlug })
                    }
                    onRemove={(index) => dispatch({ type: "REMOVE_ITEM", index })}
                    onColorChange={(index, color) =>
                      dispatch({ type: "SET_ITEM_COLOR", index, color })
                    }
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sticky summary + actions */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-4">
            {summary && <BudgetMeter summary={summary} t={tr} locale={locale} />}

            {state.addedToCart ? (
              <div className="rounded-xl border border-success/40 bg-success-soft p-5">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="size-5" strokeWidth={2} aria-hidden="true" />
                  <p className="font-semibold">{tr.addedTitle}</p>
                </div>
                <p className="mt-1.5 text-sm text-muted">{tr.addedNote}</p>
                <div className="mt-4 flex flex-col gap-2">
                  <Button href={`/${locale}/cart`} className="w-full">
                    {tr.viewCart}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => dispatch({ type: "CONTINUE_EDITING" })}
                  >
                    {tr.continueEditing}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={items.length === 0}
                  onClick={addAll}
                  iconStart={<ShoppingBag className="size-5" strokeWidth={1.75} />}
                >
                  {tr.addAll}
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={save}
                    iconStart={<Save className="size-4" strokeWidth={1.75} />}
                  >
                    {state.saved ? tr.saved : tr.saveDesign}
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "RESET" })}
                  className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-md py-1 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <RotateCcw className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  {tr.startOver}
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

