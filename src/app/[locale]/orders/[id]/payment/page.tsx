import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSession } from "@/lib/auth/session";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PaymentExperience } from "@/features/orders/payment-experience";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.payment.title, robots: { index: false } };
}

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  // Payment is private to the owning customer. Require a session; the client
  // view resolves the order only from the signed-in customer's own store, and
  // the payment intent is derived from that order (amount = order total).
  const session = await getSession();
  if (!session) redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/orders/${id}/payment`)}`);

  return (
    <Section spacing="md">
      <Container width="content">
        <PaymentExperience
          t={dict.payment}
          locale={locale}
          customerId={session!.user.id}
          orderId={id}
        />
      </Container>
    </Section>
  );
}
