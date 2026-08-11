"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, X, RotateCcw, Send, Sparkles, Cpu } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  defaultQuickActions,
  type ChatMessage,
  type ChatResponse,
  type QuickAction,
} from "@/lib/chatbot";
import { readMemoryContext } from "@/features/account/memory-store";
import { ChatProductCard } from "./chat-product-card";
import { ChatOrderSummary } from "./chat-order-summary";

const HISTORY_KEY = "athathi.chat.v1";
const MAX_STORED = 20;

interface StoredTurn {
  role: "user" | "assistant";
  content: string;
  /** Assistant-only structured payload (cards/flags), so history re-renders. */
  res?: Pick<ChatResponse, "intent" | "cards" | "flags" | "mode">;
}

/** Dictionary bundle the widget needs (order summary reuses domain dicts). */
export interface ChatDicts {
  chat: Dictionary["chat"];
  payment: Dictionary["payment"];
  fulfillment: Dictionary["fulfillment"];
  manufacturing: Dictionary["manufacturing"];
  delivery: Dictionary["delivery"];
}

/**
 * The Athathi/Dar site assistant. A floating button opens a premium chat drawer
 * with quick actions, real catalog product cards, an approval-gated add-to-cart,
 * client-side order status (own data only), and Design/Custom handoffs. The API
 * key never reaches here — the widget only calls `/api/chat`. Accessible: focus
 * trap + return, Escape to close, `aria-live` assistant replies, labelled controls.
 */
