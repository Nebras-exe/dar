import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSession } from "@/lib/auth/session";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { OrderDetail } from "@/features/orders/order-views";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.orders.detail.title, robots: { index: false } };
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  // Orders are private to the owning customer — require a session; the client
  // view resolves the order only from the signed-in customer's own store (an
  // order that isn't theirs simply resolves to null → "not found").
  const session = await getSession();
  if (!session) redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/orders/${id}`)}`);

  return (
    <Section spacing="md">
      <Container width="content">
        <OrderDetail
          t={dict.orders}
          tPay={dict.payment}
          tFul={dict.fulfillment}
          tCustom={dict.custom}
          locale={locale}
          customerId={session!.user.id}
          orderId={id}
        />
      </Container>
    </Section>
  );
}
