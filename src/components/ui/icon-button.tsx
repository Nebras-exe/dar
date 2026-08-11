import * as React from "react";
import { cn } from "@/lib/utils";

type IconButtonSize = "sm" | "md";

const sizes: Record<IconButtonSize, string> = {
  sm: "size-9",
  md: "size-11",
};

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required — icon-only controls must expose an accessible name. */
  label: string;
  size?: IconButtonSize;
}

/** Icon-only control. `label` is mandatory and becomes the `aria-label`. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { className, label, size = "md", type = "button", children, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-foreground",
          "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-soft)]",
          "hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          "disabled:pointer-events-none disabled:opacity-55",
          sizes[size],
          className,
        )}
        {...props}
      >
        <span aria-hidden="true" className="inline-flex">
          {children}
        </span>
      </button>
    );
  },
);
