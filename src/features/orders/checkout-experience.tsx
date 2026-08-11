"use client";

import * as React from "react";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, Info, Loader2,
  MapPin, Package, ShoppingBag, Store, TriangleAlert,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatOmr } from "@/lib/catalog";
import { formatNumber } from "@/lib/utils";
import {
  buildCartDraft, buildQuoteDraft, revalidateCart, validateAcceptedQuote,
  validateAddress,
  type CheckoutDraft, type DeliveryAddress, type SupplierOrderGroup,
} from "@/lib/orders";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { useCart } from "@/features/cart/cart-context";
import { useRFQ } from "@/features/custom/rfq-store";
import { createDemoOrder } from "./order-store";

type Phase = "summary" | "delivery" | "review" | "done";

const GOVERNORATES = [
  "Muscat", "Dhofar", "Musandam", "Al Buraimi", "Al Dakhiliyah",
  "Al Batinah North", "Al Batinah South", "Al Sharqiyah North",
  "Al Sharqiyah South", "Al Dhahirah", "Al Wusta",
];

/**
 * The unified checkout (Phase 10A) for BOTH sources — a catalog cart and an
 * accepted custom quote. Three calm steps: order summary (supplier-grouped) →
 * Oman delivery details → review & confirm. No payment is taken; confirming
 * records a clearly-labelled demo order and clears the cart source.
 */
