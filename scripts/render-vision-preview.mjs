/**
 * Visual-QA preview for the Phase 05 room-analysis review UI. Runs the REAL demo
 * provider output through the REAL validator, then renders the analysis-review
 * card (room / style / palette / furniture with confidence pills + keep/replace)
 * as static HTML — so the vision UI can be visually reviewed while the browser
 * tool is offline.
 *   node --import ./scripts/register-ts-resolver.mjs scripts/render-vision-preview.mjs <out.html>
 */
import { writeFileSync } from "node:fs";
import { demoProvider } from "../src/lib/vision/providers/demo.ts";
import { parseRoomAnalysis } from "../src/lib/vision/schema.ts";
import { confidenceBand } from "../src/lib/vision/types.ts";
import { colorSwatches, categoryBySlug, styleLabels, label } from "../src/lib/catalog/index.ts";

const raw = await demoProvider.analyze();
const parsed = parseRoomAnalysis(raw, { source: "demo", provider: "demo", model: "demo-sample" });
const a = parsed.analysis;

const band = (c) => ({ high: "High confidence", medium: "Medium confidence", low: "Low confidence" }[confidenceBand(c)]);
const roomLabel = (rt) => rt.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

function pill(c) {
  const b = confidenceBand(c);
  return `<span class="pill ${b}">${band(c)}</span>`;
}

const paletteHtml = a.palette
  .map((c) => {
    const hex = c.mappedColorId ? colorSwatches[c.mappedColorId].hex : "#cabfae";
    const name = c.mappedColorId ? label(colorSwatches[c.mappedColorId].label, "en") : c.raw;
    return `<span class="chip"><span class="sw" style="background:${hex}"></span>${name}</span>`;
  })
  .join("");

const furnitureHtml = a.existingFurniture
  .filter((f) => f.category)
  .map((f) => {
    const cat = categoryBySlug.get(f.category);
    const swatch = f.approximateColorId
      ? `<span class="sw sm" style="background:${colorSwatches[f.approximateColorId].hex}"></span>${label(colorSwatches[f.approximateColorId].label, "en")}`
      : "";
    const seg = ["keep", "replace", "unsure"]
      .map(
        (d) =>
          `<span class="seg ${d === f.suggestion ? (d === "keep" ? "on keep" : "on") : ""}">${d[0].toUpperCase() + d.slice(1)}</span>`,
      )
      .join("");
    return `<li class="fitem">
      <div><strong>${cat ? label(cat.name, "en") : f.rawLabel}</strong> ${pill(f.confidence)}
        <div class="fmeta">${swatch} · AI suggestion: ${f.suggestion}</div>
      </div>
      <div class="segwrap">${seg}</div>
    </li>`;
  })
  .join("");

const featuresHtml = a.architecturalFeatures.map((f) => `<span class="feat">${f.replace(/-/g, " ")}</span>`).join("");

