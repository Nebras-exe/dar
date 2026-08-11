import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Store } from "lucide-react";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicSuppliers, type SupplierWithStats } from "@/lib/repository";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return {
    title: dict.suppliers.title,
    description: dict.suppliers.subtitle,
    alternates: { canonical: `/${locale}/suppliers` },
  };
}

export default async function SuppliersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.suppliers;
  const suppliers = await getPublicSuppliers();

  return (
    <Section spacing="lg">
      <Container width="wide">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeader title={t.title} description={t.subtitle} />
          <Button href={`/${locale}/suppliers/apply`} variant="secondary" className="shrink-0">
            {t.applyCta}
          </Button>
        </div>

        {suppliers.length === 0 ? (
          <EmptyState className="mt-10" title={t.empty} />
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((s) => (
              <SupplierCard key={s.id} supplier={s} t={t} locale={locale} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}

function SupplierCard({
  supplier: s,
  t,
  locale,
}: {
  supplier: SupplierWithStats;
  t: ReturnType<typeof getDictionary>["suppliers"];
  locale: Locale;
}) {
  const name = locale === "ar" ? s.nameAr : s.name;
  const location = locale === "ar" ? s.locationAr : s.location;
  return (
    <Link
      href={`/${locale}/suppliers/${s.slug}`}
      className="group flex flex-col rounded-2xl border border-border-subtle bg-elevated p-5 transition-colors hover:border-taupe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <Store className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {s.isDemo && <Badge tone="neutral">{t.sampleBadge}</Badge>}
          {s.verified && <Badge tone="accent">{t.verifiedBadge}</Badge>}
        </div>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">{name}</h2>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
        <MapPin className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
        {location} · {t.types[s.type]}
      </p>
      <p className="mt-3 text-sm text-subtle tabular">
        {t.productCount.replace("{count}", String(s.activeProductCount))}
      </p>
    </Link>
  );
}
