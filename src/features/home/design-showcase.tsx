import { Home, Wallet, Palette, PinOff, Check, ArrowRight } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";

export function DesignShowcase({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const d = dict.home.designer;
  const inputs = [
    { icon: Home, label: d.roomLabel, value: d.roomValue },
    { icon: Wallet, label: d.budgetLabel, value: d.budgetValue },
    { icon: Palette, label: d.styleLabel, value: d.styleValue },
    { icon: PinOff, label: d.keepLabel, value: d.keepValue },
  ];

  return (
    <Section id="design" tone="surface" spacing="lg">
      <Container width="wide">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <SectionHeader
            eyebrow={d.eyebrow}
            title={d.title}
            description={d.subtitle}
          />

          <Reveal>
            <Card className="overflow-hidden">
              {/* Inputs */}
              <div className="flex items-center justify-between gap-3 border-b border-border-subtle bg-background/60 px-5 py-4">
                <span className="text-eyebrow">{d.eyebrow}</span>
                <Badge tone="demo">{dict.home.featured.badge}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-px bg-border-subtle sm:grid-cols-4">
                {inputs.map((it) => (
                  <div key={it.label} className="bg-elevated px-4 py-3">
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <it.icon className="size-3.5 text-brand" strokeWidth={1.75} aria-hidden="true" />
                      {it.label}
                    </span>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {it.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="px-5 py-4">
                <p className="mb-2 text-sm font-medium text-foreground">
                  {d.recommendationsTitle}
                </p>
                <ul className="divide-y divide-border-subtle">
                  {d.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between gap-3 py-2.5"
                    >
                      <span className="flex items-center gap-2.5 text-sm text-foreground">
                        <Check className="size-4 shrink-0 text-success" strokeWidth={2.25} aria-hidden="true" />
                        {item.name}
                      </span>
                      <span className="text-sm font-medium text-foreground tabular">
                        {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Totals */}
              <div className="border-t border-border-subtle bg-background/60 px-5 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">{d.totalLabel}</span>
                  <span className="font-semibold text-foreground tabular">
                    {d.totalValue}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-border-subtle">
                  <div className="h-full w-[52%] rounded-full bg-accent" />
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted">{d.remainingLabel}</span>
                  <span className="font-semibold text-success tabular">
                    {d.remainingValue}
                  </span>
                </div>
                <Button
                  href={`/${locale}/design`}
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  iconEnd={<ArrowRight className="size-4 rtl:rotate-180" strokeWidth={2} />}
                >
                  {d.cta}
                </Button>
              </div>
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
