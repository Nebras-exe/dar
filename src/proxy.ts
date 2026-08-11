import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, isLocale } from "@/i18n/config";

/**
 * Ensures every route is prefixed with a supported locale. When the prefix is
 * missing we negotiate the best language from the `Accept-Language` header
 * (never from IP) and redirect — so `/shop` becomes `/en/shop` or `/ar/shop`.
 */
function resolveLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (header) {
    const requested = header
      .split(",")
      .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());
    const match = requested.find((code) => isLocale(code));
    if (match) return match;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = resolveLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes, and anything with a file extension.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
