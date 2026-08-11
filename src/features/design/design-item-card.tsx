"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, RefreshCw, Trash2, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  formatOmr,
  getProductBySlug,
  label,
  materialLabels,
  styleLabels,
  type Localized,
} from "@/lib/catalog";
import { pickReplacement, type DesignInput, type ReplacementMode } from "@/lib/design";
import { ImageFrame } from "@/components/ui/image-frame";
import { ProductImage } from "@/components/shop/product-image";

/**
 * A compact design item that reuses the catalog's `ProductImage`, pricing and
 * taxonomy (no separate product-card system). Shows the deterministic reason and
 * a replace menu (cheaper / similar / upgrade) that resolves alternatives from
 * the catalog and reports honestly when none exist.
 */
export function DesignItemCard({
  slug,
  reason,
  index,
  input,
  otherSlugs,
  t,
  locale,
  onReplace,
  onRemove,
}: {
  slug: string;
  reason: Localized;
  index: number;
  input: DesignInput;
  /** Slugs already in the design (excluded from replacement results). */
  otherSlugs: string[];
  t: Dictionary["design"]["result"];
  locale: Locale;
  onReplace: (index: number, newSlug: string) => void;
  onRemove: (index: number) => void;
}) {
  const product = getProductBySlug(slug);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  if (!product) return null;

  const name = locale === "ar" ? product.nameAr : product.name;
  const meta = [
    product.materials[0] && label(materialLabels[product.materials[0]], locale),
    product.styleTags[0] && label(styleLabels[product.styleTags[0]], locale),
  ]
    .filter(Boolean)
    .join(" · ");

  const attempt = (mode: ReplacementMode) => {
    const replacement = pickReplacement(slug, mode, input, otherSlugs);
    if (replacement) {
      onReplace(index, replacement.slug);
      setMenuOpen(false);
      setMessage(null);
    } else {
      setMessage(
        mode === "cheaper" ? t.noCheaper : mode === "upgrade" ? t.noUpgrade : t.noSimilar,
      );
    }
  };

  const replaceOptions: { mode: ReplacementMode; label: string }[] = [
    { mode: "cheaper", label: t.replaceCheaper },
    { mode: "similar", label: t.replaceSimilar },
    { mode: "upgrade", label: t.replaceUpgrade },
  ];

  return (
    <article className="flex gap-4 rounded-xl border border-border-subtle bg-elevated p-3 sm:p-4">
      <Link
        href={`/${locale}/product/${product.slug}`}
        className="w-24 shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-28"
      >
        <ImageFrame ratio="square" rounded="lg" className="border border-border-subtle">
          <ProductImage product={product} alt={name} sizes="120px" />
        </ImageFrame>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/${locale}/product/${product.slug}`}
              className="rounded-md text-[0.95rem] font-medium text-foreground hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <span className="line-clamp-1">{name}</span>
            </Link>
            {meta && <p className="mt-0.5 line-clamp-1 text-sm text-muted">{meta}</p>}
          </div>
          <span className="shrink-0 text-[0.95rem] font-semibold text-foreground tabular">
            {formatOmr(product.price, locale)}
          </span>
        </div>

        {/* Reason */}
        <p className="mt-2 flex items-start gap-1.5 text-sm text-accent">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          <span>
            <span className="sr-only">{t.reasonLabel}: </span>
            {label(reason, locale)}
          </span>
        </p>

        {/* Controls */}
        <div className="mt-auto flex items-center gap-2 pt-3">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => {
                setMenuOpen((v) => !v);
                setMessage(null);
              }}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-3 py-1.5 text-sm font-medium text-foreground hover:border-taupe hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <RefreshCw className="size-4" strokeWidth={1.75} aria-hidden="true" />
              {t.replace}
              <ChevronDown className="size-3.5 text-muted" strokeWidth={2} aria-hidden="true" />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute z-20 mt-1.5 min-w-44 overflow-hidden rounded-lg border border-border bg-elevated shadow-[var(--shadow-md)]"
              >
                {replaceOptions.map((opt) => (
                  <button
                    key={opt.mode}
                    type="button"
                    role="menuitem"
                    onClick={() => attempt(opt.mode)}
                    className="block w-full px-4 py-2.5 text-start text-sm text-foreground hover:bg-surface focus-visible:bg-surface focus-visible:outline-none"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onRemove(index)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {t.remove}
          </button>
        </div>

        {message && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted" role="status">
            <X className="size-3.5 text-subtle" strokeWidth={2} aria-hidden="true" />
            {message}
          </p>
        )}
      </div>
    </article>
  );
}
