import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getDirection } from "@/i18n/config";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/shop/product-grid";
import { productCardLabels } from "@/components/shared/product-card";
import { Reveal } from "@/components/shared/reveal";
import { homepageFeatured, type ColorId, type Product } from "@/lib/catalog";
import { BeforeAfterSlider } from "./before-after";

export function BeforeAfterSection({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const ba = dict.home.beforeAfter;
  const labels = productCardLabels(dict.shop);
  // Calm, category-balanced pieces (muted variants) — bright colours stay in the shop.
  const picks = homepageFeatured(4);
  const pieces: Product[] = picks.map((p) => p.product);
  const displayColors = new Map<string, ColorId>(picks.map((p) => [p.product.slug, p.displayColorId]));

  return (
    <Section id="before-after" spacing="lg">
      <Container width="wide">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeader eyebrow={ba.eyebrow} title={ba.title} description={ba.subtitle} />
          <Badge tone="demo" className="shrink-0">
            {dict.prototypeBadge}
          </Badge>
        </div>

        <Reveal className="mt-10">
          <BeforeAfterSlider
            dir={getDirection(locale)}
            beforeLabel={ba.beforeLabel}
            afterLabel={ba.afterLabel}
            sliderLabel={ba.sliderLabel}
          />
        </Reveal>

        {pieces.length > 0 && (
          <div className="mt-10">
            <h3 className="text-base font-medium text-foreground">{ba.piecesTitle}</h3>
            <ProductGrid
              products={pieces}
              locale={locale}
              labels={labels}
              displayColorFor={(p) => displayColors.get(p.slug)}
              className="mt-4 sm:grid-cols-4 lg:grid-cols-4"
            />
          </div>
        )}
      </Container>
    </Section>
  );
}
