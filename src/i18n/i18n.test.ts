/**
 * i18n integrity tests (Phase 08.1). Guards the Arabic/RTL repair permanently:
 *   1. EN/AR key-tree parity (no missing/extra keys, no type mismatches).
 *   2. Placeholder integrity — every {token} in an EN value appears in its AR value.
 *   3. Reversed-Arabic detection — no string carries a reversed-text signature.
 *      (The corruption this phase audited: Arabic stored in reversed char order.)
 *   4. Brand consistency — the Arabic brand is always "أثاثي".
 *
 * These run under `npm test` so a future reversed/garbled string fails CI.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(readFileSync(join(here, "dictionaries/en.json"), "utf8"));
const ar = JSON.parse(readFileSync(join(here, "dictionaries/ar.json"), "utf8"));

const AR = /[؀-ۿ]/;

type Shape = Map<string, string>;
function shape(o: unknown, prefix: string, m: Shape): void {
  if (Array.isArray(o)) {
    m.set(prefix, "array");
    o.forEach((v, i) => shape(v, `${prefix}[${i}]`, m));
  } else if (o && typeof o === "object") {
    m.set(prefix, "object");
    for (const [k, v] of Object.entries(o)) shape(v, prefix ? `${prefix}.${k}` : k, m);
  } else {
    m.set(prefix, typeof o);
  }
}

function flatStrings(o: unknown, prefix: string, m: Map<string, string>): void {
  if (typeof o === "string") m.set(prefix, o);
  else if (Array.isArray(o)) o.forEach((v, i) => flatStrings(v, `${prefix}[${i}]`, m));
  else if (o && typeof o === "object")
    for (const [k, v] of Object.entries(o)) flatStrings(v, prefix ? `${prefix}.${k}` : k, m);
}

test("i18n: EN and AR have identical key trees (no missing/extra/type-mismatch)", () => {
  const em: Shape = new Map();
  const am: Shape = new Map();
  shape(en, "", em);
  shape(ar, "", am);
  const missing = [...em.keys()].filter((k) => !am.has(k));
  const extra = [...am.keys()].filter((k) => !em.has(k));
  const mismatch = [...em.keys()].filter((k) => am.has(k) && em.get(k) !== am.get(k));
  assert.deepEqual(missing, [], `keys missing in ar.json: ${missing.join(", ")}`);
  assert.deepEqual(extra, [], `extra keys in ar.json: ${extra.join(", ")}`);
  assert.deepEqual(mismatch, [], `type mismatches: ${mismatch.join(", ")}`);
});

test("i18n: placeholders are preserved in every Arabic value", () => {
  const em = new Map<string, string>();
  const am = new Map<string, string>();
  flatStrings(en, "", em);
  flatStrings(ar, "", am);
  const ph = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((x) => x[1]).sort().join(",");
  const bad: string[] = [];
  for (const [k, v] of em) {
    if (ph(v) !== ph(am.get(k) ?? "")) bad.push(k);
  }
  assert.deepEqual(bad, [], `placeholder mismatches: ${bad.join(", ")}`);
});

/** Reversed-Arabic signature (mirrors scripts/audit-arabic.mjs). */
function reversedReason(s: string): string | null {
  const KNOWN_BAD = ["يثاثأ", "كتفرغ", "لوخدلا", "ةنياعملا", "نودروملا", "ميمصت"];
  for (const bad of KNOWN_BAD) if (s.includes(bad)) return `known literal "${bad}"`;
  const words = (s.match(/[؀-ۿ]+/g) ?? []).filter((w) => w.length >= 2);
  if (words.length === 0) return null;
  const endLa = words.filter((w) => w.length >= 3 && w.endsWith("لا")).length;
  const endHamza = words.filter((w) => /[أإآ]$/.test(w)).length;
  if (words.length >= 2 && endLa >= 2 && endLa / words.length >= 0.5)
    return `${endLa}/${words.length} words end in "لا"`;
  if (words.length >= 3 && endHamza / words.length >= 0.5)
    return `${endHamza}/${words.length} words end in a leading hamza`;
  return null;
}

test("i18n: no reversed/corrupted Arabic strings", () => {
  const am = new Map<string, string>();
  flatStrings(ar, "", am);
  const flagged: string[] = [];
  for (const [k, v] of am) {
    if (!AR.test(v)) continue;
    const reason = reversedReason(v);
    if (reason) flagged.push(`${k}: "${v}" (${reason})`);
  }
  assert.deepEqual(flagged, [], `reversed Arabic:\n${flagged.join("\n")}`);
});

test("i18n: reversed-Arabic detector actually catches reversed text", () => {
  // Guards against the detector silently degrading into a no-op.
  assert.ok(reversedReason("يثاثأ ميمصت")); // reversed "تصميم أثاثي"
  assert.ok(reversedReason("تاجتنملا ةطشنلا")); // reversed "المنتجات النشطة"
  assert.equal(reversedReason("تصميم أثاثي"), null);
  assert.equal(reversedReason("المنتجات النشطة والإعدادات"), null);
});

test("i18n: the Arabic brand is consistently أثاثي", () => {
  const am = new Map<string, string>();
  flatStrings(ar, "", am);
  const wrong: string[] = [];
  for (const [k, v] of am) {
    // Flag reversed/alef-maksura brand forms; the correct form is أثاثي.
    if (/يثاثأ|أثاثى/.test(v)) wrong.push(`${k}: "${v}"`);
  }
  assert.deepEqual(wrong, [], `wrong brand form:\n${wrong.join("\n")}`);
  assert.equal(en.brand.name, "Athathi");
  assert.equal(ar.brand.name, "أثاثي");
});
