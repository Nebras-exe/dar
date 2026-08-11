"use client";

import * as React from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { label, type Localized } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Honest Demo Mode progress. The steps are the deterministic ones the engine
 * actually performed (received input → checked budget → matched style → searched
 * catalog → checked prices → built bundle). They reveal in a short, bounded
 * stagger purely for polish — not a fake multi-second "AI thinking" timer — and
 * reduced-motion users see them completed at once. Clearly badged Demo Mode.
 */
export function DemoAnalysis({
  steps,
  t,
  locale,
  onDone,
}: {
  steps: Localized[];
  t: Dictionary["design"]["analysis"] & { demoModeBadge: string };
  locale: Locale;
  onDone: () => void;
}) {
  const prefersReduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Reduced-motion users start fully revealed (no synchronous setState needed).
  const [revealed, setRevealed] = React.useState(() =>
    prefersReduced() ? steps.length : 0,
  );

  React.useEffect(() => {
    if (prefersReduced()) {
      const id = setTimeout(onDone, 250);
      return () => clearTimeout(id);
    }
    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      setRevealed(i);
      if (i >= steps.length) {
        clearInterval(tick);
        setTimeout(onDone, 500);
      }
    }, 380);
    return () => clearInterval(tick);
    // Intentionally run once on mount for this recommendation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.length]);

  return (
    <div className="mx-auto max-w-lg py-8 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Sparkles className="size-7" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <div className="mt-5 flex items-center justify-center gap-2">
        <h1 className="text-2xl sm:text-[1.75rem]">{t.title}</h1>
      </div>
      <p className="mt-2 text-muted">{t.subtitle}</p>
      <div className="mt-3 flex justify-center">
        <Badge tone="neutral">{t.demoModeBadge}</Badge>
      </div>

      <ol className="mx-auto mt-8 flex max-w-sm flex-col gap-3 text-start" aria-live="polite">
        {steps.map((step, i) => {
          const done = i < revealed;
          const active = i === revealed;
          return (
            <li
              key={i}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-[var(--duration-base)]",
                done
                  ? "border-border-subtle bg-surface opacity-100"
                  : active
                    ? "border-border-subtle bg-surface opacity-100"
                    : "border-transparent opacity-40",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full",
                  done ? "bg-success text-white" : "bg-border text-muted",
                )}
              >
                {done ? (
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                ) : active ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                ) : null}
              </span>
              <span className={cn("text-sm", done ? "text-foreground" : "text-muted")}>
                {label(step, locale)}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-6 text-xs text-subtle">{t.demoMode}</p>
    </div>
  );
}
