"use client";

import * as React from "react";
import { Check, Loader2, ScanSearch, ShieldCheck, Sparkles, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { colorSwatches, categoryBySlug, label, styleLabels } from "@/lib/catalog";
import {
  analysisToPrefill,
  confidenceBand,
  type RoomAnalysis,
  type VisionErrorCode,
} from "@/lib/vision";
import type { DesignRoomType, FurnitureDisposition } from "@/lib/design";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WizardAction } from "./wizard-state";

type VStatus = "idle" | "preparing" | "analyzing" | "structuring";

interface AnalyzeResponse {
  ok: boolean;
  code?: VisionErrorCode;
  analysis?: RoomAnalysis;
}

/**
 * The Phase 05 room-analysis panel, shown inside Step 1 once a photo exists.
 * Flow: privacy + consent → analyse (server-side) → review detected room / palette
 * / furniture with edits → apply as a wizard pre-fill (user always wins). Honest
 * throughout: real analysis is clearly distinguished from a labelled sample, and
 * when no provider is configured the user is guided to continue manually.
 */
export function VisionPanel({
  file,
  analysis,
  applied,
  design,
  locale,
  dispatch,
}: {
  file: File | null;
  analysis: RoomAnalysis | null;
  applied: boolean;
  design: Dictionary["design"];
  locale: Locale;
  dispatch: React.Dispatch<WizardAction>;
}) {
  const t = design.vision;
  const [consent, setConsent] = React.useState(false);
  const [status, setStatus] = React.useState<VStatus>("idle");
  const [error, setError] = React.useState<VisionErrorCode | null>(null);
  const [configured, setConfigured] = React.useState<boolean | null>(null);

  // One-time capability probe (boolean only — no secrets exposed).
  React.useEffect(() => {
    let alive = true;
    fetch("/api/vision/analyze", { method: "GET" })
      .then((r) => r.json())
      .then((d: { configured?: boolean }) => alive && setConfigured(Boolean(d.configured)))
      .catch(() => alive && setConfigured(false));
    return () => {
      alive = false;
    };
  }, []);

  const busy = status !== "idle";

  async function runAnalysis(mode: "auto" | "demo") {
    setError(null);
    setStatus("preparing");
    try {
      const form = new FormData();
      form.set("mode", mode);
      if (file) form.set("image", file);
      setStatus("analyzing");
      const res = await fetch("/api/vision/analyze", { method: "POST", body: form });
      const data = (await res.json()) as AnalyzeResponse;
      setStatus("structuring");
      if (data.ok && data.analysis) {
        dispatch({ type: "SET_ANALYSIS", analysis: data.analysis });
      } else {
        setError(data.code ?? "unknown");
      }
    } catch {
      setError("unknown");
    } finally {
      setStatus("idle");
    }
  }

  if (analysis) {
    return (
      <AnalysisReview
        analysis={analysis}
        applied={applied}
        design={design}
        locale={locale}
        dispatch={dispatch}
        onReanalyze={() => {
          dispatch({ type: "CLEAR_ANALYSIS" });
          setConsent(false);
        }}
      />
    );
  }

  if (busy) {
    const statusText =
      status === "preparing"
        ? t.statusPreparing
        : status === "structuring"
          ? t.statusStructuring
          : t.statusAnalyzing;
    return (
      <div
        className="mt-5 flex items-center gap-3 rounded-xl border border-border-subtle bg-surface px-4 py-4"
        aria-live="polite"
      >
        <Loader2 className="size-5 shrink-0 animate-spin text-brand" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-foreground">{t.analyzing}</p>
          <p className="text-xs text-muted">{statusText}</p>
        </div>
      </div>
    );
  }

  const canAnalyzeReal = configured === true;

  return (
    <div className="mt-5 rounded-xl border border-border-subtle bg-surface p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <ScanSearch className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[0.95rem] font-semibold text-foreground">{t.title}</h3>
            <Badge tone="neutral">{t.optional}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted">{t.intro}</p>
        </div>
      </div>

      {error && (
        <p
          className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-danger"
          role="alert"
        >
          {t.errors[error]}
        </p>
      )}

      {canAnalyzeReal ? (
        <div className="mt-4 rounded-lg border border-border-subtle bg-elevated p-3.5">
          <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <ShieldCheck className="size-4 text-accent" strokeWidth={1.75} aria-hidden="true" />
            {t.privacyTitle}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{t.privacyBody}</p>
          <label className="mt-3 flex items-start gap-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 size-4 rounded border-border text-brand accent-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            />
            <span>{t.consentLabel}</span>
          </label>
        </div>
      ) : (
        configured === false && (
          <p className="mt-4 rounded-lg border border-border-subtle bg-elevated px-3.5 py-2.5 text-xs leading-relaxed text-muted">
            {t.demoOnlyNote}
          </p>
        )
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {canAnalyzeReal ? (
          <Button
            onClick={() => runAnalysis("auto")}
            disabled={!consent || !file}
            iconStart={<Sparkles className="size-4.5" strokeWidth={1.75} />}
          >
            {t.analyze}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => runAnalysis("demo")}
            disabled={configured === null}
            iconStart={<Sparkles className="size-4.5" strokeWidth={1.75} />}
          >
            {t.analyzeSample}
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Review sub-component ───────────────────────────────────────────────────────

function AnalysisReview({
  analysis,
  applied,
  design,
  locale,
  dispatch,
  onReanalyze,
}: {
  analysis: RoomAnalysis;
  applied: boolean;
  design: Dictionary["design"];
  locale: Locale;
  dispatch: React.Dispatch<WizardAction>;
  onReanalyze: () => void;
}) {
  const t = design.vision;
  const tr = t.review;
  const isDemo = analysis.source === "demo";

  const [furniture, setFurniture] = React.useState(
    analysis.existingFurniture.filter((f) => f.category !== null),
  );

  const bandLabel = (c: number) => tr.confidence[confidenceBand(c)];

  const apply = () => {
    const edited: RoomAnalysis = { ...analysis, existingFurniture: furniture };
    dispatch({ type: "APPLY_PREFILL", prefill: analysisToPrefill(edited) });
  };

  const dispositions: FurnitureDisposition[] = ["keep", "replace", "unsure"];
  const dispositionLabel: Record<FurnitureDisposition, string> = {
    keep: design.existing.keep,
    replace: design.existing.replace,
    unsure: design.existing.unsure,
  };

  return (
    <div className="mt-5 rounded-xl border border-border-subtle bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-[0.95rem] font-semibold text-foreground">{tr.title}</h3>
          <p className="mt-1 text-sm text-muted">{tr.subtitle}</p>
        </div>
        <Badge tone={isDemo ? "warning" : "accent"}>{isDemo ? tr.sampleBadge : tr.aiBadge}</Badge>
      </div>

      {isDemo && (
        <p className="mt-3 rounded-lg border border-border-subtle bg-elevated px-3.5 py-2.5 text-xs text-muted">
          {tr.sampleNotice}
        </p>
      )}

      <dl className="mt-4 flex flex-col gap-4">
        <Row label={tr.roomLabel}>
          {analysis.roomType !== "unknown" ? (
            <span className="inline-flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {design.room.types[analysis.roomType as DesignRoomType]}
              </span>
              <ConfidencePill text={bandLabel(analysis.roomTypeConfidence)} c={analysis.roomTypeConfidence} />
            </span>
          ) : (
            <span className="text-sm text-subtle">{tr.notDetected}</span>
          )}
        </Row>

        <Row label={tr.styleLabel}>
          {analysis.style.primary ? (
            <span className="inline-flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {[analysis.style.primary, analysis.style.secondary]
                  .filter(Boolean)
                  .map((s) => label(styleLabels[s!], locale))
                  .join(" · ")}
              </span>
              <ConfidencePill text={bandLabel(analysis.style.confidence)} c={analysis.style.confidence} />
            </span>
          ) : (
            <span className="text-sm text-subtle">{tr.notDetected}</span>
          )}
        </Row>

        {analysis.palette.length > 0 && (
          <Row label={tr.paletteLabel}>
            <div className="flex flex-wrap gap-2">
              {analysis.palette.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated py-1 ps-1.5 pe-2.5 text-xs text-foreground"
                >
                  <span
                    className="size-4 rounded-full ring-1 ring-inset ring-black/10"
                    style={{ backgroundColor: c.mappedColorId ? colorSwatches[c.mappedColorId].hex : "#cabfae" }}
                    aria-hidden="true"
                  />
                  {c.mappedColorId ? label(colorSwatches[c.mappedColorId].label, locale) : c.raw}
                </span>
              ))}
            </div>
          </Row>
        )}

        {analysis.architecturalFeatures.length > 0 && (
          <Row label={tr.featuresLabel}>
            <div className="flex flex-wrap gap-1.5">
              {analysis.architecturalFeatures.map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-surface px-2.5 py-1 text-xs text-muted ring-1 ring-inset ring-border"
                >
                  {t.features[f]}
                </span>
              ))}
            </div>
          </Row>
        )}
      </dl>

      {furniture.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-foreground">{tr.furnitureLabel}</p>
          <ul className="flex flex-col gap-2.5">
            {furniture.map((item, i) => {
              const cat = item.category ? categoryBySlug.get(item.category) : null;
              return (
                <li
                  key={`${item.category}-${i}`}
                  className="flex flex-col gap-2.5 rounded-lg border border-border-subtle bg-elevated p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      {cat ? label(cat.name, locale) : item.rawLabel}
                      <ConfidencePill text={bandLabel(item.confidence)} c={item.confidence} />
                    </span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                      {item.approximateColorId && (
                        <span className="inline-flex items-center gap-1">
                          <span
                            className="size-3 rounded-full ring-1 ring-inset ring-black/10"
                            style={{ backgroundColor: colorSwatches[item.approximateColorId].hex }}
                            aria-hidden="true"
                          />
                          {label(colorSwatches[item.approximateColorId].label, locale)}
                        </span>
                      )}
                      <span className="text-subtle">
                        · {tr.suggestionLabel}: {t.suggestionReason[item.suggestion]}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      role="radiogroup"
                      aria-label={cat ? label(cat.name, locale) : item.rawLabel}
                      className="inline-flex rounded-full border border-border bg-surface p-0.5"
                    >
                      {dispositions.map((disp) => {
                        const selected = item.suggestion === disp;
                        return (
                          <button
                            key={disp}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() =>
                              setFurniture((prev) =>
                                prev.map((f, idx) => (idx === i ? { ...f, suggestion: disp } : f)),
                              )
                            }
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
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
                    <button
                      type="button"
                      onClick={() => setFurniture((prev) => prev.filter((_, idx) => idx !== i))}
                      aria-label={tr.remove}
                      className="inline-flex size-8 items-center justify-center rounded-full text-muted hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      <X className="size-4" strokeWidth={2} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="mt-4 text-xs text-subtle">{tr.dimensionsUnknown}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-border-subtle pt-4">
        {applied ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
            <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
            {tr.applied}
          </span>
        ) : (
          <Button onClick={apply} iconStart={<Check className="size-4.5" strokeWidth={2} />}>
            {tr.apply}
          </Button>
        )}
        <button type="button" onClick={onReanalyze} className={cn(buttonClasses("ghost", "md"), "text-muted")}>
          {t.reanalyze}
        </button>
      </div>
      {applied && <p className="mt-2 text-xs text-subtle">{tr.applyHint}</p>}
    </div>
  );
}

function Row({ label: l, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-32 shrink-0 text-xs uppercase tracking-wide text-subtle">{l}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

/** Confidence shown as a labelled pill (never colour-only). */
function ConfidencePill({ text, c }: { text: string; c: number }) {
  const band = confidenceBand(c);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[0.7rem] font-medium ring-1 ring-inset",
        band === "high" && "text-success ring-success/30",
        band === "medium" && "text-warning ring-warning/40",
        band === "low" && "text-muted ring-border",
      )}
    >
      {text}
    </span>
  );
}
