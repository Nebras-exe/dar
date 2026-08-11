import { notFound } from "next/navigation";

/**
 * Catch-all for unmatched paths under a locale (Phase 14). Named routes always
 * win over this catch-all, so only genuinely-unknown paths (e.g. `/en/typo`)
 * reach it — and it hands off to the branded `[locale]/not-found.tsx` inside the
 * premium shell, instead of Next's default unstyled 404.
 */
export default function LocaleCatchAll() {
  notFound();
}
