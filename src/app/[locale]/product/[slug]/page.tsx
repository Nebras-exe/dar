import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/shop/product-grid";
import { productCardLabels } from "@/components/shared/product-card";
import {
  getAllProducts,
  getCategory,
  getProductBySlug,
  getRelatedProducts,
  label,
  materialLabels,
  roomLabels,
  styleLabels,
} from "@/lib/catalog";
import { ProductGallery } from "@/features/shop/product-gallery";
import { AddToCartPanel } from "@/features/shop/add-to-cart-panel";
import { DimensionsDisplay } from "@/features/shop/dimensions-display";
import { VariantProvider } from "@/features/shop/variant-context";
import { VariantPrice } from "@/features/shop/variant-price";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllProducts().map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const product = getProductBySlug(slug);
  if (!product) return {};
  const name = loc === "ar" ? product.nameAr : product.name;
  const description = loc === "ar" ? product.descriptionAr : product.description;
  return {
    title: name,
    description,
    alternates: { canonical: `/${locale}/product/${slug}` },
  };
}

const availabilityTone = {
  "in-stock": "success",
  "made-to-order": "warning",
  "out-of-stock": "neutral",
} as const;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const dict = getDictionary(typedLocale);
  const t = dict.shop;
  const tp = t.product;
  const name = typedLocale === "ar" ? product.nameAr : product.name;
  const description =
    typedLocale === "ar" ? product.descriptionAr : product.description;
  const category = getCategory(product.category);
  const related = getRelatedProducts(product, 4);
  const cardLabels = productCardLabels(t);

  const chipClass =
    "inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-sm text-foreground transition-colors hover:border-taupe hover:bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

  return (
    <Section spacing="md">
      <Container width="wide">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted">
          <Link
            href={`/${typedLocale}/shop`}
            className="rounded-md hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {tp.breadcrumbShop}
          </Link>
          {category && (
            <>
              <ChevronRight className="size-3.5 text-subtle rtl:rotate-180" aria-hidden="true" />
              <Link
                href={`/${typedLocale}/shop/${product.category}`}
                className="rounded-md hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {label(category.name, typedLocale)}
              </Link>
            </>
          )}
          <ChevronRight className="size-3.5 text-subtle rtl:rotate-180" aria-hidden="true" />
          <span className="text-foreground">{name}</span>
        </nav>

        <VariantProvider slug={product.slug}>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Gallery — sticky on desktop so the piece stays in view while reading specs */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery product={product} name={name} />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {category && (
              <Link
                href={`/${typedLocale}/shop/${product.category}`}
                className="text-eyebrow mb-2 w-fit rounded-md hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {label(category.name, typedLocale)}
              </Link>
            )}
            <h1 className="text-3xl sm:text-4xl">{name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <VariantPrice basePrice={product.price} locale={typedLocale} />
              {product.priceType === "estimated" && (
                <Badge tone="neutral" title={tp.estimatedNote}>{tp.estimatedPrice}</Badge>
              )}
              <Badge tone={availabilityTone[product.stockStatus]}>
                {t.availability[product.stockStatus]}
              </Badge>
              {product.customizable && (
                <Badge tone="accent">{tp.customizableBadge}</Badge>
              )}
            </div>

            {product.priceType === "estimated" && (
              <p className="mt-2 text-xs text-subtle">{tp.estimatedNote}</p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span>
                <span className="font-medium text-foreground">{tp.demoSupplierLabel}:</span>{" "}
                <span translate="no">{product.supplier}</span>
              </span>
              {product.sourceLabel && (
                <span>
                  <span className="font-medium text-foreground">{tp.sourceLabel}:</span>{" "}
                  <span translate="no">{product.sourceLabel}</span>
                </span>
              )}
            </div>

            <p className="mt-5 text-base leading-relaxed text-muted">{description}</p>

            {/* Buy box */}
            <div className="mt-7">
              <AddToCartPanel product={product} locale={typedLocale} t={t} />
            </div>

            {/* Dimensions */}
            <div className="mt-9">
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                {tp.dimensionsTitle}
              </h2>
              <DimensionsDisplay dimensions={product.dimensions} t={tp} locale={typedLocale} />
              {product.dimensionsKnown === false && (
                <p className="mt-2 text-xs text-subtle">{tp.dimensionsApprox}</p>
              )}
            </div>

            {/* Materials + Style + Rooms */}
            <dl className="mt-8 grid gap-6 border-t border-border-subtle pt-8 sm:grid-cols-2">
              <div>
                <dt className="mb-2.5 text-sm font-semibold text-foreground">
                  {tp.materialsTitle}
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {product.materials.map((m) => (
                    <Link
                      key={m}
                      href={`/${typedLocale}/shop?material=${m}`}
                      className={chipClass}
                    >
                      {label(materialLabels[m], typedLocale)}
                    </Link>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="mb-2.5 text-sm font-semibold text-foreground">
                  {tp.styleTitle}
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {product.styleTags.map((s) => (
                    <Link
                      key={s}
                      href={`/${typedLocale}/shop?style=${s}`}
                      className={chipClass}
                    >
                      {label(styleLabels[s], typedLocale)}
                    </Link>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="mb-2.5 text-sm font-semibold text-foreground">
                  {tp.roomTitle}
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {product.roomTypes.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-sm text-accent"
                    >
                      {label(roomLabels[r], typedLocale)}
                    </span>
                  ))}
                </dd>
              </div>
              {product.features.length > 0 && (
                <div>
                  <dt className="mb-2.5 text-sm font-semibold text-foreground">
                    {tp.featuresTitle}
                  </dt>
                  <dd>
                    <ul className="flex flex-col gap-1.5 text-sm text-muted">
                      {product.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                          {label(f, typedLocale)}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>

            {product.customizable && (
              <div className="mt-6 rounded-lg border border-border-subtle bg-surface px-4 py-3">
                <p className="text-sm text-muted">{tp.customizableNote}</p>
                <Link
                  href={`/${locale}/custom?from=${product.slug}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {tp.customLink}
                  <span aria-hidden="true" className="rtl:-scale-x-100">→</span>
                </Link>
              </div>
            )}

            <p className="mt-6 text-xs text-subtle">{tp.demoNote}</p>
          </div>
        </div>
        </VariantProvider>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-border-subtle pt-12">
            <SectionHeader title={tp.relatedTitle} />
            <div className="mt-8">
              <ProductGrid products={related} locale={typedLocale} labels={cardLabels} />
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
