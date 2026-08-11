import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { ImageFrame } from "@/components/ui/image-frame";
import { PlaceholderImage } from "@/components/shared/placeholder-image";

const tones = ["sand", "stone", "cream", "walnut", "sand", "stone"] as const;

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
          {s.items.map((style, i) => (
            <li key={style.name}>
              <a
                href={`/${locale}/design`}
                className="group relative block overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <ImageFrame ratio="landscape" rounded="xl" zoomOnHover>
                  <PlaceholderImage tone={tones[i % tones.length]} />
                </ImageFrame>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-charcoal/75 via-charcoal/10 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="text-lg font-medium text-background">
                    {style.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-background/80">{style.desc}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
