"use client";

import * as React from "react";
import { Sparkles, Info } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button, buttonClasses } from "@/components/ui/button";
import { extractSpecFromText, type CustomFurnitureSpec } from "@/lib/rfq";
import { cn } from "@/lib/utils";
import { StepNav } from "../custom-experience";

/**
 * Idea step: the user describes the piece; Athathi runs the DETERMINISTIC demo
 * extractor over their own words and pre-fills the fields it recognised (only
 * facts they stated — never a measurement guessed from an image). The user
 * confirms/edits everything in the next step.
 */
export function IdeaStep({
  t, patchSpec, onBack, onNext,
}: {
  t: Dictionary["custom"];
  locale: Locale;
  spec: CustomFurnitureSpec;
  patchSpec: (patch: Partial<CustomFurnitureSpec>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [text, setText] = React.useState("");
  const [extracted, setExtracted] = React.useState(false);

  const runExtract = () => {
    const e = extractSpecFromText(text);
    // Apply only recognised fields; never overwrite with empties.
    const patch: Partial<CustomFurnitureSpec> = { notes: text.trim() || undefined };
    if (e.style) patch.style = e.style;
    if (e.color) patch.color = e.color;
    if (e.material) patch.material = e.material;
    if (e.widthCm !== undefined) patch.widthCm = e.widthCm;
    if (e.depthCm !== undefined) patch.depthCm = e.depthCm;
    if (e.heightCm !== undefined) patch.heightCm = e.heightCm;
    if (e.shape) patch.shape = e.shape;
    if (e.seatCount !== undefined) patch.seatCount = e.seatCount;
    if (e.firmness) patch.firmness = e.firmness;
    if (e.budget !== undefined) patch.budget = e.budget;
    patchSpec(patch);
    setExtracted(true);
  };

  return (
    <div>
      <div className="max-w-2xl">
        <h2 className="text-2xl">{t.idea.title}</h2>
        <p className="mt-2 text-muted">{t.idea.subtitle}</p>
      </div>

      <div className="mt-6">
        <label htmlFor="idea-text" className="sr-only">{t.idea.title}</label>
        <textarea
          id="idea-text"
          rows={4}
          value={text}
          maxLength={2000}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.idea.placeholder}
          className="w-full resize-y rounded-xl border border-border bg-elevated px-4 py-3 text-[0.95rem] leading-relaxed text-foreground shadow-[var(--shadow-xs)] placeholder:text-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button onClick={runExtract} disabled={!text.trim()} iconStart={<Sparkles className="size-4.5" strokeWidth={1.75} />}>
            {t.idea.extract}
          </Button>
          <button type="button" onClick={onNext} className={cn(buttonClasses("ghost", "md"), "text-muted")}>
            {t.idea.skip}
          </button>
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs text-subtle">
          <Info className="mt-0.5 size-3.5 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
          {t.idea.extractNote}
        </p>

        {extracted && (
          <p className="mt-4 rounded-lg border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-foreground" role="status">
            {t.idea.extracted}
          </p>
        )}
      </div>

      <StepNav
        onBack={onBack}
        onNext={onNext}
        nextLabel={t.start.continue}
        backLabel={t.review.edit}
      />
    </div>
  );
}