export function ChatWidget({ dicts, locale }: { dicts: ChatDicts; locale: Locale }) {
  const t = dicts.chat;
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [turns, setTurns] = React.useState<StoredTurn[]>(() => {
    if (typeof localStorage === "undefined") return [];
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? (JSON.parse(raw) as StoredTurn[]).slice(-MAX_STORED) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [mode, setMode] = React.useState<"claude" | "demo" | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);

  const panelRef = React.useRef<HTMLDivElement>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const logRef = React.useRef<HTMLDivElement>(null);

  // Fetch the capability enum + the signed-in user id (for own-order lookups).
  React.useEffect(() => {
    fetch("/api/chat").then((r) => r.json()).then((d: { chatMode?: string }) => setMode(d.chatMode === "claude" ? "claude" : "demo")).catch(() => setMode("demo"));
    fetch("/api/auth/session").then((r) => r.json()).then((d: { userId?: string | null }) => setUserId(d.userId ?? null)).catch(() => {});
  }, []);

  // Persist (capped).
  React.useEffect(() => {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(turns.slice(-MAX_STORED))); } catch { /* ignore */ }
  }, [turns]);

  // Scroll to the newest message.
  React.useEffect(() => {
    if (open && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [turns, open, busy]);

  // Focus the input on open; return focus to the button on close.
  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape to close + focus trap within the panel.
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); return; }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const send = React.useCallback(async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    const nextTurns: StoredTurn[] = [...turns, { role: "user", content }];
    setTurns(nextTurns);
    setInput("");
    setBusy(true);
    try {
      const messages: ChatMessage[] = nextTurns.filter((x) => x.content).map((x) => ({ role: x.role, content: x.content }));
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale, messages: messages.slice(-12) }),
      });
      const data = (await r.json()) as ChatResponse | { ok: false; code: keyof Dictionary["chat"]["errors"] };
      if ("ok" in data && data.ok) {
        setTurns((prev) => [...prev, { role: "assistant", content: data.message, res: { intent: data.intent, cards: data.cards, flags: data.flags, mode: data.mode } }]);
      } else {
        const code = ("code" in data ? data.code : "unknown") as keyof Dictionary["chat"]["errors"];
        setTurns((prev) => [...prev, { role: "assistant", content: t.errors[code] ?? t.errors.unknown }]);
      }
    } catch {
      setTurns((prev) => [...prev, { role: "assistant", content: t.errors.unknown }]);
    } finally {
      setBusy(false);
    }
  }, [busy, turns, locale, t.errors]);

  const runAction = (a: QuickAction) => {
    if (a.route) {
      const path = a.route === "design" ? "design" : a.route === "custom" ? "custom" : a.route === "cart" ? "cart" : "account";
      router.push(`/${locale}/${path}`);
      setOpen(false);
      return;
    }
    void send(a.intentHint);
  };

  const reset = () => {
    setTurns([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch { /* ignore */ }
    inputRef.current?.focus();
  };

  const memoryContext = userId ? readMemoryContext(userId) : null;
  const memorySummary = memoryContext && memoryContext.enabled && memoryContext.useInDesign
    ? [memoryContext.preferredStyles[0], memoryContext.preferredColors[0], memoryContext.preferredMaterials[0]].filter(Boolean).map((s) => String(s)).join(" · ")
    : "";

  const quickActions = defaultQuickActions(locale);

  return (
    <>
      {/* Floating launcher — bottom corner; sits clear of cart/checkout controls */}
      {!open && (
        <button
          ref={btnRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.open}
          className="fixed bottom-4 end-4 z-40 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-medium text-brand-foreground shadow-[var(--shadow-lg)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <MessageCircle className="size-5" strokeWidth={1.75} aria-hidden="true" />
          <span className="hidden sm:inline">{t.name}</span>
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.name}
          className="fixed inset-x-0 bottom-0 z-50 flex h-[85vh] flex-col overflow-hidden rounded-t-2xl border border-border-subtle bg-background shadow-[var(--shadow-lg)] sm:inset-auto sm:bottom-4 sm:end-4 sm:h-[min(36rem,80vh)] sm:w-[24rem] sm:rounded-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-border-subtle bg-elevated px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-brand">
                <Sparkles className="size-4.5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  {t.name}
                  {mode && (
                    <Badge tone={mode === "claude" ? "brand" : "neutral"}>
                      {mode === "claude" ? <Sparkles className="size-3" strokeWidth={2} aria-hidden="true" /> : <Cpu className="size-3" strokeWidth={2} aria-hidden="true" />}
                      {mode === "claude" ? t.claudeBadge : t.demoBadge}
                    </Badge>
                  )}
                </p>
                <p className="text-xs text-muted">{t.tagline}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={reset} aria-label={t.reset} title={t.reset}
                className="rounded-full p-1.5 text-muted hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                <RotateCcw className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => { setOpen(false); btnRef.current?.focus(); }} aria-label={t.close} title={t.close}
                className="rounded-full p-1.5 text-muted hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Conversation */}
          <div ref={logRef} className="flex-1 overflow-y-auto px-4 py-4" aria-live="polite" aria-atomic="false">
            {/* Welcome */}
            {turns.length === 0 && (
              <div className="flex flex-col gap-3">
                <Bubble role="assistant" text={t.welcome} />
                {memorySummary && (
                  <div className="rounded-xl border border-brand/30 bg-brand-soft/40 p-3 text-sm text-foreground">
                    {t.memoryNote.replace("{summary}", memorySummary)}
                  </div>
                )}
              </div>
            )}

            {turns.map((turn, i) => (
              <div key={i} className="mb-3">
                <Bubble role={turn.role} text={turn.content} youLabel={t.you} />
                {turn.res?.cards && turn.res.cards.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    {turn.res.cards.map((c, ci) => (
                      <ChatProductCard key={`${c.slug}-${ci}`} slug={c.slug} colorId={c.colorId} reason={c.reason} t={t} locale={locale} />
                    ))}
                  </div>
                )}
                {turn.res?.flags?.showOrders && (
                  <div className="mt-2">
                    <ChatOrderSummary userId={userId} t={t} tPay={dicts.payment} tFul={dicts.fulfillment} tMfg={dicts.manufacturing} tDel={dicts.delivery} locale={locale} />
                  </div>
                )}
                {turn.res?.flags?.handoffDesign && (
                  <button type="button" onClick={() => { router.push(`/${locale}/design`); setOpen(false); }}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                    {t.openDesign}
                  </button>
                )}
                {turn.res?.flags?.handoffCustom && (
                  <button type="button" onClick={() => { router.push(`/${locale}/custom`); setOpen(false); }}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-taupe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                    {t.openCustom}
                  </button>
                )}
              </div>
            ))}

            {busy && <p className="text-xs text-muted">{t.typing}</p>}
          </div>

          {/* Quick actions */}
          <div className="border-t border-border-subtle px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label={t.quickActionsLabel}>
              {quickActions.map((a) => (
                <button key={a.id} type="button" onClick={() => runAction(a)} disabled={busy}
                  className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand hover:text-brand disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => { e.preventDefault(); void send(input); }}
            className="flex items-center gap-2 border-t border-border-subtle p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              className="h-11 flex-1 rounded-full border border-border bg-elevated px-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label={t.send}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground transition-colors hover:bg-brand-hover disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <Send className="size-4.5 rtl:-scale-x-100" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Bubble({ role, text, youLabel }: { role: "user" | "assistant"; text: string; youLabel?: string }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <p
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm",
          isUser ? "bg-brand text-brand-foreground" : "bg-surface text-foreground",
        )}
      >
        {isUser && youLabel && <span className="sr-only">{youLabel}: </span>}
        {text}
      </p>
    </div>
  );
}
