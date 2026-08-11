/**
 * Safe, stable slug generation (Phase 08, §32).
 *
 * Slugs are machine identifiers. They must be URL-safe, stable, and unique — a
 * supplier must never overwrite another product by colliding on a slug. Arabic
 * (and any non-ASCII) names are handled safely: non-`[a-z0-9-]` runs collapse to
 * hyphens, and if nothing usable remains (e.g. a purely-Arabic name) we fall
 * back to a deterministic transliteration-free stub so a slug always exists.
 *
 * Pure + dependency-free (client + Node).
 */

/** Base slugify: lowercase ASCII words joined by single hyphens. */
export function slugify(input: string): string {
  const base = input
    .normalize("NFKD")
    // strip combining marks
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  return base;
}

/**
 * Build a slug that is guaranteed non-empty and unique against `existing`.
 * If the base is empty (e.g. an Arabic-only name) a stable stub is used. On a
 * collision, a numeric suffix is appended (`-2`, `-3`, …).
 */
export function uniqueSlug(
  desired: string,
  existing: Iterable<string>,
  fallbackSeed = "product",
): string {
  const taken = existing instanceof Set ? existing : new Set(existing);
  let base = slugify(desired);
  if (!base) {
    // Deterministic non-empty stub for non-latin names.
    base = `${slugify(fallbackSeed) || "item"}-${shortHash(desired)}`;
  }
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/** Small deterministic hash → 6 hex chars (for fallback stubs). */
function shortHash(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 6);
}
