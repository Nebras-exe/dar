"use client";

import * as React from "react";
import { ArrowRight, Check, CheckCircle2, Clock, ShieldCheck, Sparkles, Store, Truck } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { demoSupplierById } from "@/lib/repository";
import { formatOmr } from "@/lib/catalog";
import { formatNumber } from "@/lib/utils";
import {
  budgetPosition, recommendQuote, sortQuotes,
  type CustomFurnitureSpec, type Quote, type QuoteSort,
} from "@/lib/rfq";
import { cn } from "@/lib/utils";
import { StepNav } from "../custom-experience";
import { useRFQ } from "../rfq-store";

const SORTS: QuoteSort[] = ["recommended", "lowest-price", "fastest", "within-budget"];

/**
 * Quote comparison + acceptance (§26/§27/§29/§30). A premium, transparent
 * comparison — never a single opaque "AI score". Athathi's pick is explained by
 * reasons. Accepting is an explicit, confirmed customer action; it records the
 * choice as "ready for order" and does NOT create payment/order (that's Phase 10).
 */
export function QuotesStep({
  t, locale, customerId, requestId, spec, onBack,
}: {
  t: Dictionary["custom"];
  locale: Locale;
  customerId: string;
  requestId: string;
  spec: CustomFurnitureSpec;
  onBack: () => void;
}) {
  const tq = t.quotes;
  const { quotesFor, accept, requests } = useRFQ(customerId);
  const [sort, setSort] = React.useState<QuoteSort>("recommended");
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  const quotes = quotesFor(requestId);
  const request = requests.find((r) => r.id === requestId);
  const accepted = request?.status === "accepted";
  const budget = spec.budget;
  const rec = React.useMemo(() => recommendQuote(quotes, budget), [quotes, budget]);
  const sorted = React.useMemo(() => sortQuotes(quotes, sort, budget), [quotes, sort, budget]);

  if (quotes.length === 0) {
    return (
      <div>
        <EmptyState title={tq.empty} />
        <StepNav onBack={onBack} nextLabel="" backLabel={t.review.edit} />
      </div>
    );
  }

  const acceptedQuote = quotes.find((q) => q.status === "accepted");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-2xl">
          <h2 className="text-2xl">{tq.title}</h2>
          <p className="mt-2 text-muted">{tq.subtitle}</p>
        </div>
        {!accepted && (
          <div>
            <label htmlFor="quote-sort" className="me-2 text-sm text-subtle">{tq.sortLabel}</label>
            <select id="quote-sort" value={sort} onChange={(e) => setSort(e.target.value as QuoteSort)}
              className="h-9 rounded-lg border border-border bg-elevated px-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25">
              {SORTS.map((s) => <option key={s} value={s}>{tq.sort[s]}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Accepted confirmation → proceed to unified checkout */}
      {accepted && acceptedQuote && (
        <div className="mt-5 rounded-xl border border-success/40 bg-success-soft p-5">
          <p className="flex items-center gap-2 font-semibold text-success">
            <CheckCircle2 className="size-5" strokeWidth={2} aria-hidden="true" />
            {tq.acceptedTitle}
          </p>
          <p className="mt-1.5 text-sm text-muted">{tq.acceptedBody}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Badge tone="success">{tq.readyForOrder}</Badge>
            <Button
              size="sm"
              href={`/${locale}/checkout?source=quote&request=${requestId}&quote=${acceptedQuote.id}`}
              iconEnd={<ArrowRight className="size-4 rtl:rotate-180" strokeWidth={2} />}
            >
              {tq.checkout}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {sorted.map((q, i) => (
          <div key={q.id} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <QuoteCard
              q={q} tq={tq} locale={locale} budget={budget}
              isRecommended={!accepted && rec?.quoteId === q.id}
              recReasons={rec?.quoteId === q.id ? rec.reasons : []}
              accepted={accepted}
              onChoose={() => setConfirmId(q.id)}
            />
          </div>
        ))}
      </div>

      {/* Accept confirmation dialog */}
      {confirmId && !accepted && (() => {
        const q = quotes.find((x) => x.id === confirmId)!;
        const s = demoSupplierById(q.supplierId);
        const name = s ? (locale === "ar" ? s.nameAr : s.name) : q.supplierId;
        return (
          <div className="mt-6 rounded-xl border border-brand/40 bg-brand-soft/50 p-5" role="dialog" aria-label={tq.acceptTitle}>
            <h3 className="text-lg font-semibold text-foreground">{tq.acceptTitle}</h3>
            <p className="mt-1.5 text-sm text-muted">
              {tq.acceptBody
                .replace("{supplier}", name)
                .replace("{total}", formatOmr(q.total, locale))
                .replace("{days}", tq.days.replace("{count}", formatNumber(q.manufacturingDays, locale)))}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => { accept(requestId, q.id); setConfirmId(null); }} iconStart={<Check className="size-4.5" strokeWidth={2} />}>
                {tq.acceptConfirm}
              </Button>
              <Button variant="ghost" onClick={() => setConfirmId(null)}>{tq.cancel}</Button>
            </div>
          </div>
        );
      })()}

      <StepNav onBack={onBack} nextLabel="" backLabel={t.review.edit} />
    </div>
  );
}

function QuoteCard({
  q, tq, locale, budget, isRecommended, recReasons, accepted, onChoose,
}: {
  q: Quote;
  tq: Dictionary["custom"]["quotes"];
  locale: Locale;
  budget: number | undefined;
  isRecommended: boolean;
  recReasons: { code: string; value?: string }[];
  accepted: boolean;
  onChoose: () => void;
}) {
  const s = demoSupplierById(q.supplierId);
  const name = s ? (locale === "ar" ? s.nameAr : s.name) : q.supplierId;
  const pos = budgetPosition(q.total, budget);
  const isAcceptedOne = q.status === "accepted";
  const isDeclined = q.status === "declined";

  return (
    <article className={cn(
      "flex flex-col rounded-2xl border bg-elevated p-5",
      isAcceptedOne ? "border-success ring-1 ring-success" : isRecommended ? "border-brand ring-1 ring-brand" : "border-border-subtle",
      isDeclined && "opacity-60",
    )}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-medium text-foreground">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <Store className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </span>
          {name}
        </span>
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="neutral">{tq.demoQuote}</Badge>
          {s?.verified && <Badge tone="accent"><ShieldCheck className="me-1 inline size-3" strokeWidth={2} />{tq.recReasons["verified-supplier"]}</Badge>}
        </div>
      </div>

      {isRecommended && (
        <div className="mt-3 rounded-lg border border-brand/30 bg-brand-soft/60 px-3.5 py-2.5">
          <p className="flex items-center gap-1.5 text-sm font-medium text-brand">
            <Sparkles className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {tq.recommendedBadge}
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-foreground">
            {recReasons.map((r, i) => (
              <li key={i} className="flex items-center gap-1">
                <Check className="size-3 text-success" strokeWidth={2.5} aria-hidden="true" />
                {tq.recReasons[r.code as keyof typeof tq.recReasons]}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Total + budget position */}
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-subtle">{tq.total}</p>
          <p className="text-2xl font-semibold text-foreground tabular">{formatOmr(q.total, locale)}</p>
        </div>
        <BudgetPill pos={pos} tq={tq} locale={locale} />
      </div>

      {/* Breakdown */}
      <dl className="mt-4 flex flex-col gap-1.5 border-t border-border-subtle pt-3 text-sm">
        <Line label={tq.furniture} value={formatOmr(q.basePrice, locale)} />
        <Line label={tq.delivery} value={q.deliveryFee === 0 ? tq.freeDelivery : formatOmr(q.deliveryFee, locale)} />
        <Line label={tq.installation} value={formatOmr(q.installationFee, locale)} />
      </dl>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
        <span className="flex items-center gap-1.5"><Clock className="size-3.5" strokeWidth={1.75} aria-hidden="true" />{tq.days.replace("{count}", formatNumber(q.manufacturingDays, locale))}</span>
        <span className="flex items-center gap-1.5"><Truck className="size-3.5" strokeWidth={1.75} aria-hidden="true" />{tq.warranties[q.warrantyText as keyof typeof tq.warranties] ?? q.warrantyText}</span>
      </div>

      {/* Action */}
      <div className="mt-4">
        {isAcceptedOne ? (
          <Badge tone="success"><Check className="me-1 inline size-3.5" strokeWidth={2.5} />{tq.accepted}</Badge>
        ) : accepted ? (
          <Badge tone="neutral">{tq.declined}</Badge>
        ) : (
          <Button size="sm" variant={isRecommended ? "primary" : "outline"} onClick={onChoose} className="w-full">
            {tq.choose}
          </Button>
        )}
      </div>
    </article>
  );
}

function BudgetPill({ pos, tq, locale }: { pos: ReturnType<typeof budgetPosition>; tq: Dictionary["custom"]["quotes"]; locale: Locale }) {
  if (pos.status === "within") return <Badge tone="success">{tq.withinBudget}</Badge>;
  if (pos.status === "over") return <Badge tone="warning">{tq.overBudget.replace("{amount}", formatOmr(pos.overBy, locale))}</Badge>;
  return <Badge tone="neutral">{tq.noBudget}</Badge>;
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-foreground tabular">{value}</dd>
    </div>
  );
}
