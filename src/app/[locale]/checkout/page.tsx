import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSession } from "@/lib/auth/session";
import { CheckoutExperience } from "@/features/orders/checkout-experience";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.checkout.title, robots: { index: false } };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ source?: string; request?: string; quote?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { source, request, quote } = await searchParams;

  // Checkout requires an account so the order can be saved + owned.
  const session = await getSession();
  if (!session) {
    const target = source === "quote" && request && quote
      ? `/${locale}/checkout?source=quote&request=${request}&quote=${quote}`
      : `/${locale}/checkout`;
    redirect(`/${locale}/login?next=${encodeURIComponent(target)}`);
  }

  const mode = source === "quote" ? "quote" : "cart";

  return (
    <CheckoutExperience
      dict={dict}
      locale={locale}
      customerId={session!.user.id}
      mode={mode}
      requestId={request}
      quoteId={quote}
    />
  );
}
