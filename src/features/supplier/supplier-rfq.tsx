"use client";

import * as React from "react";
import { Inbox, Send } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { categoryBySlug, colorSwatches, formatOmr, label, materialLabels, styleLabels } from "@/lib/catalog";
import { formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { quoteTotal, validateQuoteInput, type CustomRequest, type CustomFurnitureSpec } from "@/lib/rfq";
import { cn } from "@/lib/utils";
import { useSupplierRFQ, submitSupplierQuote } from "@/features/custom/rfq-store";

type Tab = "new" | "quoted" | "closed";

/**
 * Supplier RFQ view (§23/§24). Requests ADDRESSED to this supplier only. The
 * supplier opens a request, sees the spec, and submits a quote (validated,
 * money computed in code) AS its own supplier. Demo mode stores the quote
 * locally; in Supabase mode RLS enforces the same isolation. No fake counts.
 */
export function SupplierRFQ({
  supplierId,
  t,
  tCustom,
  locale,
}: {
  supplierId: string;
  t: Dictionary["custom"]["supplier"];
  tCustom: Dictionary["custom"];
  locale: Locale;
}) {
  const { requests, quoteFor, hydrated } = useSupplierRFQ(supplierId);
  const [tab, setTab] = React.useState<Tab>("new");
  const [openId, setOpenId] = React.useState<string | null>(null);

  if (!hydrated) return null;

  const quoted = requests.filter((r) => quoteFor(r.id));
  const closed = requests.filter((r) => r.status === "accepted" || r.status === "cancelled");
  const fresh = requests.filter((r) => !quoteFor(r.id) && r.status !== "accepted" && r.status !== "cancelled");
  const shown = tab === "new" ? fresh : tab === "quoted" ? quoted : closed;

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
      <p className="mt-0.5 text-sm text-muted">{t.subtitle}</p>

      <div className="mt-4 inline-flex rounded-full border border-border bg-elevated p-0.5" role="tablist" aria-label={t.title}>
        {(["new", "quoted", "closed"] as Tab[]).map((tb) => (
          <button key={tb} role="tab" aria-selected={tab === tb} onClick={() => { setTab(tb); setOpenId(null); }}
            className={cn("rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              tab === tb ? "bg-foreground text-background" : "text-muted hover:text-foreground")}>
            {t.tabs[tb]}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState className="mt-6" title={t.empty} icon={<Inbox className="size-5" strokeWidth={1.75} />} />
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {shown.map((r) => (
            <RequestRow
              key={r.id} request={r} supplierId={supplierId} t={t} tCustom={tCustom} locale={locale}
              open={openId === r.id} onToggle={() => setOpenId(openId === r.id ? null : r.id)}
              existingQuote={Boolean(quoteFor(r.id))}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function RequestRow({
  request, supplierId, t, tCustom, locale, open, onToggle, existingQuote,
}: {
  request: CustomRequest;
  supplierId: string;
  t: Dictionary["custom"]["supplier"];
  tCustom: Dictionary["custom"];
  locale: Locale;
  open: boolean;
  onToggle: () => void;
  existingQuote: boolean;
}) {
  const spec = request.spec;
  const cat = categoryBySlug.get(spec.category);
  const accepted = request.status === "accepted";

  return (
    <li className="rounded-xl border border-border-subtle bg-elevated">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="font-medium text-foreground">
            {cat ? label(cat.name, locale) : spec.category}
            <span className="text-muted"> · {tCustom.review.quantity} {formatNumber(spec.quantity, locale)}</span>
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {spec.budget !== undefined ? `${tCustom.review.budget}: ${formatOmr(spec.budget, locale)}` : tCustom.review.notSpecified}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {accepted && <Badge tone="success">{tCustom.account.status.accepted}</Badge>}
          {existingQuote && !accepted && <Badge tone="accent">{t.quoted}</Badge>}
          <Button size="sm" variant="outline" onClick={onToggle}>
            {existingQuote ? t.editQuote : t.sendQuote}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border-subtle p-4">
          <SpecSummary spec={spec} tCustom={tCustom} locale={locale} title={t.specTitle} />
          {!accepted ? (
            <QuoteForm supplierId={supplierId} requestId={request.id} t={t.quoteForm} onDone={onToggle} />
          ) : (
            <p className="mt-4 text-sm text-muted">{tCustom.quotes.accepted}</p>
          )}
        </div>
      )}
    </li>
  );
}

function SpecSummary({
  spec, tCustom, locale, title,
}: {
  spec: CustomFurnitureSpec;
  tCustom: Dictionary["custom"];
  locale: Locale;
  title: string;
}) {
  const tf = tCustom.spec.fields;
  const val = (v: CustomFurnitureSpec["widthCm"]) =>
    v === "unknown" ? tCustom.review.askSupplier : typeof v === "number" ? `${formatNumber(v, locale)} ${locale === "ar" ? "سم" : "cm"}` : "—";
  const rows = [
    spec.style && [tf.style, label(styleLabels[spec.style], locale)],
    spec.color && [tf.color, label(colorSwatches[spec.color].label, locale)],
    spec.material && [tf.material, label(materialLabels[spec.material], locale)],
    (spec.widthCm !== undefined) && [tf.widthCm, val(spec.widthCm)],
    (spec.depthCm !== undefined) && [tf.depthCm, val(spec.depthCm)],
    (spec.heightCm !== undefined) && [tf.heightCm, val(spec.heightCm)],
    spec.shape && [tf.shape, tCustom.spec.shapeOptions[spec.shape as keyof typeof tCustom.spec.shapeOptions] ?? spec.shape],
    spec.seatCount && [tf.seatCount, formatNumber(spec.seatCount, locale)],
  ].filter(Boolean) as [string, string][];

  return (
    <div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3">
        {rows.map(([k, v], i) => (
          <div key={i} className="flex flex-col">
            <dt className="text-xs text-subtle">{k}</dt>
            <dd className="text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
      {spec.notes && <p className="mt-3 rounded-lg bg-surface px-3 py-2 text-sm text-muted">{spec.notes}</p>}
    </div>
  );
}

function QuoteForm({
  supplierId, requestId, t, onDone,
}: {
  supplierId: string;
  requestId: string;
  t: Dictionary["custom"]["supplier"]["quoteForm"];
  onDone: () => void;
}) {
  // Demo: quotes are stored via the RFQ store's exported helper. Because the
  // customer's demo store is per-browser, in this prototype supplier-submitted
  // quotes are recorded through the same local store when present.
  const [basePrice, setBasePrice] = React.useState("");
  const [deliveryFee, setDeliveryFee] = React.useState("0");
  const [installationFee, setInstallationFee] = React.useState("0");
  const [days, setDays] = React.useState("");
  const [warranty, setWarranty] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [errors, setErrors] = React.useState<string[]>([]);
  const [done, setDone] = React.useState(false);

  const numOr = (s: string) => (s.trim() === "" ? NaN : Number(s.replace(/[^\d.]/g, "")));
  const total = quoteTotal(numOr(basePrice) || 0, numOr(deliveryFee) || 0, numOr(installationFee) || 0);

  const submit = () => {
    const parsed = validateQuoteInput({
      basePrice: numOr(basePrice),
      deliveryFee: numOr(deliveryFee),
      installationFee: numOr(installationFee),
      manufacturingDays: numOr(days),
      warrantyText: warranty,
      notes,
      validDays: 30,
    });
    if (!parsed.ok) {
      setErrors(parsed.errors.map((e) => e.field));
      return;
    }
    // Persist the supplier quote into the shared demo RFQ store.
    submitSupplierQuote(requestId, supplierId, parsed.value);
    setDone(true);
    setTimeout(onDone, 900);
  };

  if (done) {
    return <p className="mt-4 rounded-lg border border-success/40 bg-success-soft px-4 py-3 text-sm text-success">{t.submitted}</p>;
  }

  const errFor = (f: string) => errors.includes(f);

  return (
    <div className="mt-5 rounded-lg border border-border-subtle bg-surface p-4">
      <p className="text-sm font-semibold text-foreground">{t.title}</p>
      {errors.length > 0 && (
        <p className="mt-2 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">{t.errorsTitle}</p>
      )}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Num id="qbase" label={t.basePrice} value={basePrice} onChange={setBasePrice} error={errFor("basePrice")} />
        <Num id="qdel" label={t.deliveryFee} value={deliveryFee} onChange={setDeliveryFee} error={errFor("deliveryFee")} />
        <Num id="qinst" label={t.installationFee} value={installationFee} onChange={setInstallationFee} error={errFor("installationFee")} />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Num id="qdays" label={t.manufacturingDays} value={days} onChange={setDays} error={errFor("manufacturingDays")} />
        <div className="sm:col-span-2">
          <label htmlFor="qwarr" className="text-sm font-medium text-foreground">{t.warranty}</label>
          <input id="qwarr" value={warranty} onChange={(e) => setWarranty(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-lg border border-border bg-elevated px-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25" />
        </div>
      </div>
      <div className="mt-3">
        <label htmlFor="qnotes" className="text-sm font-medium text-foreground">{t.notes}</label>
        <textarea id="qnotes" rows={2} value={notes} maxLength={2000} onChange={(e) => setNotes(e.target.value)}
          className="mt-1.5 w-full resize-y rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25" />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted">{t.total}: <span className="font-semibold text-foreground tabular">{formatOmr(total, "en")}</span></span>
        <Button size="sm" onClick={submit} iconStart={<Send className="size-4" strokeWidth={1.75} />}>{t.submit}</Button>
      </div>
      <p className="mt-2 text-xs text-subtle">{t.demoNote}</p>
    </div>
  );
}

function Num({ id, label, value, onChange, error }: { id: string; label: string; value: string; onChange: (v: string) => void; error?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      <input id={id} inputMode="decimal" dir="ltr" value={value} aria-invalid={error} onChange={(e) => onChange(e.target.value)}
        className={cn("mt-1.5 h-10 w-full rounded-lg border bg-elevated px-3 text-sm text-foreground tabular focus:outline-none focus:ring-2 focus:ring-brand/25", error ? "border-danger" : "border-border focus:border-brand")} />
    </div>
  );
}
