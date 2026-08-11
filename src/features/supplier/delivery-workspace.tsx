"use client";

import * as React from "react";
import {
  ArrowLeft, CalendarClock, CheckCircle2, CircleDot, MapPin, PackageCheck,
  Truck, TriangleAlert, Wrench, X,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";
import type { SupplierOrderGroup } from "@/lib/orders";
import {
  availableDeliveryActions,
  type Delivery, type DeliveryStatus, type DeliveryAction,
  type DeliveryFailureReason, type InstallationIssueCategory,
} from "@/lib/delivery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useSupplierOrders } from "@/features/orders/order-store";
import { useSupplierDeliveries } from "@/features/orders/delivery-store";
import { SlotPicker, formatWindow } from "@/features/orders/slot-picker";

function dateTime(ts: number, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-OM" : "en-GB", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(ts);
}

const statusTone: Record<DeliveryStatus, "neutral" | "success" | "warning" | "accent"> = {
  awaiting_schedule: "neutral", scheduled: "accent", assigned: "accent",
  out_for_delivery: "warning", delivered: "success", delivery_failed: "warning",
  reschedule_required: "warning", cancelled: "neutral", completed: "success",
};
const statusIcon: Record<DeliveryStatus, React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>> = {
  awaiting_schedule: CalendarClock, scheduled: CalendarClock, assigned: Truck,
  out_for_delivery: Truck, delivered: PackageCheck, delivery_failed: TriangleAlert,
  reschedule_required: TriangleAlert, cancelled: X, completed: CheckCircle2,
};

function DeliveryStatusBadge({ status, t }: { status: DeliveryStatus; t: Dictionary["delivery"] }) {
  const Icon = statusIcon[status];
  return (
    <Badge tone={statusTone[status]}>
      <Icon className="size-3.5" strokeWidth={1.75} aria-hidden={true} />
      {t.status[status]}
    </Badge>
  );
}

type Bucket = "awaiting" | "scheduled" | "outForDelivery" | "delivered" | "attention" | "completed";
function bucketOf(status: DeliveryStatus): Bucket {
  switch (status) {
    case "awaiting_schedule": return "awaiting";
    case "scheduled": case "assigned": return "scheduled";
    case "out_for_delivery": return "outForDelivery";
    case "delivered": return "delivered";
    case "delivery_failed": case "reschedule_required": return "attention";
    case "cancelled": case "completed": return "completed";
  }
}
const BUCKET_ORDER: Bucket[] = ["awaiting", "scheduled", "outForDelivery", "delivered", "attention", "completed"];

/**
 * Supplier delivery workspace (Phase 12, §13/§14). Deliveries grouped by stage;
 * opening one shows the operational detail (address snapshot, items, slot,
 * timeline, installation) with state-gated actions. Premium furniture identity —
 * not a courier ERP, no map. Own supplier's deliveries only (§14/§35).
 */
export function SupplierDelivery({
  supplierId, t, locale,
}: {
  supplierId: string; t: Dictionary["delivery"]; locale: Locale;
}) {
  const { orders, hydrated: ordersHydrated } = useSupplierOrders(supplierId);
  const { deliveries, hydrated, actions } = useSupplierDeliveries(supplierId, orders);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  if (!ordersHydrated || !hydrated) return <div className="h-40 animate-pulse rounded-xl bg-surface" aria-hidden="true" />;

  const selected = deliveries.find((d) => d.id === selectedId) ?? null;
  if (selected) {
    const order = orders.find((o) => o.id === selected.orderId) ?? null;
    const group = order?.groups.find((g) => g.supplierId === supplierId) ?? null;
    return (
      <DeliveryDetail delivery={selected} group={group} t={t} locale={locale}
        actions={actions} onBack={() => setSelectedId(null)} />
    );
  }

  const grouped = new Map<Bucket, Delivery[]>();
  for (const d of deliveries) {
    const b = bucketOf(d.status);
    (grouped.get(b) ?? grouped.set(b, []).get(b)!).push(d);
  }

  return (
    <div>
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Truck className="size-5 text-brand" strokeWidth={1.75} aria-hidden="true" />
        {t.navLabel}
      </h2>
      <p className="mt-2 text-xs text-subtle">{t.demoNote}</p>
      {deliveries.length === 0 ? (
        <EmptyState className="mt-6" title={t.card.empty} icon={<Truck className="size-5" strokeWidth={1.75} />} />
      ) : (
        <div className="mt-5 flex flex-col gap-6">
          {BUCKET_ORDER.filter((b) => grouped.get(b)?.length).map((b) => (
            <section key={b}>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {t.groups[b]}
                <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted tabular">{grouped.get(b)!.length}</span>
              </h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {grouped.get(b)!.map((d) => (
                  <li key={d.id}>
                    <button type="button" onClick={() => setSelectedId(d.id)}
                      className="group flex w-full flex-col gap-2 rounded-xl border border-border-subtle bg-elevated p-4 text-start transition-colors hover:border-taupe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-foreground tabular">{d.orderNumber}</span>
                        <DeliveryStatusBadge status={d.status} t={t} />
                      </div>
                      <p className="text-sm text-muted">{t.card.area}: {d.address.wilayat}، {d.address.governorate}</p>
                      <p className="text-xs text-subtle">
                        {t.card.slot}: {d.window ? formatWindow(d.window, t.slots, locale) : t.card.noSlot}
                        {d.installationRequired ? ` · ${t.card.installRequired}` : ""}
                      </p>
                      <p className="text-xs text-subtle">{t.card.updated}: {dateTime(d.updatedAt, locale)}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

type DeliveryActions = ReturnType<typeof useSupplierDeliveries>["actions"];

function DeliveryDetail({
  delivery, group, t, locale, actions, onBack,
}: {
  delivery: Delivery; group: SupplierOrderGroup | null;
  t: Dictionary["delivery"]; locale: Locale;
  actions: DeliveryActions; onBack: () => void;
}) {
  const td = t.detail;
  return (
    <div>
      <button type="button" onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
        <ArrowLeft className="size-4 rtl:rotate-180" strokeWidth={1.75} aria-hidden="true" />
        {td.back}
      </button>

      <div className="flex flex-wrap items-center gap-3 border-b border-border-subtle pb-4">
        <h2 className="text-xl font-semibold text-foreground tabular">{delivery.orderNumber}</h2>
        <DeliveryStatusBadge status={delivery.status} t={t} />
        {delivery.installationRequired && (
          <Badge tone="accent"><Wrench className="size-3.5" strokeWidth={1.75} aria-hidden="true" />{t.card.installRequired}</Badge>
        )}
        <span className="ms-auto text-xs text-muted">{t.card.updated}: {dateTime(delivery.updatedAt, locale)}</span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-5">
          {/* Address snapshot (operational) */}
          <section className="rounded-xl border border-border-subtle bg-elevated p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
              {td.address}
            </h3>
            <p className="mt-2 text-sm text-foreground">{delivery.address.fullName}</p>
            <p className="text-sm text-muted" dir="ltr">{delivery.address.phone}</p>
            <p className="mt-1 text-sm text-muted">
              {[delivery.address.building, delivery.address.area, delivery.address.wilayat, delivery.address.governorate].filter(Boolean).join("، ")}
            </p>
            {delivery.address.notes && <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-xs text-muted">{td.notes}: {delivery.address.notes}</p>}
            <p className="mt-3 border-t border-border-subtle pt-3 text-xs text-subtle">{td.snapshotNote}</p>
          </section>

          {/* Items in this group */}
          {group && (
            <section className="rounded-xl border border-border-subtle bg-elevated p-5">
              <h3 className="text-sm font-semibold text-foreground">{td.items}</h3>
              <ul className="mt-2 flex flex-col gap-1.5">
                {group.items.map((item, i) => (
                  <li key={i} className="text-sm text-foreground">
                    {item.kind === "catalog" ? (locale === "ar" ? item.nameAr : item.name) : t.card.customItem}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Timeline + attempts */}
          <section className="rounded-xl border border-border-subtle bg-elevated p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CircleDot className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
              {td.timeline}
            </h3>
            <ol className="mt-3 flex flex-col gap-2">
              {delivery.events.map((e) => (
                <li key={e.id} className="flex items-start gap-2.5 text-sm">
                  <CircleDot className="mt-0.5 size-3.5 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
                  <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3">
                    <span className="text-foreground">{eventLabel(e.type, e.note, t)}</span>
                    <span className="text-xs text-subtle tabular">{dateTime(e.at, locale)}</span>
                  </div>
                </li>
              ))}
            </ol>
            {delivery.attempts.length > 0 && (
              <div className="mt-3 border-t border-border-subtle pt-3">
                <p className="text-xs font-medium text-foreground">{td.attempts}</p>
                <ul className="mt-1.5 flex flex-col gap-1">
                  {delivery.attempts.map((a) => (
                    <li key={a.id} className="flex items-center gap-2 text-xs text-muted">
                      {a.outcome === "delivered"
                        ? <PackageCheck className="size-3.5 text-success" strokeWidth={1.75} aria-hidden="true" />
                        : <TriangleAlert className="size-3.5 text-warning" strokeWidth={1.75} aria-hidden="true" />}
                      {a.outcome === "delivered" ? td.attemptDelivered : `${td.attemptFailed}${a.reason ? ` · ${t.failure.reasons[a.reason]}` : ""}`}
                      <span className="ms-auto tabular">{dateTime(a.at, locale)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        {/* Actions */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border-subtle bg-surface p-5">
            <h3 className="text-sm font-semibold text-foreground">{td.actions}</h3>
            {delivery.assignment && (
              <p className="mt-2 text-xs text-muted">
                {t.assignment.assignedTo}: <span className="font-medium text-foreground">{t.assignment.demoTeam}</span> <Badge tone="neutral">Demo</Badge>
              </p>
            )}
            <DeliveryActionsPanel delivery={delivery} t={t} actions={actions} locale={locale} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function eventLabel(type: Delivery["events"][number]["type"], note: string | undefined, t: Dictionary["delivery"]): string {
  switch (type) {
    case "delivery_ready": return t.status.awaiting_schedule;
    case "slot_selected": return t.slots.chosen;
    case "delivery_scheduled": return t.status.scheduled;
    case "assigned": return t.status.assigned;
    case "out_for_delivery": return t.status.out_for_delivery;
    case "delivery_attempt_failed": return `${t.status.delivery_failed}${note ? ` · ${t.failure.reasons[note as DeliveryFailureReason] ?? ""}` : ""}`;
    case "rescheduled": return t.status.reschedule_required;
    case "delivered": return t.status.delivered;
    case "installation_scheduled": return t.installStatus.scheduled;
    case "installation_started": return t.installStatus.in_progress;
    case "installation_completed": return t.installStatus.completed;
    case "installation_issue": return t.installStatus.issue;
    case "handover_confirmed": return t.actions.confirm_handover;
    case "completed": return t.status.completed;
    case "cancelled": return t.status.cancelled;
    default: return type;
  }
}

const FAILURE_REASONS: DeliveryFailureReason[] = ["customer_unavailable", "incorrect_address", "access_issue", "vehicle_issue", "item_issue", "other"];
const INSTALL_ISSUE_CATEGORIES: InstallationIssueCategory[] = ["missing_component", "damage_found", "fit_issue", "customer_request", "other"];

function DeliveryActionsPanel({
  delivery, t, actions, locale,
}: {
  delivery: Delivery; t: Dictionary["delivery"]; actions: DeliveryActions; locale: Locale;
}) {
  const [mode, setMode] = React.useState<"idle" | "schedule" | "fail" | "installSlot" | "installIssue">("idle");
  const avail = availableDeliveryActions(delivery.status, delivery.installation.status);

  if (avail.length === 0) {
    return <p className="mt-3 text-sm text-muted">{delivery.status === "completed" ? t.tracking.completedBody : t.detail.noActions}</p>;
  }

  if (mode === "schedule") {
    return <div className="mt-3"><SlotPicker t={t.slots} locale={locale}
      onConfirm={(w) => { actions.schedule(delivery.id, w); setMode("idle"); }} onCancel={() => setMode("idle")} /></div>;
  }
  if (mode === "installSlot") {
    return <div className="mt-3"><SlotPicker t={t.slots} locale={locale}
      onConfirm={(w) => { actions.scheduleInstallation(delivery.id, w); setMode("idle"); }} onCancel={() => setMode("idle")} /></div>;
  }
  if (mode === "fail") {
    return <FailForm t={t} onCancel={() => setMode("idle")} onSubmit={(reason) => { actions.failed(delivery.id, reason); setMode("idle"); }} />;
  }
  if (mode === "installIssue") {
    return <InstallIssueForm t={t} onCancel={() => setMode("idle")} onSubmit={(cat, desc) => { actions.recordInstallationIssue(delivery.id, cat, desc); setMode("idle"); }} />;
  }

  const label = (a: DeliveryAction) => t.actions[a];
  const iconFor: Partial<Record<DeliveryAction, React.ReactNode>> = {
    assign: <Truck className="size-4" strokeWidth={1.75} />,
    mark_out_for_delivery: <Truck className="size-4" strokeWidth={1.75} />,
    mark_delivered: <PackageCheck className="size-4" strokeWidth={1.75} />,
    complete: <CheckCircle2 className="size-4" strokeWidth={1.75} />,
    schedule_installation: <CalendarClock className="size-4" strokeWidth={1.75} />,
    start_installation: <Wrench className="size-4" strokeWidth={1.75} />,
    complete_installation: <CheckCircle2 className="size-4" strokeWidth={1.75} />,
  };

  const run = (a: DeliveryAction) => {
    switch (a) {
      case "assign": return actions.assign(delivery.id);
      case "mark_out_for_delivery": return actions.outForDelivery(delivery.id);
      case "mark_delivered": return actions.delivered(delivery.id);
      case "mark_failed": return setMode("fail");
      case "reschedule": return actions.reschedule(delivery.id);
      case "schedule": return setMode("schedule");
      case "schedule_installation": return setMode("installSlot");
      case "start_installation": return actions.startInstallation(delivery.id);
      case "complete_installation": return actions.completeInstallation(delivery.id);
      case "complete": return actions.confirmHandover(delivery.id);
    }
  };

  return (
    <div className="mt-3 flex flex-col gap-2">
      {avail.map((a) => (
        <Button key={a} size="sm" variant={a === "mark_failed" || a === "reschedule" ? "outline" : "primary"}
          onClick={() => run(a)} iconStart={iconFor[a]}>
          {label(a)}
        </Button>
      ))}
      {/* Installation-issue shortcut while installing */}
      {delivery.installation.status === "in_progress" && (
        <Button size="sm" variant="ghost" onClick={() => setMode("installIssue")} iconStart={<TriangleAlert className="size-4" strokeWidth={1.75} />}>
          {t.installIssue.title}
        </Button>
      )}
    </div>
  );
}

function FailForm({ t, onCancel, onSubmit }: { t: Dictionary["delivery"]; onCancel: () => void; onSubmit: (r: DeliveryFailureReason) => void }) {
  const [reason, setReason] = React.useState<DeliveryFailureReason>("customer_unavailable");
  return (
    <form className="mt-3 rounded-lg border border-border-subtle bg-surface p-3" onSubmit={(e) => { e.preventDefault(); onSubmit(reason); }}>
      <p className="text-sm font-medium text-foreground">{t.failure.title}</p>
      <p className="mt-1 text-xs text-muted">{t.failure.intro}</p>
      <fieldset className="mt-3">
        <legend className="text-xs font-medium text-foreground">{t.failure.reasonLabel}</legend>
        <div className="mt-2 grid gap-1.5">
          {FAILURE_REASONS.map((r) => (
            <label key={r} className={cn("flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors",
              reason === r ? "border-brand bg-brand-soft/50 text-foreground" : "border-border bg-elevated text-muted hover:border-taupe")}>
              <input type="radio" name="fail-reason" checked={reason === r} onChange={() => setReason(r)} className="size-4 accent-[var(--brand)]" />
              {t.failure.reasons[r]}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-3 flex gap-2">
        <Button type="submit" size="sm" variant="outline" iconStart={<TriangleAlert className="size-4" strokeWidth={1.75} />}>{t.failure.submit}</Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>{t.failure.cancel}</Button>
      </div>
    </form>
  );
}

function InstallIssueForm({ t, onCancel, onSubmit }: { t: Dictionary["delivery"]; onCancel: () => void; onSubmit: (c: InstallationIssueCategory, d: string) => void }) {
  const [category, setCategory] = React.useState<InstallationIssueCategory>("missing_component");
  const [desc, setDesc] = React.useState("");
  return (
    <form className="mt-3 rounded-lg border border-border-subtle bg-surface p-3" onSubmit={(e) => { e.preventDefault(); onSubmit(category, desc.trim()); }}>
      <p className="text-sm font-medium text-foreground">{t.installIssue.title}</p>
      <label className="mt-2 block text-xs">
        <span className="font-medium text-foreground">{t.installIssue.categoryLabel}</span>
        <select value={category} onChange={(e) => setCategory(e.target.value as InstallationIssueCategory)}
          className="mt-1 h-9 w-full rounded-lg border border-border bg-elevated px-2 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25">
          {INSTALL_ISSUE_CATEGORIES.map((c) => <option key={c} value={c}>{t.installIssue.categories[c]}</option>)}
        </select>
      </label>
      <label className="mt-2 block text-xs">
        <span className="font-medium text-foreground">{t.installIssue.descriptionLabel}</span>
        <textarea rows={2} value={desc} maxLength={400} onChange={(e) => setDesc(e.target.value)} placeholder={t.installIssue.descriptionPlaceholder}
          className="mt-1 w-full resize-y rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25" />
      </label>
      <div className="mt-3 flex gap-2">
        <Button type="submit" size="sm" variant="outline">{t.installIssue.submit}</Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>{t.failure.cancel}</Button>
      </div>
    </form>
  );
}
