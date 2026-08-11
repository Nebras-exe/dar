"use client";

import * as React from "react";
import { Brain, Check, Sparkles, X } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { StyleTag } from "@/lib/catalog";
import type { MemoryContext } from "@/lib/memory";
import { Button } from "@/components/ui/button";
import { readMemoryContext } from "@/features/account/memory-store";

/**
 * "Use my saved style" seed card for the AI Designer (Phase 13, §3/§18). Memory is
 * NEVER applied silently — this card surfaces the saved preferences and asks. It
 * only appears when the signed-in user enabled memory + use-in-design AND has
 * usable preferences. "Use" applies the saved primary style (and offers the summary);
 * "Start fresh" dismisses. Reads the user's OWN memory only (own session id).
 */
export function MemorySeedCard({
  t, onApplyStyle,
}: {
  t: Dictionary["designMemory"]; onApplyStyle: (style: StyleTag) => void;
}) {
  const [ctx, setCtx] = React.useState<MemoryContext | null>(null);
  const [dismissed, setDismissed] = React.useState(false);
  const [applied, setApplied] = React.useState(false);

  // Resolve the user's own id from their session, then read their local memory.
  React.useEffect(() => {
    let alive = true;
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d: { userId?: string | null }) => {
        if (!alive || !d.userId) return;
        setCtx(readMemoryContext(d.userId));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  if (dismissed || !ctx || !ctx.enabled || !ctx.useInDesign) return null;
  const hasPrefs = ctx.preferredStyles.length > 0 || ctx.preferredColors.length > 0 || ctx.preferredMaterials.length > 0;
  if (!hasPrefs) return null;

  // A short human summary: Style · Colour · Material.
  const parts = [
    ...ctx.preferredStyles.slice(0, 1).map(labelize),
    ...ctx.preferredColors.slice(0, 1).map(labelize),
    ...ctx.preferredMaterials.slice(0, 1).map(labelize),
  ];
  const summary = parts.join(t.separator);
  const primary = ctx.preferredStyles[0];

  if (applied) {
    return (
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-success/40 bg-success-soft/60 px-4 py-3 text-sm text-foreground" role="status">
        <Check className="size-4 text-success" strokeWidth={2} aria-hidden="true" />
        {t.applied}
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border border-brand/30 bg-brand-soft/40 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Brain className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Sparkles className="size-3.5 text-brand" strokeWidth={1.75} aria-hidden="true" />
            {t.useSavedTitle}
          </p>
          <p className="mt-0.5 text-sm text-muted">{t.useSavedBody.replace("{summary}", summary)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {primary && (
              <Button size="sm" onClick={() => { onApplyStyle(primary); setApplied(true); }} iconStart={<Check className="size-4" strokeWidth={2} />}>
                {t.useSaved}
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => setDismissed(true)} iconStart={<X className="size-4" strokeWidth={1.75} />}>
              {t.ignore}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function labelize(v: string): string {
  return v.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
