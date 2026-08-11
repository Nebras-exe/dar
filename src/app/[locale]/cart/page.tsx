import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CartView } from "@/features/cart/cart-view";

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
    title: dict.shop.cart.title,
    robots: { index: false },
  };
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);

  return (
    <Section spacing="md">
      <Container width="content">
        <h1 className="mb-8 text-3xl sm:text-4xl">{dict.shop.cart.title}</h1>
        <CartView locale={typedLocale} t={dict.shop} />
      </Container>
    </Section>
  );
}
