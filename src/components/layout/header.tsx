"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { Logo } from "@/components/shared/logo";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { Container } from "@/components/ui/container";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n/dictionaries";
import { NotificationBell } from "@/features/notifications/notification-center";

export interface HeaderLabels {
  home: string;
  shop: string;
  design: string;
  inspirations: string;
  search: string;
  account: string;
  cart: string;
  openMenu: string;
  closeMenu: string;
  language: string;
  designCta: string;
  suppliers: string;
  custom: string;
  login: string;
  supplierDashboard: string;
}

export interface HeaderProps {
  locale: Locale;
  labels: HeaderLabels;
  tNotifications: Dictionary["notifications"];
}

/**
 * Site header. Shop/Search route to the real Phase 03 catalog; the cart icon
 * links to the cart and shows a live item count. Design My Space still points
 * to the Phase 02 showcase until its own phase.
 */
export function Header({ locale, labels, tNotifications }: HeaderProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [signedIn, setSignedIn] = React.useState(false);
  const [isSupplier, setIsSupplier] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);
  const home = `/${locale}`;
  const cart = useCart();

  // Reflect auth state without making pages dynamic — no secrets. `userId` is the
  // user's OWN id, used to scope their own in-app notifications (§23).
  React.useEffect(() => {
    let alive = true;
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d: { signedIn?: boolean; isSupplier?: boolean; userId?: string | null }) => {
        if (!alive) return;
        setSignedIn(Boolean(d.signedIn));
        setIsSupplier(Boolean(d.isSupplier));
        setUserId(d.userId ?? null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const navItems = [
    { key: "home", label: labels.home, href: `${home}#top` },
    { key: "shop", label: labels.shop, href: `${home}/shop` },
    { key: "design", label: labels.design, href: `${home}/design` },
    { key: "custom", label: labels.custom, href: `${home}/custom` },
    { key: "suppliers", label: labels.suppliers, href: `${home}/suppliers` },
  ];
  const designHref = `${home}/design`;
  const shopHref = `${home}/shop`;
  const cartHref = `${home}/cart`;
  const accountHref = signedIn ? `${home}/account` : `${home}/login`;
  const cartCount = cart.hydrated ? cart.count : 0;

  React.useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/85 backdrop-blur-md">
      <Container width="wide">
        <div className="flex h-16 items-center justify-between gap-4 sm:h-18">
          <div className="flex items-center gap-8">
            <Link
              href={home}
              className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              aria-label={labels.home}
            >
              <Logo locale={locale} />
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium text-muted",
                    "transition-colors hover:text-foreground hover:bg-surface",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1.5">
            <LocaleSwitcher
              current={locale}
              label={labels.language}
              className="hidden sm:inline-flex"
            />
            <Link
              href={shopHref}
              aria-label={labels.search}
              title={labels.search}
              className="hidden size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:inline-flex"
            >
              <Search className="size-5" strokeWidth={1.75} />
            </Link>
            {signedIn && userId && (
              <NotificationBell userId={userId} t={tNotifications} locale={locale} />
            )}
            <Link
              href={accountHref}
              aria-label={signedIn ? labels.account : labels.login}
              title={signedIn ? labels.account : labels.login}
              className="hidden size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:inline-flex"
            >
              <User className="size-5" strokeWidth={1.75} />
            </Link>
            <Link
              href={cartHref}
              aria-label={labels.cart}
              title={labels.cart}
              className="relative inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <ShoppingBag className="size-5" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -end-0.5 -top-0.5 inline-flex min-w-4.5 items-center justify-center rounded-full bg-brand px-1 text-[0.65rem] font-semibold leading-4 text-brand-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
            <Button size="sm" href={designHref} className="ms-1 hidden md:inline-flex">
              {labels.designCta}
            </Button>

            <IconButton
              label={menuOpen ? labels.closeMenu : labels.openMenu}
              size="sm"
              className="lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <X className="size-5" strokeWidth={1.75} />
              ) : (
                <Menu className="size-5" strokeWidth={1.75} />
              )}
            </IconButton>
          </div>
        </div>
      </Container>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-border-subtle bg-background lg:hidden"
        >
          <Container width="wide" className="py-4">
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={accountHref}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {signedIn ? labels.account : labels.login}
              </Link>
              {isSupplier && (
                <Link
                  href={`${home}/supplier`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {labels.supplierDashboard}
                </Link>
              )}
            </nav>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
              <LocaleSwitcher current={locale} label={labels.language} />
              <Button size="sm" href={designHref} onClick={() => setMenuOpen(false)}>
                {labels.designCta}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