export function CheckoutExperience({
  dict, locale, customerId, mode, requestId, quoteId,
}: {
  dict: Dictionary;
  locale: Locale;
  customerId: string;
  mode: "cart" | "quote";
  requestId?: string;
  quoteId?: string;
}) {
  const t = dict.checkout;
  const cart = useCart();
  const rfq = useRFQ(customerId);

  const [phase, setPhase] = React.useState<Phase>("summary");
  const [address, setAddress] = React.useState<DeliveryAddress>({
    fullName: "", phone: "", governorate: "", wilayat: "", area: "", building: "", notes: "",
  });
  const [addrErrors, setAddrErrors] = React.useState<string[]>([]);
  const [confirming, setConfirming] = React.useState(false);
  const [orderId, setOrderId] = React.useState<string | null>(null);
  const [orderNumber, setOrderNumber] = React.useState<string>("");

  // ── Build the draft from the source (revalidated) ──────────────────────────
  const { draft, dropped, priceChanged, invalid } = React.useMemo(() => {
    if (mode === "quote") {
      if (!requestId || !quoteId) return { draft: null, dropped: [], priceChanged: [], invalid: true };
      const v = validateAcceptedQuote(customerId, requestId, quoteId, rfq.requests, rfq.quotesFor(requestId));
      if (!v.ok || !v.quote || !v.request) return { draft: null, dropped: [], priceChanged: [], invalid: true };
      return { draft: buildQuoteDraft(v.request.spec, v.quote), dropped: [], priceChanged: [], invalid: false };
    }
    // cart
    if (!cart.hydrated) return { draft: null, dropped: [], priceChanged: [], invalid: false };
    const claimed = Object.fromEntries(cart.resolved.map((l) => [l.slug, l.product.price]));
    const rev = revalidateCart(
      cart.lines.map((l) => ({ slug: l.slug, colorId: l.colorId, quantity: l.quantity })),
      claimed,
    );
    if (rev.valid.length === 0) return { draft: null, dropped: rev.dropped, priceChanged: rev.priceChanged, invalid: false };
    return { draft: buildCartDraft(rev.valid), dropped: rev.dropped, priceChanged: rev.priceChanged, invalid: false };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, requestId, quoteId, customerId, cart.hydrated, cart.lines, rfq.requests]);

  // ── Empty / invalid states ─────────────────────────────────────────────────
  if (mode === "cart" && !cart.hydrated) {
    return <Shell t={t}><div className="h-40 animate-pulse rounded-xl bg-surface" /></Shell>;
  }
  if (invalid) {
    return (
      <Shell t={t}>
        <EmptyState icon={<TriangleAlert className="size-5" strokeWidth={1.75} />} title={t.emptyTitle} description={t.emptyBody}
          action={<Button href={`/${locale}/custom`}>{t.emptyAction}</Button>} />
      </Shell>
    );
  }
  if (!draft) {
    return (
      <Shell t={t}>
        <EmptyState icon={<ShoppingBag className="size-5" strokeWidth={1.75} />} title={t.emptyTitle} description={t.emptyBody}
          action={<Button href={`/${locale}/shop`}>{t.emptyAction}</Button>} />
      </Shell>
    );
  }

  const confirm = () => {
    const parsed = validateAddress(address);
    if (!parsed.ok) { setAddrErrors(parsed.errors.map((e) => e.field)); setPhase("delivery"); return; }
    setConfirming(true);
    const order = createDemoOrder(customerId, draft, parsed.value);
    // Clear the source so it can't be re-ordered.
    if (mode === "cart") cart.clear();
    setOrderId(order.id);
    setOrderNumber(order.orderNumber);
    setPhase("done");
  };

  const goDelivery = () => setPhase("delivery");
  const goReview = () => {
    const parsed = validateAddress(address);
    if (!parsed.ok) { setAddrErrors(parsed.errors.map((e) => e.field)); return; }
    setAddrErrors([]);
    setPhase("review");
  };

  // ── Confirmed ──────────────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <Shell t={t}>
        <div className="mx-auto max-w-lg rounded-2xl border border-success/40 bg-success-soft p-8 text-center">
          <CheckCircle2 className="mx-auto size-10 text-success" strokeWidth={1.75} aria-hidden="true" />
          <h2 className="mt-4 text-2xl">{t.confirmed.demoTitle}</h2>
          <p className="mt-2 text-muted">{t.confirmed.demoBody}</p>
          <p className="mt-4 text-sm text-subtle">{t.confirmed.orderNumber}</p>
          <p className="text-xl font-semibold text-foreground tabular">{orderNumber}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button href={`/${locale}/orders/${orderId}`}>{t.confirmed.viewOrder}</Button>
            <Button variant="outline" href={`/${locale}/account`}>{t.confirmed.viewOrders}</Button>
            <Button variant="ghost" href={`/${locale}/shop`}>{t.confirmed.keepShopping}</Button>
          </div>
        </div>
      </Shell>
    );
  }

  const steps: Phase[] = ["summary", "delivery", "review"];
  const stepIndex = steps.indexOf(phase);

  return (
    <Shell t={t}>
      {/* Step rail */}
      <ol className="mb-8 flex flex-wrap gap-x-2 gap-y-1 text-sm" aria-label={t.title}>
        {steps.map((s, i) => {
          const done = i < stepIndex, active = i === stepIndex;
          return (
            <li key={s} className="flex items-center gap-2">
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1", active ? "bg-brand-soft font-medium text-brand" : done ? "text-foreground" : "text-subtle")} aria-current={active ? "step" : undefined}>
                <span className={cn("inline-flex size-5 items-center justify-center rounded-full text-xs", active ? "bg-brand text-brand-foreground" : done ? "bg-success text-white" : "bg-surface text-subtle")}>
                  {done ? <Check className="size-3" strokeWidth={3} /> : i + 1}
                </span>
                {t.steps[s as keyof typeof t.steps]}
              </span>
              {i < steps.length - 1 && <span aria-hidden="true" className="text-border">·</span>}
            </li>
          );
        })}
      </ol>

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          {phase === "summary" && (
            <SummaryStep t={t} locale={locale} draft={draft} dropped={dropped} priceChanged={priceChanged} onNext={goDelivery} backHref={mode === "cart" ? `/${locale}/cart` : `/${locale}/custom`} backLabel={mode === "cart" ? t.backToCart : t.summary.fromQuote} />
          )}
          {phase === "delivery" && (
            <DeliveryStep t={t} address={address} setAddress={setAddress} errors={addrErrors} onBack={() => setPhase("summary")} onNext={goReview} />
          )}
          {phase === "review" && (
            <ReviewStep t={t} locale={locale} draft={draft} address={address} confirming={confirming} onEditAddress={() => setPhase("delivery")} onBack={() => setPhase("delivery")} onConfirm={confirm} />
          )}
        </div>

        {/* Sticky totals */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <TotalsCard t={t} locale={locale} draft={draft} />
        </aside>
      </div>
    </Shell>
  );
}

function Shell({ t, children }: { t: Dictionary["checkout"]; children: React.ReactNode }) {
  return (
    <Section spacing="md">
      <Container width="content">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl sm:text-4xl">{t.title}</h1>
          <Badge tone="neutral">{t.demoBadge}</Badge>
        </div>
        {children}
      </Container>
    </Section>
  );
}

