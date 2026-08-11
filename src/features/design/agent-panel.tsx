"use client";

import * as React from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  Wallet,
  Wand2,
  RefreshCw,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatOmr } from "@/lib/catalog";
import type { AgentResponse, ActivityLine, CartProposal } from "@/lib/agent";
import type { DesignInput, DesignItem } from "@/lib/design";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";
import type { WizardAction } from "./wizard-state";

const ACTIVITY_ICON: Record<ActivityLine["kind"], React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  search: Search,
  budget: Wallet,
  replace: RefreshCw,
  remove: Trash2,
  build: Sparkles,
  cart: ShoppingBag,
  info: Sparkles,
  keep: Check,
};

/**
 * The Athathi Agent control panel, embedded in the design result. A restrained
 * composer (not a chatbot): the user types a natural request, the Agent runs
 * server-side, and the DESIGN updates in place — with a short explanation, real
 * tool-activity lines (no raw JSON), and an explicit approval card before
 * anything is added to the cart. Labelled "Demo Agent" when no live provider.
 */
export function AgentPanel({
  input,
  items,
  design,
  locale,
  dispatch,
}: {
  input: DesignInput;
  items: DesignItem[];
  design: Dictionary["design"];
  locale: Locale;
  dispatch: React.Dispatch<WizardAction>;
}) {
  const t = design.agent;
  const cart = useCart();
  const [value, setValue] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [response, setResponse] = React.useState<AgentResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [mode, setMode] = React.useState<"provider" | "demo" | null>(null);
  const [proposal, setProposal] = React.useState<CartProposal | null>(null);
  const [addedCount, setAddedCount] = React.useState(0);

  React.useEffect(() => {
    let alive = true;
    fetch("/api/agent", { method: "GET" })
      .then((r) => r.json())
      .then((d: { mode?: "provider" | "demo" }) => alive && setMode(d.mode ?? "demo"))
      .catch(() => alive && setMode("demo"));
    return () => {
      alive = false;
    };
  }, []);

  const send = React.useCallback(
    async (message: string) => {
      const text = message.trim();
      if (!text || busy) return;
      setBusy(true);
      setError(null);
      setAddedCount(0);
      try {
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            locale,
            message: text,
            state: {
              input,
              items: items.map((i) => ({ slug: i.slug, colorId: i.colorId })),
            },
          }),
        });
        const data = (await res.json()) as AgentResponse | { ok: false; code: string };
        if (!data.ok) {
          setError(t.errors[(data.code as keyof typeof t.errors) ?? "unknown"] ?? t.errors.unknown);
          return;
        }
        setResponse(data);
        setValue("");
        if (data.design) {
          dispatch({ type: "APPLY_AGENT_RESULT", input: data.design.input, items: data.design.items });
        }
        setProposal(data.requiresApproval && data.cartProposal ? data.cartProposal : null);
      } catch {
        setError(t.errors.unknown);
      } finally {
        setBusy(false);
      }
    },
    [busy, locale, input, items, dispatch, t],
  );

  const confirmCart = () => {
    if (!proposal) return;
    for (const it of proposal.items) cart.add(it.slug, { colorId: it.colorId, quantity: it.quantity });
    setAddedCount(proposal.count);
    setProposal(null);
  };

  const quickCommands =
    response?.suggestedActions ?? [
      { intentHint: "make it cheaper", label: t.quick.cheaper },
      { intentHint: "keep it under OMR 400", label: t.quick.underBudget },
      { intentHint: "add this design to my cart", label: t.quick.addCart },
    ];

  return (
    <section
      aria-label={t.title}
      className="rounded-xl border border-border-subtle bg-surface p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <Wand2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </span>
          {t.title}
        </h2>
        {mode && (
          <Badge tone={mode === "demo" ? "neutral" : "accent"}>
            {mode === "demo" ? t.demoBadge : t.liveBadge}
          </Badge>
        )}
      </div>
      <p className="mt-1.5 text-sm text-muted">{t.subtitle}</p>

      {/* Composer */}
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          send(value);
        }}
        className="mt-4"
      >
        <label htmlFor="agent-input" className="sr-only">
          {t.inputLabel}
        </label>
        <div className="flex gap-2">
          <input
            id="agent-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t.placeholder}
            maxLength={1000}
            disabled={busy}
            className="h-11 flex-1 rounded-full border border-border bg-elevated px-4 text-[0.95rem] text-foreground shadow-[var(--shadow-xs)] placeholder:text-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 disabled:opacity-60"
          />
          <Button
            type="submit"
            disabled={busy || !value.trim()}
            aria-label={t.send}
            className="shrink-0"
            iconStart={busy ? <Loader2 className="size-4.5 animate-spin" /> : <ArrowRight className="size-4.5 rtl:rotate-180" strokeWidth={2} />}
          >
            <span className="hidden sm:inline">{t.send}</span>
          </Button>
        </div>
      </form>

      {/* Quick commands */}
      <div className="mt-3 flex flex-wrap gap-2">
        {quickCommands.map((q, i) => (
          <button
            key={`${q.intentHint}-${i}`}
            type="button"
            disabled={busy}
            onClick={() => send(q.intentHint)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-3 py-1.5 text-sm text-foreground transition-colors hover:border-taupe hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
          >
            <Sparkles className="size-3.5 text-brand" strokeWidth={1.75} aria-hidden="true" />
            {q.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      {/* Live status + result */}
      <div aria-live="polite" className="mt-4 empty:mt-0">
        {busy && (
          <p className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="size-4 animate-spin text-brand" aria-hidden="true" />
            {t.working}
          </p>
        )}

        {!busy && response && (
          <div className="rounded-lg border border-border-subtle bg-elevated p-4">
            <p className="text-sm text-foreground">{response.message}</p>

            {response.activity.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1.5">
                {response.activity.map((a, i) => {
                  const Icon = ACTIVITY_ICON[a.kind];
                  return (
                    <li key={i} className="flex items-center gap-2 text-xs text-muted">
                      <Check className="size-3.5 shrink-0 text-success" strokeWidth={2.5} aria-hidden="true" />
                      <Icon className="size-3.5 shrink-0 text-subtle" strokeWidth={1.75} />
                      {a.text}
                    </li>
                  );
                })}
              </ul>
            )}

            {response.budgetSummary && (
              <div className="mt-3 flex items-center gap-4 border-t border-border-subtle pt-3 text-sm">
                <span className="text-muted">
                  {t.newTotal}:{" "}
                  <span
                    key={response.budgetSummary.newFurnitureTotal}
                    className="animate-value-pop font-semibold text-foreground tabular"
                  >
                    {formatOmr(response.budgetSummary.newFurnitureTotal, locale)}
                  </span>
                </span>
                {response.budgetSummary.overBudget === 0 && (
                  <span className="text-muted">
                    {t.remaining}:{" "}
                    <span className="font-semibold text-success tabular">
                      {formatOmr(response.budgetSummary.remaining, locale)}
                    </span>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Cart approval — never auto-commits */}
        {!busy && proposal && (
          <div className="mt-3 rounded-lg border border-brand/40 bg-brand-soft/60 p-4">
            <p className="text-sm font-medium text-foreground">
              {t.approveTitle
                .replace("{count}", String(proposal.count))
                .replace("{total}", formatOmr(proposal.subtotal, locale))}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={confirmCart}
                iconStart={<ShoppingBag className="size-4" strokeWidth={1.75} />}
              >
                {t.confirmCart}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setProposal(null)}>
                {t.cancel}
              </Button>
            </div>
          </div>
        )}

        {!busy && addedCount > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-success/40 bg-success-soft px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium text-success">
              <CheckCircle2 className="size-4.5" strokeWidth={2} aria-hidden="true" />
              {t.addedToCart.replace("{count}", String(addedCount))}
            </span>
            <Button size="sm" variant="outline" href={`/${locale}/cart`}>
              {t.viewCart}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
