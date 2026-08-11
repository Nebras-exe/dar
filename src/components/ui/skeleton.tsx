import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
}

/** Loading placeholder. Respects reduced-motion via the global CSS override. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-[color-mix(in_srgb,var(--color-taupe)_28%,transparent)]",
        className,
      )}
    />
  );
}
