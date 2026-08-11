"use client";

import * as React from "react";
import {
  ArrowLeft, CheckCircle2, CircleDot, ClipboardCheck, Factory, Hammer,
  PackageCheck, Ruler, ScrollText, TriangleAlert, Wrench, X,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatOmr } from "@/lib/catalog";
import { formatNumber, cn } from "@/lib/utils";
import type { Order, SupplierOrderGroup, OrderCustomSnapshot } from "@/lib/orders";
import {
  availableActions, canEditMilestones, openQualityCheck,
  MANUFACTURING_MILESTONES, QUALITY_CRITERIA,
  type ManufacturingJob, type ManufacturingStatus, type ManufacturingMilestone,
  type QualityCriterion, type QualityIssueCategory, type QualityIssueSeverity,
} from "@/lib/manufacturing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useSupplierOrders } from "@/features/orders/order-store";
import { useSupplierFulfillments } from "@/features/orders/fulfillment-store";
import { useSupplierManufacturing, type QcIssueInput } from "@/features/orders/manufacturing-store";

function dateTime(ts: number, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-OM" : "en-GB", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(ts);
}

const statusTone: Record<ManufacturingStatus, "neutral" | "success" | "warning" | "accent"> = {
  not_started: "neutral", manufacturing: "accent", manufacturing_completed: "accent",
  quality_check: "warning", qc_passed: "success", qc_failed: "warning",
  rework: "warning", ready_for_delivery: "success",
};
const statusIcon: Record<ManufacturingStatus, React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>> = {
  not_started: CircleDot, manufacturing: Hammer, manufacturing_completed: PackageCheck,
  quality_check: ClipboardCheck, qc_passed: CheckCircle2, qc_failed: TriangleAlert,
  rework: Wrench, ready_for_delivery: PackageCheck,
};

function MfgStatusBadge({ status, t }: { status: ManufacturingStatus; t: Dictionary["manufacturing"] }) {
  const Icon = statusIcon[status];
  return (
    <Badge tone={statusTone[status]}>
      <Icon className="size-3.5" strokeWidth={1.75} aria-hidden={true} />
      {t.status[status]}
    </Badge>
  );
}

/** The five dashboard groupings (§9), mapped from status. */
type Bucket = "toStart" | "inProduction" | "qualityCheck" | "needsRework" | "ready";
function bucketOf(status: ManufacturingStatus): Bucket {
  switch (status) {
    case "not_started": return "toStart";
    case "manufacturing": case "manufacturing_completed": case "rework": return "inProduction";
    case "quality_check": return "qualityCheck";
    case "qc_failed": return "needsRework";
    case "qc_passed": case "ready_for_delivery": return "ready";
  }
}
const BUCKET_ORDER: Bucket[] = ["toStart", "inProduction", "qualityCheck", "needsRework", "ready"];

/**
 * Supplier manufacturing workspace (Phase 11B, §9/§10). Lists CUSTOM manufacturing
 * jobs grouped by stage; opening one shows a detailed view (spec, accepted quote,
 * timeline, QC history) with state-gated actions + the QC workflow. Premium
 * furniture identity — not a generic ERP. Own supplier's jobs only.
 */
