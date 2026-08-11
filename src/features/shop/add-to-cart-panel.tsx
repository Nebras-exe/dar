"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Heart, Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { label, type ColorId, type Product } from "@/lib/catalog";
import { Button, buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/features/cart/cart-context";
import { useFavorites } from "@/features/favorites/favorites-context";
import { cn } from "@/lib/utils";

/**
 * The product buy-box: colour selection, an accessible quantity stepper, the
 * primary Add-to-cart action, an honest disabled "Try in My Room", and a
 * favourite toggle. All state is local/demo; nothing is charged.
 */
export function AddToCartPanel({
  product,
  locale,
  t,
}: {
  product: Product;
  locale: Locale;
  t: Dictionary["shop"];
}) {
  const cart = useCart();
  const { isFavorite, toggle, hydrated } = useFavorites();
  const [colorId, setColorId] = React.useState<ColorId | undefined>(
    product.colors[0]?.id,
  );
  const [qty, setQty] = React.useState(1);
  const [announce, setAnnounce] = React.useState("");

  const inStock = product.stockStatus !== "out-of-stock";
  const favorite = hydrated && isFavorite(product.slug);
  const cartHref = `/${locale}/cart`;

  const add = () => {
    cart.add(product.slug, { colorId, quantity: qty });
    setAnnounce(t.product.added);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Colours */}
      {product.colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              {t.product.colorsTitle}
            </h3>
            <span className="text-sm text-muted">
              {colorId
                ? label(
                    product.colors.find((c) => c.id === colorId)?.label ??
                      product.colors[0].label,
                    locale,
                  )
                : null}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5" role="group" aria-label={t.product.selectColor}>
            {product.colors.map((c) => {
              const selected = c.id === colorId;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={selected}
                  aria-label={label(c.label, locale)}
                  title={label(c.label, locale)}
                  onClick={() => setColorId(c.id)}
                  className={cn(
                    "relative inline-flex size-9 items-center justify-center rounded-full ring-1 ring-inset ring-black/10 transition-transform",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                    selected && "ring-2 ring-brand ring-offset-2 ring-offset-background",
                  )}
                  style={{ backgroundColor: c.hex }}
                >
                  {selected && (
                    <Check className="size-4 text-white mix-blend-difference" strokeWidth={3} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity + add */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="inline-flex items-center rounded-full border border-border bg-elevated">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label={t.product.decrease}
            className="inline-flex size-11 items-center justify-center rounded-full text-foreground hover:bg-surface disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <Minus className="size-4" strokeWidth={2} />
          </button>
          <span
            className="min-w-10 text-center text-[0.95rem] font-medium tabular"
            aria-live="polite"
            aria-label={t.product.quantity}
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            aria-label={t.product.increase}
            className="inline-flex size-11 items-center justify-center rounded-full text-foreground hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <Plus className="size-4" strokeWidth={2} />
          </button>
        </div>

        <Button
          size="lg"
          onClick={add}
          disabled={!inStock}
          iconStart={<ShoppingBag className="size-5" strokeWidth={1.75} />}
          className="flex-1"
        >
          {t.product.addToCart}
        </Button>
      </div>

      {/* Live confirmation + cart link */}
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
      {hydrated && cart.isInCart(product.slug) && (
        <Link
          href={cartHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <Check className="size-4" strokeWidth={2.5} />
          {t.product.added}
        </Link>
      )}

      {/* Secondary actions */}
      <div className="flex flex-col gap-3 border-t border-border-subtle pt-5 sm:flex-row">
        <div className="flex-1">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className={cn(
              buttonClasses("outline", "md", "w-full"),
              "cursor-not-allowed opacity-60",
            )}
          >
            <Sparkles className="size-4.5" strokeWidth={1.75} />
            {t.product.tryInRoom}
          </button>
          <p className="mt-1.5 text-center text-xs text-subtle sm:text-start">
            <Badge tone="neutral">{t.product.tryInRoomNote}</Badge>
          </p>
        </div>
        <button
          type="button"
          aria-pressed={favorite}
          onClick={() => toggle(product.slug)}
          className={cn(
            buttonClasses("outline", "md", "sm:w-auto"),
            favorite && "border-brand text-brand",
          )}
        >
          <Heart
            className="size-4.5"
            strokeWidth={1.75}
            fill={favorite ? "currentColor" : "none"}
          />
          {favorite ? t.card.saved : t.card.save}
        </button>
      </div>
    </div>
  );
}
