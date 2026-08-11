/**
 * Visual-QA preview for the AI Designer result. Runs the REAL recommendation
 * engine over a sample brief and renders the resulting plan (tiers, budget
 * meter, item cards with reasons, kept furniture) as static HTML — so the
 * design result can be visually reviewed even when the browser tool is offline.
 *   node --import ./scripts/register-ts-resolver.mjs scripts/render-design-preview.mjs <out.html>
 */
import { writeFileSync } from "node:fs";
import { generateDemoDesign, getOption } from "../src/lib/design/index.ts";
import { getProductBySlug, categoryBySlug } from "../src/lib/catalog/index.ts";

const omr = (n) => "OMR " + n.toFixed(3);

const briefs = [
  {
    heading: "Living Room · Warm Modern · OMR 500 · keeping the sofa",
    input: {
      roomType: "living-room", budget: 500, primaryStyle: "warm-modern",
      preferredColors: ["beige"], preferredMaterials: ["oak"],
      decisions: [{ category: "sofas", disposition: "keep" }],
    },
  },
  {
    heading: "Bedroom · Japandi · OMR 700",
    input: {
      roomType: "bedroom", budget: 700, primaryStyle: "japandi",
      preferredColors: ["sage", "oak"], preferredMaterials: ["oak", "linen"], decisions: [],
    },
  },
  {
    heading: "Majlis · Boho · OMR 80 (very low budget)",
    input: {
      roomType: "majlis", budget: 80, primaryStyle: "boho",
      preferredColors: ["sand"], preferredMaterials: [], decisions: [],
    },
  },
];

function renderOption(rec, tier) {
  const opt = getOption(rec, tier);
  const s = opt.summary;
  const over = s.overBudget > 0;
  const pct = s.budget > 0 ? Math.min(100, Math.round((s.newFurnitureTotal / s.budget) * 100)) : 0;
  const items = opt.items.map((i) => {
    const p = getProductBySlug(i.slug);
    return `<li class="item">
      <div><strong>${p.name}</strong> <span class="cat">${i.category}</span></div>
      <div class="reason">${i.reason.en}</div>
      <div class="price">${omr(p.price)}</div>
    </li>`;
  }).join("");
  const kept = opt.kept.map((k) => {
    const c = categoryBySlug.get(k.category);
    return `<span class="kept">✓ ${c ? c.name.en : k.category} · ${omr(0)}</span>`;
  }).join("");
  return `<div class="option ${rec.recommendedTier === tier ? "rec" : ""}">
    <div class="ohead">
      <span class="tier">${tier}${rec.recommendedTier === tier ? " · recommended" : ""}</span>
      <span class="total ${over ? "over" : ""}">${omr(s.newFurnitureTotal)}</span>
    </div>
    <div class="meter"><div class="fill ${over ? "overfill" : ""}" style="width:${over ? 100 : pct}%"></div></div>
    <div class="sub">${pct}% of budget used · ${over ? "OVER by " + omr(s.overBudget) : "remaining " + omr(s.remaining)}</div>
    ${kept ? `<div class="kepts">${kept}</div>` : ""}
    <ul class="items">${items}</ul>
  </div>`;
}

const sections = briefs.map((b) => {
  const rec = generateDemoDesign(b.input);
  return `<section>
    <h2>${b.heading}</h2>
    <div class="options">${["smart-saver","balanced","premium"].map((t) => renderOption(rec, t)).join("")}</div>
  </section>`;
}).join("\n");

const html = `<style>
:root{--bg:#F5F1EA;--fg:#262019;--muted:#766C60;--subtle:#9A9184;--border:#E4DCCF;--surface:#FBF8F3;--elevated:#fff;--brand:#9A5B3B;--success:#4F6F52;--danger:#A8432F}
@media (prefers-color-scheme:dark){:root{--bg:#221E1A;--fg:#F3ECDE;--muted:#A99C8C;--subtle:#8A8073;--border:#3A352F;--surface:#2A2521;--elevated:#2f2a25}}
body{margin:0;background:var(--bg);color:var(--fg);font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.5}
.wrap{max-width:1100px;margin:0 auto;padding:40px 24px}
h1{font-family:Georgia,serif;font-weight:500;font-size:2rem;margin:0 0 4px}
.lede{color:var(--muted);margin:0 0 28px;max-width:64ch}
section{margin-bottom:36px}
h2{font-size:1.05rem;margin:0 0 14px;padding-bottom:8px;border-bottom:1px solid var(--border)}
.options{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media(max-width:800px){.options{grid-template-columns:1fr}}
.option{border:1px solid var(--border);border-radius:14px;padding:16px;background:var(--elevated)}
.option.rec{border-color:var(--brand);box-shadow:0 0 0 1px var(--brand)}
.ohead{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.tier{font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:var(--brand);font-weight:600}
.total{font-weight:700;font-variant-numeric:tabular-nums}
.total.over{color:var(--danger)}
.meter{height:8px;border-radius:99px;background:var(--border);overflow:hidden;margin:10px 0 4px}
.fill{height:100%;background:var(--brand);border-radius:99px}
.fill.overfill{background:var(--danger)}
.sub{font-size:.72rem;color:var(--subtle);font-variant-numeric:tabular-nums}
.kepts{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}
.kept{font-size:.72rem;color:var(--success);border:1px dashed var(--border);border-radius:99px;padding:2px 8px}
.items{list-style:none;margin:12px 0 0;padding:0;display:flex;flex-direction:column;gap:10px}
.item{border-top:1px solid var(--border);padding-top:10px}
.item strong{font-size:.9rem}
.cat{font-size:.66rem;color:var(--subtle);text-transform:uppercase;letter-spacing:.05em;margin-inline-start:4px}
.reason{font-size:.78rem;color:var(--success);margin:2px 0}
.price{font-size:.82rem;font-weight:600;font-variant-numeric:tabular-nums}
</style>
<div class="wrap">
  <h1>Athathi AI Designer — Phase 04 Result Preview</h1>
  <p class="lede">Real output of the deterministic recommendation engine for three sample briefs, each across the Smart Saver / Balanced / Premium tiers. Every product, price, reason and budget figure is computed from the Phase 03 catalog — no hardcoded data, no LLM. Demo Mode.</p>
  ${sections}
</div>`;

const out = process.argv[2] ?? "design-preview.html";
writeFileSync(out, html);
console.log("wrote", out);
