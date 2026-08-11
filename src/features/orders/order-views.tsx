"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft, Check, CreditCard, MapPin, Package, PackageCheck, ShoppingBag, Store,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatOmr } from "@/lib/catalog";
import { formatNumber } from "@/lib/utils";
import type { SupplierOrderGroup } from "@/lib/orders";
import type { PaymentStatus } from "@/lib/payments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useOrders, useSupplierOrders } from "./order-store";
import { usePaymentStatus } from "./payment-store";

function orderDate(ts: number, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-OM" : "en-GB", {
    year: "numeric", month: "short", day: "numeric",
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

/** Customer account → Orders list (real; honest empty state). */
export function AccountOrders({
  t, tPay, locale, customerId,
}: {
  t: Dictionary["orders"]; tPay: Dictionary["payment"]; locale: Locale; customerId: string;
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
            <AccountOrderRow key={o.id} order={o} t={t} tPay={tPay} locale={locale} />
          ))}
        </ul>
      )}
    </section>
  );
}

function AccountOrderRow({
  order: o, t, tPay, locale,
}: {
  order: import("@/lib/orders").Order; t: Dictionary["orders"]; tPay: Dictionary["payment"]; locale: Locale;
}) {
  const { status } = usePaymentStatus(o.id);
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

/** Order detail (customer view). Full supplier grouping + address + payment note. */
export function OrderDetail({
  t, tPay, tCustom, locale, customerId, orderId,
}: {
  t: Dictionary["orders"]; tPay: Dictionary["payment"]; tCustom: Dictionary["custom"]; locale: Locale;
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

/** Supplier dashboard → Orders (own portion only; acknowledge/processing). */
export function SupplierOrders({
  supplierId, t, tPay, locale,
}: {
  supplierId: string; t: Dictionary["orders"]; tPay: Dictionary["payment"]; locale: Locale;
}) {
  const { orders, setGroupStatus, hydrated } = useSupplierOrders(supplierId);
  const ts = t.supplier;
  if (!hydrated) return null;

  const rows = orders
    .map((o) => ({ order: o, group: o.groups.find((g) => g.supplierId === supplierId)! }))
    .filter((r) => r.group);

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">{ts.title}</h2>
      <p className="mt-0.5 text-sm text-muted">{ts.subtitle}</p>
      {rows.length === 0 ? (
        <EmptyState className="mt-6" title={ts.empty} icon={<PackageCheck className="size-5" strokeWidth={1.75} />} />
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {rows.map(({ order, group }) => (
            <SupplierOrderRow key={order.id} order={order} group={group} t={t} tPay={tPay} locale={locale}
              onSetStatus={(s) => setGroupStatus(order.id, s)} />
          ))}
        </ul>
      )}
    </div>
  );
}

function SupplierOrderRow({
  order, group, t, tPay, locale, onSetStatus,
}: {
  order: import("@/lib/orders").Order; group: SupplierOrderGroup;
  t: Dictionary["orders"]; tPay: Dictionary["payment"]; locale: Locale;
  onSetStatus: (status: "acknowledged" | "processing") => void;
}) {
  const ts = t.supplier;
  const { status } = usePaymentStatus(order.id);
  // Supplier-safe payment view (§8/§23): only whether the customer has PAID —
  // never a failure reason, provider reference, method, or amount attempted.
  const paid = status === "paid";
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
          <Badge tone={paid ? "success" : "neutral"}>
            <CreditCard className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            {paid ? tPay.supplierPaid : tPay.supplierAwaiting}
          </Badge>
          <Badge tone={group.status === "processing" ? "warning" : group.status === "acknowledged" ? "accent" : "neutral"}>
            {ts.groupStatus[group.status]}
          </Badge>
          <span className="text-sm font-semibold text-foreground tabular">{formatOmr(group.groupTotal, locale)}</span>
        </div>
      </div>
      {/* Own portion only — never another supplier's items/totals */}
      <ul className="divide-y divide-border-subtle">
        {group.items.map((item, i) => (
          <li key={i} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
            <span className="min-w-0 truncate text-foreground">
              {item.kind === "catalog" ? (locale === "ar" ? item.nameAr : item.name) : t.detail.custom}
            </span>
            <span className="tabular text-muted">{formatOmr(item.lineTotal, locale)}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="text-xs text-muted">
          {ts.deliverTo}: {order.address.wilayat}، {order.address.governorate}
        </p>
        <div className="flex gap-2">
          {group.status === "new" && (
            <Button size="sm" variant="outline" onClick={() => onSetStatus("acknowledged")} iconStart={<Check className="size-4" strokeWidth={2} />}>
              {ts.acknowledge}
            </Button>
          )}
          {group.status === "acknowledged" && (
            <Button size="sm" onClick={() => onSetStatus("processing")} iconStart={<Package className="size-4" strokeWidth={1.75} />}>
              {ts.markProcessing}
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
