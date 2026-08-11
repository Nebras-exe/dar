import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

import { Hero } from "@/features/home/hero";
import { ValueStrip } from "@/features/home/value-strip";
import { HowItWorks } from "@/features/home/how-it-works";
import { DesignShowcase } from "@/features/home/design-showcase";
import { KeepWhatWorks } from "@/features/home/keep-what-works";
import { BudgetIntelligence } from "@/features/home/budget-intelligence";
import { BeforeAfterSection } from "@/features/home/before-after-section";
import { Categories } from "@/features/home/categories";
import { FeaturedProducts } from "@/features/home/featured-products";
import { StyleDiscovery } from "@/features/home/style-discovery";
import { ReferenceImage } from "@/features/home/reference-image";
import { CustomFurniture } from "@/features/home/custom-furniture";
import { SupplierCta } from "@/features/home/supplier-cta";
import { FinalCta } from "@/features/home/final-cta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);

  return (
    <>
      <Hero dict={dict} locale={typedLocale} />
      <ValueStrip dict={dict} />
      <HowItWorks dict={dict} />
      <DesignShowcase dict={dict} locale={typedLocale} />
      <KeepWhatWorks dict={dict} />
      <BudgetIntelligence dict={dict} locale={typedLocale} />
      <BeforeAfterSection dict={dict} locale={typedLocale} />
      <Categories dict={dict} locale={typedLocale} />
      <FeaturedProducts dict={dict} locale={typedLocale} />
      <StyleDiscovery dict={dict} locale={typedLocale} />
      <ReferenceImage dict={dict} locale={typedLocale} />
      <CustomFurniture dict={dict} locale={typedLocale} />
      <SupplierCta dict={dict} />
      <FinalCta dict={dict} locale={typedLocale} />
    </>
  );
}
