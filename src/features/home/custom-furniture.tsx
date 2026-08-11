import { Ruler, Palette, Layers, Wallet, Hammer } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

const optionIcons = [Ruler, Palette, Layers, Wallet];

export function CustomFurniture({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const c = dict.home.custom;
  return (
    <Section id="custom" spacing="lg">
      <Container width="wide">
        <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-elevated p-8 sm:p-12">
          <div
            aria-hidden="true"
            className="bg-grain pointer-events-none absolute inset-0 opacity-50"
          />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Hammer className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <p className="text-eyebrow">{c.eyebrow}</p>
              </div>
              <h2 className="text-2xl sm:text-3xl">{c.title}</h2>
              <p className="mt-4 max-w-lg text-lg text-muted">{c.subtitle}</p>
              <Button href={`/${locale}/custom`} className="mt-8">
                {c.cta}
              </Button>
            </div>

            <ul className="grid grid-cols-2 gap-3">
              {c.options.map((option, i) => {
                const Icon = optionIcons[i % optionIcons.length];
                return (
                  <li
                    key={option}
                    className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface px-4 py-4"
                  >
                    <span className="inline-flex size-9 items-center justify-center rounded-full bg-elevated text-brand">
                      <Icon className="size-4.5" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{option}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
