"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell, Check, CheckCheck, CreditCard, Hammer, Package, Truck, X, FileText,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";
import type { Notification, NotificationCategory } from "@/lib/notifications";
import { useOrders } from "@/features/orders/order-store";
import { useNotifications } from "./notification-store";

const categoryIcon: Record<NotificationCategory, React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>> = {
  orders: Package, designs: FileText, quotes: FileText, delivery: Truck,
};
const sourceIcon: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>> = {
  payment: CreditCard, manufacturing: Hammer, delivery: Truck,
};

function relTime(ts: number, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-OM" : "en-GB", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(ts);
}

/** Interpolate {param} placeholders in a localization string. */
function interpolate(s: string, params: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (_m, k) => params[k] ?? `{${k}}`);
}

function eventText(n: Notification, t: Dictionary["notifications"]): { title: string; body: string } {
  const ev = (t.events as Record<string, { title: string; body: string }>)[n.eventKey];
  if (!ev) return { title: n.eventKey, body: "" };
  return { title: interpolate(ev.title, n.params), body: interpolate(ev.body, n.params) };
}

function linkHref(n: Notification, locale: Locale): string | null {
  if (!n.link) return null;
  if (n.link.kind === "order") return `/${locale}/orders/${n.link.id}`;
  if (n.link.kind === "design") return `/${locale}/design`;
  if (n.link.kind === "request") return `/${locale}/account`;
  return null;
}

/**
 * Header notification bell + dropdown center (Phase 13, §23/§24). Unread badge,
 * grouped Today / Earlier, mark one / all read, deep links. In-app only — the
 * feed is derived deterministically from the user's own orders (deduped), never
 * an external message. Accessible: labelled trigger, aria-live count, Escape to
 * close, focus-visible.
 */
export function NotificationBell({
  userId, t, locale,
}: {
  userId: string; t: Dictionary["notifications"]; locale: Locale;
}) {
  const { orders } = useOrders(userId);
  const { groups, unreadCount, hydrated, markRead, markAllRead, dismiss } = useNotifications(userId, orders);
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); } }
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [open]);

  const has = groups.today.length + groups.earlier.length > 0;

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.bell}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <Bell className="size-5" strokeWidth={1.75} />
        {hydrated && unreadCount > 0 && (
          <span className="absolute -end-0.5 -top-0.5 inline-flex min-w-4.5 items-center justify-center rounded-full bg-brand px-1 text-[0.65rem] font-semibold leading-4 text-brand-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {/* Screen-reader unread announcement */}
      <span className="sr-only" role="status" aria-live="polite">
        {hydrated && unreadCount > 0 ? t.unread.replace("{count}", String(unreadCount)) : ""}
      </span>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={t.title}
          className="absolute end-0 z-50 mt-2 w-[min(24rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-border-subtle bg-elevated shadow-[var(--shadow-lg)]"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border-subtle px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">{t.title}</h2>
            {unreadCount > 0 && (
              <button type="button" onClick={markAllRead}
                className="inline-flex items-center gap-1 rounded-md text-xs font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                <CheckCheck className="size-3.5" strokeWidth={2} aria-hidden="true" />
                {t.markAllRead}
              </button>
            )}
          </div>

          <div className="max-h-[min(28rem,70vh)] overflow-y-auto">
            {!has ? (
              <p className="px-4 py-8 text-center text-sm text-muted">{t.none}</p>
            ) : (
              <>
                {groups.today.length > 0 && <Group label={t.today} items={groups.today} t={t} locale={locale} onRead={markRead} onDismiss={dismiss} />}
                {groups.earlier.length > 0 && <Group label={t.earlier} items={groups.earlier} t={t} locale={locale} onRead={markRead} onDismiss={dismiss} />}
              </>
            )}
          </div>

          <p className="border-t border-border-subtle px-4 py-2 text-center text-[0.7rem] text-subtle">{t.demoNote}</p>
        </div>
      )}
    </div>
  );
}

function Group({
  label, items, t, locale, onRead, onDismiss,
}: {
  label: string; items: Notification[]; t: Dictionary["notifications"]; locale: Locale;
  onRead: (id: string) => void; onDismiss: (id: string) => void;
}) {
  return (
    <div>
      <p className="sticky top-0 bg-elevated/95 px-4 py-1.5 text-xs font-medium text-subtle backdrop-blur">{label}</p>
      <ul>
        {items.map((n) => {
          const { title, body } = eventText(n, t);
          const Icon = sourceIcon[n.sourceType] ?? categoryIcon[n.category];
          const href = linkHref(n, locale);
          const unread = n.readAt === null;
          const inner = (
            <div className="flex gap-3">
              <span className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                n.priority === "high" ? "bg-danger-soft text-danger" : unread ? "bg-brand-soft text-brand" : "bg-surface text-muted",
              )}>
                <Icon className="size-4" strokeWidth={1.75} aria-hidden={true} />
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("flex items-center gap-2 text-sm", unread ? "font-semibold text-foreground" : "font-medium text-foreground")}>
                  {title}
                  {unread && <span className="inline-block size-1.5 shrink-0 rounded-full bg-brand" aria-label={t.new} />}
                </p>
                {body && <p className="mt-0.5 text-xs text-muted">{body}</p>}
                <p className="mt-0.5 text-[0.7rem] text-subtle tabular">{relTime(n.createdAt, locale)}</p>
              </div>
            </div>
          );
          return (
            <li key={n.id} className="group border-b border-border-subtle last:border-0">
              <div className="flex items-start gap-1 px-4 py-3">
                {href ? (
                  <Link href={href} onClick={() => onRead(n.id)} className="min-w-0 flex-1 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                    {inner}
                  </Link>
                ) : (
                  <div className="min-w-0 flex-1">{inner}</div>
                )}
                <div className="flex flex-col gap-1">
                  {unread && (
                    <button type="button" onClick={() => onRead(n.id)} aria-label={t.markRead} title={t.markRead}
                      className="rounded-md p-1 text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                      <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />
                    </button>
                  )}
                  <button type="button" onClick={() => onDismiss(n.id)} aria-label={t.dismiss} title={t.dismiss}
                    className="rounded-md p-1 text-subtle hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                    <X className="size-3.5" strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
