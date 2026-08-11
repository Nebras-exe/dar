import * as React from "react";
import { SearchX } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { CategorySlug, Product } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductGrid } from "@/components/shop/product-grid";
import { productCardLabels } from "@/components/shared/product-card";
import { formatNumber } from "@/lib/utils";
import { CategoryNav } from "./category-nav";
import { SearchBar } from "./search-bar";
import { SortSelect } from "./sort-select";
import { FilterSheet } from "./filter-sheet";
import { FilterContent } from "./filter-content";
import { ActiveFilters } from "./active-filters";
import { countActiveFilters, type ShopState } from "./url-state";

/**
 * The full catalog browsing experience, shared by `/shop` and
 * `/shop/[category]`. Products are already filtered + sorted on the server, so
 * the grid is server-rendered (fast, crawlable); only search, sort and the
 * filter facets are interactive client islands driving the URL.
 */
export function ShopBrowser({
  locale,
  dict,
  state,
  products,
  priceBounds,
  lockedCategory,
}: {
  locale: Locale;
  dict: Dictionary;
  state: ShopState;
  products: Product[];
  priceBounds: { min: number; max: number };
  lockedCategory?: CategorySlug;
}) {
  const t = dict.shop;
  const labels = productCardLabels(t);
  const activeCount = countActiveFilters(state, Boolean(lockedCategory));
  const count = products.length;
  const countLabel = `${formatNumber(count, locale)} ${count === 1 ? t.result : t.results}`;
  const resetHref = lockedCategory
    ? `/${locale}/shop/${lockedCategory}`
    : `/${locale}/shop`;

  return (
    <div className="flex flex-col gap-6">
      <CategoryNav locale={locale} allLabel={t.browseAll} activeCategory={lockedCategory} />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar t={t} />
        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <FilterSheet
            t={t}
            locale={locale}
            lockedCategory={lockedCategory}
            priceBounds={priceBounds}
            activeCount={activeCount}
          />
          <SortSelect t={t} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[15rem_1fr] xl:grid-cols-[16rem_1fr]">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pe-1">
            <FilterContent
              t={t}
              locale={locale}
              lockedCategory={lockedCategory}
              priceBounds={priceBounds}
              activeCount={activeCount}
            />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col gap-3 pb-5">
            <p className="text-sm text-muted tabular" aria-live="polite">
              {countLabel}
            </p>
            <ActiveFilters
              state={state}
              t={t}
              locale={locale}
              hasLockedCategory={Boolean(lockedCategory)}
            />
          </div>

          {count === 0 ? (
            <EmptyState
              icon={<SearchX className="size-5" strokeWidth={1.75} />}
              title={t.empty.title}
              description={t.empty.description}
              action={
                <div className="flex flex-col items-center gap-3">
                  <Button href={resetHref}>{t.empty.action}</Button>
                  <p className="text-sm text-muted">{t.empty.customPrompt}</p>
                  <Button variant="outline" size="sm" href={`/${locale}/custom`}>
                    {t.empty.customAction}
                  </Button>
                </div>
              }
            />
          ) : (
            <ProductGrid products={products} locale={locale} labels={labels} />
          )}
        </div>
      </div>
    </div>
  );
}
