import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { isSupabaseConfigured } from "@/lib/backend/config";
import { getSession } from "@/lib/auth/session";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SupplierApplyForm } from "@/features/supplier/apply-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.suppliers.applyTitle, robots: { index: false } };
}

export default async function SupplierApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.suppliers;
  const session = await getSession();

  return (
    <Section spacing="lg">
      <Container width="narrow">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl">{t.applyTitle}</h1>
          <p className="mt-3 text-lg text-muted">{t.applySubtitle}</p>
        </div>
        <SupplierApplyForm
          t={t}
          tTypes={t.types}
          isDemo={!isSupabaseConfigured()}
          signedIn={Boolean(session)}
        />
      </Container>
    </Section>
  );
}
