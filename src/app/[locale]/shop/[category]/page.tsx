import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import {
  filterProducts,
  getAllProducts,
  getCategories,
  getCategory,
  getPriceBounds,
  isCategorySlug,
  label,
  sortProducts,
} from "@/lib/catalog";
import { ShopBrowser } from "@/features/shop/shop-browser";
import {
  parseShopState,
  stateToFilter,
  type RawSearchParams,
} from "@/features/shop/url-state";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getCategories().map((c) => ({ locale, category: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const dict = getDictionary(loc);
  const cat = getCategory(category);
  if (!cat) return { title: dict.shop.allProductsTitle };
  const name = label(cat.name, loc);
  return {
    title: name,
    description: label(cat.tagline, loc),
    alternates: { canonical: `/${locale}/shop/${category}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { locale, category } = await params;
  if (!isLocale(locale)) notFound();
  if (!isCategorySlug(category)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);
  const cat = getCategory(category)!;
  const sp = await searchParams;

  const state = parseShopState(sp, category);
  const filtered = filterProducts(stateToFilter(state));
  const products = sortProducts(filtered, state.sort);
  const priceBounds = getPriceBounds();
  const catalogEmpty = getAllProducts().length === 0;

  return (
    <>
      <Section spacing="sm" tone="surface" className="border-b border-border-subtle">
        <Container width="wide">
          <Link
            href={`/${typedLocale}/shop`}
            className="mb-4 inline-flex items-center gap-1 rounded-md text-sm font-medium text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <ChevronLeft className="size-4 rtl:rotate-180" strokeWidth={2} aria-hidden="true" />
            {dict.shop.browseAll}
          </Link>
          <h1 className="text-3xl sm:text-4xl">{label(cat.name, typedLocale)}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">{label(cat.tagline, typedLocale)}</p>
        </Container>
      </Section>

      <Section spacing="md">
        <Container width="wide">
          <ShopBrowser
            locale={typedLocale}
            dict={dict}
            state={state}
            products={products}
            priceBounds={priceBounds}
            lockedCategory={category}
            catalogEmpty={catalogEmpty}
          />
        </Container>
      </Section>
    </>
  );
}