// ── Summary step ──────────────────────────────────────────────────────────────
function SummaryStep({
  t, locale, draft, dropped, priceChanged, onNext, backHref, backLabel,
}: {
  t: Dictionary["checkout"]; locale: Locale; draft: CheckoutDraft;
  dropped: string[]; priceChanged: { slug: string; was: number; now: number }[];
  onNext: () => void; backHref: string; backLabel: string;
}) {
  return (
    <div>
      {priceChanged.length > 0 && (
        <Notice tone="warning" title={t.summary.priceChangedTitle} body={t.summary.priceChangedBody} />
      )}
      {dropped.length > 0 && (
        <Notice tone="warning" title={t.summary.droppedTitle} body={t.summary.droppedBody} />
      )}
      <p className="mb-4 text-sm text-muted">{draft.source === "cart" ? t.summary.fromCart : t.summary.fromQuote}</p>
      <div className="flex flex-col gap-5">
        {draft.groups.map((g) => (
          <SupplierGroupCard key={g.supplierId} group={g} t={t} locale={locale} />
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-border-subtle pt-6">
        <Button variant="ghost" href={backHref} iconStart={<ArrowLeft className="size-4 rtl:rotate-180" strokeWidth={1.75} />}>{backLabel}</Button>
        <Button onClick={onNext} iconEnd={<ArrowRight className="size-4 rtl:rotate-180" strokeWidth={1.75} />}>{t.delivery.title}</Button>
      </div>
    </div>
  );
}

function SupplierGroupCard({ group, t, locale }: { group: SupplierOrderGroup; t: Dictionary["checkout"]; locale: Locale }) {
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
                    {formatOmr(item.unitPrice, locale)} {t.summary.each} · {t.summary.qty} {formatNumber(item.quantity, locale)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-foreground">{t.summary.custom}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {t.summary.manufacturing}: {t.summary.days.replace("{count}", formatNumber(item.manufacturingDays, locale))}
                  </p>
                </>
              )}
            </div>
            <span className="shrink-0 text-sm font-medium text-foreground tabular">{formatOmr(item.lineTotal, locale)}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between px-4 py-2.5 text-xs text-muted">
        <span>{t.summary.supplierSubtotal}</span>
        <span className="tabular">{formatOmr(group.groupTotal, locale)}</span>
      </div>
    </section>
  );
}

// ── Delivery step ─────────────────────────────────────────────────────────────
function DeliveryStep({
  t, address, setAddress, errors, onBack, onNext,
}: {
  t: Dictionary["checkout"]; address: DeliveryAddress;
  setAddress: (a: DeliveryAddress) => void; errors: string[];
  onBack: () => void; onNext: () => void;
}) {
  const td = t.delivery;
  const set = (k: keyof DeliveryAddress, v: string) => setAddress({ ...address, [k]: v });
  const err = (f: string) => errors.includes(f);

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground">{td.title}</h2>
      <p className="mt-1 text-muted">{td.subtitle}</p>
      {errors.length > 0 && <Notice tone="danger" title={td.errorsTitle} />}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field id="fullName" label={td.fullName} value={address.fullName} onChange={(v) => set("fullName", v)} error={err("fullName") && td.errors.required} autoComplete="name" />
        <Field id="phone" label={td.phone} value={address.phone} onChange={(v) => set("phone", v)} error={err("phone") && td.errors["invalid-phone"]} hint={td.phoneHint} type="tel" dir="ltr" autoComplete="tel" />
        <div>
          <label htmlFor="governorate" className="text-sm font-medium text-foreground">{td.governorate}</label>
          <select id="governorate" value={address.governorate} onChange={(e) => set("governorate", e.target.value)}
            aria-invalid={err("governorate")}
            className={cn("mt-1.5 h-11 w-full rounded-lg border bg-elevated px-3 text-[0.95rem] text-foreground shadow-[var(--shadow-xs)] focus:outline-none focus:ring-2 focus:ring-brand/25", err("governorate") ? "border-danger" : "border-border focus:border-brand")}>
            <option value="">—</option>
            {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          {err("governorate") && <p className="mt-1.5 text-xs text-danger">{td.errors.required}</p>}
        </div>
        <Field id="wilayat" label={td.wilayat} value={address.wilayat} onChange={(v) => set("wilayat", v)} error={err("wilayat") && td.errors.required} />
        <Field id="area" label={td.areaOptional} value={address.area} onChange={(v) => set("area", v)} />
        <Field id="building" label={td.building} value={address.building} onChange={(v) => set("building", v)} error={err("building") && td.errors.required} hint={td.buildingHint} />
      </div>
      <div className="mt-4">
        <label htmlFor="notes" className="text-sm font-medium text-foreground">{td.notesOptional}</label>
        <textarea id="notes" rows={2} value={address.notes ?? ""} maxLength={500} onChange={(e) => set("notes", e.target.value)}
          className="mt-1.5 w-full resize-y rounded-lg border border-border bg-elevated px-4 py-2.5 text-[0.95rem] text-foreground shadow-[var(--shadow-xs)] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25" />
      </div>
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-border-subtle pt-6">
        <Button variant="ghost" onClick={onBack} iconStart={<ArrowLeft className="size-4 rtl:rotate-180" strokeWidth={1.75} />}>{t.summary.title}</Button>
        <Button onClick={onNext} iconEnd={<ArrowRight className="size-4 rtl:rotate-180" strokeWidth={1.75} />}>{td.continue}</Button>
      </div>
    </div>
  );
}

// ── Review step ───────────────────────────────────────────────────────────────
function ReviewStep({
  t, locale, draft, address, confirming, onEditAddress, onBack, onConfirm,
}: {
  t: Dictionary["checkout"]; locale: Locale; draft: CheckoutDraft; address: DeliveryAddress;
  confirming: boolean; onEditAddress: () => void; onBack: () => void; onConfirm: () => void;
}) {
  const tr = t.review;
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground">{tr.title}</h2>

      <div className="mt-5 rounded-xl border border-border-subtle bg-surface p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <MapPin className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
            {tr.deliverTo}
          </span>
          <button type="button" onClick={onEditAddress} className="rounded-md text-sm font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">{tr.edit}</button>
        </div>
        <p className="mt-2 text-sm text-foreground">{address.fullName} · <span dir="ltr">{address.phone}</span></p>
        <p className="text-sm text-muted">{[address.building, address.area, address.wilayat, address.governorate].filter(Boolean).join("، ")}</p>
        {address.notes && <p className="mt-1 text-xs text-subtle">{address.notes}</p>}
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {draft.groups.map((g) => <SupplierGroupCard key={g.supplierId} group={g} t={t} locale={locale} />)}
      </div>

      <div className="mt-6 rounded-xl border border-brand/30 bg-brand-soft/50 p-4">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Info className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
          {tr.paymentNoteTitle}
        </p>
        <p className="mt-1 text-sm text-muted">{tr.paymentNoteBody}</p>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-border-subtle pt-6">
        <Button variant="ghost" onClick={onBack} iconStart={<ArrowLeft className="size-4 rtl:rotate-180" strokeWidth={1.75} />}>{t.delivery.title}</Button>
        <Button onClick={onConfirm} loading={confirming} size="lg" iconStart={confirming ? <Loader2 className="size-4.5 animate-spin" /> : <Package className="size-4.5" strokeWidth={1.75} />}>
          {confirming ? tr.confirming : tr.confirmDemo}
        </Button>
      </div>
    </div>
  );
}

