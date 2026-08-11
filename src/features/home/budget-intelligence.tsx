import { Check, TrendingDown } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";

export function BudgetIntelligence({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const b = dict.home.budget;
  return (
    <Section id="budget" tone="surface" spacing="lg">
      <Container width="wide">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Copy */}
          <div>
            <p className="text-eyebrow mb-3">{b.eyebrow}</p>
            <h2 className="text-2xl sm:text-3xl">{b.title}</h2>
            <p className="mt-4 text-lg text-muted">{b.subtitle}</p>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {b.abilities.map((ability) => (
                <li key={ability} className="flex items-center gap-2.5 text-sm text-foreground">
                  <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <Check className="size-3.5" strokeWidth={2.25} aria-hidden="true" />
                  </span>
                  {ability}
                </li>
              ))}
            </ul>
            <Button
              href={`/${locale}/design`}
              variant="outline"
              className="mt-8"
              iconStart={<TrendingDown className="size-4.5" strokeWidth={1.75} />}
            >
              {b.cta}
            </Button>
          </div>

          {/* Budget meter */}
          <Reveal>
            <Card className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="text-eyebrow">{b.yourBudgetLabel}</span>
                <Badge tone="demo">{dict.home.featured.badge}</Badge>
              </div>
              <p className="mt-2 font-display text-4xl text-foreground tabular">
                {b.yourBudgetValue}
              </p>

              <div className="mt-6 h-3.5 overflow-hidden rounded-full bg-border-subtle">
                <div
                  className="flex h-full items-center rounded-full bg-brand"
                  style={{ width: "94%" }}
                />
              </div>

              <dl className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-sm text-muted">
                    <span className="size-2.5 rounded-full bg-brand" aria-hidden="true" />
                    {b.designCostLabel}
                  </dt>
                  <dd className="text-sm font-semibold text-foreground tabular">
                    {b.designCostValue}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-border-subtle pt-3">
                  <dt className="flex items-center gap-2 text-sm text-muted">
                    <span className="size-2.5 rounded-full bg-border" aria-hidden="true" />
                    {b.remainingLabel}
                  </dt>
                  <dd className="text-sm font-semibold text-success tabular">
                    {b.remainingValue}
                  </dd>
                </div>
              </dl>
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
