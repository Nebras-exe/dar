"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Heart, Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { label, colorSwatches, materialLabels, type ColorId, type Product } from "@/lib/catalog";
import { Button, buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/features/cart/cart-context";
import { useFavorites } from "@/features/favorites/favorites-context";
import { cn } from "@/lib/utils";
import { useVariant } from "./variant-context";

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
  const variant = useVariant();
  const hasVariants = (variant?.variants.length ?? 0) > 0;

  // The selected colour: driven by the shared variant context when the product has
  // variants (so the swatch, gallery image, and price stay in sync), else local.
  const [localColorId, setLocalColorId] = React.useState<ColorId | undefined>(
    product.colors[0]?.id,
  );
  const colorId = hasVariants ? variant!.selected?.colorId : localColorId;
  const setColorId = (id: ColorId) => (hasVariants ? variant!.selectByColor(id) : setLocalColorId(id));

  const [qty, setQty] = React.useState(1);
  const [announce, setAnnounce] = React.useState("");

  const inStock = product.stockStatus !== "out-of-stock";
  const favorite = hydrated && isFavorite(product.slug);
  const cartHref = `/${locale}/cart`;

  const add = () => {
    cart.add(product.slug, { colorId, quantity: qty });
    setAnnounce(t.product.added);
  };

  // Swatch source: variant colours (with per-variant material/finish) or plain colours.
  const swatches = hasVariants
    ? variant!.variants.map((v) => ({
        id: v.colorId,
        hex: colorSwatches[v.colorId].hex,
        colorLabel: label(colorSwatches[v.colorId].label, locale),
        finishLabel: v.materialId ? label(materialLabels[v.materialId], locale) : undefined,
      }))
    : product.colors.map((c) => ({ id: c.id, hex: c.hex, colorLabel: label(c.label, locale), finishLabel: undefined as string | undefined }));

  const activeSwatch = swatches.find((s) => s.id === colorId);

  return (
    <div className="flex flex-col gap-6">
      {/* Colours / variants */}
      {swatches.length > 0 && (
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-foreground">
              {t.product.colorsTitle}
            </h3>
            <span className="text-sm text-muted">{activeSwatch?.colorLabel}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5" role="group" aria-label={t.product.selectColor}>
            {swatches.map((s) => {
              const selected = s.id === colorId;
              const aria = s.finishLabel ? `${s.colorLabel} — ${s.finishLabel}` : s.colorLabel;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={selected}
                  aria-label={aria}
                  title={aria}
                  onClick={() => setColorId(s.id)}
                  className={cn(
                    "relative inline-flex size-9 items-center justify-center rounded-full ring-1 ring-inset ring-black/10 transition-transform hover:scale-105",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                    selected && "ring-2 ring-brand ring-offset-2 ring-offset-background",
                  )}
                  style={{ backgroundColor: s.hex }}
                >
                  {selected && (
                    <Check className="size-4 text-white mix-blend-difference" strokeWidth={3} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Material / finish for the selected variant */}
          {hasVariants && activeSwatch?.finishLabel && (
            <p className="mt-3 text-sm text-muted">
              <span className="font-medium text-foreground">{t.product.finishLabel}:</span> {activeSwatch.finishLabel}
            </p>
          )}
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
