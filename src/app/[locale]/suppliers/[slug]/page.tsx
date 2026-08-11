import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, ShieldCheck, Store } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  demoSuppliers,
  getSupplierBySlug,
  repoGetProductsBySupplier,
} from "@/lib/repository";
import { productCardLabels } from "@/components/shared/product-card";
import { ProductGrid } from "@/components/shop/product-grid";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export function generateStaticParams() {
  return demoSuppliers.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const supplier = await getSupplierBySlug(slug);
  if (!supplier) return { title: "Supplier" };
  const name = locale === "ar" ? supplier.nameAr : supplier.name;
  return { title: name, alternates: { canonical: `/${locale}/suppliers/${slug}` } };
}

export default async function SupplierProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.suppliers;

  const supplier = await getSupplierBySlug(slug);
  if (!supplier) notFound();

  const products = await repoGetProductsBySupplier(supplier.id);
  const name = locale === "ar" ? supplier.nameAr : supplier.name;
  const description = locale === "ar" ? supplier.descriptionAr : supplier.description;
  const location = locale === "ar" ? supplier.locationAr : supplier.location;

  return (
    <Section spacing="lg">
      <Container width="wide">
        {/* Profile header */}
        <div className="flex flex-col gap-4 border-b border-border-subtle pb-8 sm:flex-row sm:items-start">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <Store className="size-7" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl sm:text-4xl">{name}</h1>
              {supplier.isDemo && <Badge tone="neutral">{t.sampleBadge}</Badge>}
              {supplier.verified && (
                <Badge tone="accent">
                  <ShieldCheck className="me-1 inline size-3.5" strokeWidth={2} aria-hidden="true" />
                  {t.verifiedBadge}
                </Badge>
              )}
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-muted">
              <MapPin className="size-4" strokeWidth={1.75} aria-hidden="true" />
              {location} · {t.types[supplier.type]}
            </p>
            {description && <p className="mt-3 max-w-2xl text-muted">{description}</p>}
          </div>
        </div>

        {/* Products */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">{t.profileProducts}</h2>
          {products.length === 0 ? (
            <EmptyState className="mt-4" title={t.profileEmpty} />
          ) : (
            <ProductGrid
              products={products}
              locale={locale}
              labels={productCardLabels(dict.shop)}
              className="mt-5 sm:grid-cols-2 lg:grid-cols-4"
            />
          )}
        </div>
      </Container>
    </Section>
  );
}
