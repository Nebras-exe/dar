import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "brand" | "accent" | "success" | "warning" | "demo";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface text-muted border-border",
  brand: "bg-brand-soft text-brand border-transparent",
  accent: "bg-accent-soft text-accent border-transparent",
  success: "bg-success-soft text-success border-transparent",
  warning: "bg-warning-soft text-warning border-transparent",
  demo: "bg-elevated text-muted border-border",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

/** Small, non-interactive status/label element. */
export function Badge({
  className,
  tone = "neutral",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "text-xs font-medium leading-5",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
