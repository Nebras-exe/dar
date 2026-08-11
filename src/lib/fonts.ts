import {
  Fraunces,
  Hanken_Grotesk,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";

/**
 * Editorial display serif for English headings — warm, characterful, and
 * high-end. Deliberately not a generic UI font.
 */
export const fontFraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

/** Refined humanist grotesque for English body copy and UI. */
export const fontHanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

/** Premium, highly readable Arabic typeface for headings and body. */
export const fontPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

/** All font variables, applied together on <html> so both languages resolve. */
export const fontVariables = [
  fontFraunces.variable,
  fontHanken.variable,
  fontPlexArabic.variable,
].join(" ");
