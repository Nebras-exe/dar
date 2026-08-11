import { ImageUp, ArrowRight, Sofa, Armchair } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageFrame } from "@/components/ui/image-frame";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { Reveal } from "@/components/shared/reveal";

export function ReferenceImage({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const r = dict.home.reference;
  const matches = [
    { icon: Sofa, tone: "stone" as const },
    { icon: Armchair, tone: "sand" as const },
  ];
  return (
    <Section id="reference" tone="surface" spacing="lg">
      <Container width="wide">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <p className="text-eyebrow">{r.eyebrow}</p>
              <Badge tone="accent">{r.comingSoon}</Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl">{r.title}</h2>
            <p className="mt-4 text-lg text-muted">{r.subtitle}</p>
            <p className="mt-3 text-sm text-subtle">{r.note}</p>
            <Button href={`/${locale}/design`} variant="outline" className="mt-8">
              {r.cta}
            </Button>
          </div>

          <Reveal>
            <Card className="p-5 sm:p-6">
              <div className="grid grid-cols-[1.1fr_auto_1fr] items-center gap-3 sm:gap-4">
                {/* Reference */}
                <div className="rounded-lg border-2 border-dashed border-border p-2">
                  <ImageFrame ratio="square" rounded="md">
                    <PlaceholderImage
                      tone="cream"
                      icon={<ImageUp strokeWidth={1.1} />}
                      label={r.comingSoon}
                    />
                  </ImageFrame>
                </div>
                {/* Arrow */}
                <ArrowRight
                  className="size-6 text-brand rtl:rotate-180"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                {/* Matches */}
                <div className="grid gap-3">
                  {matches.map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <ImageFrame ratio="square" rounded="md" className="w-16 shrink-0">
                        <PlaceholderImage tone={m.tone} icon={<m.icon strokeWidth={1.1} />} />
                      </ImageFrame>
                      <div className="h-2 flex-1 rounded-full bg-border-subtle">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: i === 0 ? "88%" : "72%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
