import * as React from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getCategories, label, type CategorySlug } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export interface CategoryNavProps {
  locale: Locale;
  allLabel: string;
  activeCategory?: CategorySlug;
  className?: string;
}

/**
 * Horizontal category navigation — scrollable chips on mobile, wrapping on
 * desktop. Uses real links (stable English slugs) so it is crawlable and works
 * without JS. The active category is not colour-only: it is filled and
 * `aria-current`.
 */
export function CategoryNav({
  locale,
  allLabel,
  activeCategory,
  className,
}: CategoryNavProps) {
  const categories = getCategories();
  const base = `/${locale}/shop`;

  const item = (
    href: string,
    text: string,
    active: boolean,
    key: string,
  ) => (
    <Link
      key={key}
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-4 h-9 text-sm font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-elevated text-muted hover:border-taupe hover:text-foreground",
      )}
    >
      {text}
    </Link>
  );

  return (
    <nav
      aria-label="Categories"
      className={cn(
        "-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {item(base, allLabel, !activeCategory, "all")}
      {categories.map((c) =>
        item(
          `${base}/${c.slug}`,
          label(c.name, locale),
          activeCategory === (c.slug as CategorySlug),
          c.slug,
        ),
      )}
    </nav>
  );
}
