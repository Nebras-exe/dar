import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import {
  locales,
  isLocale,
  getDirection,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ShopProviders } from "@/features/shop/shop-providers";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#f5f1ea",
  colorScheme: "light",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  const title = `${dict.brand.name} — ${dict.brand.tagline}`;
  return {
    title: {
      default: title,
      template: `%s · ${dict.brand.name}`,
    },
    description: dict.home.hero.subtitle,
    applicationName: "Athathi",
    openGraph: {
      title,
      description: dict.home.hero.subtitle,
      type: "website",
      locale: locale === "ar" ? "ar_OM" : "en_OM",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale: Locale = locale;
  const dir = getDirection(typedLocale);
  const dict = getDictionary(typedLocale);

  return (
    <html
      lang={typedLocale}
      dir={dir}
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ShopProviders>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-foreground"
          >
            {dict.skipToContent}
          </a>
          <Header
            locale={typedLocale}
            labels={{
              home: dict.nav.home,
              shop: dict.nav.shop,
              design: dict.nav.design,
              inspirations: dict.nav.inspirations,
              search: dict.nav.search,
              account: dict.nav.account,
              cart: dict.nav.cart,
              openMenu: dict.nav.openMenu,
              closeMenu: dict.nav.closeMenu,
              language: dict.language,
              designCta: dict.cta.designMySpace,
              suppliers: dict.nav.suppliers,
              custom: dict.custom.navLabel,
              login: dict.nav.login,
              supplierDashboard: dict.nav.supplierDashboard,
            }}
            tNotifications={dict.notifications}
          />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter locale={typedLocale} footer={dict.footer} />
        </ShopProviders>
      </body>
    </html>
  );
}
