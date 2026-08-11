import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Store, LogOut } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSession } from "@/lib/auth/session";
import { signOutAction } from "@/lib/auth/actions";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccountLists, AccountPlaceholders } from "@/features/account/account-lists";
import { AccountCustomRequests } from "@/features/custom/account-requests";
import { AccountOrders } from "@/features/orders/order-views";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.account.title, robots: { index: false } };
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.account;

  const session = await getSession();
  if (!session) redirect(`/${locale}/login`);
  const user = session!.user;
  const isSupplier = user.memberships.length > 0;

  return (
    <Section spacing="lg">
      <Container width="content">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-border-subtle pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl">{t.title}</h1>
            <p className="mt-2 text-muted">{t.greeting.replace("{name}", user.displayName)}</p>
            {session!.mode === "demo" && (
              <Badge tone="neutral" className="mt-3">{t.demoTag}</Badge>
            )}
          </div>
          <form action={signOutAction.bind(null, locale)}>
            <Button type="submit" variant="outline" iconStart={<LogOut className="size-4" strokeWidth={1.75} />}>
              {dict.auth.signOut}
            </Button>
          </form>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_18rem]">
          <div className="flex flex-col gap-10">
            <AccountOrders t={dict.orders} tPay={dict.payment} tFul={dict.fulfillment} locale={locale} customerId={user.id} />
            <AccountLists t={t} tRoom={dict.design.room.types} locale={locale} />
            <AccountCustomRequests t={dict.custom} locale={locale} customerId={user.id} />
            <AccountPlaceholders t={t} />
          </div>

          {/* Side: profile + supplier CTA */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border-subtle bg-elevated p-5">
              <h2 className="text-base font-semibold text-foreground">{t.profile}</h2>
              <dl className="mt-3 flex flex-col gap-2.5 text-sm">
                <Row label={t.profileName} value={user.displayName} />
                <Row label={t.profileEmail} value={user.email} dir="ltr" />
                <Row
                  label={t.profileRole}
                  value={isSupplier ? t.roleSupplier : t.roleCustomer}
                />
              </dl>
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface p-5">
              <p className="flex items-center gap-2 font-medium text-foreground">
                <Store className="size-4.5 text-brand" strokeWidth={1.75} aria-hidden="true" />
                {t.becomeSupplier}
              </p>
              <p className="mt-1.5 text-sm text-muted">{t.becomeSupplierBody}</p>
              <div className="mt-3">
                {isSupplier ? (
                  <Button href={`/${locale}/supplier`} size="sm" variant="secondary">
                    {t.goToDashboard}
                  </Button>
                ) : (
                  <Button href={`/${locale}/suppliers/apply`} size="sm" variant="secondary">
                    {dict.suppliers.applyCta}
                  </Button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

function Row({ label, value, dir }: { label: string; value: string; dir?: "ltr" | "rtl" }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-subtle">{label}</dt>
      <dd className="min-w-0 truncate font-medium text-foreground" dir={dir}>
        {value}
      </dd>
    </div>
  );
}
