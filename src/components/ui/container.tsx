import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerWidth = "content" | "wide" | "narrow";

const widths: Record<ContainerWidth, string> = {
  narrow: "max-w-3xl",
  content: "max-w-[var(--container-content)]",
  wide: "max-w-[var(--container-wide)]",
};

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: ContainerWidth;
  as?: React.ElementType;
}

/** Centered, responsive content column with consistent gutters. */
export function Container({
  className,
  width = "content",
  as: Tag = "div",
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        widths[width],
        className,
      )}
      {...props}
    />
  );
}
