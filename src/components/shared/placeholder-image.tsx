import * as React from "react";
import { cn } from "@/lib/utils";

export interface PlaceholderImageProps {
  icon?: React.ReactNode;
  label?: string;
  className?: string;
  tone?: "sand" | "cream" | "stone" | "walnut";
}

const tones = {
  sand: "from-sand to-cream text-walnut",
  cream: "from-cream to-ivory text-taupe",
  stone: "from-stone to-cream text-walnut",
  walnut: "from-walnut to-charcoal text-cream",
};

/**
 * A tasteful stand-in for real furniture photography. Clearly a placeholder —
 * no external assets are shipped in Phase 01. A soft warm gradient plus a line
 * motif keeps the visual language consistent without faking product imagery.
 */
export function PlaceholderImage({
  icon,
  label,
  className,
  tone = "sand",
}: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-3 bg-linear-to-br",
        tones[tone],
        className,
      )}
    >
      {icon && (
        <span aria-hidden="true" className="opacity-80 [&>svg]:size-12">
          {icon}
        </span>
      )}
      {label && (
        <span className="text-xs font-medium uppercase tracking-wider opacity-70">
          {label}
        </span>
      )}
    </div>
  );
}
