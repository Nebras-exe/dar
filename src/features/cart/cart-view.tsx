"use client";

import * as React from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatOmr, label } from "@/lib/catalog";
import { ImageFrame } from "@/components/ui/image-frame";
import { ProductImage } from "@/components/shop/product-image";
import { Button, buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "./cart-context";
import { cn } from "@/lib/utils";

/** The /cart page body. Renders the local demo cart with deterministic totals. */
export function CartView({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary["shop"];
}) {
  const cart = useCart();
  const shopHref = `/${locale}/shop`;

  // Avoid an empty/full flash before localStorage hydration.
  if (!cart.hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-4">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    );
  }

  if (cart.resolved.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="size-5" strokeWidth={1.75} />}
        title={t.cart.emptyTitle}
        description={t.cart.emptyDescription}
        action={
          <Button href={shopHref}>{t.cart.emptyAction}</Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <ul className="flex flex-col divide-y divide-border-subtle">
        {cart.resolved.map((line) => {
          const name = locale === "ar" ? line.product.nameAr : line.product.name;
          const color = line.colorId
            ? line.product.colors.find((c) => c.id === line.colorId)
            : undefined;
          return (
            <li key={line.key} className="flex gap-4 py-5 first:pt-0">
              <Link
                href={`/${locale}/product/${line.product.slug}`}
                className="w-24 shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-28"
              >
                <ImageFrame ratio="square" rounded="lg" className="border border-border-subtle">
                  <ProductImage product={line.product} alt={name} sizes="120px" />
                </ImageFrame>
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/${locale}/product/${line.product.slug}`}
                      className="rounded-md text-[0.95rem] font-medium text-foreground hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      <span className="line-clamp-1">{name}</span>
                    </Link>
                    {color && (
                      <p className="mt-0.5 text-sm text-muted">
                        {t.cart.colorLabel}: {label(color.label, locale)}
                      </p>
                    )}
                    <p className="mt-0.5 text-sm text-subtle tabular">
                      {formatOmr(line.product.price, locale)} {t.cart.each}
                    </p>
                  </div>
                  <span className="shrink-0 text-[0.95rem] font-semibold text-foreground tabular">
                    {formatOmr(line.lineTotal, locale)}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="inline-flex items-center rounded-full border border-border bg-elevated">
                    <button
                      type="button"
                      onClick={() =>
                        cart.setQuantity(line.slug, line.colorId, line.quantity - 1)
                      }
                      aria-label={t.product.decrease}
                      className="inline-flex size-9 items-center justify-center rounded-full text-foreground hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      <Minus className="size-4" strokeWidth={2} />
                    </button>
                    <span className="min-w-8 text-center text-sm font-medium tabular">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        cart.setQuantity(line.slug, line.colorId, line.quantity + 1)
                      }
                      aria-label={t.product.increase}
                      className="inline-flex size-9 items-center justify-center rounded-full text-foreground hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      <Plus className="size-4" strokeWidth={2} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => cart.remove(line.slug, line.colorId)}
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    <Trash2 className="size-4" strokeWidth={1.75} />
                    {t.cart.remove}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-border-subtle bg-surface p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-semibold text-foreground">
              {t.cart.subtotal}
            </span>
            <span className="text-lg font-semibold text-foreground tabular">
              {formatOmr(cart.subtotal, locale)}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-subtle">{t.cart.subtotalNote}</p>

          <Link
            href={`/${locale}/checkout`}
            className={cn(buttonClasses("primary", "lg", "mt-5 w-full"))}
          >
            {t.cart.checkout}
          </Link>
          <p className="mt-2 text-center text-xs text-subtle">{t.cart.checkoutNote}</p>

          <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-4">
            <Link
              href={shopHref}
              className="rounded-md text-sm font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {t.cart.continue}
            </Link>
            <button
              type="button"
              onClick={() => cart.clear()}
              className="rounded-md text-sm text-muted hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {t.cart.clear}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
