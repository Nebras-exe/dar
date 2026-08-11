import { BadgeCheck, Wallet, Recycle, Ruler } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";

const icons = [BadgeCheck, Wallet, Recycle, Ruler];

export function ValueStrip({ dict }: { dict: Dictionary }) {
  const items = dict.home.value.items;
  return (
    <section className="border-y border-border-subtle bg-surface">
      <Container width="wide" className="py-10 sm:py-12">
        <ul className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = icons[i] ?? BadgeCheck;
            return (
              <li key={item.title} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Icon className="size-4.5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[0.95rem] font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">
                    {item.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