export function SupplierManufacturing({
  supplierId, t, tCustom, locale,
}: {
  supplierId: string; t: Dictionary["manufacturing"]; tCustom: Dictionary["custom"]; locale: Locale;
}) {
  const { orders, hydrated: ordersHydrated } = useSupplierOrders(supplierId);
  const { fulfillments } = useSupplierFulfillments(supplierId);
  const { jobs, hydrated, actions } = useSupplierManufacturing(supplierId, orders, fulfillments);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  if (!ordersHydrated || !hydrated) return <div className="h-40 animate-pulse rounded-xl bg-surface" aria-hidden="true" />;

  const selected = jobs.find((j) => j.id === selectedId) ?? null;
  if (selected) {
    const order = orders.find((o) => o.id === selected.orderId) ?? null;
    const group = order?.groups.find((g) => g.supplierId === supplierId) ?? null;
    return (
      <ManufacturingJobDetail job={selected} order={order} group={group} t={t} tCustom={tCustom} locale={locale}
        actions={actions} onBack={() => setSelectedId(null)} />
    );
  }

  const grouped = new Map<Bucket, ManufacturingJob[]>();
  for (const j of jobs) {
    const b = bucketOf(j.status);
    (grouped.get(b) ?? grouped.set(b, []).get(b)!).push(j);
  }

  return (
    <div>
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Factory className="size-5 text-brand" strokeWidth={1.75} aria-hidden="true" />
        {t.navLabel}
      </h2>
      <p className="mt-2 text-xs text-subtle">{t.demoNote}</p>
      {jobs.length === 0 ? (
        <EmptyState className="mt-6" title={t.card.empty} icon={<Factory className="size-5" strokeWidth={1.75} />} />
      ) : (
        <div className="mt-5 flex flex-col gap-6">
          {BUCKET_ORDER.filter((b) => grouped.get(b)?.length).map((b) => (
            <section key={b}>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {t.groups[b]}
                <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted tabular">{formatNumber(grouped.get(b)!.length, locale)}</span>
              </h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {grouped.get(b)!.map((job) => {
                  const order = orders.find((o) => o.id === job.orderId);
                  const group = order?.groups.find((g) => g.supplierId === supplierId);
                  const custom = group?.items.find((i): i is OrderCustomSnapshot => i.kind === "custom");
                  return (
                    <li key={job.id}>
                      <button type="button" onClick={() => setSelectedId(job.id)}
                        className="group flex w-full flex-col gap-2 rounded-xl border border-border-subtle bg-elevated p-4 text-start transition-colors hover:border-taupe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-foreground tabular">{job.orderNumber}</span>
                          <MfgStatusBadge status={job.status} t={t} />
                        </div>
                        <p className="text-sm text-muted">
                          {custom ? (tCustom.spec.fields ? categoryLabel(custom.spec.category, tCustom) : t.card.customItem) : t.card.customItem}
                          {" · "}{t.card.qty} {formatNumber(custom?.quantity ?? 1, locale)}
                        </p>
                        {job.estimateDays ? <p className="text-xs text-subtle tabular">{t.card.estimate.replace("{count}", formatNumber(job.estimateDays, locale))}</p> : null}
                        <p className="text-xs text-subtle">{t.card.updated}: {dateTime(job.updatedAt, locale)}</p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function categoryLabel(category: string, tCustom: Dictionary["custom"]): string {
  const map = (tCustom.idea as { categories?: Record<string, string> })?.categories;
  return map?.[category] ?? category;
}

// ── Job detail ────────────────────────────────────────────────────────────────

type MfgActions = ReturnType<typeof useSupplierManufacturing>["actions"];

function ManufacturingJobDetail({
  job, order, group, t, tCustom, locale, actions, onBack,
}: {
  job: ManufacturingJob; order: Order | null; group: SupplierOrderGroup | null;
  t: Dictionary["manufacturing"]; tCustom: Dictionary["custom"]; locale: Locale;
  actions: MfgActions; onBack: () => void;
}) {
  const custom = group?.items.find((i): i is OrderCustomSnapshot => i.kind === "custom") ?? null;
  const td = t.detail;

  return (
    <div>
      <button type="button" onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
        <ArrowLeft className="size-4 rtl:rotate-180" strokeWidth={1.75} aria-hidden="true" />
        {td.back}
      </button>

      <div className="flex flex-wrap items-center gap-3 border-b border-border-subtle pb-4">
        <h2 className="text-xl font-semibold text-foreground tabular">{job.orderNumber}</h2>
        <MfgStatusBadge status={job.status} t={t} />
        {order?.isDemo && <Badge tone="neutral">{tCustom.demoBadge}</Badge>}
        <span className="ms-auto text-xs text-muted">{t.card.updated}: {dateTime(job.updatedAt, locale)}</span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-5">
          {/* Spec (immutable) */}
          {custom && (
            <section className="rounded-xl border border-border-subtle bg-elevated p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Ruler className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
                {td.spec}
              </h3>
              <SpecSummary spec={custom.spec} t={t} tCustom={tCustom} locale={locale} />
              <p className="mt-3 border-t border-border-subtle pt-3 text-xs text-subtle">{td.specImmutable}</p>
            </section>
          )}

          {/* Production timeline + milestones */}
          <section className="rounded-xl border border-border-subtle bg-elevated p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ScrollText className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
              {td.timelineTitle}
            </h3>
            <SupplierTimeline job={job} t={t} locale={locale} />
            {(job.status === "manufacturing" || job.status === "rework") && (
              <MilestoneChecklist job={job} t={t} onToggle={(m) => actions.toggleMilestone(job.id, m)} />
            )}
          </section>

          {/* Quality section */}
          {(job.qualityChecks.length > 0 || job.status === "quality_check") && (
            <section className="rounded-xl border border-border-subtle bg-elevated p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ClipboardCheck className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
                {td.qualityTitle}
              </h3>
              {job.status === "quality_check"
                ? <QcPanel job={job} t={t} actions={actions} />
                : <QcHistory job={job} t={t} locale={locale} />}
            </section>
          )}
        </div>

        {/* Actions + accepted quote */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border-subtle bg-surface p-5">
            <h3 className="text-sm font-semibold text-foreground">{td.actionsTitle}</h3>
            <JobActions job={job} t={t} actions={actions} />
          </div>
          {custom && (
            <div className="rounded-xl border border-border-subtle bg-surface p-5">
              <h3 className="text-sm font-semibold text-foreground">{td.acceptedQuote}</h3>
              <dl className="mt-3 flex flex-col gap-2 text-sm">
                <Row label={td.quoteBase} value={formatOmr(custom.basePrice, locale)} />
                {custom.deliveryFee > 0 && <Row label={td.quoteDelivery} value={formatOmr(custom.deliveryFee, locale)} />}
                {custom.installationFee > 0 && <Row label={td.quoteInstall} value={formatOmr(custom.installationFee, locale)} />}
                <div className="flex items-baseline justify-between gap-3 border-t border-border-subtle pt-2">
                  <dt className="font-medium text-foreground">{td.quoteTotal}</dt>
                  <dd className="font-semibold text-foreground tabular">{formatOmr(custom.lineTotal, locale)}</dd>
                </div>
                <Row label={td.manufacturingDays} value={td.days.replace("{count}", formatNumber(custom.manufacturingDays, locale))} />
              </dl>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-foreground tabular">{value}</dd>
    </div>
  );
}

function SpecSummary({
  spec, t, tCustom, locale,
}: {
  spec: OrderCustomSnapshot["spec"]; t: Dictionary["manufacturing"]; tCustom: Dictionary["custom"]; locale: Locale;
}) {
  const f = tCustom.spec.fields;
  const dims = [spec.widthCm, spec.depthCm, spec.heightCm]
    .map((d) => (typeof d === "number" ? t.detail.cm.replace("{value}", formatNumber(d, locale)) : null));
  const rows: Array<[string, string]> = [];
  if (dims.some(Boolean)) rows.push([t.detail.dimensions, dims.map((d) => d ?? "—").join(" × ")]);
  if (spec.material) rows.push([f.material, String(spec.material)]);
  if (spec.color) rows.push([f.color, String(spec.color)]);
  if (spec.finish) rows.push([f.finish, optionLabel(tCustom.spec.finishOptions, spec.finish)]);
  if (spec.style) rows.push([f.style, String(spec.style)]);
  if (typeof spec.seatCount === "number") rows.push([f.seatCount, formatNumber(spec.seatCount, locale)]);
  if (spec.shape) rows.push([f.shape, optionLabel(tCustom.spec.shapeOptions, spec.shape)]);
  if (spec.legStyle) rows.push([f.legStyle, optionLabel(tCustom.spec.legOptions, spec.legStyle)]);
  if (spec.armStyle) rows.push([f.armStyle, optionLabel(tCustom.spec.armOptions, spec.armStyle)]);
  if (spec.firmness) rows.push([f.firmness, optionLabel(tCustom.spec.firmnessOptions, spec.firmness)]);
  if (spec.storageLayout) rows.push([f.storageLayout, optionLabel(tCustom.spec.storageOptions, spec.storageLayout)]);
  if (spec.mattressSize) rows.push([f.mattressSize, optionLabel(tCustom.spec.mattressOptions, spec.mattressSize)]);

  return (
    <div className="mt-3">
      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {rows.map(([label, value], i) => (
          <div key={i} className="flex items-baseline justify-between gap-3">
            <dt className="text-muted">{label}</dt>
            <dd className="text-end font-medium text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
      {spec.hasReferenceImage && <p className="mt-3 text-xs text-subtle">{t.detail.reference}</p>}
      {spec.notes && <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-xs text-muted">{spec.notes}</p>}
    </div>
  );
}

function optionLabel(map: Record<string, string> | undefined, key: string): string {
  return map?.[key] ?? key;
}

// ── Milestones ────────────────────────────────────────────────────────────────

function MilestoneChecklist({
  job, t, onToggle,
}: {
  job: ManufacturingJob; t: Dictionary["manufacturing"]; onToggle: (m: ManufacturingMilestone) => void;
}) {
  const done = job.milestones.length;
  return (
    <fieldset className="mt-4 border-t border-border-subtle pt-4" disabled={!canEditMilestones(job.status)}>
      <legend className="text-sm font-medium text-foreground">{t.milestones.title}</legend>
      <p className="mt-0.5 text-xs text-subtle">
        {t.milestones.hint} · {t.milestones.progress.replace("{done}", String(done)).replace("{total}", String(MANUFACTURING_MILESTONES.length))}
      </p>
      <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {MANUFACTURING_MILESTONES.map((m) => {
          const checked = job.milestones.includes(m);
          return (
            <label key={m} className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors",
              checked ? "border-brand bg-brand-soft/40 text-foreground" : "border-border bg-surface text-muted hover:border-taupe",
            )}>
              <input type="checkbox" checked={checked} onChange={() => onToggle(m)} className="size-4 accent-[var(--brand)]" />
              {t.milestones[m]}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// ── Timeline (supplier-side, full detail) ─────────────────────────────────────

function SupplierTimeline({ job, t, locale }: { job: ManufacturingJob; t: Dictionary["manufacturing"]; locale: Locale }) {
  return (
    <ol className="mt-3 flex flex-col gap-2">
      {job.events.map((e) => (
        <li key={e.id} className="flex items-start gap-2.5 text-sm">
          <CircleDot className="mt-0.5 size-3.5 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
          <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3">
            <span className="text-foreground">{eventLabel(e.type, e.note, t)}</span>
            <span className="text-xs text-subtle tabular">{dateTime(e.at, locale)}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function eventLabel(type: ManufacturingJob["events"][number]["type"], note: string | undefined, t: Dictionary["manufacturing"]): string {
  switch (type) {
    case "created": return t.status.not_started;
    case "manufacturing_started": return t.timeline.stage.manufacturing;
    case "manufacturing_completed": return t.status.manufacturing_completed;
    case "rework_completed": return t.actions.complete_rework;
    case "rework_started": return t.status.rework;
    case "qc_started": return t.timeline.stage.quality_check;
    case "qc_passed": return t.status.qc_passed;
    case "qc_failed": return t.status.qc_failed;
    case "ready_for_delivery": return t.status.ready_for_delivery;
    case "milestone_reached": return note ? t.milestones[note as ManufacturingMilestone] ?? note : t.milestones.title;
    default: return type;
  }
}

// ── QC panel (checklist + pass/fail) ──────────────────────────────────────────

function QcPanel({
  job, t, actions,
}: {
  job: ManufacturingJob; t: Dictionary["manufacturing"]; actions: MfgActions;
}) {
  const open = openQualityCheck(job);
  const [checklist, setChecklist] = React.useState<Partial<Record<QualityCriterion, boolean>>>({});
  const [mode, setMode] = React.useState<"idle" | "fail">("idle");
  const [issues, setIssues] = React.useState<QcIssueInput[]>([{ category: "finish", severity: "minor", description: "" }]);
  const [error, setError] = React.useState<string | null>(null);
  const allChecked = QUALITY_CRITERIA.every((c) => checklist[c]);

  const toggle = (c: QualityCriterion) => setChecklist((p) => ({ ...p, [c]: !p[c] }));

  const pass = () => {
    if (!allChecked) { setError(t.qc.checklistIncomplete); return; }
    actions.passQc(job.id, checklist);
  };
  const fail = () => {
    const cleaned = issues.filter((i) => i.description.trim().length > 0);
    if (cleaned.length === 0) { setError(t.qc.issueRequired); return; }
    actions.failQc(job.id, checklist, cleaned);
  };

  return (
    <div className="mt-3">
      {open && <p className="text-xs text-muted">{t.qc.attempt.replace("{n}", String(open.attempt))} · {t.qc.pending}</p>}
      <fieldset className="mt-3">
        <legend className="text-sm font-medium text-foreground">{t.qc.checklistTitle}</legend>
        <p className="mt-0.5 text-xs text-subtle">{t.qc.checklistHint}</p>
        <div className="mt-3 grid gap-1.5">
          {QUALITY_CRITERIA.map((c) => (
            <label key={c} className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors",
              checklist[c] ? "border-success/50 bg-success-soft/50 text-foreground" : "border-border bg-surface text-muted hover:border-taupe",
            )}>
              <input type="checkbox" checked={!!checklist[c]} onChange={() => toggle(c)} className="size-4 accent-[var(--brand)]" />
              {t.qc.criteria[c]}
            </label>
          ))}
        </div>
      </fieldset>

      {mode === "fail" && (
        <QcIssueForm issues={issues} setIssues={setIssues} t={t} />
      )}

      {error && <p className="mt-3 text-xs text-danger" role="alert">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {mode === "idle" ? (
          <>
            <Button size="sm" onClick={pass} iconStart={<CheckCircle2 className="size-4" strokeWidth={1.75} />}>{t.qc.pass}</Button>
            <Button size="sm" variant="outline" onClick={() => { setError(null); setMode("fail"); }} iconStart={<TriangleAlert className="size-4" strokeWidth={1.75} />}>{t.actions.qc_fail}</Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={fail} iconStart={<TriangleAlert className="size-4" strokeWidth={1.75} />}>{t.qc.issueFound}</Button>
            <Button size="sm" variant="ghost" onClick={() => { setError(null); setMode("idle"); }}>{t.qc.cancel}</Button>
          </>
        )}
      </div>
    </div>
  );
}

const ISSUE_CATEGORIES: QualityIssueCategory[] = [
  "dimensions", "material", "colour", "finish", "construction", "damage", "missing_component", "customization_mismatch", "other",
];

function QcIssueForm({
  issues, setIssues, t,
}: {
  issues: QcIssueInput[]; setIssues: React.Dispatch<React.SetStateAction<QcIssueInput[]>>; t: Dictionary["manufacturing"];
}) {
  const set = (i: number, patch: Partial<QcIssueInput>) =>
    setIssues((prev) => prev.map((iss, idx) => (idx === i ? { ...iss, ...patch } : iss)));
  return (
    <div className="mt-4 border-t border-border-subtle pt-4">
      <p className="text-sm font-medium text-foreground">{t.qc.issuesTitle}</p>
      <div className="mt-3 flex flex-col gap-3">
        {issues.map((iss, i) => (
          <div key={i} className="rounded-lg border border-border-subtle bg-surface p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="text-xs">
                <span className="font-medium text-foreground">{t.qc.category}</span>
                <select value={iss.category} onChange={(e) => set(i, { category: e.target.value as QualityIssueCategory })}
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-elevated px-2 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25">
                  {ISSUE_CATEGORIES.map((c) => <option key={c} value={c}>{t.qc.categories[c]}</option>)}
                </select>
              </label>
              <fieldset className="text-xs">
                <legend className="font-medium text-foreground">{t.qc.severity}</legend>
                <div className="mt-1 flex gap-3">
                  {(["minor", "major"] as QualityIssueSeverity[]).map((sev) => (
                    <label key={sev} className="flex items-center gap-1.5 text-sm text-muted">
                      <input type="radio" name={`sev-${i}`} checked={iss.severity === sev} onChange={() => set(i, { severity: sev })} className="size-4 accent-[var(--brand)]" />
                      {t.qc[sev]}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
            <label className="mt-2 block text-xs">
              <span className="font-medium text-foreground">{t.qc.description}</span>
              <textarea rows={2} value={iss.description} maxLength={400} onChange={(e) => set(i, { description: e.target.value })}
                placeholder={t.qc.descriptionPlaceholder}
                className="mt-1 w-full resize-y rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25" />
            </label>
            {issues.length > 1 && (
              <button type="button" onClick={() => setIssues((prev) => prev.filter((_, idx) => idx !== i))}
                className="mt-1 inline-flex items-center gap-1 text-xs text-danger hover:underline">
                <X className="size-3.5" strokeWidth={2} aria-hidden="true" />{t.qc.removeIssue}
              </button>
            )}
          </div>
        ))}
      </div>
      <Button size="sm" variant="ghost" className="mt-2" onClick={() => setIssues((prev) => [...prev, { category: "other", severity: "minor", description: "" }])}>
        + {t.qc.addIssue}
      </Button>
    </div>
  );
}

function QcHistory({ job, t, locale }: { job: ManufacturingJob; t: Dictionary["manufacturing"]; locale: Locale }) {
  if (job.qualityChecks.length === 0) return <p className="mt-3 text-sm text-muted">{t.qc.noHistory}</p>;
  return (
    <div className="mt-3 flex flex-col gap-3">
      <p className="text-sm font-medium text-foreground">{t.qc.historyTitle}</p>
      {job.qualityChecks.map((qc) => (
        <div key={qc.id} className="rounded-lg border border-border-subtle bg-surface p-3">
          <p className="flex items-center gap-2 text-sm">
            <span className="font-medium text-foreground tabular">{t.qc.attempt.replace("{n}", String(qc.attempt))}</span>
            <Badge tone={qc.status === "passed" ? "success" : qc.status === "failed" ? "warning" : "neutral"}>
              {qc.status === "passed" ? t.qc.passed : qc.status === "failed" ? t.qc.failed : t.qc.pending}
            </Badge>
            {qc.decidedAt && <span className="ms-auto text-xs text-subtle tabular">{dateTime(qc.decidedAt, locale)}</span>}
          </p>
          {qc.issues.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1">
              {qc.issues.map((iss) => (
                <li key={iss.id} className="flex items-start gap-1.5 text-xs text-muted">
                  <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-warning" strokeWidth={1.75} aria-hidden="true" />
                  <span><span className="font-medium text-foreground">{t.qc.categories[iss.category]}</span> · {t.qc[iss.severity]} — {iss.description}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Actions ───────────────────────────────────────────────────────────────────

function JobActions({ job, t, actions }: { job: ManufacturingJob; t: Dictionary["manufacturing"]; actions: MfgActions }) {
  const avail = availableActions(job.status);
  // QC pass/fail are handled inside the QC panel, not here.
  const buttons = avail.filter((a) => a !== "qc_pass" && a !== "qc_fail");
  if (buttons.length === 0) {
    return <p className="mt-3 text-sm text-muted">{job.status === "quality_check" ? t.qc.checklistHint : t.detail.noActions}</p>;
  }
  const iconFor: Partial<Record<string, React.ReactNode>> = {
    start_manufacturing: <Hammer className="size-4" strokeWidth={1.75} />,
    complete_manufacturing: <PackageCheck className="size-4" strokeWidth={1.75} />,
    submit_for_qc: <ClipboardCheck className="size-4" strokeWidth={1.75} />,
    start_rework: <Wrench className="size-4" strokeWidth={1.75} />,
    complete_rework: <PackageCheck className="size-4" strokeWidth={1.75} />,
    mark_ready_for_delivery: <PackageCheck className="size-4" strokeWidth={1.75} />,
  };
  const run = (a: string) => {
    switch (a) {
      case "start_manufacturing": return actions.start(job.id);
      case "complete_manufacturing": return actions.complete(job.id);
      case "submit_for_qc": return actions.submitQc(job.id);
      case "start_rework": return actions.startRework(job.id);
      case "complete_rework": return actions.completeRework(job.id);
      case "mark_ready_for_delivery": return actions.markReady(job.id);
    }
  };
  return (
    <div className="mt-3 flex flex-col gap-2">
      {buttons.map((a) => (
        <Button key={a} size="sm" onClick={() => run(a)} iconStart={iconFor[a]}>
          {t.actions[a]}
        </Button>
      ))}
    </div>
  );
}
