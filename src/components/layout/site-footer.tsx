import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/ui/container";

// Link targets that match the authored link order. Real routes (Design, Shop)
// point to their pages; the rest resolve to homepage sections rather than
// unbuilt routes.
const anchorMap: string[][] = [
  ["/design", "/shop", "#styles", "#styles"],
  ["#top", "#suppliers", "#custom", "#top"],
  ["#how", "#top", "#top", "#top"],
];

export function SiteFooter({
  locale,
  footer,
}: {
  locale: Locale;
  footer: Dictionary["footer"];
}) {
  const home = `/${locale}`;
  return (
    <footer className="mt-auto bg-[var(--color-inverse)] text-[var(--color-inverse-foreground)]">
      <Container width="wide" className="py-16">
        <div className="grid gap-10 md:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo locale={locale} onInverse />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-inverse-foreground)]/80">
              {footer.tagline}
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3"
          >
            {footer.columns.map((col, ci) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-inverse-foreground)]/75">
                  {col.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link, li) => (
                    <li key={link}>
                      <a
                        href={`${home}${anchorMap[ci]?.[li] ?? "#top"}`}
                        className="rounded text-sm text-[var(--color-inverse-foreground)]/80 transition-colors hover:text-[var(--color-inverse-foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-inverse-foreground)]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--color-inverse-foreground)]/15 pt-6 text-sm text-[var(--color-inverse-foreground)]/80 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.madeIn} · {footer.currency}</p>
          <p className="text-xs text-[var(--color-inverse-foreground)]/70">{footer.rights}</p>
        </div>
      </Container>
    </footer>
  );
}
