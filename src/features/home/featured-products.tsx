import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/shop/product-grid";
import { productCardLabels } from "@/components/shared/product-card";
import { Reveal } from "@/components/shared/reveal";
import { getAllProducts, type Product } from "@/lib/catalog";

export function FeaturedProducts({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const f = dict.home.featured;
  const labels = productCardLabels(dict.shop);
  // The first few real catalog pieces (empty until real products are added).
  const products: Product[] = getAllProducts().slice(0, 6);

  return (
    <Section id="featured" spacing="lg">
      <Container width="wide">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeader eyebrow={f.eyebrow} title={f.title} description={f.subtitle} />
          <Button
            variant="outline"
            size="sm"
            href={`/${locale}/shop`}
            className="shrink-0"
          >
            {dict.cta.shopFurniture}
          </Button>
        </div>
        <Reveal className="mt-10">
          {products.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center text-muted">
              {f.emptyNote}
            </p>
          ) : (
            <ProductGrid products={products} locale={locale} labels={labels} />
          )}
        </Reveal>
      </Container>
    </Section>
  );
}
