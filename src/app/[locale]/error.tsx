"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, RefreshCw, TriangleAlert } from "lucide-react";
import en from "@/i18n/dictionaries/en.json";
import ar from "@/i18n/dictionaries/ar.json";

/**
 * Branded runtime error boundary (Phase 14). Keeps a failed render inside the
 * premium shell with a calm retry instead of an unstyled crash — the competition
 * demo never collapses (§49). Self-contained (no server-only import). No error
 * detail is shown to the user; it's logged to the console for developers only.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname() ?? "/en";
  const locale = pathname.split("/")[1] === "ar" ? "ar" : "en";
  const t = (locale === "ar" ? ar : en).notFound;

  React.useEffect(() => {
    // Developer-only; never surfaced to the user.
    console.error("[athathi] render error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="mx-auto max-w-md text-center">
        <p className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-warning-soft text-warning">
          <TriangleAlert className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </p>
        <h1 className="text-2xl sm:text-3xl">{t.errorTitle}</h1>
        <p className="mx-auto mt-3 max-w-sm text-muted">{t.errorBody}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <RefreshCw className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {t.retry}
          </button>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <Home className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {t.home}
          </Link>
        </div>
      </div>
    </section>
  );
}
