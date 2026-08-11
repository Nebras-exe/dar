import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import {
  filterProducts,
  getAllProducts,
  getPriceBounds,
  sortProducts,
} from "@/lib/catalog";
import { ShopBrowser } from "@/features/shop/shop-browser";
import {
  parseShopState,
  stateToFilter,
  type RawSearchParams,
} from "@/features/shop/url-state";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return {
    title: dict.shop.allProductsTitle,
    description: dict.shop.hero.subtitle,
    alternates: { canonical: `/${locale}/shop` },
  };
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);
  const sp = await searchParams;

  const state = parseShopState(sp);
  const filtered = filterProducts(stateToFilter(state));
  const products = sortProducts(filtered, state.sort);
  const priceBounds = getPriceBounds();
  const catalogEmpty = getAllProducts().length === 0;

  return (
    <>
      <Section spacing="sm" tone="surface" className="border-b border-border-subtle">
        <Container width="wide">
          <div className="max-w-2xl">
            <p className="text-eyebrow mb-3">{dict.shop.hero.eyebrow}</p>
            <h1 className="text-3xl sm:text-4xl">{dict.shop.hero.title}</h1>
            <p className="mt-4 text-lg text-muted">{dict.shop.hero.subtitle}</p>
          </div>
        </Container>
      </Section>

      <Section spacing="md">
        <Container width="wide">
          <p className="mb-8 flex items-start gap-2 rounded-lg border border-border-subtle bg-surface px-4 py-3 text-sm text-muted">
            <Info className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
            {dict.shop.demoNotice}
          </p>
          <ShopBrowser
            locale={typedLocale}
            dict={dict}
            state={state}
            products={products}
            priceBounds={priceBounds}
            catalogEmpty={catalogEmpty}
          />
        </Container>
      </Section>
    </>
  );
}
