import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllProducts, categories, type Product } from "@/lib/catalog";
import { hasPreviewPhoto, previewEnabled } from "@/lib/catalog-preview";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/shop/product-grid";
import { productCardLabels } from "@/components/shared/product-card";

/**
 * Real Catalog Preview gallery (LOCAL/DEMO ONLY).
 *
 * A single page that renders the whole catalog through the PRODUCTION product
 * card, so you can visually evaluate Athathi with representative real furniture
 * photography. It reads only public catalog data + the isolated preview layer —
 * it mutates nothing. Not linked from the main navigation; `robots: noindex`.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: `Real Catalog Preview · ${dict.brand.name}`, robots: { index: false } };
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const labels = productCardLabels(dict.shop);

  const all = getAllProducts();
  const withPhoto = all.filter((p) => hasPreviewPhoto({ slug: p.slug, category: p.category, subcategory: p.subcategory })).length;
  const total = all.length;

  const byCategory = categories
    .map((c) => ({ category: c, products: all.filter((p) => p.category === c.slug) }))
    .filter((g) => g.products.length > 0);

  return (
    <Section spacing="md">
      <Container width="wide">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-eyebrow mb-3 flex items-center gap-2">
            <Badge tone="demo">Local preview</Badge>
            {previewEnabled() ? "Real photos on" : "Preview off — showing generated art"}
          </p>
          <h1 className="text-3xl sm:text-4xl">Real Catalog Preview</h1>
          <p className="mt-3 text-muted">
            {locale === "ar"
              ? "معاينة محلية فقط: صور أثاث واقعية تمثيلية (من Unsplash، مسموح بالربط، دون أي واجهات مدفوعة) معروضة عبر بطاقة المنتج الفعلية — لتقييم شكل أثاثي بصور حقيقية. لا تُعدَّل بيانات الكتالوج أو أي منطق أعمال."
              : "Local-only: representative real furniture photography (Unsplash — hotlink-permitted, license-clean, no paid APIs) shown through the real product card, so you can evaluate how Athathi looks with real photos. No catalog data or business logic is changed."}
          </p>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div className="flex items-baseline gap-2">
              <dt className="text-muted">{locale === "ar" ? "المنتجات" : "Products"}</dt>
              <dd className="font-semibold text-foreground tabular">{total}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-muted">{locale === "ar" ? "بصور واقعية" : "With real photos"}</dt>
              <dd className="font-semibold text-foreground tabular">{withPhoto}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-muted">{locale === "ar" ? "برسوم الاستوديو" : "Generated art (decor)"}</dt>
              <dd className="font-semibold text-foreground tabular">{total - withPhoto}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-muted">{locale === "ar" ? "الفئات" : "Categories"}</dt>
              <dd className="font-semibold text-foreground tabular">{byCategory.length}</dd>
            </div>
          </dl>
          <p className="mt-4 rounded-lg border border-border-subtle bg-surface px-3.5 py-2.5 text-xs text-subtle">
            {locale === "ar"
              ? "الصور تمثيلية ودقيقة حسب الفئة، وليست صور منتجات حصرية. لتثبيت صورة دقيقة لمنتج، أضف مُعرّفه في src/lib/catalog-preview/overrides.ts."
              : "Photos are representative + category-accurate, not exact per-product retailer shots. To pin an exact photo for a product, add its slug to src/lib/catalog-preview/overrides.ts."}
          </p>
        </div>

        {/* Per-category grids (reusing the production ProductGrid + card) */}
        <div className="mt-10 flex flex-col gap-14">
          {byCategory.map(({ category, products }) => (
            <PreviewCategory key={category.slug} title={category.name[locale]} products={products} locale={locale} labels={labels} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function PreviewCategory({
  title, products, locale, labels,
}: {
  title: string; products: Product[]; locale: "en" | "ar"; labels: ReturnType<typeof productCardLabels>;
}) {
  return (
    <section>
      <div className="mb-5 flex items-baseline justify-between gap-3 border-b border-border-subtle pb-3">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{title}</h2>
        <span className="text-sm text-muted tabular">{products.length}</span>
      </div>
      <ProductGrid products={products} locale={locale} labels={labels} />
    </section>
  );
}
