"use client";

import * as React from "react";
import Image from "next/image";
import {
  Bot,
  Check,
  Info,
  Loader2,
  PackageSearch,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  categoryBySlug,
  colorSwatches,
  formatOmr,
  label,
  materialLabels,
  styleLabels,
} from "@/lib/catalog";
import type { DesignInput } from "@/lib/design";
import type { InteriorDesignRun, RunErrorCode } from "@/lib/interior-agents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRoomImage } from "./room-image-context";

/**
 * Room Image Catalog Agent panel (LOCAL/DEMO-safe).
 *
 * Runs the ONE focused agent server-side (`POST /api/interior-agent/run`): it
 * analyses the uploaded room, plans what the room needs, then grounds every
 * recommendation in the REAL Athathi catalog (deterministic — the model never
 * invents a product, price, variant or image). Budget is computed in code; the
 * result carries a RenderSpec allow-list for the visualization hand-off.
 *
 * Prepared for Claude Vision but never forces a live call: with no
 * `ANTHROPIC_API_KEY` the whole run is the deterministic Demo path. The panel
 * shows which engine produced the result and stays honest on empty/no-match.
 */

type Status = "idle" | "running" | "done" | "error";

interface RunResponse {
  ok: boolean;
  code?: RunErrorCode;
  run?: InteriorDesignRun;
}

export function RoomAgentPanel({
  input,
  design,
  locale,
}: {
  input: DesignInput;
  design: Dictionary["design"];
  locale: Locale;
}) {
  const t = design.roomAgent;
  const { file } = useRoomImage();

  const [status, setStatus] = React.useState<Status>("idle");
  const [run, setRun] = React.useState<InteriorDesignRun | null>(null);
  const [errorCode, setErrorCode] = React.useState<RunErrorCode | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => () => abortRef.current?.abort(), []);

  async function analyze() {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("running");
    setRun(null);
    setErrorCode(null);

    const form = new FormData();
    form.set("roomType", input.roomType);
    form.set("budget", String(input.budget));
    form.set("primaryStyle", input.primaryStyle);
    if (input.secondaryStyle) form.set("secondaryStyle", input.secondaryStyle);
    form.set("locale", locale);
    if (file) form.set("image", file);

    try {
      const res = await fetch("/api/interior-agent/run", {
        method: "POST",
        body: form,
        signal: controller.signal,
      });
      const data = (await res.json()) as RunResponse;
      if (data.ok && data.run) {
        setRun(data.run);
        setStatus("done");
      } else {
        setErrorCode(data.code ?? "unknown");
        setStatus("error");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setErrorCode("unknown");
      setStatus("error");
    }
  }

  return (
    <section
      aria-labelledby="room-agent-title"
      className="rounded-2xl border border-border bg-elevated p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
            <Bot className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div>
            <h2 id="room-agent-title" className="text-base font-semibold text-foreground">
              {t.title}
            </h2>
            <p className="mt-0.5 max-w-prose text-sm text-muted">{t.subtitle}</p>
          </div>
        </div>
        <Badge tone="neutral" className="shrink-0">{design.demoMode}</Badge>
      </div>

      {/* Catalog-only guarantee */}
      <p className="mt-4 flex items-start gap-2 rounded-lg border border-border-subtle bg-surface px-4 py-3 text-sm text-muted">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
        {t.catalogOnlyNote}
      </p>

      {status !== "done" && (
        <div className="mt-4">
          <Button
            onClick={analyze}
            disabled={status === "running"}
            iconStart={
              status === "running" ? (
                <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
              ) : (
                <ScanSearch className="size-4" strokeWidth={1.75} />
              )
            }
          >
            {status === "running" ? t.running : file ? t.analyzeCta : t.analyzeNoImageCta}
          </Button>
          {!file && (
            <p className="mt-2 text-xs text-subtle">{t.noImageHint}</p>
          )}
        </div>
      )}

      {status === "error" && (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-warning/40 bg-warning-soft px-4 py-3 text-sm text-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-warning" strokeWidth={1.75} aria-hidden="true" />
          {errorCode === "no-catalog-matches" ? t.catalogEmpty : t.errorGeneric}
        </p>
      )}

      {status === "done" && run && (
        <RoomAgentResult run={run} t={t} design={design} locale={locale} onRerun={analyze} />
      )}
    </section>
  );
}

