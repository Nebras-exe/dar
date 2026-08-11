"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, LayoutGrid, Trash2 } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatOmr, getProductBySlug, label, styleLabels } from "@/lib/catalog";
import { ImageFrame } from "@/components/ui/image-frame";
import { ProductImage } from "@/components/shop/product-image";
import { useFavorites } from "@/features/favorites/favorites-context";
import { useSavedDesigns } from "./saved-designs-store";

/**
 * Client account modules: saved designs + favourites, both read from local
 * stores (the demo fallback; DB-backed + RLS-owned when Supabase is configured).
 * Honest empty states — no injected data to fill the screen (§38).
 */
export function AccountLists({
  t,
  tRoom,
  locale,
}: {
  t: Dictionary["account"];
  tRoom: Dictionary["design"]["room"]["types"];
  locale: Locale;
}) {
  const { designs, hydrated: dHydrated, remove } = useSavedDesigns();
  const { favorites, hydrated: fHydrated } = useFavorites();

  const favProducts = favorites
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="flex flex-col gap-10">
      {/* Saved designs */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <LayoutGrid className="size-5 text-brand" strokeWidth={1.75} aria-hidden="true" />
          {t.savedDesigns}
        </h2>
        {!dHydrated ? null : designs.length === 0 ? (
          <p className="mt-3 rounded-xl border border-border-subtle bg-surface px-4 py-6 text-sm text-muted">
            {t.savedDesignsEmpty}
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {designs.map((d) => (
              <li
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-subtle bg-elevated p-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {tRoom[d.roomType as keyof typeof tRoom] ?? d.roomType}
                    {d.primaryStyle && (
                      <span className="text-muted">
                        {" · "}
                        {label(styleLabels[d.primaryStyle as keyof typeof styleLabels] ?? { en: d.primaryStyle, ar: d.primaryStyle }, locale)}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-sm text-muted tabular">
                    {d.items.length} · {formatOmr(d.newFurnitureTotal, locale)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${locale}/design`}
                    className="rounded-full border border-border bg-elevated px-3 py-1.5 text-sm font-medium text-foreground hover:border-taupe hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {t.openDesign}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(d.id)}
                    aria-label={t.removeDesign}
                    className="inline-flex size-8 items-center justify-center rounded-full text-muted hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Favourites */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Heart className="size-5 text-brand" strokeWidth={1.75} aria-hidden="true" />
          {t.favorites}
        </h2>
        {!fHydrated ? null : favProducts.length === 0 ? (
          <p className="mt-3 rounded-xl border border-border-subtle bg-surface px-4 py-6 text-sm text-muted">
            {t.favoritesEmpty}
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {favProducts.map((p) => {
              const name = locale === "ar" ? p.nameAr : p.name;
              return (
                <Link
                  key={p.slug}
                  href={`/${locale}/product/${p.slug}`}
                  className="group rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <ImageFrame ratio="square" rounded="lg" className="border border-border-subtle">
                    <ProductImage product={p} alt={name} sizes="(max-width:640px) 50vw, 200px" />
                  </ImageFrame>
                  <p className="mt-2 line-clamp-1 text-sm font-medium text-foreground">{name}</p>
                  <p className="text-sm text-muted tabular">{formatOmr(p.price, locale)}</p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

/** Saved rooms — honest placeholder (orders are now a real section; see AccountOrders). */
export function AccountPlaceholders({ t }: { t: Dictionary["account"] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">{t.savedRooms}</h2>
      <p className="mt-3 rounded-xl border border-border-subtle bg-surface px-4 py-6 text-sm text-muted">
        {t.savedRoomsEmpty}
      </p>
    </section>
  );
}
