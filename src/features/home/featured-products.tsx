import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/shop/product-grid";
import { productCardLabels } from "@/components/shared/product-card";
import { Reveal } from "@/components/shared/reveal";
import { getProductBySlug, type Product } from "@/lib/catalog";

// A curated spread of real catalog pieces — every card links to a real product.
const FEATURED_SLUGS = [
  "luna-modular-sofa",
  "noura-coffee-table",
  "rima-accent-chair",
  "faris-floor-lamp",
  "textured-wool-rug",
  "sila-side-table",
];

export function FeaturedProducts({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const f = dict.home.featured;
  const labels = productCardLabels(dict.shop);
  const products = FEATURED_SLUGS.map((slug) => getProductBySlug(slug)).filter(
    (p): p is Product => Boolean(p),
  );

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
          <ProductGrid products={products} locale={locale} labels={labels} />
        </Reveal>
      </Container>
    </Section>
  );
}
