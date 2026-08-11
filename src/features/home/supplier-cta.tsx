import { Store, Check } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SupplierCta({ dict }: { dict: Dictionary }) {
  const s = dict.home.supplier;
  return (
    <Section id="suppliers" tone="surface" spacing="md">
      <Container width="wide">
        <div className="grid gap-8 rounded-2xl border border-border-subtle bg-elevated p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Store className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <p className="text-eyebrow">{s.eyebrow}</p>
              <Badge tone="accent">{dict.home.custom.comingSoon}</Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl">{s.title}</h2>
            <p className="mt-3 max-w-xl text-muted">{s.subtitle}</p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {s.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="size-4 shrink-0 text-accent" strokeWidth={2.25} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Button variant="secondary" className="shrink-0 justify-self-start" disabled>
            {s.cta}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
