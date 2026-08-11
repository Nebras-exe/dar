import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "whitespace-nowrap select-none transition-[background-color,border-color,color,box-shadow,transform] " +
  "duration-[var(--duration-base)] ease-[var(--ease-soft)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand " +
  "disabled:pointer-events-none disabled:opacity-55 active:translate-y-px";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-brand-foreground shadow-[var(--shadow-sm)] hover:bg-brand-hover hover:shadow-[var(--shadow-md)]",
  secondary:
    "bg-foreground text-background hover:bg-charcoal shadow-[var(--shadow-xs)]",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-surface hover:border-taupe",
  ghost: "bg-transparent text-foreground hover:bg-surface",
  destructive:
    "bg-danger text-white hover:brightness-95 shadow-[var(--shadow-xs)]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-13 px-8 text-base",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, sizes[size], variants[variant], className);
}

interface CommonButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}

export interface ButtonProps
  extends CommonButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  /** When set, the button renders as an anchor (use for links/in-page nav). */
  href?: string;
}

/**
 * Premium, accessible button. Renders a real `<button>` for actions and an
 * `<a>` when `href` is supplied (so links keep native link behaviour). Stays
 * enabled semantics-wise but shows a spinner while `loading`, and never removes
 * its focus ring.
 */
export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    loading = false,
    iconStart,
    iconEnd,
    children,
    disabled,
    type = "button",
    href,
    "aria-busy": ariaBusy,
    ...props
  },
  ref,
) {
  const content = (
    <>
      {loading ? (
        <Spinner />
      ) : (
        iconStart && (
          <span className="shrink-0" aria-hidden="true">
            {iconStart}
          </span>
        )
      )}
      {children && <span className="min-w-0">{children}</span>}
      {!loading && iconEnd && (
        <span className="shrink-0" aria-hidden="true">
          {iconEnd}
        </span>
      )}
    </>
  );

  const classes = buttonClasses(variant, size, className);

  if (href) {
    const { onClick, ...anchorProps } =
      props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        onClick={onClick}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled || loading}
      aria-busy={ariaBusy ?? (loading || undefined)}
      className={classes}
      {...props}
    >
      {content}
    </button>
  );
});

function Spinner() {
  return (
    <svg
      className="size-4 shrink-0 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        className="opacity-25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