const html = `<style>
:root{--bg:#F5F1EA;--fg:#262019;--muted:#766C60;--subtle:#9A9184;--border:#E4DCCF;--surface:#FBF8F3;--elevated:#fff;--brand:#9A5B3B;--brandSoft:#F0E4DA;--accent:#5E6A53;--success:#4F6F52;--warning:#A9792D}
@media (prefers-color-scheme:dark){:root{--bg:#221E1A;--fg:#F3ECDE;--muted:#A99C8C;--subtle:#8A8073;--border:#3A352F;--surface:#2A2521;--elevated:#2f2a25;--brandSoft:#3a2c22}}
body{margin:0;background:var(--bg);color:var(--fg);font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.5}
.wrap{max-width:760px;margin:0 auto;padding:40px 24px}
h1{font-family:Georgia,serif;font-weight:500;font-size:1.8rem;margin:0 0 4px}
.lede{color:var(--muted);margin:0 0 24px;max-width:60ch}
.card{border:1px solid var(--border);border-radius:16px;background:var(--surface);padding:20px}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap}
.badge{font-size:.7rem;font-weight:600;border-radius:99px;padding:3px 10px;background:#f3e9d4;color:var(--warning)}
.notice{margin-top:12px;border:1px solid var(--border);background:var(--elevated);border-radius:10px;padding:10px 14px;font-size:.78rem;color:var(--muted)}
dl{margin:16px 0 0;display:flex;flex-direction:column;gap:14px}
.row{display:flex;gap:16px;align-items:baseline}
dt{width:110px;flex:0 0 auto;font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:var(--subtle)}
.val{font-size:.9rem;font-weight:500}
.pill{display:inline-block;font-size:.68rem;font-weight:600;border-radius:99px;padding:1px 8px;border:1px solid;margin-inline-start:6px}
.pill.high{color:var(--success);border-color:color-mix(in srgb,var(--success) 40%,transparent)}
.pill.medium{color:var(--warning);border-color:color-mix(in srgb,var(--warning) 50%,transparent)}
.pill.low{color:var(--muted);border-color:var(--border)}
.chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--border);background:var(--elevated);border-radius:99px;padding:3px 10px 3px 6px;font-size:.76rem;margin:0 6px 6px 0}
.sw{width:15px;height:15px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}
.sw.sm{width:11px;height:11px;vertical-align:middle;margin-inline-end:4px;display:inline-block}
.feat{display:inline-block;border:1px solid var(--border);border-radius:99px;padding:3px 10px;font-size:.72rem;color:var(--muted);margin:0 6px 6px 0}
.fl{margin:8px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px}
.fitem{display:flex;justify-content:space-between;gap:12px;align-items:center;border:1px solid var(--border);background:var(--elevated);border-radius:10px;padding:10px 12px;flex-wrap:wrap}
.fmeta{font-size:.72rem;color:var(--muted);margin-top:2px}
.segwrap{display:inline-flex;border:1px solid var(--border);border-radius:99px;padding:2px;background:var(--surface)}
.seg{font-size:.72rem;font-weight:500;color:var(--muted);border-radius:99px;padding:3px 11px}
.seg.on{background:var(--fg);color:var(--bg)}
.seg.on.keep{background:var(--success);color:#fff}
.dim{margin-top:14px;font-size:.72rem;color:var(--subtle)}
.actions{margin-top:16px;border-top:1px solid var(--border);padding-top:14px;display:flex;gap:10px;align-items:center}
.btn{background:var(--brand);color:#fbf8f3;border:none;border-radius:99px;padding:9px 18px;font-size:.85rem;font-weight:500}
.ghost{color:var(--muted);font-size:.85rem}
h2{font-size:.82rem;margin:18px 0 6px}
</style>
<div class="wrap">
  <h1>Athathi — Room Analysis Review (Phase 05 visual QA)</h1>
  <p class="lede">The analysis-review UI rendered from the REAL demo-provider output passed through the REAL validator. Confidence is shown as labelled bands (never colour-only or raw decimals); keep/replace is an editable suggestion; dimensions are honestly marked unavailable. This is the fallback shown when no Vision provider is configured — clearly badged as a sample.</p>
  <div class="card">
    <div class="head">
      <div>
        <strong style="font-size:.95rem">Here's what we found</strong>
        <div style="color:var(--muted);font-size:.85rem;margin-top:2px">A starting point from your photo — change anything before continuing.</div>
      </div>
      <span class="badge">Sample · Demo Mode</span>
    </div>
    <div class="notice">This is a sample analysis to demonstrate the flow — it was not generated from your photo.</div>
    <dl>
      <div class="row"><dt>Room</dt><dd class="val">${roomLabel(a.roomType)} ${pill(a.roomTypeConfidence)}</dd></div>
      <div class="row"><dt>Style</dt><dd class="val">${[a.style.primary, a.style.secondary].filter(Boolean).map((s) => label(styleLabels[s], "en")).join(" · ")} ${pill(a.style.confidence)}</dd></div>
      <div class="row"><dt>Palette</dt><dd>${paletteHtml}</dd></div>
      <div class="row"><dt>Room context</dt><dd>${featuresHtml}</dd></div>
    </dl>
    <h2>Existing furniture</h2>
    <ul class="fl">${furnitureHtml}</ul>
    <p class="dim">Dimensions can't be reliably measured from a single photo. You can add them manually in a later step.</p>
    <div class="actions"><button class="btn">Use these in my design</button><span class="ghost">Analyse again</span></div>
  </div>
</div>`;

const out = process.argv[2] ?? "vision-preview.html";
writeFileSync(out, html);
console.log("wrote", out);
