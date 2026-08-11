import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSession } from "@/lib/auth/session";
import { isCustomCategory, type CustomCategory } from "@/lib/rfq";
import { getProductBySlug } from "@/lib/catalog";
import { CustomExperience } from "@/features/custom/custom-experience";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return {
    title: dict.custom.title,
    description: dict.custom.subtitle,
    alternates: { canonical: `/${locale}/custom` },
    robots: { index: false },
  };
}

export default async function CustomPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ from?: string; category?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { from, category } = await searchParams;

  // Customer id: the signed-in user, or a stable per-visit "guest" so the demo
  // store scopes requests. (Real requests require auth once Supabase is on.)
  const session = await getSession();
  const customerId = session?.user.id ?? "guest";

  // Optional deep-links: base on a catalog product, or a category.
  const basedOnSlug = from && getProductBySlug(from) ? from : undefined;
  const initialCategory: CustomCategory | undefined =
    basedOnSlug
      ? asCustomCategory(getProductBySlug(from!)!.category)
      : category && isCustomCategory(category)
        ? category
        : undefined;

  return (
    <CustomExperience
      dict={dict}
      locale={locale}
      customerId={customerId}
      basedOnSlug={basedOnSlug}
      initialCategory={initialCategory}
    />
  );
}

/** Map a catalog category to a custom category when the product supports it. */
function asCustomCategory(slug: string): CustomCategory | undefined {
  return isCustomCategory(slug) ? slug : undefined;
}
