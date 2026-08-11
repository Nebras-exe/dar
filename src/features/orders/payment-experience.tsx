"use client";
import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft, BadgeCheck, CheckCircle2, CreditCard, Info, Loader2,
  Lock, Receipt, RefreshCw, ShieldCheck, TriangleAlert,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatOmr } from "@/lib/catalog";
import { isPaid, canRetry, type PaymentIntent, type PaymentStatus } from "@/lib/payments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { useOrders } from "./order-store";
import { usePayment } from "./payment-store";

type DemoOutcome = "success" | "failure";

function dateTime(ts: number, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-OM" : "en-GB", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(ts);
}

/**
 * Payment page (Phase 10B). Pays a CONFIRMED order through the Demo Payment
 * provider — never a card/CVV/bank field (§7/§13). The amount shown is derived
 * from the order, not any client value (§15); "paid" is only reached by calling
 * the provider's `verify` (§17), gated by the status machine. Everything is
 * clearly labelled **Demo Payment** and no real money moves (§12).
 */
export function PaymentExperience({
  t, locale, customerId, orderId,
}: {
  t: Dictionary["payment"]; locale: Locale; customerId: string; orderId: string;
}) {
  const { byId, hydrated: ordersHydrated } = useOrders(customerId);
  const order = byId(orderId);
  const { intent, hydrated: payHydrated, start, verify, retry } = usePayment(order ?? null);

  const [outcome, setOutcome] = React.useState<DemoOutcome>("success");
  const [busy, setBusy] = React.useState<null | "pay" | "verify">(null);

  if (!ordersHydrated || !payHydrated) {
    return <div className="h-64 animate-pulse rounded-2xl bg-surface" aria-hidden="true" />;
  }
  if (!order) {
    return (
      <EmptyState
        icon={<CreditCard className="size-5" strokeWidth={1.75} />}
        title={t.notFoundTitle} description={t.notFoundBody}
        action={<Button href={`/${locale}/account`}>{t.backToOrders}</Button>}
      />
    );
  }

  const status: PaymentStatus = intent?.status ?? "not_started";
  const paid = isPaid(status);
  const failed = status === "failed" || status === "expired";
  const pending = status === "pending" || status === "requires_action" || status === "authorized";
  const amount = order.totals.grandTotal; // server/order authority — never a client value

  const onPay = async () => {
    setBusy("pay");
    try { await start("demo", outcome); } finally { setBusy(null); }
  };
  const onVerify = async () => {
    setBusy("verify");
    try { await verify(); } finally { setBusy(null); }
  };
  const onRetry = () => { retry(); setOutcome("success"); };

  return (
    <div>
      <Link href={`/${locale}/orders/${order.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
        <ArrowLeft className="size-4 rtl:rotate-180" strokeWidth={1.75} aria-hidden="true" />
        {t.backToOrder}
      </Link>

      <div className="flex flex-wrap items-center gap-3 border-b border-border-subtle pb-5">
        <h1 className="text-2xl sm:text-3xl">{t.title}</h1>
        <Badge tone="demo">
          <ShieldCheck className="size-3.5" strokeWidth={2} aria-hidden="true" />
          {t.demoBadge}
        </Badge>
        <span className="ms-auto font-medium text-muted tabular">
          {t.orderRef} <span className="text-foreground">{order.orderNumber}</span>
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="min-w-0">
          {/* Live status, announced to assistive tech */}
          <p className="sr-only" role="status" aria-live="polite">{t.status[status]}</p>

          {paid ? (
            <PaidReceipt t={t} locale={locale} intent={intent!} amount={amount} orderHref={`/${locale}/orders/${order.id}`} />
          ) : (
            <div className="rounded-2xl border border-border-subtle bg-elevated p-5 sm:p-6">
              {/* Honest demo explainer — never a fake gateway */}
              <div className="flex gap-3 rounded-xl border border-brand/25 bg-brand-soft/40 p-4">
                <Info className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.demoNoticeTitle}</p>
                  <p className="mt-1 text-sm text-muted">{t.demoNoticeBody}</p>
                </div>
              </div>

              {failed && (
                <div className="mt-5 flex gap-3 rounded-xl border border-danger/30 bg-danger-soft p-4" role="alert">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0 text-danger" strokeWidth={1.75} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-danger">{t.failed.title}</p>
                    <p className="mt-1 text-sm text-muted">{t.failed.body}</p>
                  </div>
                </div>
              )}

              {pending ? (
                /* Intent created (like returning from a hosted gateway) → verify server-side */
                <div className="mt-6">
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <BadgeCheck className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
                    {t.status.pending}
                  </p>
                  <p className="mt-1 text-sm text-muted">{t.verifyHint}</p>
                  <Button className="mt-4" size="lg" onClick={onVerify} loading={busy === "verify"}
                    iconStart={busy === "verify" ? <Loader2 className="size-4.5 animate-spin" /> : <ShieldCheck className="size-4.5" strokeWidth={1.75} />}>
                    {busy === "verify" ? t.verifying : t.verifyButton}
                  </Button>
                </div>
              ) : (
                /* not_started / failed / expired → choose demo outcome + pay */
                <div className="mt-6">
                  <fieldset>
                    <legend className="text-sm font-medium text-foreground">{t.outcomeLabel}</legend>
                    <p className="mt-0.5 text-xs text-subtle">{t.outcomeHint}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <OutcomeOption value="success" checked={outcome === "success"} onChange={setOutcome} label={t.outcomeSuccess} />
                      <OutcomeOption value="failure" checked={outcome === "failure"} onChange={setOutcome} label={t.outcomeFailure} />
                    </div>
                  </fieldset>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Button size="lg" onClick={onPay} loading={busy === "pay"}
                      iconStart={busy === "pay" ? <Loader2 className="size-4.5 animate-spin" /> : <Lock className="size-4.5" strokeWidth={1.75} />}>
                      {busy === "pay" ? t.paying : (failed ? t.retryButton : t.payButton)}
                    </Button>
                    {failed && canRetry(status) && (
                      <Button variant="ghost" onClick={onRetry} iconStart={<RefreshCw className="size-4" strokeWidth={1.75} />}>
                        {t.resetButton}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <p className="mt-6 flex items-center gap-1.5 border-t border-border-subtle pt-4 text-xs text-subtle">
                <Lock className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                {t.noCardNote}
              </p>
            </div>
          )}
        </div>

        {/* Amount summary — from the order */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border-subtle bg-surface p-5">
            <p className="text-sm font-medium text-foreground">{t.summaryTitle}</p>
            <dl className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted">{t.orderRef}</dt>
                <dd className="font-medium text-foreground tabular">{order.orderNumber}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted">{t.statusLabel}</dt>
                <dd><PaymentStatusPill t={t} status={status} /></dd>
              </div>
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-border-subtle pt-4">
              <span className="text-base font-semibold text-foreground">{t.amountDue}</span>
              <span className="text-lg font-semibold text-foreground tabular">{formatOmr(amount, locale)}</span>
            </div>
            <p className="mt-3 text-xs text-subtle">{t.liveNote}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function OutcomeOption({
  value, checked, onChange, label,
}: {
  value: DemoOutcome; checked: boolean; onChange: (v: DemoOutcome) => void; label: string;
}) {
  return (
    <label className={cn(
      "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm transition-colors",
      checked ? "border-brand bg-brand-soft/50 text-foreground" : "border-border bg-elevated text-muted hover:border-taupe",
    )}>
      <input type="radio" name="demo-outcome" value={value} checked={checked}
        onChange={() => onChange(value)}
        className="size-4 accent-[var(--brand)]" />
      <span className="font-medium">{label}</span>
    </label>
  );
}

function PaidReceipt({
  t, locale, intent, amount, orderHref,
}: {
  t: Dictionary["payment"]; locale: Locale; intent: PaymentIntent; amount: number; orderHref: string;
}) {
  const r = t.receipt;
  return (
    <div className="rounded-2xl border border-success/40 bg-success-soft/60 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="size-8 text-success" strokeWidth={1.75} aria-hidden="true" />
        <div>
          <h2 className="text-xl font-semibold text-foreground">{t.paidTitle}</h2>
          <p className="text-sm text-muted">{t.paidBody}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border-subtle bg-surface p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Receipt className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
          {r.title}
          <Badge tone="demo" className="ms-auto">{t.demoBadge}</Badge>
        </p>
        <dl className="mt-4 flex flex-col gap-2.5 text-sm">
          <ReceiptRow label={r.reference} value={intent.providerReference ?? "—"} mono />
          <ReceiptRow label={r.method} value={r.methodDemo} />
          <ReceiptRow label={r.paidOn} value={dateTime(intent.updatedAt, locale)} />
          <div className="flex items-baseline justify-between gap-3 border-t border-border-subtle pt-2.5">
            <dt className="font-semibold text-foreground">{r.amount}</dt>
            <dd className="text-base font-semibold text-foreground tabular">{formatOmr(amount, locale)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-subtle">{r.note}</p>
      </div>

      <Button className="mt-6" href={orderHref} iconStart={<ArrowLeft className="size-4 rtl:rotate-180" strokeWidth={1.75} />}>
        {r.viewOrder}
      </Button>
    </div>
  );
}

function ReceiptRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className={cn("font-medium text-foreground", mono && "font-mono text-xs tabular")} dir="ltr">{value}</dd>
    </div>
  );
}

/** Status pill — text + icon (never colour-only), for the payment page summary. */
function PaymentStatusPill({ t, status }: { t: Dictionary["payment"]; status: PaymentStatus }) {
  const tone = status === "paid" ? "success" : status === "failed" || status === "expired" ? "warning" : "neutral";
  return <Badge tone={tone}>{t.status[status]}</Badge>;
}
