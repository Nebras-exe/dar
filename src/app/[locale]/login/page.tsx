import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { isSupabaseConfigured } from "@/lib/backend/config";
import { AuthForm } from "@/features/auth/auth-form";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.auth.loginTitle, robots: { index: false } };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <Section spacing="lg">
      <Container width="narrow">
        <AuthForm
          mode="login"
          t={dict.auth}
          locale={locale}
          isDemo={!isSupabaseConfigured()}
          redirectTo={`/${locale}/account`}
        />
      </Container>
    </Section>
  );
}
