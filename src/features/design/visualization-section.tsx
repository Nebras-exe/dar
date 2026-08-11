"use client";

import * as React from "react";
import {
  ImageOff,
  Info,
  Loader2,
  RefreshCw,
  Sparkles,
  TriangleAlert,
  Wand2,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDirection } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { DesignInput, DesignItem } from "@/lib/design";
import {
  buildVisualizationRequest,
  currentDesignFingerprint,
  isPreviewStale,
  type VisualizationErrorCode,
  type VisualizationSuccess,
} from "@/lib/visualization";
import type { ColorId } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WizardAction } from "./wizard-state";
import { useRoomImage } from "./room-image-context";
import { VisualizationCompare } from "./visualization-preview";
import { VisualizationProductCard } from "./visualization-product-card";
import { RoomIllustration } from "@/features/home/room-illustration";

interface CapabilityResponse {
  configured?: boolean;
  mode?: "live" | "demo";
}

/**
 * Phase 07 — the before/after room visualization, embedded in the design result.
 * Turns the current design + the user's room photo into a premium before/after
 * preview. Demo Mode composes a labelled preview locally (the photo never leaves
 * the browser); a real provider path is ready but not configured here. The
 * preview tracks a design fingerprint and goes STALE when the design changes.
 */
export function VisualizationSection({
  input,
  items,
  t,
  locale,
  dispatch,
}: {
  input: DesignInput;
  items: DesignItem[];
  t: Dictionary["design"];
  locale: Locale;
  dispatch: React.Dispatch<WizardAction>;
}) {
  const tv = t.visualization;
  const dir = getDirection(locale);
  const { url: roomUrl } = useRoomImage();

  const [mode, setMode] = React.useState<"live" | "demo" | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [preview, setPreview] = React.useState<VisualizationSuccess | null>(null);
  const [error, setError] = React.useState<VisualizationErrorCode | null>(null);
  const [usedSample, setUsedSample] = React.useState(false);

  // Capability probe — booleans/enum only, no secrets.
  React.useEffect(() => {
    let alive = true;
    fetch("/api/visualization/generate", { method: "GET" })
      .then((r) => r.json())
      .then((d: CapabilityResponse) => alive && setMode(d.mode ?? "demo"))
      .catch(() => alive && setMode("demo"));
    return () => {
      alive = false;
    };
  }, []);

  const currentFingerprint = React.useMemo(
    () => currentDesignFingerprint(input, items),
    [input, items],
  );
  const stale = preview ? isPreviewStale(currentFingerprint, preview.designFingerprint) : false;

  const generate = React.useCallback(async () => {
    if (busy || items.length === 0) return;
    setBusy(true);
    setError(null);
    // Demo path: the room photo stays in the browser; only the structured,
    // catalog-validated request is sent. Track whether a sample room is used.
    setUsedSample(!roomUrl);
    try {
      const request = buildVisualizationRequest(input, items, locale);
      const res = await fetch("/api/visualization/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = (await res.json()) as
        | VisualizationSuccess
        | { ok: false; code: VisualizationErrorCode };
      if (data.ok) {
        setPreview(data);
      } else {
        setError(data.code);
      }
    } catch {
      setError("unknown");
    } finally {
      setBusy(false);
    }
  }, [busy, items, input, locale, roomUrl]);

  const onColor = (index: number, color: ColorId) =>
    dispatch({ type: "SET_ITEM_COLOR", index, color });

  const hasPreview = Boolean(preview);
  const showBadge = mode === "demo" ? tv.demoBadge : tv.aiBadge;

  return (
    <section
      aria-label={tv.title}
      className="rounded-2xl border border-border-subtle bg-surface p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <Wand2 className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{tv.title}</h2>
            <p className="mt-0.5 text-sm text-muted">{tv.subtitle}</p>
          </div>
        </div>
        {mode && hasPreview && (
          <Badge tone={mode === "demo" ? "neutral" : "accent"}>{showBadge}</Badge>
        )}
      </div>

      {error && (
        <p
          className="mt-4 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-danger"
          role="alert"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {tv.errors[error]}
        </p>
      )}

      {/* ── Idle: a CTA over the room (or a sample room) ──────────────────────── */}
      {!hasPreview && !busy && (
        <div className="mt-5">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-cream shadow-[var(--shadow-md)]">
            {roomUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
              <img src={roomUrl} alt={tv.beforeLabel} className="size-full object-cover" />
            ) : (
              <RoomIllustration variant="before" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-charcoal/35 p-4 text-center backdrop-blur-[1px]">
              <Button
                onClick={generate}
                disabled={items.length === 0}
                iconStart={<Sparkles className="size-4.5" strokeWidth={1.75} />}
              >
                {tv.cta}
              </Button>
              {!roomUrl && (
                <p className="max-w-xs text-xs font-medium text-background/90">
                  {tv.needPhotoBody}
                </p>
              )}
            </div>
          </div>
          {!roomUrl && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-subtle">
              <ImageOff className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
              {tv.needPhotoTitle}
            </p>
          )}
        </div>
      )}

      {/* ── Generating ───────────────────────────────────────────────────────── */}
      {busy && (
        <div
          className="mt-5 flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 rounded-xl border border-border-subtle bg-elevated"
          aria-live="polite"
        >
          <Loader2 className="size-6 animate-spin text-brand" aria-hidden="true" />
          <p className="text-sm text-muted">{tv.generating}</p>
        </div>
      )}

      {/* ── Ready / Stale ────────────────────────────────────────────────────── */}
      {hasPreview && !busy && preview && (
        <div className="mt-5">
          {/* Stale banner */}
          {stale && (
            <div className="mb-4 flex flex-col gap-2.5 rounded-lg border border-warning/40 bg-warning-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <RefreshCw className="size-4 text-warning" strokeWidth={2} aria-hidden="true" />
                  {tv.staleTitle}
                </p>
                <p className="mt-0.5 text-xs text-muted">{tv.staleBody}</p>
              </div>
              <Button size="sm" onClick={generate} className="shrink-0">
                {tv.staleAction}
              </Button>
            </div>
          )}

          <div className={cn("relative", stale && "opacity-90")}>
            {/* Persistent preview-type badge over the comparison */}
            {mode && (
              <span className="pointer-events-none absolute start-3 top-3 z-10">
                <Badge tone={mode === "demo" ? "neutral" : "accent"}>{showBadge}</Badge>
              </span>
            )}
            <VisualizationCompare
              dir={dir}
              preview={preview.preview}
              roomUrl={roomUrl}
              locale={locale}
              labels={{ before: tv.beforeLabel, after: tv.afterLabel, slider: tv.sliderLabel }}
            />
          </div>

          {/* Honest disclosures */}
          <p className="mt-3 flex items-start gap-2 text-xs text-muted">
            <Info className="mt-0.5 size-3.5 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
            {tv.disclaimer}
          </p>
          {preview.mode === "demo" && (
            <p className="mt-1 text-xs text-subtle">{tv.demoCompositionNote}</p>
          )}
          {usedSample && !roomUrl && (
            <p className="mt-1 text-xs text-subtle">{tv.sampleRoomNote}</p>
          )}
          {preview.mode === "demo" && (
            <p className="mt-1 text-xs text-subtle">{tv.privacyNote}</p>
          )}

          {/* Update preview (when fresh, offer a manual refresh too) */}
          {!stale && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={generate}
                iconStart={<RefreshCw className="size-4" strokeWidth={1.75} />}
              >
                {tv.regenerate}
              </Button>
            </div>
          )}

          {/* Products in this design */}
          {items.length > 0 && (
            <div className="mt-6 border-t border-border-subtle pt-5">
              <h3 className="text-base font-semibold text-foreground">{tv.usedTitle}</h3>
              <p className="mt-0.5 text-sm text-muted">{tv.usedSubtitle}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {items.map((item, i) => (
                  <VisualizationProductCard
                    key={`${item.slug}-${i}`}
                    slug={item.slug}
                    colorId={item.colorId}
                    index={i}
                    t={tv}
                    locale={locale}
                    onColor={onColor}
                  />
                ))}
              </div>
              <p className="mt-3 flex items-start gap-2 rounded-lg border border-border-subtle bg-elevated px-3.5 py-2.5 text-xs text-muted">
                <Info className="mt-0.5 size-3.5 shrink-0 text-subtle" strokeWidth={1.75} aria-hidden="true" />
                {tv.scaleNote}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
