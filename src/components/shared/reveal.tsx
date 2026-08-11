"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stagger the reveal, in ms. */
  delay?: number;
  as?: React.ElementType;
}

/**
 * Lightweight scroll-reveal. Renders in the "hidden" state on the server and
 * flips to "shown" the first time it enters the viewport. CSS handles the
 * reduced-motion case (content is shown immediately, no transition).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  style,
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      data-reveal={shown ? "shown" : "hidden"}
      style={{ ...style, transitionDelay: shown ? `${delay}ms` : undefined }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