// ── Totals card ───────────────────────────────────────────────────────────────
function TotalsCard({ t, locale, draft }: { t: Dictionary["checkout"]; locale: Locale; draft: CheckoutDraft }) {
  const tt = t.totals;
  const hasCatalog = draft.groups.some((g) => g.items.some((i) => i.kind === "catalog"));
  const { totals } = draft;
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-5">
      <dl className="flex flex-col gap-2.5 text-sm">
        <Row label={tt.goods} value={formatOmr(totals.goodsSubtotal, locale)} />
        <Row label={tt.delivery} value={totals.deliveryTotal > 0 ? formatOmr(totals.deliveryTotal, locale) : (hasCatalog ? tt.deliveryUnknown : tt.free)} muted={totals.deliveryTotal === 0} />
        {totals.installationTotal > 0 && <Row label={tt.installation} value={formatOmr(totals.installationTotal, locale)} />}
      </dl>
      <div className="mt-4 flex items-baseline justify-between border-t border-border-subtle pt-4">
        <span className="text-base font-semibold text-foreground">{tt.grandTotal}</span>
        <span className="text-lg font-semibold text-foreground tabular">{formatOmr(totals.grandTotal, locale)}</span>
      </div>
      {hasCatalog && totals.deliveryTotal === 0 && <p className="mt-2 text-xs text-subtle">{tt.deliveryUnknownNote}</p>}
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className={cn("font-medium tabular", muted ? "text-muted" : "text-foreground")}>{value}</dd>
    </div>
  );
}

function Notice({ tone, title, body }: { tone: "warning" | "danger"; title: string; body?: string }) {
  return (
    <div className={cn("mb-4 rounded-lg border px-3.5 py-2.5", tone === "warning" ? "border-warning/40 bg-warning-soft" : "border-danger/30 bg-danger-soft")} role="alert">
      <p className={cn("flex items-center gap-1.5 text-sm font-medium", tone === "warning" ? "text-foreground" : "text-danger")}>
        <TriangleAlert className="size-4" strokeWidth={1.75} aria-hidden="true" />
        {title}
      </p>
      {body && <p className="mt-0.5 text-xs text-muted">{body}</p>}
    </div>
  );
}

function Field({
  id, label, value, onChange, error, hint, className, ...props
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  error?: string | false; hint?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)}
        className={cn("mt-1.5 h-11 w-full rounded-lg border bg-elevated px-4 text-[0.95rem] text-foreground shadow-[var(--shadow-xs)] focus:outline-none focus:ring-2 focus:ring-brand/25", error ? "border-danger" : "border-border focus:border-brand", className)}
        {...props} />
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : hint ? <p className="mt-1.5 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}
