"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, ShoppingBag } from "lucide-react";
import en from "@/i18n/dictionaries/en.json";
import ar from "@/i18n/dictionaries/ar.json";

/**
 * Branded 404 (Phase 14). Rendered inside the `[locale]` layout, so it inherits
 * the header/footer/fonts and the correct `dir`. Self-contained (imports the JSON
 * dictionaries directly, no server-only dependency) so the error boundary can
 * never itself fail. Locale is read from the path's first segment.
 */
export default function LocaleNotFound() {
  const pathname = usePathname() ?? "/en";
  const locale = pathname.split("/")[1] === "ar" ? "ar" : "en";
  const t = (locale === "ar" ? ar : en).notFound;

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="mx-auto max-w-md text-center">
        <p className="text-eyebrow mb-4 inline-flex items-center gap-2 justify-center text-brand">
          <Compass className="size-4" strokeWidth={1.75} aria-hidden="true" />
          404
        </p>
        <h1 className="text-3xl sm:text-4xl">{t.title}</h1>
        <p className="mx-auto mt-3 max-w-sm text-muted">{t.body}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <Home className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {t.home}
          </Link>
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <ShoppingBag className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {t.shop}
          </Link>
        </div>
      </div>
    </section>
  );
}
