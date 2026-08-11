import { Camera, SlidersHorizontal, Sparkles, Replace, ShoppingBag } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/shared/reveal";

const icons = [Camera, SlidersHorizontal, Sparkles, Replace, ShoppingBag];

export function HowItWorks({ dict }: { dict: Dictionary }) {
  const how = dict.home.how;
  return (
    <Section id="how" spacing="lg">
      <Container width="wide">
        <SectionHeader eyebrow={how.eyebrow} title={how.title} description={how.subtitle} />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {how.steps.map((step, i) => {
            const Icon = icons[i] ?? Sparkles;
            return (
              <Reveal
                as="li"
                key={step.num}
                delay={i * 70}
                className="relative flex flex-col rounded-xl border border-border-subtle bg-elevated p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className="font-display text-2xl text-border" aria-hidden="true">
                    {step.num}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {step.desc}
                </p>
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
