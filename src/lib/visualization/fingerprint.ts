/**
 * Deterministic design fingerprint (Phase 07, §18).
 *
 * The fingerprint captures the design state a visualization was produced from —
 * the products, their selected colours, and the room/style context. When the
 * current design's fingerprint differs from a preview's fingerprint, the preview
 * is STALE and the UI must offer to update it instead of silently implying the
 * old preview still matches.
 *
 * Pure + dependency-free so it runs identically on the client (to detect
 * staleness) and on the server (to stamp the authoritative fingerprint onto a
 * result). Same input → same output, always.
 */

export interface FingerprintItem {
  slug: string;
  colorId?: string;
}

export interface FingerprintInput {
  roomType: string;
  primaryStyle: string;
  secondaryStyle?: string;
  items: readonly FingerprintItem[];
}

/** Build the canonical, human-readable string the hash is derived from. */
export function canonicalDesignString(input: FingerprintInput): string {
  const style = input.secondaryStyle
    ? `${input.primaryStyle}+${input.secondaryStyle}`
    : input.primaryStyle;
  // Item ORDER is part of the design (replacing a piece changes a position), so
  // it is preserved rather than sorted.
  const items = input.items
    .map((i) => `${i.slug}:${i.colorId ?? ""}`)
    .join(",");
  return `room=${input.roomType}|style=${style}|items=${items}`;
}

/** FNV-1a 32-bit hash → stable short hex. */
function fnv1a(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // Unsigned 32-bit, zero-padded hex.
  return (h >>> 0).toString(16).padStart(8, "0");
}

/**
 * Deterministic fingerprint for a design state. Versioned so a future change to
 * what the fingerprint covers can't silently collide with old previews.
 */
export function designFingerprint(input: FingerprintInput): string {
  return `df1_${fnv1a(canonicalDesignString(input))}`;
}

/** True when a shown preview no longer matches the current design. */
export function isPreviewStale(
  currentFingerprint: string,
  previewFingerprint: string | null | undefined,
): boolean {
  if (!previewFingerprint) return false;
  return currentFingerprint !== previewFingerprint;
}
