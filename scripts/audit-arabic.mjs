/**
 * Arabic source audit (Phase 08.1).
 *
 * Detects the class of corruption that motivated this phase: Arabic strings
 * stored in REVERSED character order (an RTL string typed/stored backwards so it
 * only "looks" right in a naive editor). It does NOT reject legitimate Arabic —
 * it looks for concrete reversed signatures, so a normal, correctly-authored
 * string passes cleanly.
 *
 * How it works (heuristics, combined — a string is flagged only on a strong
 * signal, never on the mere presence of Arabic):
 *   1. Reversed high-frequency tokens: the definite article "ال" and the brand
 *      "أثاثي" reverse to "لا"/"يثاثأ"; a run of words ENDING in "لا" is a strong
 *      reversed-text signal (correct Arabic starts words with "ال").
 *   2. Known bad literals seen in prior corruption reports.
 *   3. Trailing leading-hamza: words ending in "أ"/"إ"/"آ" across many tokens.
 *
 * Usage:  node scripts/audit-arabic.mjs [--verbose]
 * Exit 1 if any string is flagged; 0 when clean.
 */

import fs from "node:fs";
import path from "node:path";

const AR = /[؀-ۿ]/;
const VERBOSE = process.argv.includes("--verbose");

// Concrete reversed literals from prior corruption reports (exact substrings).
const KNOWN_BAD = [
  "يثاثأ", // ← أثاثي reversed (brand)
  "كتفرغ", // ← غرفتك reversed
  "لوخدلا", // ← الدخول reversed
  "ةنياعملا", // ← المعاينة reversed
  "نودروملا", // ← الموردون reversed
  "ميمصت", // ← تصميم reversed
];

/** Collect Arabic string values from a JSON dictionary (with key paths). */
function collectJsonStrings(obj, prefix, out) {
  if (typeof obj === "string") {
    if (AR.test(obj)) out.push({ key: prefix, value: obj });
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => collectJsonStrings(v, `${prefix}[${i}]`, out));
    return;
  }
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      collectJsonStrings(v, prefix ? `${prefix}.${k}` : k, out);
    }
  }
}

/** Arabic word tokens in a string. */
function arabicWords(s) {
  return (s.match(/[؀-ۿ]+/g) ?? []).filter((w) => w.length >= 2);
}

/** Heuristic: is this string likely reversed Arabic? Returns a reason or null. */
function reversedReason(s) {
  for (const bad of KNOWN_BAD) {
    if (s.includes(bad)) return `contains known-reversed literal "${bad}"`;
  }
  const words = arabicWords(s);
  if (words.length === 0) return null;

  // Words ending in "لا" (reversed "ال" definite article at the front).
  const endLa = words.filter((w) => w.length >= 3 && w.endsWith("لا")).length;
  // Words ending in a leading-hamza letter (these normally START words).
  const endHamza = words.filter((w) => /[أإآ]$/.test(w)).length;

  // Require a clear majority signal so ordinary strings never trip.
  if (words.length >= 2 && endLa >= 2 && endLa / words.length >= 0.5) {
    return `${endLa}/${words.length} words end in "لا" (reversed "ال")`;
  }
  if (words.length >= 3 && endHamza / words.length >= 0.5) {
    return `${endHamza}/${words.length} words end in a leading hamza`;
  }
  return null;
}

// ── Walk the tree ─────────────────────────────────────────────────────────────
const flagged = [];
let totalArabic = 0;

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git"].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    // Skip test files: they deliberately embed reversed fixtures to prove the
    // detector works (see src/i18n/i18n.test.ts). We audit real UI + dictionaries.
    else if (/\.test\.tsx?$/.test(e.name)) continue;
    else if (/\.(tsx?|json)$/.test(e.name)) auditFile(p);
  }
}

function auditFile(file) {
  const rel = file.replace(/\\/g, "/");
  const text = fs.readFileSync(file, "utf8");
  if (!AR.test(text)) return;

  if (file.endsWith(".json")) {
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return;
    }
    const strings = [];
    collectJsonStrings(json, "", strings);
    for (const { key, value } of strings) {
      totalArabic++;
      const reason = reversedReason(value);
      if (reason) flagged.push({ file: rel, key, value, reason });
    }
  } else {
    // Source files: scan Arabic string literals line by line.
    text.split(/\r?\n/).forEach((line, i) => {
      const matches = line.match(/["'`]([^"'`]*[؀-ۿ][^"'`]*)["'`]/g) ?? [];
      for (const m of matches) {
        const value = m.slice(1, -1);
        totalArabic++;
        const reason = reversedReason(value);
        if (reason) flagged.push({ file: `${rel}:${i + 1}`, key: "", value, reason });
      }
    });
  }
}

walk("src");

console.log(`Arabic strings scanned: ${totalArabic}`);
if (flagged.length === 0) {
  console.log("✓ No reversed/corrupted Arabic detected.");
  process.exit(0);
}
console.log(`✗ ${flagged.length} suspicious string(s):\n`);
for (const f of flagged) {
  console.log(`  ${f.file}${f.key ? ` [${f.key}]` : ""}`);
  console.log(`    "${f.value}"`);
  console.log(`    → ${f.reason}\n`);
}
if (VERBOSE) console.log("(heuristic — inspect each in context before editing)");
process.exit(1);
