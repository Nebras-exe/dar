"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft, Ban, Check, CircleDot, Clock, CreditCard, Hammer, MapPin, Package,
  PackageCheck, ShoppingBag, Store, X,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatOmr } from "@/lib/catalog";
import { formatNumber, cn } from "@/lib/utils";
import type { Order, SupplierOrderGroup } from "@/lib/orders";
import type { PaymentStatus } from "@/lib/payments";
import {
  availableSupplierActions, buildTimeline,
  type FulfillmentStatus, type DeclineReason, type FulfillmentSummary,
  type TimelineStep,
} from "@/lib/fulfillment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useOrders, useSupplierOrders } from "./order-store";
import { usePaymentStatus } from "./payment-store";
import { useSupplierFulfillment, useOrderFulfillments, useFulfillmentSummary } from "./fulfillment-store";

function orderDate(ts: number, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-OM" : "en-GB", {
    year: "numeric", month: "short", day: "numeric",
  }).format(ts);
}

function orderDateTime(ts: number, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-OM" : "en-GB", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(ts);
}

const statusTone: Record<string, "neutral" | "success" | "warning"> = {
  draft: "neutral", confirmed: "success", processing: "warning", cancelled: "neutral", completed: "success",
};

/**
 * Payment status chip (text + icon, never colour-only — §26 accessibility).
 * `not_started` is hidden by default so unpaid orders stay quiet until acted on.
 */
function PaymentStatusBadge({
  status, tPay, showNotStarted,
}: {
  status: PaymentStatus; tPay: Dictionary["payment"]; showNotStarted?: boolean;
}) {
  if (status === "not_started" && !showNotStarted) return null;
  const tone = status === "paid" ? "success" : status === "failed" || status === "expired" ? "warning" : "neutral";
  return (
    <Badge tone={tone}>
      <CreditCard className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
      {tPay.status[status]}
    </Badge>
  );
}

const fulfillmentIcon: Record<FulfillmentStatus, React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>> = {
  awaiting_supplier: Clock, accepted: Check, preparing: Hammer,
  ready_for_next_stage: PackageCheck, declined: Ban, cancelled: X,
};
const fulfillmentTone: Record<FulfillmentStatus, "neutral" | "success" | "warning" | "accent"> = {
  awaiting_supplier: "neutral", accepted: "accent", preparing: "warning",
  ready_for_next_stage: "success", declined: "neutral", cancelled: "neutral",
};

/** Fulfillment status chip (text + icon, never colour-only — §32). */
function FulfillmentStatusBadge({
  status, tFul,
}: {
  status: FulfillmentStatus; tFul: Dictionary["fulfillment"];
}) {
  const Icon = fulfillmentIcon[status];
  return (
    <Badge tone={fulfillmentTone[status]}>
      <Icon className="size-3.5" strokeWidth={1.75} aria-hidden={true} />
      {tFul.status[status]}
    </Badge>
  );
}

/** Customer account → Orders list (real; honest empty state). */
export function AccountOrders({
  t, tPay, tFul, locale, customerId,
}: {
  t: Dictionary["orders"]; tPay: Dictionary["payment"]; tFul: Dictionary["fulfillment"]; locale: Locale; customerId: string;
}) {
  const { orders, hydrated } = useOrders(customerId);
  if (!hydrated) return null;

  return (
    <section>
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <ShoppingBag className="size-5 text-brand" strokeWidth={1.75} aria-hidden="true" />
        {t.title}
      </h2>
      {orders.length === 0 ? (
        <div className="mt-3 rounded-xl border border-border-subtle bg-surface px-4 py-6">
          <p className="text-sm text-muted">{t.empty}</p>
          <Button href={`/${locale}/shop`} size="sm" variant="secondary" className="mt-3">{t.browse}</Button>
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {orders.map((o) => (
            <AccountOrderRow key={o.id} order={o} t={t} tPay={tPay} tFul={tFul} locale={locale} />
          ))}
        </ul>
      )}
    </section>
  );
}

/** A deterministic one-line fulfillment summary for an account order card (§19). */
function fulfillmentSummaryLabel(s: FulfillmentSummary, tFul: Dictionary["fulfillment"]): string | null {
  if (s.total === 0) return null;
  if (s.allReady) return tFul.summary.allReady;
  if (s.declined > 0) return tFul.summary.declinedCount.replace("{count}", String(s.declined));
  if (s.ready > 0) return tFul.summary.readyCount.replace("{done}", String(s.ready)).replace("{total}", String(s.total));
  const decided = s.accepted + s.preparing + s.ready;
  if (decided > 0) return tFul.summary.acceptedCount.replace("{done}", String(decided)).replace("{total}", String(s.total));
  return tFul.summary.awaitingAll;
}

