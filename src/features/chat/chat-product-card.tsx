"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getProductBySlug, formatOmr, colorSwatches, type ColorId } from "@/lib/catalog";
import { variantsFor, variantPrice, variantImageUrl, previewImageFor } from "@/lib/catalog-preview";
import { ImageFrame } from "@/components/ui/image-frame";
import { ProductImage } from "@/components/shop/product-image";
import { useCart } from "@/features/cart/cart-context";

/**
 * A real catalog product card rendered inside the chat. Every value (name, price,
 * variant, image) resolves from the catalog by slug — the assistant only supplies
 * a slug, never product truth. Add-to-cart requires an explicit click (never
 * silent) and preserves the selected variant. A fabricated slug renders nothing.
 */
export function ChatProductCard({
  slug,
  colorId,
  reason,
  t,
  locale,
}: {
  slug: string;
  colorId?: ColorId;
  reason?: string;
  t: Dictionary["chat"];
  locale: Locale;
}) {
  const cart = useCart();
  const product = getProductBySlug(slug);
  const [added, setAdded] = React.useState(false);
  if (!product) return null; // never render a fabricated product

  const name = locale === "ar" ? product.nameAr : product.name;
  const variants = variantsFor(slug);
  const activeVariant = colorId ? variants.find((v) => v.colorId === colorId) : variants[0];
  const price = activeVariant ? variantPrice(product.price, activeVariant) : product.price;
  const overrideSrc = activeVariant
    ? variantImageUrl(activeVariant, 240)
    : previewImageFor({ slug: product.slug, category: product.category, subcategory: product.subcategory }, 0, 240) ?? undefined;
  const chosenColor = activeVariant?.colorId;

  const onAdd = () => {
    cart.add(product.slug, { colorId: chosenColor, quantity: 1 });
    setAdded(true);
  };

  return (
    <div className="flex gap-3 rounded-xl border border-border-subtle bg-elevated p-2.5">
      <Link
        href={`/${locale}/product/${product.slug}`}
        className="w-16 shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <ImageFrame ratio="square" rounded="lg" className="border border-border-subtle">
          <ProductImage product={product} alt={name} overrideSrc={overrideSrc} sizes="64px" />
        </ImageFrame>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={`/${locale}/product/${product.slug}`}
          className="rounded-md text-sm font-medium text-foreground hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <span className="line-clamp-1">{name}</span>
        </Link>
        <p className="mt-0.5 text-sm font-semibold text-foreground tabular">
          {formatOmr(price, locale)}
          {chosenColor && (
            <span className="ms-2 text-xs font-normal text-muted">
              {colorSwatches[chosenColor].label[locale === "ar" ? "ar" : "en"]}
            </span>
          )}
        </p>
        {reason && <p className="mt-0.5 line-clamp-1 text-xs text-muted">{reason}</p>}

        <div className="mt-1.5 flex items-center gap-2">
          <Link
            href={`/${locale}/product/${product.slug}`}
            className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:border-taupe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {t.viewProduct}
          </Link>
          <button
            type="button"
            onClick={onAdd}
            aria-label={`${t.addToCart}: ${name}`}
            className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-xs font-medium text-brand-foreground transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {added ? <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" /> : <ShoppingBag className="size-3.5" strokeWidth={1.75} aria-hidden="true" />}
            {added ? t.added : t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
