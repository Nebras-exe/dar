"use client";

import * as React from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatOmr } from "@/lib/catalog";
import { useOrders } from "@/features/orders/order-store";
import { getPaymentStatus } from "@/features/orders/payment-store";
import { getFulfillment } from "@/features/orders/fulfillment-store";
import { getManufacturingJob } from "@/features/orders/manufacturing-store";
import { getOrderDeliveries } from "@/features/orders/delivery-store";

/**
 * The signed-in user's OWN order summary, rendered inside chat. Reads ONLY the
 * per-user client stores (payment/fulfillment/manufacturing/delivery) — this data
 * never leaves the browser and is never sent to the chat API, so cross-user access
 * is impossible. Shows nothing for a signed-out user or an empty account.
 */
export function ChatOrderSummary({
  userId,
  t,
  tPay,
  tFul,
  tMfg,
  tDel,
  locale,
}: {
  userId: string | null;
  t: Dictionary["chat"];
  tPay: Dictionary["payment"];
  tFul: Dictionary["fulfillment"];
  tMfg: Dictionary["manufacturing"];
  tDel: Dictionary["delivery"];
  locale: Locale;
}) {
  const { orders, hydrated } = useOrders(userId ?? "");

  if (!userId) return <p className="text-xs text-muted">{t.signInForOrders}</p>;
  if (!hydrated) return null;
  if (orders.length === 0) return <p className="text-xs text-muted">{t.noOrders}</p>;

  const recent = orders.slice(0, 3);

  /** The furthest-along customer-facing stage label for an order. */
  function progressLabel(orderId: string, supplierIds: string[]): string {
    // Delivery is the latest stage; then manufacturing; then fulfillment.
    const dels = getOrderDeliveries(orderId);
    if (dels.length > 0) {
      const d = dels[0];
      return tDel.status[d.status];
    }
    for (const sid of supplierIds) {
      const job = getManufacturingJob(orderId, sid);
      if (job) return tMfg.status[job.status];
      const ful = getFulfillment(orderId, sid);
      if (ful) return tFul.status[ful.status];
    }
    return tPay.status[getPaymentStatus(orderId)];
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-foreground">{t.ordersIntro}</p>
      {recent.map((o) => {
        const supplierIds = o.groups.map((g) => g.supplierId);
        const pay = getPaymentStatus(o.id);
        return (
          <Link
            key={o.id}
            href={`/${locale}/orders/${o.id}`}
            className="flex items-center gap-2.5 rounded-lg border border-border-subtle bg-elevated px-3 py-2 transition-colors hover:border-taupe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <Package className="size-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground tabular">{o.orderNumber}</span>
              <span className="block text-xs text-muted">
                {t.orderPayment}: {tPay.status[pay]} · {t.orderProgress}: {progressLabel(o.id, supplierIds)}
              </span>
            </span>
            <span className="shrink-0 text-xs font-semibold text-foreground tabular">{formatOmr(o.totals.grandTotal, locale)}</span>
          </Link>
        );
      })}
    </div>
  );
}
