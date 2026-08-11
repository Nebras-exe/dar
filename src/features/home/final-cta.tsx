import { Sparkles } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export function FinalCta({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const f = dict.home.finalCta;
  return (
    <Section id="final-cta" tone="contrast" spacing="lg" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-grain pointer-events-none absolute inset-0 opacity-40"
      />
      <Container width="content" className="relative text-center">
        <h2 className="mx-auto max-w-2xl text-3xl sm:text-4xl">{f.title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-background/75">
          {f.subtitle}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button
            href={`/${locale}/design`}
            size="lg"
            iconStart={<Sparkles className="size-5" strokeWidth={2} />}
          >
            {f.ctaPrimary}
          </Button>
          <Button
            href={`/${locale}/shop`}
            size="lg"
            variant="outline"
            className="border-background/30 text-background hover:bg-background/10 hover:border-background/50"
          >
            {f.ctaSecondary}
          </Button>
        </div>
        <p className="mt-8 text-sm text-background/60">{f.omanNote}</p>
      </Container>
    </Section>
  );
}
