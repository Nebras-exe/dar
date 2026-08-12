"use client";

import * as React from "react";
import {
  ImageOff,
  Info,
  Loader2,
  RefreshCw,
  Ruler,
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
  createCamera,
  currentDesignFingerprint,
  isPreviewStale,
  projectPlan,
  type RoomPlan,
  type VisualizationErrorCode,
  type VisualizationSuccess,
} from "@/lib/visualization";
import { getProductBySlug, type ColorId } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";
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
 * Says plainly how the furniture in the preview was scaled: against the room the
 * user measured, or against a labelled stand-in when they skipped it. Also names
 * any piece that could not be fitted, so a partial room never reads as complete.
 */
function PlanNote({
  plan,
  roomTypeLabel,
  tv,
  locale,
  onEditSpace,
}: {
  plan: RoomPlan;
  roomTypeLabel: string;
  tv: Dictionary["design"]["visualization"];
  locale: Locale;
  onEditSpace: () => void;
}) {
  const names = (slugs: readonly string[]) =>
    slugs
      .map((slug) => getProductBySlug(slug))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => (locale === "ar" ? p.nameAr : p.name));

  // Wouldn't fit in the room at all.
  const unplacedNames = names(plan.unplaced);
  // Fits, but sits in the strip of floor this camera angle can't show.
  const outOfFrameNames = React.useMemo(
    () => names(projectPlan(createCamera(plan.space), plan.placements).outOfFrame),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `names` is a pure local closure over locale
    [plan.space, plan.placements, locale],
  );

  return (
    <div className="mt-3 space-y-2">
      <p
        className={cn(
          "flex items-start gap-2 rounded-lg px-3.5 py-2.5 text-xs",
          plan.assumed
            ? "border border-warning/40 bg-warning-soft text-foreground"
            : "border border-border-subtle bg-elevated text-muted",
        )}
      >
        <Ruler className="mt-0.5 size-3.5 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
        <span>
          {plan.assumed
            ? tv.planAssumed.replace("{room}", roomTypeLabel)
            : tv.planMeasured
                .replace("{width}", formatNumber(plan.space.widthM, locale))
                .replace("{length}", formatNumber(plan.space.lengthM, locale))}{" "}
          {plan.assumed && (
            <button
              type="button"
              onClick={onEditSpace}
              className="font-medium text-brand underline underline-offset-2 hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {tv.planEditSpace}
            </button>
          )}
        </span>
      </p>

      {unplacedNames.length > 0 && (
        <p className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning-soft px-3.5 py-2.5 text-xs text-foreground">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-warning" strokeWidth={1.75} aria-hidden="true" />
          <span>
            {tv.planUnplaced.replace("{count}", formatNumber(unplacedNames.length, locale))}{" "}
            {unplacedNames.join("، ")}
          </span>
        </p>
      )}

      {outOfFrameNames.length > 0 && (
        <p className="flex items-start gap-2 rounded-lg border border-border-subtle bg-elevated px-3.5 py-2.5 text-xs text-muted">
          <Info className="mt-0.5 size-3.5 shrink-0 text-subtle" strokeWidth={1.75} aria-hidden="true" />
          <span>
            {tv.planOutOfFrame.replace("{count}", formatNumber(outOfFrameNames.length, locale))}{" "}
            {outOfFrameNames.join("، ")}
          </span>
        </p>
      )}
    </div>
  );
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
  const { url: roomUrl, file: roomFile } = useRoomImage();

  const [mode, setMode] = React.useState<"live" | "demo" | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [preview, setPreview] = React.useState<VisualizationSuccess | null>(null);
  const [error, setError] = React.useState<VisualizationErrorCode | null>(null);
  const [usedSample, setUsedSample] = React.useState(false);
  const [stage, setStage] = React.useState(0);

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

  // Staged loading messages (§12) — cycle while a render is in flight.
  const stageKeys = React.useMemo(
    () => [tv.stages.preparing, tv.stages.creating, tv.stages.checking, tv.stages.finalizing],
    [tv.stages],
  );
  React.useEffect(() => {
    if (!busy) return;
    const id = setInterval(() => setStage((s) => Math.min(s + 1, stageKeys.length - 1)), 1100);
    return () => clearInterval(id);
  }, [busy, stageKeys.length]);

  const currentFingerprint = React.useMemo(
    () => currentDesignFingerprint(input, items),
    [input, items],
  );
  const stale = preview ? isPreviewStale(currentFingerprint, preview.designFingerprint) : false;

  const generate = React.useCallback(async () => {
    if (busy || items.length === 0) return;
    // LIVE mode needs the actual room photo (it is sent to the image provider to
    // EDIT). Never silently produce a demo when a real render was expected.
    if (mode === "live" && !roomFile) {
      setError("no-image");
      return;
    }
    setStage(0);
    setBusy(true);
    setError(null);
    setUsedSample(!roomUrl);
    try {
      const request = buildVisualizationRequest(input, items, locale);
      let res: Response;
      if (mode === "live" && roomFile) {
        // Multipart: the room photo + explicit consent go to the server, which
        // runs the real provider (Google Gemini) and returns a NEW image.
        const form = new FormData();
        form.set("request", JSON.stringify(request));
        form.set("consent", "true");
        form.set("image", roomFile);
        res = await fetch("/api/visualization/generate", { method: "POST", body: form });
      } else {
        // Demo path: the room photo stays in the browser; only the structured,
        // catalog-validated request is sent.
        res = await fetch("/api/visualization/generate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(request),
        });
      }
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
  }, [busy, items, input, locale, roomUrl, roomFile, mode]);

  const onColor = (index: number, color: ColorId) =>
    dispatch({ type: "SET_ITEM_COLOR", index, color });

  const hasPreview = Boolean(preview);
  // Label by the ACTUAL result: a real generated render is "AI Generated"; only a
  // genuine demo composition is labelled "Demo". Falls back to capability before a run.
  const resultMode: "live" | "demo" = preview ? preview.mode : mode ?? "demo";
  const showBadge = resultMode === "demo" ? tv.demoBadge : tv.aiBadge;

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
        {hasPreview && (
          <Badge tone={resultMode === "demo" ? "neutral" : "accent"}>{showBadge}</Badge>
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
              {!roomUrl ? (
                <p className="max-w-xs text-xs font-medium text-background/90">
                  {tv.needPhotoBody}
                </p>
              ) : (
                mode === "live" && (
                  <p className="max-w-xs text-xs font-medium text-background/90">
                    {tv.liveConsentNote}
                  </p>
                )
              )}
            </div>
          </div>
          {!roomUrl && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-subtle">
              <ImageOff className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
              {tv.needPhotoTitle}
            </p>
          )}

          {/* Product board (§13): exactly what will be inserted — approve before generating. */}
          {items.length > 0 && (
            <div className="mt-5 rounded-xl border border-border-subtle bg-elevated p-4">
              <h3 className="text-base font-semibold text-foreground">{tv.boardTitle}</h3>
              <p className="mt-0.5 text-sm text-muted">{tv.boardSubtitle}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {items.map((item, i) => (
                  <VisualizationProductCard
                    key={`board-${item.slug}-${i}`}
                    slug={item.slug}
                    colorId={item.colorId}
                    index={i}
                    t={tv}
                    locale={locale}
                    onColor={onColor}
                  />
                ))}
              </div>
              <p className="mt-3 flex items-start gap-2 text-xs text-subtle">
                <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                {tv.approveHint}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Generating (staged progress, §12) ────────────────────────────────── */}
      {busy && (
        <div
          className="mt-5 flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 rounded-xl border border-border-subtle bg-elevated"
          aria-live="polite"
        >
          <Loader2 className="size-6 animate-spin text-brand" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">{stageKeys[stage]}</p>
          <div className="flex gap-1.5" aria-hidden="true">
            {stageKeys.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  i <= stage ? "bg-brand" : "bg-border",
                )}
              />
            ))}
          </div>
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
            <span className="pointer-events-none absolute start-3 top-3 z-10">
              <Badge tone={resultMode === "demo" ? "neutral" : "accent"}>{showBadge}</Badge>
            </span>
            <VisualizationCompare
              dir={dir}
              preview={preview.preview}
              roomUrl={roomUrl}
              locale={locale}
              labels={{ before: tv.beforeLabel, after: tv.afterLabel, slider: tv.sliderLabel }}
            />
          </div>

          {/* Visual critic + honest product fidelity (§10/§15) — live renders only */}
          {preview.mode === "live" && preview.critic && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone={preview.critic.verdict === "APPROVED" ? "success" : "warning"}>
                {preview.critic.verdict === "APPROVED" ? tv.approved : tv.notApproved}
              </Badge>
              <Badge
                tone={
                  preview.critic.fidelity === "HIGH"
                    ? "success"
                    : preview.critic.fidelity === "MEDIUM"
                      ? "neutral"
                      : "warning"
                }
              >
                {tv.fidelityLabel}: {tv.fidelity[preview.critic.fidelity]}
              </Badge>
            </div>
          )}
          {preview.mode === "live" && preview.critic?.verdict === "REJECTED" && (
            <p className="mt-2 flex items-start gap-2 rounded-lg border border-warning/40 bg-warning-soft px-3.5 py-2.5 text-xs text-foreground">
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-warning" strokeWidth={1.75} aria-hidden="true" />
              {tv.notApprovedNote}
            </p>
          )}

          {/* How the pieces were scaled — measured room, or a labelled default. */}
          {preview.preview.kind === "demo-composition" && (
            <PlanNote
              plan={preview.preview.scheme.plan}
              roomTypeLabel={t.room.types[input.roomType]}
              tv={tv}
              locale={locale}
              onEditSpace={() => dispatch({ type: "GO_TO_STEP", step: 2 })}
            />
          )}

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
