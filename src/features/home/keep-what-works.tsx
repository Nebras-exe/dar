import { Check, RefreshCw, Plus } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

const columnStyles: Record<
  string,
  { icon: typeof Check; ring: string; chip: string }
> = {
  keep: { icon: Check, ring: "text-success", chip: "bg-success-soft text-success" },
  change: { icon: RefreshCw, ring: "text-warning", chip: "bg-warning-soft text-warning" },
  add: { icon: Plus, ring: "text-brand", chip: "bg-brand-soft text-brand" },
};

export function KeepWhatWorks({ dict }: { dict: Dictionary }) {
  const k = dict.home.keep;
  return (
    <Section id="keep" spacing="lg">
      <Container width="wide">
        <SectionHeader eyebrow={k.eyebrow} title={k.title} description={k.subtitle} />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {k.columns.map((col, i) => {
            const style = columnStyles[col.kind] ?? columnStyles.keep;
            const Icon = style.icon;
            return (
              <Reveal
                key={col.kind}
                delay={i * 80}
                className="rounded-xl border border-border-subtle bg-elevated p-6"
              >
                <div className="flex items-center gap-2.5">
                  <span className={cn("inline-flex size-8 items-center justify-center rounded-full", style.chip)}>
                    <Icon className="size-4" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold text-foreground">
                    {col.title}
                  </h3>
                </div>
                <ul className="mt-4 space-y-2">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 rounded-lg bg-surface px-3 py-2.5 text-sm text-foreground"
                    >
                      <Icon className={cn("size-4 shrink-0", style.ring)} strokeWidth={2} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
