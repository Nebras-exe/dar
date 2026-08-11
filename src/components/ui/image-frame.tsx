import * as React from "react";
import { cn } from "@/lib/utils";

type Ratio = "square" | "portrait" | "landscape" | "wide";

const ratios: Record<Ratio, string> = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/10]",
};

export interface ImageFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: Ratio;
  rounded?: "md" | "lg" | "xl";
  /** Enables a gentle zoom on hover of the nearest `group`. */
  zoomOnHover?: boolean;
}

/**
 * Consistent, overflow-clipped image container with a fixed aspect ratio so
 * furniture imagery never causes layout shift. Radius is kept modest — no
 * oversized rounded corners.
 */
export function ImageFrame({
  className,
  ratio = "landscape",
  rounded = "lg",
  zoomOnHover = false,
  children,
  ...props
}: ImageFrameProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-cream",
        ratios[ratio],
        rounded === "md" && "rounded-md",
        rounded === "lg" && "rounded-lg",
        rounded === "xl" && "rounded-xl",
        // Zoom targets BOTH real photography (<img>) and the generated SVG art
        // (<svg>) so the hover treatment works on every card.
        zoomOnHover &&
          "[&>img]:transition-transform [&>img]:duration-[var(--duration-slow)] [&>img]:ease-[var(--ease-soft)] group-hover:[&>img]:scale-[1.05] [&>svg]:transition-transform [&>svg]:duration-[var(--duration-slow)] [&>svg]:ease-[var(--ease-soft)] group-hover:[&>svg]:scale-[1.05]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
