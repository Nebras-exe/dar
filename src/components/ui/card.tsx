import * as React from "react";
import { cn } from "@/lib/utils";

type CardTone = "elevated" | "surface" | "outline";

const tones: Record<CardTone, string> = {
  elevated: "bg-elevated border border-border-subtle shadow-[var(--shadow-sm)]",
  surface: "bg-surface border border-border-subtle",
  outline: "bg-transparent border border-border",
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  /** Adds subtle hover lift — use only for interactive cards. */
  interactive?: boolean;
}

/**
 * Editorial card surface. Kept intentionally restrained — hierarchy comes from
 * whitespace and imagery, not heavy borders or large shadows.
 */
export function Card({
  className,
  tone = "elevated",
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl",
        tones[tone],
        interactive &&
          "transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)]",
        className,
      )}
      {...props}
    />
  );
}
