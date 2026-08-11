"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight, CalendarClock, Compass, CreditCard, FileText, RefreshCw, ShoppingBag,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { buildFollowUpContext, type FollowUpOrderState, type NextAction, type NextActionKind } from "@/lib/agent/followup";
import { useOrders } from "@/features/orders/order-store";
import { getPaymentStatus } from "@/features/orders/payment-store";
import { getFulfillment } from "@/features/orders/fulfillment-store";
import { getManufacturingJob } from "@/features/orders/manufacturing-store";
import { getOrderDeliveries } from "@/features/orders/delivery-store";

const actionIcon: Record<NextActionKind, React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>> = {
  pay_order: CreditCard, review_quote: FileText, choose_delivery_slot: CalendarClock,
  reschedule_delivery: RefreshCw, view_order: ShoppingBag, continue_design: Compass,
};

/**
 * Agent follow-up card (Phase 13, §30–§34). Surfaces the user's most useful next
 * actions from DETERMINISTIC state (never invented). Each action deep-links to the
 * relevant surface; the assistant recommends, the user acts — no operational write
 * happens here. Read-only + own-orders only.
 */
export function FollowUpCard({
  t, locale, customerId,
}: {
  t: Dictionary["followup"]; locale: Locale; customerId: string;
}) {
  const { orders, hydrated } = useOrders(customerId);

  const context = React.useMemo(() => {
    const orderStates: FollowUpOrderState[] = orders.map((o) => {
      const deliveries = getOrderDeliveries(o.id);
      return {
        orderId: o.id,
        orderNumber: o.orderNumber,
        paymentStatus: getPaymentStatus(o.id),
        fulfillmentStatuses: o.groups.map((g) => getFulfillment(o.id, g.supplierId)?.status).filter(Boolean) as FollowUpOrderState["fulfillmentStatuses"],
        manufacturingStatuses: o.groups.map((g) => getManufacturingJob(o.id, g.supplierId)?.status).filter(Boolean) as FollowUpOrderState["manufacturingStatuses"],
        deliveryStatuses: deliveries.map((d) => d.status),
        awaitingSlot: deliveries.some((d) => d.status === "awaiting_schedule" || d.status === "reschedule_required"),
      };
    });
    return buildFollowUpContext({ orders: orderStates, pendingQuoteRequestIds: [], activeDesignIds: [] });
  }, [orders]);

  if (!hydrated || context.actions.length === 0) return null; // quiet when nothing's pending

  const top = context.top!;
  const rest = context.actions.filter((a) => a !== top).slice(0, 3);

  return (
    <section aria-labelledby="followup-heading" className="rounded-xl border border-border-subtle bg-elevated p-5">
      <h2 id="followup-heading" className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Compass className="size-5 text-brand" strokeWidth={1.75} aria-hidden="true" />
        {t.title}
      </h2>

      {/* Primary suggested next step */}
      <div className="mt-3">
        <p className="text-xs font-medium text-subtle">{t.nextTitle}</p>
        <ActionRow action={top} t={t} locale={locale} primary />
      </div>

      {rest.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2 border-t border-border-subtle pt-3">
          {rest.map((a) => (
            <li key={`${a.kind}:${a.target.id}`}><ActionRow action={a} t={t} locale={locale} /></li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-xs text-subtle">{t.readOnlyNote}</p>
    </section>
  );
}

function actionHref(a: NextAction, locale: Locale): string {
  if (a.target.kind === "order") {
    if (a.kind === "pay_order") return `/${locale}/orders/${a.target.id}/payment`;
    return `/${locale}/orders/${a.target.id}`;
  }
  if (a.target.kind === "design") return `/${locale}/design`;
  return `/${locale}/account`;
}

function ActionRow({
  action, t, locale, primary,
}: {
  action: NextAction; t: Dictionary["followup"]; locale: Locale; primary?: boolean;
}) {
  const Icon = actionIcon[action.kind];
  const label = t.actions[action.kind].replace("{orderNumber}", action.params.orderNumber ?? "");
  const priorityTone = action.priority === "high" ? "text-danger" : "text-brand";
  return (
    <Link href={actionHref(action, locale)}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        primary ? "mt-1.5 border border-brand/30 bg-brand-soft/40 hover:bg-brand-soft/60" : "hover:bg-surface",
      )}>
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full bg-surface", priorityTone)}>
        <Icon className="size-4" strokeWidth={1.75} aria-hidden={true} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className={cn("block text-xs", priorityTone)}>{t.priority[action.priority]}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" strokeWidth={1.75} aria-hidden="true" />
    </Link>
  );
}
