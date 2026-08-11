import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";

export interface LogoProps {
  locale: Locale;
  /** Show the alternate-language wordmark beneath the primary one. */
  showAlternate?: boolean;
  className?: string;
}

/**
 * Typographic brand mark for Athathi. An architectural arch glyph — a nod to
 * interiors and doorways — paired with the wordmark in the active language.
 * Deliberately a tasteful prototype mark, not a final logo.
 */
export function Logo({ locale, showAlternate = false, className }: LogoProps) {
  const isArabic = locale === "ar";
  const primary = isArabic ? "أثاثي" : "Athathi";
  const alternate = isArabic ? "Athathi" : "أثاثي";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <ArchMark className="size-8 shrink-0 text-brand" />
      <span className="inline-flex flex-col leading-none">
        <span
          className={cn(
            "text-[1.35rem] tracking-tight text-foreground",
            isArabic ? "font-arabic font-semibold" : "font-display font-medium",
          )}
        >
          {primary}
        </span>
        {showAlternate && (
          <span
            className={cn(
              "mt-0.5 text-[0.7rem] tracking-wide text-subtle",
              isArabic ? "font-display" : "font-arabic",
            )}
          >
            {alternate}
          </span>
        )}
      </span>
    </span>
  );
}

function ArchMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6 28V14a10 10 0 0 1 20 0v14"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path
        d="M12 28v-9a4 4 0 0 1 8 0v9"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        className="opacity-45"
      />
    </svg>
  );
}
