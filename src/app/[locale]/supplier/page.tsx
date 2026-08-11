import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Store } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSession } from "@/lib/auth/session";
import { enterDemoSupplierAction } from "@/lib/auth/actions";
import { demoSupplierById, repoGetProductsBySupplier } from "@/lib/repository";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SupplierDashboard } from "@/features/supplier/supplier-dashboard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.supplier.title, robots: { index: false } };
}

export default async function SupplierDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.supplier;

  const session = await getSession();

  // Not signed in → prompt to sign in.
  if (!session) {
    return (
      <Guard>
        <p className="text-muted">{t.signInFirst}</p>
        <Button href={`/${locale}/login`} className="mt-4">{dict.auth.signIn}</Button>
      </Guard>
    );
  }

  // Server-side authorization: only a member gets the workspace (§28).
  const membership = session.user.memberships[0];
  const supplier = membership ? demoSupplierById(membership.supplierId) : undefined;

  if (!membership || !supplier) {
    return (
      <Guard>
        <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <Store className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl">{t.notMemberTitle}</h1>
        <p className="mt-2 max-w-md text-muted">{t.notMemberBody}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <form action={enterDemoSupplierAction.bind(null, locale)}>
            <Button type="submit">{t.openDemo}</Button>
          </form>
          <Link href={`/${locale}/suppliers/apply`} className="text-sm font-medium text-brand hover:text-brand-hover">
            {t.applyLink}
          </Link>
        </div>
      </Guard>
    );
  }

  const sampleProducts = await repoGetProductsBySupplier(supplier.id);

  return (
    <Section spacing="md">
      <Container width="wide">
        <SupplierDashboard
          supplier={supplier}
          sampleProducts={sampleProducts}
          t={t}
          tSup={dict.suppliers}
          tCustom={dict.custom}
          tOrders={dict.orders}
          tPay={dict.payment}
          tFul={dict.fulfillment}
          tMfg={dict.manufacturing}
          tDel={dict.delivery}
          locale={locale}
        />
      </Container>
    </Section>
  );
}

function Guard({ children }: { children: React.ReactNode }) {
  return (
    <Section spacing="lg">
      <Container width="narrow">
        <div className="flex flex-col items-center rounded-2xl border border-border-subtle bg-surface p-8 text-center">
          {children}
        </div>
      </Container>
    </Section>
  );
}
