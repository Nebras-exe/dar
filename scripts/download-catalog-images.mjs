/**
 * Catalog image downloader (offline-friendly, resumable, no paid APIs).
 *
 * Reads scripts/.import/image-manifest.json ({ url, dest }[]) produced by the
 * importer and downloads each image into the Athathi public tree. Free HTTP GETs
 * only (the reference gallery hotlinks IKEA Oman product photos). Resumable:
 * already-present files are skipped, so it can be re-run after interruptions.
 * Bounded concurrency + retry; failures are recorded, never fatal.
 *
 * Usage: node scripts/download-catalog-images.mjs [--concurrency 16] [--limit N]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const CONC = Number(args[args.indexOf("--concurrency") + 1]) || 16;
const LIMIT = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : Infinity;

const manifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts/.import/image-manifest.json"), "utf8"),
).slice(0, LIMIT);

let done = 0, skipped = 0, failed = 0;
const failures = [];

async function fetchOne(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 AthathiImporter/1.0", "Accept": "image/*" },
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
}

async function worker(items) {
  for (const { url, dest } of items) {
    const abs = path.join(ROOT, dest.replace(/^\//, "public/"));
    if (fs.existsSync(abs) && fs.statSync(abs).size > 0) { skipped++; continue; }
    try {
      const buf = await fetchOne(url);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, buf);
      done++;
    } catch (e) {
      failed++;
      failures.push({ url, dest, error: String(e.message || e) });
    }
    if ((done + skipped + failed) % 50 === 0) {
      process.stdout.write(`\r  ${done} downloaded, ${skipped} skipped, ${failed} failed / ${manifest.length}   `);
    }
  }
}

// Round-robin split across workers.
const buckets = Array.from({ length: CONC }, () => []);
manifest.forEach((m, i) => buckets[i % CONC].push(m));

console.log(`Downloading ${manifest.length} images with concurrency ${CONC}…`);
await Promise.all(buckets.map(worker));

const outDir = path.join(ROOT, "scripts/.import");
fs.writeFileSync(path.join(outDir, "download-report.json"), JSON.stringify({
  total: manifest.length, downloaded: done, skipped, failed, failures,
}, null, 2));

console.log(`\nDone: ${done} downloaded, ${skipped} skipped, ${failed} failed.`);
if (failed) console.log(`Failures logged to scripts/.import/download-report.json`);
