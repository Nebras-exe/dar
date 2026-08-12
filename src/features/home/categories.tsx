import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { ImageFrame } from "@/components/ui/image-frame";
import { ProductImage } from "@/components/shop/product-image";
import { variantsFor, variantImageUrl } from "@/lib/catalog-preview";
import {
  getCategory,
  getProductsByCategory,
  homepageEligible,
  label,
  type CategorySlug,
  type ColorId,
  type Product,
} from "@/lib/catalog";

// A curated set of real categories; each shows a representative catalog piece.
const HOME_CATEGORIES: CategorySlug[] = [
  "sofas",
  "chairs",
  "coffee-tables",
  "dining",
  "beds",
  "rugs",
  "lighting",
  "storage",
];

/**
 * Editorial, image-led category grid. Each tile shows a REAL representative
 * catalog piece (generated studio art) with the category name and a count —
 * furniture, not generic gradient placeholders. The first tile is featured
 * larger for magazine rhythm.
 */
export function Categories({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const c = dict.home.categories;
  const tiles = HOME_CATEGORIES.map((slug) => {
    const category = getCategory(slug);
    const products = getProductsByCategory(slug);
    // Calm curation: prefer a piece with a muted variant and show that variant;
    // fall back to the first product only if none is calm-eligible.
    const calm = homepageEligible(products)[0];
    const hero = (calm?.product ?? products[0]) as Product | undefined;
    const heroColor = calm?.displayColorId;
    return category && hero
      ? { slug, category, hero, heroColor, count: products.length }
      : null;
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  const heroImageSrc = (hero: Product, heroColor: ColorId | undefined): string | undefined => {
    if (!heroColor) return undefined;
    const v = variantsFor(hero.slug).find((x) => x.colorId === heroColor);
    return v ? variantImageUrl(v) : undefined;
  };

  return (
    <Section id="shop" tone="surface" spacing="lg">
      <Container width="wide">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeader eyebrow={c.eyebrow} title={c.title} description={c.subtitle} />
          <Link
            href={`/${locale}/shop`}
            className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-taupe hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {dict.cta.shopFurniture}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {tiles.map(({ slug, category, hero, heroColor, count }, i) => {
            const featured = i === 0;
            return (
              <li
                key={slug}
                className={featured ? "col-span-2 row-span-2 sm:col-span-1 lg:col-span-2 lg:row-span-2" : ""}
              >
                <Link
                  href={`/${locale}/shop/${slug}`}
                  className="group relative block overflow-hidden rounded-xl ring-1 ring-border-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <ImageFrame
                    ratio="square"
                    rounded="xl"
                    zoomOnHover
                    className="rounded-xl"
                  >
                    <ProductImage
                      product={hero}
                      alt={label(category.name, locale)}
                      overrideSrc={heroImageSrc(hero, heroColor)}
                      sizes={featured ? "(max-width:1024px) 100vw, 40vw" : "(max-width:640px) 50vw, 22vw"}
                    />
                  </ImageFrame>
                  {/* Legible label bar over a soft gradient scrim */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent p-4">
                    <div>
                      <span className={"block font-medium text-background " + (featured ? "text-lg" : "text-[0.95rem]")}>
                        {label(category.name, locale)}
                      </span>
                      <span className="text-xs text-background/80 tabular">
                        {c.count.replace("{count}", String(count))}
                      </span>
                    </div>
                    <span className="flex size-8 items-center justify-center rounded-full bg-elevated/90 text-brand opacity-0 transition-opacity group-hover:opacity-100">
                      <ArrowUpRight className="size-4 rtl:-scale-x-100" strokeWidth={2} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