function AccountOrderRow({
  order: o, t, tPay, tFul, locale,
}: {
  order: Order; t: Dictionary["orders"]; tPay: Dictionary["payment"]; tFul: Dictionary["fulfillment"]; locale: Locale;
}) {
  const { status } = usePaymentStatus(o.id);
  const { summary } = useFulfillmentSummary(o, status);
  const fulLabel = fulfillmentSummaryLabel(summary, tFul);
  return (
    <li>
      <Link href={`/${locale}/orders/${o.id}`}
        className="group flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-subtle bg-elevated p-4 transition-colors hover:border-taupe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-medium text-foreground tabular">
            {o.orderNumber}
            {o.isDemo && <Badge tone="neutral">{t.demoBadge}</Badge>}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {orderDate(o.createdAt, locale)} · {t.items.replace("{count}", String(o.totals.itemCount))}
            {o.totals.supplierCount > 1 && ` · ${t.suppliers.replace("{count}", String(o.totals.supplierCount))}`}
          </p>
          {fulLabel && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
              <CircleDot className="size-3.5 text-brand" strokeWidth={1.75} aria-hidden="true" />
              {tFul.summary.label}: {fulLabel}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <PaymentStatusBadge status={status} tPay={tPay} />
          <Badge tone={statusTone[o.status]}>{t.status[o.status]}</Badge>
          <span className="font-semibold text-foreground tabular">{formatOmr(o.totals.grandTotal, locale)}</span>
        </div>
      </Link>
    </li>
  );
}

/** Order detail (customer view). Full supplier grouping + address + fulfillment timeline. */
export function OrderDetail({
  t, tPay, tFul, tCustom, locale, customerId, orderId,
}: {
  t: Dictionary["orders"]; tPay: Dictionary["payment"]; tFul: Dictionary["fulfillment"];
  tCustom: Dictionary["custom"]; locale: Locale;
  customerId: string; orderId: string;
}) {
  const { byId, hydrated } = useOrders(customerId);
  const { status: payStatus } = usePaymentStatus(orderId);
  if (!hydrated) return <div className="h-40 animate-pulse rounded-xl bg-surface" />;
  const order = byId(orderId);

  if (!order) {
    return (
      <EmptyState icon={<Package className="size-5" strokeWidth={1.75} />} title={t.detail.notFoundTitle}
        description={t.detail.notFoundBody} action={<Button href={`/${locale}/account`}>{t.detail.backToOrders}</Button>} />
    );
  }

  const td = t.detail;
  return (
    <div>
      <Link href={`/${locale}/account`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
        <ArrowLeft className="size-4 rtl:rotate-180" strokeWidth={1.75} aria-hidden="true" />
        {td.backToOrders}
      </Link>

      <div className="flex flex-wrap items-center gap-3 border-b border-border-subtle pb-5">
        <h1 className="text-2xl sm:text-3xl tabular">{order.orderNumber}</h1>
        <Badge tone={statusTone[order.status]}>{t.status[order.status]}</Badge>
        <PaymentStatusBadge status={payStatus} tPay={tPay} />
        {order.isDemo && <Badge tone="neutral">{t.demoBadge}</Badge>}
        <Badge tone="accent">{order.source === "cart" ? t.sourceCart : t.sourceQuote}</Badge>
        <span className="ms-auto text-sm text-muted">{orderDate(order.createdAt, locale)}</span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="flex flex-col gap-5">
          <OrderFulfillmentTimeline order={order} payStatus={payStatus} tFul={tFul} locale={locale} />
          {order.groups.map((g) => (
            <GroupBlock key={g.supplierId} group={g} t={t} tCustom={tCustom} locale={locale} />
          ))}
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border-subtle bg-surface p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
              {td.deliverTo}
            </p>
            <p className="mt-2 text-sm text-foreground">{order.address.fullName}</p>
            <p className="text-sm text-muted" dir="ltr">{order.address.phone}</p>
            <p className="mt-1 text-sm text-muted">
              {[order.address.building, order.address.area, order.address.wilayat, order.address.governorate].filter(Boolean).join("، ")}
            </p>
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface p-5">
            <div className="flex items-baseline justify-between">
              <span className="text-base font-semibold text-foreground">{t.total}</span>
              <span className="text-lg font-semibold text-foreground tabular">{formatOmr(order.totals.grandTotal, locale)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-border-subtle pt-4">
              <span className="text-sm text-muted">{tPay.statusLabel}</span>
              <PaymentStatusBadge status={payStatus} tPay={tPay} showNotStarted />
            </div>
            {payStatus === "paid" ? (
              <Button variant="outline" size="sm" className="mt-3 w-full" href={`/${locale}/orders/${order.id}/payment`}
                iconStart={<CreditCard className="size-4" strokeWidth={1.75} />}>
                {tPay.viewReceipt}
              </Button>
            ) : (
              <Button size="sm" className="mt-3 w-full" href={`/${locale}/orders/${order.id}/payment`}
                iconStart={<CreditCard className="size-4" strokeWidth={1.75} />}>
                {payStatus === "failed" || payStatus === "expired" ? tPay.retryButton : tPay.payNow}
              </Button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/**
 * Customer fulfillment timeline (§17/§18). ONE timeline PER supplier — never a
 * single misleading unified progress bar. Each stage is text + icon + date (not
 * colour-only); the current stage is explicit and future stages are subdued.
 */
function OrderFulfillmentTimeline({
  order, payStatus, tFul, locale,
}: {
  order: Order; payStatus: PaymentStatus; tFul: Dictionary["fulfillment"]; locale: Locale;
}) {
  const { fulfillments, hydrated } = useOrderFulfillments(order, payStatus);
  if (!hydrated || fulfillments.length === 0) return null; // shown once paid
  const multi = order.groups.length > 1;

  return (
    <section className="rounded-xl border border-border-subtle bg-surface p-5">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <CircleDot className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
        {tFul.timeline.title}
      </h2>
      {multi && <p className="mt-0.5 text-xs text-muted">{tFul.timeline.perSupplier}</p>}
      <div className="mt-4 flex flex-col gap-6">
        {fulfillments.map((f) => (
          <SupplierTimeline key={f.supplierId} timeline={buildTimeline(f)} orderSource={f.orderSource}
            showSupplierName={multi} tFul={tFul} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function SupplierTimeline({
  timeline, orderSource, showSupplierName, tFul, locale,
}: {
  timeline: ReturnType<typeof buildTimeline>; orderSource: Order["source"];
  showSupplierName: boolean; tFul: Dictionary["fulfillment"]; locale: Locale;
}) {
  const tl = tFul.timeline;
  return (
    <div>
      {showSupplierName && (
        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
          <Store className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
          {timeline.supplierName}
        </p>
      )}
      <ol className="flex flex-col">
        {timeline.steps.map((step, i) => (
          <TimelineRow key={step.stage} step={step} isLast={i === timeline.steps.length - 1}
            orderSource={orderSource} tFul={tFul} locale={locale} />
        ))}
      </ol>
      {timeline.status === "declined" && (
        <div className="mt-2 rounded-lg border border-border-subtle bg-elevated px-3 py-2" role="status">
          <p className="text-xs font-medium text-foreground">{tl.declinedTitle}</p>
          <p className="mt-0.5 text-xs text-muted">
            {tl.declinedBody}{timeline.declineReason ? ` · ${tl.reasonLabel}: ${tFul.reasons[timeline.declineReason]}` : ""}
          </p>
        </div>
      )}
    </div>
  );
}

const stepIcon: Record<TimelineStep["state"], React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>> = {
  done: Check, current: CircleDot, upcoming: CircleDot, declined: Ban, cancelled: X,
};

function TimelineRow({
  step, isLast, orderSource, tFul, locale,
}: {
  step: TimelineStep; isLast: boolean; orderSource: Order["source"];
  tFul: Dictionary["fulfillment"]; locale: Locale;
}) {
  const tl = tFul.timeline;
  const Icon = stepIcon[step.state];
  const isCurrent = step.state === "current";
  const isFuture = step.state === "upcoming";
  const readyNote = step.stage === "ready_for_next_stage" && step.state !== "upcoming"
    ? (orderSource === "accepted_quote" ? tl.readyCustomNote : tl.readyCatalogNote)
    : step.stage === "awaiting_supplier" && isCurrent ? tl.awaitingNote : null;

  return (
    <li className="flex gap-3">
      {/* Rail: icon + connector */}
      <div className="flex flex-col items-center">
        <span className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border",
          step.state === "done" ? "border-success bg-success text-white"
          : isCurrent ? "border-brand bg-brand-soft text-brand"
          : step.state === "declined" ? "border-danger/50 bg-danger-soft text-danger"
          : step.state === "cancelled" ? "border-border bg-surface text-muted"
          : "border-border bg-surface text-subtle",
        )}>
          <Icon className="size-3.5" strokeWidth={2} aria-hidden={true} />
        </span>
        {!isLast && <span className={cn("w-px flex-1", step.state === "done" ? "bg-success/40" : "bg-border-subtle")} style={{ minHeight: "1.5rem" }} aria-hidden="true" />}
      </div>
      {/* Label */}
      <div className={cn("pb-4", isFuture && "opacity-60")}>
        <p className={cn("flex flex-wrap items-center gap-2 text-sm", isCurrent ? "font-semibold text-foreground" : "font-medium text-foreground")}>
          {tl.stage[step.stage]}
          {isCurrent && <Badge tone="brand">{tl.current}</Badge>}
        </p>
        {step.at !== undefined && step.state !== "upcoming" && (
          <p className="mt-0.5 text-xs text-muted">{orderDateTime(step.at, locale)}</p>
        )}
        {readyNote && <p className="mt-0.5 text-xs text-subtle">{readyNote}</p>}
      </div>
    </li>
  );
}

function GroupBlock({
  group, t, tCustom, locale,
}: {
  group: SupplierOrderGroup; t: Dictionary["orders"]; tCustom: Dictionary["custom"]; locale: Locale;
}) {
  const td = t.detail;
  return (
    <section className="rounded-xl border border-border-subtle bg-elevated">
      <header className="flex items-center justify-between gap-2 border-b border-border-subtle px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Store className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
          {group.supplierName}
        </span>
        <span className="text-sm font-semibold text-foreground tabular">{formatOmr(group.groupTotal, locale)}</span>
      </header>
      <ul className="divide-y divide-border-subtle">
        {group.items.map((item, i) => (
          <li key={i} className="flex items-start justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              {item.kind === "catalog" ? (
                <>
                  <p className="text-sm font-medium text-foreground">{locale === "ar" ? item.nameAr : item.name}</p>
                  <p className="mt-0.5 text-xs text-muted tabular">
                    {formatOmr(item.unitPrice, locale)} {td.each} · {td.qty} {formatNumber(item.quantity, locale)}
                    {item.colorId && item.colorLabel && ` · ${locale === "ar" ? item.colorLabelAr : item.colorLabel}`}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-foreground">{td.custom}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {td.manufacturing}: {td.days.replace("{count}", formatNumber(item.manufacturingDays, locale))}
                    {item.warrantyText && tCustom.quotes.warranties[item.warrantyText as keyof typeof tCustom.quotes.warranties] && ` · ${tCustom.quotes.warranties[item.warrantyText as keyof typeof tCustom.quotes.warranties]}`}
                  </p>
                </>
              )}
            </div>
            <span className="shrink-0 text-sm font-medium text-foreground tabular">{formatOmr(item.lineTotal, locale)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Supplier dashboard → Orders. Own portion only; paid orders drive fulfillment. */
export function SupplierOrders({
  supplierId, t, tPay, tFul, tCustom, locale,
}: {
  supplierId: string; t: Dictionary["orders"]; tPay: Dictionary["payment"];
  tFul: Dictionary["fulfillment"]; tCustom: Dictionary["custom"]; locale: Locale;
}) {
  const { orders, hydrated } = useSupplierOrders(supplierId);
  const ts = tFul.supplier;
  if (!hydrated) return null;

  const rows = orders
    .map((o) => ({ order: o, group: o.groups.find((g) => g.supplierId === supplierId)! }))
    .filter((r) => r.group);

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">{ts.title}</h2>
      <p className="mt-0.5 text-sm text-muted">{ts.subtitle}</p>
      <p className="mt-2 text-xs text-subtle">{tFul.demoNote}</p>
      {rows.length === 0 ? (
        <EmptyState className="mt-6" title={ts.empty} icon={<PackageCheck className="size-5" strokeWidth={1.75} />} />
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {rows.map(({ order, group }) => (
            <SupplierOrderRow key={order.id} order={order} group={group} supplierId={supplierId}
              t={t} tPay={tPay} tFul={tFul} tCustom={tCustom} locale={locale} />
          ))}
        </ul>
      )}
    </div>
  );
}

function SupplierOrderRow({
  order, group, supplierId, t, tPay, tFul, tCustom, locale,
}: {
  order: Order; group: SupplierOrderGroup; supplierId: string;
  t: Dictionary["orders"]; tPay: Dictionary["payment"]; tFul: Dictionary["fulfillment"];
  tCustom: Dictionary["custom"]; locale: Locale;
}) {
  const ts = tFul.supplier;
  const { status: payStatus } = usePaymentStatus(order.id);
  const paid = payStatus === "paid";
  const { fulfillment, accept, decline, beginPreparing, ready } = useSupplierFulfillment(order, supplierId, payStatus);
  const fStatus: FulfillmentStatus | null = fulfillment?.status ?? (paid ? "awaiting_supplier" : null);

  return (
    <li className="rounded-xl border border-border-subtle bg-elevated">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
        <div>
          <p className="flex items-center gap-2 font-medium text-foreground tabular">
            {order.orderNumber}
            {order.isDemo && <Badge tone="neutral">{t.demoBadge}</Badge>}
          </p>
          <p className="mt-0.5 text-xs text-muted">{orderDate(order.createdAt, locale)}</p>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Supplier-safe payment view (§10): only Paid / Awaiting — never a failure reason. */}
          <Badge tone={paid ? "success" : "neutral"}>
            <CreditCard className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            {paid ? ts.paid : tPay.supplierAwaiting}
          </Badge>
          {fStatus && <FulfillmentStatusBadge status={fStatus} tFul={tFul} />}
          <span className="text-sm font-semibold text-foreground tabular">{formatOmr(group.groupTotal, locale)}</span>
        </div>
      </div>

      {/* Own portion only — never another supplier's items/totals (§10) */}
      <ul className="divide-y divide-border-subtle">
        {group.items.map((item, i) => (
          <li key={i} className="px-4 py-3">
            {item.kind === "catalog" ? (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{locale === "ar" ? item.nameAr : item.name}</p>
                  <p className="mt-0.5 text-xs text-muted tabular">
                    {ts.qty} {formatNumber(item.quantity, locale)} · {formatOmr(item.unitPrice, locale)} {ts.each}
                    {item.colorId && item.colorLabel && ` · ${locale === "ar" ? item.colorLabelAr : item.colorLabel}`}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium text-foreground tabular">{formatOmr(item.lineTotal, locale)}</span>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{ts.custom}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {ts.manufacturing}: {ts.days.replace("{count}", formatNumber(item.manufacturingDays, locale))}
                    {item.warrantyText && tCustom.quotes.warranties[item.warrantyText as keyof typeof tCustom.quotes.warranties]
                      && ` · ${tCustom.quotes.warranties[item.warrantyText as keyof typeof tCustom.quotes.warranties]}`}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium text-foreground tabular">{formatOmr(item.lineTotal, locale)}</span>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="border-t border-border-subtle px-4 py-3">
        <p className="text-xs text-muted">
          {ts.deliverTo}: {order.address.wilayat}، {order.address.governorate}
        </p>
        {/* Fulfillment actions — only for PAID orders (§4/§11). */}
        {!paid ? (
          <p className="mt-2 text-xs text-subtle">{tPay.supplierAwaiting}</p>
        ) : fulfillment ? (
          <SupplierFulfillmentActions
            status={fulfillment.status} declineReason={fulfillment.decline?.reason}
            source={order.source} tFul={tFul}
            onAccept={accept} onDecline={decline} onPrepare={beginPreparing} onReady={ready} />
        ) : (
          <p className="mt-2 text-xs text-subtle">{ts.awaitingHint}</p>
        )}
      </div>
    </li>
  );
}

/**
 * Supplier lifecycle controls (§11–§16). Buttons come only from
 * `availableSupplierActions(status)` — a hidden button is never the only guard;
 * the store re-checks the state machine. Accept opens an inline confirmation;
 * Decline opens an accessible reason form (structured reasons + optional internal
 * note that the customer never sees, §12).
 */
function SupplierFulfillmentActions({
  status, declineReason, source, tFul, onAccept, onDecline, onPrepare, onReady,
}: {
  status: FulfillmentStatus; declineReason?: DeclineReason; source: Order["source"];
  tFul: Dictionary["fulfillment"];
  onAccept: () => boolean; onDecline: (reason: DeclineReason, note?: string) => boolean;
  onPrepare: () => boolean; onReady: () => boolean;
}) {
  const ts = tFul.supplier;
  const [mode, setMode] = React.useState<"idle" | "confirmAccept" | "decline">("idle");
  const actions = availableSupplierActions(status);

  if (status === "declined") {
    return (
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
        <Ban className="size-3.5 text-danger" strokeWidth={1.75} aria-hidden="true" />
        {ts.declinedToast}{declineReason ? ` · ${tFul.reasons[declineReason]}` : ""}
      </p>
    );
  }
  if (status === "ready_for_next_stage") {
    return (
      <p className="mt-2 flex items-center gap-1.5 text-xs text-success">
        <PackageCheck className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
        {source === "accepted_quote" ? ts.customReadyHint : ts.readyHint}
      </p>
    );
  }

  if (mode === "confirmAccept") {
    return (
      <div className="mt-3 rounded-lg border border-border-subtle bg-surface p-3" role="group" aria-label={ts.acceptConfirmTitle}>
        <p className="text-sm font-medium text-foreground">{ts.acceptConfirmTitle}</p>
        <p className="mt-1 text-xs text-muted">{ts.acceptConfirmBody}</p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={() => { onAccept(); setMode("idle"); }} iconStart={<Check className="size-4" strokeWidth={2} />}>{ts.confirm}</Button>
          <Button size="sm" variant="ghost" onClick={() => setMode("idle")}>{ts.cancel}</Button>
        </div>
      </div>
    );
  }
  if (mode === "decline") {
    return <DeclineForm tFul={tFul} onCancel={() => setMode("idle")} onSubmit={(reason, note) => { onDecline(reason, note); setMode("idle"); }} />;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.includes("accept") && (
        <Button size="sm" onClick={() => setMode("confirmAccept")} iconStart={<Check className="size-4" strokeWidth={2} />}>{ts.accept}</Button>
      )}
      {actions.includes("decline") && (
        <Button size="sm" variant="outline" onClick={() => setMode("decline")} iconStart={<X className="size-4" strokeWidth={2} />}>{ts.decline}</Button>
      )}
      {actions.includes("start_preparing") && (
        <Button size="sm" onClick={() => onPrepare()} iconStart={<Hammer className="size-4" strokeWidth={1.75} />}>{ts.startPreparing}</Button>
      )}
      {actions.includes("mark_ready") && (
        <Button size="sm" onClick={() => onReady()} iconStart={<PackageCheck className="size-4" strokeWidth={1.75} />}>{ts.markReady}</Button>
      )}
    </div>
  );
}

const DECLINE_REASONS: DeclineReason[] = ["unable_to_fulfill", "inventory_issue", "capacity_issue", "delivery_issue", "other"];

function DeclineForm({
  tFul, onCancel, onSubmit,
}: {
  tFul: Dictionary["fulfillment"]; onCancel: () => void; onSubmit: (reason: DeclineReason, note?: string) => void;
}) {
  const ts = tFul.supplier;
  const [reason, setReason] = React.useState<DeclineReason>("unable_to_fulfill");
  const [note, setNote] = React.useState("");
  return (
    <form
      className="mt-3 rounded-lg border border-border-subtle bg-surface p-3"
      onSubmit={(e) => { e.preventDefault(); onSubmit(reason, note.trim() || undefined); }}
    >
      <p className="text-sm font-medium text-foreground">{ts.declineTitle}</p>
      <p className="mt-1 text-xs text-muted">{ts.declineIntro}</p>
      <fieldset className="mt-3">
        <legend className="text-xs font-medium text-foreground">{ts.declineReasonLabel}</legend>
        <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {DECLINE_REASONS.map((r) => (
            <label key={r} className={cn(
              "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
              reason === r ? "border-brand bg-brand-soft/50 text-foreground" : "border-border bg-elevated text-muted hover:border-taupe",
            )}>
              <input type="radio" name="decline-reason" value={r} checked={reason === r}
                onChange={() => setReason(r)} className="size-4 accent-[var(--brand)]" />
              {tFul.reasons[r]}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-3">
        <label htmlFor="decline-note" className="text-xs font-medium text-foreground">{ts.declineNoteLabel}</label>
        <textarea id="decline-note" rows={2} maxLength={400} value={note} onChange={(e) => setNote(e.target.value)}
          aria-describedby="decline-note-hint"
          className="mt-1.5 w-full resize-y rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-foreground shadow-[var(--shadow-xs)] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25" />
        <p id="decline-note-hint" className="mt-1 text-xs text-subtle">{ts.declineNoteHint}</p>
      </div>
      <div className="mt-3 flex gap-2">
        <Button type="submit" size="sm" variant="outline" iconStart={<X className="size-4" strokeWidth={2} />}>{ts.declineSubmit}</Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>{ts.cancel}</Button>
      </div>
    </form>
  );
}
