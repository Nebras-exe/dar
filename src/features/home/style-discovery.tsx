import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { ImageFrame } from "@/components/ui/image-frame";

/**
 * Real interior-style photography for the six style cards, in the fixed order
 * the design brief mandates (1→6). Each entry pairs the WebP asset with
 * bilingual alt text; the visible card label/description come from the
 * localization dictionary (`home.styles.items`) so nothing is hardcoded.
 */
const STYLE_MEDIA = [
  { src: "/images/styles/warm-modern.webp", altEn: "Warm Modern interior — soft neutrals and walnut", altAr: "غرفة بتصميم مودرن دافئ" },
  { src: "/images/styles/japandi.webp", altEn: "Japandi interior — calm and quietly refined", altAr: "غرفة بتصميم جاباندي" },
  { src: "/images/styles/minimal.webp", altEn: "Minimal interior — clean lines and open space", altAr: "غرفة بتصميم مينيمال" },
  { src: "/images/styles/contemporary.webp", altEn: "Contemporary interior — current and comfortable", altAr: "غرفة بتصميم معاصر" },
  { src: "/images/styles/modern-classic.webp", altEn: "Modern Classic interior — timeless with a warm edge", altAr: "غرفة بتصميم كلاسيكي مودرن" },
  { src: "/images/styles/bohemian.webp", altEn: "Bohemian interior — layered textures and earthy tones", altAr: "غرفة بتصميم بوهيمي" },
] as const;

export function StyleDiscovery({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const s = dict.home.styles;
  return (
    <Section id="styles" spacing="lg">
      <Container width="wide">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} description={s.subtitle} />
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {s.items.map((style, i) => {
            const media = STYLE_MEDIA[i % STYLE_MEDIA.length];
            const alt = locale === "ar" ? media.altAr : media.altEn;
            return (
              <li key={style.name}>
                <a
                  href={`/${locale}/design`}
                  className="lift group relative block overflow-hidden rounded-xl shadow-[var(--shadow-sm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <ImageFrame
                    ratio="landscape"
                    rounded="xl"
                    zoomOnHover
                    className="ring-1 ring-border-subtle"
                  >
                    <Image
                      src={media.src}
                      alt={alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover"
                    />
                  </ImageFrame>
                  {/* Subtle warm-dark gradient at the bottom only — keeps the room
                      bright while the label stays readable. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-t from-charcoal/70 via-charcoal/5 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-lg font-medium text-background">
                      {style.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-background/85">{style.desc}</p>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
