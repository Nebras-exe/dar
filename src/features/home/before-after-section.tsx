import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getDirection } from "@/i18n/config";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/shop/product-grid";
import { productCardLabels } from "@/components/shared/product-card";
import { Reveal } from "@/components/shared/reveal";
import { getProductBySlug, type Product } from "@/lib/catalog";
import { BeforeAfterSlider } from "./before-after";

// Real catalog pieces that make up the illustrated "after" room.
const PIECE_SLUGS = [
  "luna-modular-sofa",
  "textured-wool-rug",
  "noura-coffee-table",
  "faris-floor-lamp",
];

export function BeforeAfterSection({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const ba = dict.home.beforeAfter;
  const labels = productCardLabels(dict.shop);
  const pieces = PIECE_SLUGS.map((slug) => getProductBySlug(slug)).filter(
    (p): p is Product => Boolean(p),
  );

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

        <div className="mt-10">
          <h3 className="text-base font-medium text-foreground">{ba.piecesTitle}</h3>
          <ProductGrid
            products={pieces}
            locale={locale}
            labels={labels}
            className="mt-4 sm:grid-cols-4 lg:grid-cols-4"
          />
        </div>
      </Container>
    </Section>
  );
}
