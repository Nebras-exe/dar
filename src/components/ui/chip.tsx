"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  iconStart?: React.ReactNode;
}

/**
 * Selectable pill used for styles, room types, and filters — a foundational
 * building block for the future AI designer. Uses `aria-pressed` so its state
 * is exposed to assistive tech.
 */
export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  function Chip(
    { className, selected = false, iconStart, children, type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-pressed={selected}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 h-10 text-sm font-medium",
          "transition-[background-color,border-color,color] duration-[var(--duration-fast)] ease-[var(--ease-soft)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          selected
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-elevated text-foreground hover:border-taupe hover:bg-surface",
          className,
        )}
        {...props}
      >
        {iconStart && (
          <span aria-hidden="true" className="inline-flex text-[1.05em]">
            {iconStart}
          </span>
        )}
        {children}
      </button>
    );
  },
);