function RoomAgentResult({
  run,
  t,
  design,
  locale,
  onRerun,
}: {
  run: InteriorDesignRun;
  t: Dictionary["design"]["roomAgent"];
  design: Dictionary["design"];
  locale: Locale;
  onRerun: () => void;
}) {
  const analysis = run.roomAnalysis;
  const selections = run.catalogSelections;
  const budget = run.budgetResult;
  const spec = run.renderSpec;
  const usesClaude = run.provider.designer === "claude" || run.provider.vision === "provider";

  const unmet = run.warnings.filter((w) => w.code === "no_catalog_match");

  return (
    <div className="mt-5 flex flex-col gap-6">
      {/* Engine + provenance */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={usesClaude ? "brand" : "neutral"}>
          {usesClaude ? design.engine.claudeMode : design.engine.demoMode}
        </Badge>
        {run.provider.model && (
          <span className="text-xs text-subtle" translate="no">{run.provider.model}</span>
        )}
      </div>

      {/* Room analysis */}
      {analysis && (
        <div>
          <h3 className="text-sm font-semibold text-foreground">{t.analysisTitle}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {analysis.style.primary && (
              <Badge tone="neutral">{label(styleLabels[analysis.style.primary], locale)}</Badge>
            )}
            {analysis.palette.slice(0, 5).map((c, i) =>
              c.mappedColorId ? (
                <span
                  key={`${c.mappedColorId}-${i}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-foreground"
                >
                  <span
                    className="size-3 rounded-full ring-1 ring-inset ring-black/10"
                    style={{ backgroundColor: colorSwatches[c.mappedColorId].hex }}
                    aria-hidden="true"
                  />
                  {label(colorSwatches[c.mappedColorId].label, locale)}
                </span>
              ) : null,
            )}
          </div>

          {/* Existing furniture the agent proposes to KEEP (the only non-catalog items) */}
          {analysis.existingFurniture.filter((f) => f.suggestion === "keep" && f.category).length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-foreground">{t.keepTitle}</p>
              <ul className="mt-1.5 flex flex-wrap gap-2">
                {analysis.existingFurniture
                  .filter((f) => f.suggestion === "keep" && f.category)
                  .map((f, i) => {
                    const cat = categoryBySlug.get(f.category!);
                    return (
                      <li
                        key={`${f.category}-${i}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border bg-surface px-2.5 py-1 text-xs text-muted"
                      >
                        <Check className="size-3 text-success" strokeWidth={2.5} aria-hidden="true" />
                        {cat ? label(cat.name, locale) : f.category}
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Recommended REAL catalog products */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <PackageSearch className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
          {t.productsTitle}
        </h3>
        {selections.length === 0 ? (
          <p className="mt-2 text-sm text-muted">{t.noMatch}</p>
        ) : (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {selections.map((s) => {
              const cat = categoryBySlug.get(s.category);
              const variantColor = locale === "ar" ? s.variantColorAr : s.variantColorEn;
              return (
                <li
                  key={s.slug}
                  className="flex gap-3 rounded-xl border border-border-subtle bg-surface p-3"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-elevated ring-1 ring-border-subtle">
                    {s.imageRef ? (
                      <Image src={s.imageRef} alt={locale === "ar" ? s.nameAr : s.nameEn} fill sizes="64px" className="object-cover" />
                    ) : (
                      <span className="flex size-full items-center justify-center text-subtle">
                        <PackageSearch className="size-5" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <a
                      href={`/${locale}/product/${s.slug}`}
                      className="line-clamp-1 text-sm font-medium text-foreground hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      {locale === "ar" ? s.nameAr : s.nameEn}
                    </a>
                    <p className="mt-0.5 text-xs text-subtle">{cat ? label(cat.name, locale) : s.category}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground tabular">{formatOmr(s.priceOmr, locale)}</span>
                      {variantColor && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted">
                          {s.colorId && (
                            <span className="size-2.5 rounded-full ring-1 ring-inset ring-black/10" style={{ backgroundColor: colorSwatches[s.colorId].hex }} aria-hidden="true" />
                          )}
                          {variantColor}
                        </span>
                      )}
                      {s.variantMaterialId && (
                        <span className="text-xs text-subtle">{label(materialLabels[s.variantMaterialId], locale)}</span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Unmet needs — honest */}
      {unmet.length > 0 && (
        <p className="flex items-start gap-2 rounded-lg border border-border-subtle bg-surface px-4 py-3 text-sm text-muted">
          <Info className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
          {t.unmetPrefix}{" "}
          {unmet
            .map((w) => {
              const cat = w.context ? categoryBySlug.get(w.context as never) : undefined;
              return cat ? label(cat.name, locale) : w.context;
            })
            .filter(Boolean)
            .join("، ")}
        </p>
      )}

      {/* Budget (deterministic) */}
      {budget && (
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted">{t.budgetTotal}</span>
            <span className="font-semibold text-foreground tabular">{formatOmr(budget.total, locale)}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-3 text-sm">
            <span className="text-muted">{budget.withinBudget ? t.budgetRemaining : t.budgetOver}</span>
            <span className={cn("font-medium tabular", budget.withinBudget ? "text-success" : "text-warning")}>
              {formatOmr(budget.withinBudget ? budget.remaining : budget.exceededBy, locale)}
            </span>
          </div>
        </div>
      )}

      {/* Visualization hand-off: the allow-list */}
      {spec && (
        <div className="rounded-xl border border-brand/30 bg-brand-soft/40 p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
            {t.handoffTitle}
          </h3>
          <p className="mt-1.5 text-sm text-muted">{t.handoffNote}</p>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-surface px-3 py-2">
              <dt className="text-xs text-subtle">{t.handoffInserts}</dt>
              <dd className="font-medium text-foreground tabular">{spec.insertProducts.length}</dd>
            </div>
            <div className="rounded-lg bg-surface px-3 py-2">
              <dt className="text-xs text-subtle">{t.handoffKeep}</dt>
              <dd className="font-medium text-foreground tabular">{spec.preserveExistingFurniture.length}</dd>
            </div>
          </dl>
          <p className="mt-3 flex items-start gap-2 text-xs text-subtle">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            {t.handoffConstraint}
          </p>
        </div>
      )}

      <div>
        <Button variant="outline" onClick={onRerun} iconStart={<ScanSearch className="size-4" strokeWidth={1.75} />}>
          {t.rerun}
        </Button>
      </div>
    </div>
  );
}
