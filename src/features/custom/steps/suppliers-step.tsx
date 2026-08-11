"use client";

import * as React from "react";
import { Check, MapPin, Send, ShieldCheck, Store } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { demoSuppliers } from "@/lib/repository";
import { categoryBySlug, formatOmr, label as catLabel, materialLabels } from "@/lib/catalog";
import { matchSuppliers, type CustomFurnitureSpec, type MatchReason } from "@/lib/rfq";
import { cn } from "@/lib/utils";
import { StepNav } from "../custom-experience";
import { useRFQ } from "../rfq-store";

/**
 * Supplier matching + selection + send RFQ (§17/§19/§20). Suppliers are matched
 * from real data with transparent reasons; inactive/ineligible suppliers never
 * appear. Sending is an explicit, confirmed action that shows the summary first.
 * In demo mode it creates the request + deterministic Demo Quotes locally.
 */
export function SuppliersStep({
  t, locale, spec, chosen, setChosen, customerId, onBack, onSent,
}: {
  t: Dictionary["custom"];
  locale: Locale;
  spec: CustomFurnitureSpec;
  chosen: string[];
  setChosen: (ids: string[]) => void;
  customerId: string;
  onBack: () => void;
  onSent: (requestId: string) => void;
}) {
  const tsup = t.suppliers;
  const tsend = t.send;
  const { submit } = useRFQ(customerId);
  const [confirming, setConfirming] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  const matches = React.useMemo(() => matchSuppliers(demoSuppliers, spec), [spec]);

  // Default: preselect all matched (Athathi recommended).
  React.useEffect(() => {
    if (chosen.length === 0 && matches.length > 0) setChosen(matches.map((m) => m.supplier.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);

  const toggle = (id: string) =>
    setChosen(chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id]);

  const send = () => {
    setSending(true);
    const id = submit(spec, chosen);
    onSent(id);
  };

  if (matches.length === 0) {
    return (
      <div>
        <EmptyState title={tsup.empty} icon={<Store className="size-5" strokeWidth={1.75} />} />
        <StepNav onBack={onBack} nextLabel="" backLabel={t.review.edit} />
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-2xl">
        <h2 className="text-2xl">{tsup.title}</h2>
        <p className="mt-2 text-muted">{tsup.subtitle}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setChosen(matches.map((m) => m.supplier.id))}
          className="text-sm font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
          {tsup.selectAll}
        </button>
        <span className="text-sm text-subtle">·</span>
        <span className="text-sm text-muted">{tsup.selected.replace("{count}", String(chosen.length))}</span>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {matches.map((m, i) => {
          const s = m.supplier;
          const name = locale === "ar" ? s.nameAr : s.name;
          const selected = chosen.includes(s.id);
          const caps = s.capabilities;
          return (
            <li key={s.id}>
              <button type="button" aria-pressed={selected} onClick={() => toggle(s.id)}
                className={cn(
                  "flex w-full flex-col gap-3 rounded-xl border p-4 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:flex-row sm:items-start sm:justify-between",
                  selected ? "border-brand bg-brand-soft/40 ring-1 ring-brand" : "border-border-subtle bg-elevated hover:border-taupe",
                )}>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                      <Store className="size-4" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="font-medium text-foreground">{name}</span>
                    {i === 0 && <Badge tone="accent">{tsup.recommended}</Badge>}
                    {s.isDemo && <Badge tone="neutral">{tsup.sampleBadge}</Badge>}
                    {s.verified && <Badge tone="accent"><ShieldCheck className="me-1 inline size-3" strokeWidth={2} />{tsup.reasons.verified}</Badge>}
                  </div>
                  <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    {m.reasons.map((r, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="size-3 text-success" strokeWidth={2.5} aria-hidden="true" />
                        {reasonText(tsup.reasons, r, locale)}
                      </li>
                    ))}
                  </ul>
                  {caps && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-subtle">
                      <MapPin className="size-3" strokeWidth={1.75} aria-hidden="true" />
                      {tsup.leadTime.replace("{min}", String(caps.leadTimeDaysMin)).replace("{max}", String(caps.leadTimeDaysMax))}
                    </p>
                  )}
                </div>
                <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full border", selected ? "border-brand bg-brand text-brand-foreground" : "border-border")}>
                  {selected && <Check className="size-4" strokeWidth={3} aria-hidden="true" />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs text-subtle">{t.promotedNote}</p>

      {!confirming ? (
        <StepNav onBack={onBack} onNext={() => setConfirming(true)} nextLabel={tsup.continue} nextDisabled={chosen.length === 0} backLabel={t.review.edit} />
      ) : (
        <div className="mt-8 rounded-xl border border-brand/40 bg-brand-soft/50 p-5">
          <h3 className="text-lg font-semibold text-foreground">{tsend.title}</h3>
          <p className="mt-1 text-sm text-muted">{tsend.subtitle}</p>
          <dl className="mt-4 flex flex-col gap-2 text-sm">
            <Row label={tsend.detailsTitle} value={tsend.supplierCount.replace("{count}", String(chosen.length))} />
            <Row label={tsend.budget} value={spec.budget !== undefined ? formatOmr(spec.budget, locale) : t.review.notSpecified} />
            <Row label={tsend.reference} value={spec.hasReferenceImage ? t.review.referenceAdded : t.review.referenceNone} />
          </dl>
          <p className="mt-3 text-xs text-subtle">{tsend.demoNote}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={send} loading={sending} iconStart={<Send className="size-4.5" strokeWidth={1.75} />}>
              {sending ? tsend.sending : tsend.confirm}
            </Button>
            <Button variant="ghost" onClick={() => setConfirming(false)}>{t.quotes.cancel}</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-subtle">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

function reasonText(tReasons: Dictionary["custom"]["suppliers"]["reasons"], r: MatchReason, locale: Locale): string {
  const template = tReasons[r.code];
  if (!r.value) return template;
  // Localize known machine values (category/material) via the catalog labels.
  return template.replace("{value}", localizeValue(r.code, r.value, locale));
}

function localizeValue(code: MatchReason["code"], value: string, locale: Locale): string {
  if (code === "handles-category") {
    const c = categoryBySlug.get(value as never);
    return c ? catLabel(c.name, locale) : value;
  }
  if (code === "works-with-material") {
    const m = (materialLabels as Record<string, { en: string; ar: string }>)[value];
    if (m) return catLabel(m, locale);
  }
  return value;
}
