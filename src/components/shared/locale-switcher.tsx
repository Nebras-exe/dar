"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale, localeLabels } from "@/i18n/config";
import { cn } from "@/lib/utils";

export interface LocaleSwitcherProps {
  current: Locale;
  label: string;
  className?: string;
}

/**
 * Swaps the leading locale segment of the current path, preserving the rest of
 * the route. Rendered as real links so Cmd/Ctrl+click and middle-click work.
 */
export function LocaleSwitcher({
  current,
  label,
  className,
}: LocaleSwitcherProps) {
  const pathname = usePathname();

  function pathForLocale(locale: Locale): string {
    const segments = pathname.split("/");
    // segments[0] is "" (leading slash); segments[1] is the current locale.
    segments[1] = locale;
    const next = segments.join("/");
    return next || `/${locale}`;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-elevated p-0.5",
        className,
      )}
      role="group"
      aria-label={label}
    >
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={pathForLocale(locale)}
            hrefLang={locale}
            aria-current={active ? "true" : undefined}
            translate="no"
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              active
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground",
            )}
          >
            {localeLabels[locale].native}
          </Link>
        );
      })}
    </div>
  );
}
