import * as React from "react";
import { cn } from "@/lib/utils";

type SectionTone = "base" | "surface" | "contrast";

const tones: Record<SectionTone, string> = {
  base: "",
  surface: "bg-surface",
  contrast: "bg-charcoal text-background",
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  /** Vertical rhythm — responsive by default. */
  spacing?: "sm" | "md" | "lg";
}

const spacings = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-20 sm:py-32",
};

/** A full-width band of vertical space with an optional background tone. */
export function Section({
  className,
  tone = "base",
  spacing = "md",
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(tones[tone], spacings[spacing], className)}
      {...props}
    >
      {children}
    </section>
  );
}

export interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

/**
 * Consistent editorial section intro: a hairline kicker → a larger display
 * title → a measured description. Bigger and more confident than a generic
 * SaaS section header.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && <span className="kicker mb-4">{eyebrow}</span>}
      <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">{title}</h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-muted">{description}</p>
      )}
    </div>
  );
}
