import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";

export interface LogoProps {
  locale: Locale;
  /** Render for a dark/inverse surface (e.g. the olive footer). */
  onInverse?: boolean;
  className?: string;
}

/**
 * DAR brand mark — the house-and-«دار» lockup. The mark ALREADY contains the
 * wordmark «دار», so no separate text label is rendered beside it (that would
 * duplicate the brand). The mark is a warm two-tone PNG (transparent background)
 * with a light variant for dark surfaces. The image `alt` carries the brand name
 * for assistive tech.
 */
export function Logo({ locale, onInverse = false, className }: LogoProps) {
  const markSrc = onInverse ? "/brand/dar-mark-light.png" : "/brand/dar-mark.png";
  const alt = locale === "ar" ? "دار" : "DAR";

  return (
    <Image
      src={markSrc}
      alt={alt}
      width={44}
      height={45}
      priority
      className={cn("h-9 w-auto", className)}
    />
  );
}
