/**
 * Visual-QA preview generator. Renders the generated product art (a faithful
 * port of components/shop/product-art.tsx) for a representative product in every
 * category, using the real catalog colours/prices, into a static HTML file for
 * visual review. Run: node --import ./scripts/register-ts-resolver.mjs scripts/render-art-preview.mjs
 */
import { writeFileSync } from "node:fs";
import { products } from "../src/lib/catalog/products.ts";
import { categories, colorSwatches } from "../src/lib/catalog/taxonomy.ts";

const LINE = "#3A352F";
const CREAM = "#EFE7D9";

function seedFrom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
function shade(hex, amount) {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16),
    g = parseInt(n.slice(2, 4), 16),
    b = parseInt(n.slice(4, 6), 16);
  const t = amount < 0 ? 0 : 255,
    p = Math.abs(amount);
  const mix = (c) => Math.round((t - c) * p + c);
  const to2 = (c) => c.toString(16).padStart(2, "0");
  return `#${to2(mix(r))}${to2(mix(g))}${to2(mix(b))}`;
}
function palette(product) {
  const primary = product.colors[0]?.hex ?? "#DCCBB0";
  const secondary = product.colors[1]?.hex ?? primary;
  return {
    bg1: shade(primary, 0.72),
    bg2: shade(primary, 0.5),
    accent: shade(secondary, 0.34),
    body: primary,
    bodyDark: shade(primary, -0.22),
    body2: shade(secondary, -0.05),
    line: LINE,
    cream: CREAM,
  };
}
// Faithful port of renderScene (see product-art.tsx). Returns an SVG fragment.
function scene(category, p, seed) {
  const b = p.body,
    bd = p.bodyDark,
    wood = shade("#6B4A32", (seed % 5) / 18),
    cushion = p.body2;
  const S = {
    sofas: `<rect x="70" y="230" width="260" height="70" rx="16" fill="${bd}"/><rect x="60" y="180" width="60" height="90" rx="18" fill="${b}"/><rect x="280" y="180" width="60" height="90" rx="18" fill="${b}"/><rect x="110" y="150" width="180" height="70" rx="14" fill="${cushion}"/><rect x="118" y="212" width="164" height="40" rx="12" fill="${b}"/><line x1="95" y1="300" x2="95" y2="322" stroke="${wood}" stroke-width="6"/><line x1="305" y1="300" x2="305" y2="322" stroke="${wood}" stroke-width="6"/>`,
    chairs: `<rect x="150" y="120" width="110" height="120" rx="20" fill="${cushion}"/><rect x="135" y="150" width="30" height="95" rx="12" fill="${b}"/><rect x="245" y="150" width="30" height="95" rx="12" fill="${b}"/><rect x="150" y="235" width="110" height="40" rx="12" fill="${bd}"/><line x1="160" y1="275" x2="150" y2="322" stroke="${wood}" stroke-width="6"/><line x1="250" y1="275" x2="262" y2="322" stroke="${wood}" stroke-width="6"/>`,
    "coffee-tables": `<ellipse cx="200" cy="235" rx="120" ry="26" fill="${b}"/><rect x="82" y="230" width="236" height="16" rx="8" fill="${bd}"/><line x1="110" y1="244" x2="110" y2="315" stroke="${wood}" stroke-width="8"/><line x1="290" y1="244" x2="290" y2="315" stroke="${wood}" stroke-width="8"/>`,
    "side-tables": `<ellipse cx="200" cy="235" rx="120" ry="26" fill="${b}"/><rect x="82" y="230" width="236" height="16" rx="8" fill="${bd}"/><line x1="110" y1="244" x2="110" y2="315" stroke="${wood}" stroke-width="8"/><line x1="290" y1="244" x2="290" y2="315" stroke="${wood}" stroke-width="8"/>`,
    dining: `<rect x="70" y="180" width="260" height="20" rx="8" fill="${b}"/><line x1="95" y1="200" x2="95" y2="315" stroke="${wood}" stroke-width="9"/><line x1="305" y1="200" x2="305" y2="315" stroke="${wood}" stroke-width="9"/><rect x="150" y="120" width="45" height="70" rx="10" fill="${cushion}"/>`,
    beds: `<rect x="70" y="150" width="60" height="130" rx="12" fill="${b}"/><rect x="70" y="240" width="270" height="55" rx="12" fill="${bd}"/><rect x="90" y="205" width="240" height="45" rx="14" fill="${cushion}"/><rect x="150" y="188" width="70" height="34" rx="14" fill="${p.cream}"/><rect x="230" y="188" width="70" height="34" rx="14" fill="${p.cream}"/>`,
    storage: `<rect x="70" y="200" width="260" height="95" rx="12" fill="${b}"/><line x1="200" y1="205" x2="200" y2="290" stroke="${bd}"/><circle cx="167" cy="248" r="5" fill="${bd}"/><circle cx="233" cy="248" r="5" fill="${bd}"/>`,
    "tv-units": `<rect x="70" y="200" width="260" height="95" rx="12" fill="${b}"/><line x1="200" y1="205" x2="200" y2="290" stroke="${bd}"/><circle cx="167" cy="248" r="5" fill="${bd}"/><circle cx="233" cy="248" r="5" fill="${bd}"/>`,
    wardrobes: `<rect x="120" y="100" width="160" height="200" rx="12" fill="${b}"/><line x1="200" y1="105" x2="200" y2="295" stroke="${bd}"/><line x1="180" y1="180" x2="180" y2="215" stroke="${bd}" stroke-width="6"/><line x1="220" y1="180" x2="220" y2="215" stroke="${bd}" stroke-width="6"/>`,
    desks: `<rect x="80" y="185" width="240" height="18" rx="8" fill="${b}"/><rect x="235" y="203" width="70" height="55" rx="6" fill="${bd}"/><line x1="100" y1="203" x2="100" y2="315" stroke="${wood}" stroke-width="8"/><line x1="300" y1="258" x2="300" y2="315" stroke="${wood}" stroke-width="8"/>`,
    rugs: `<rect x="70" y="215" width="260" height="130" rx="10" fill="${b}" transform="skewX(-8)"/><rect x="95" y="235" width="210" height="90" rx="6" fill="none" stroke="${bd}" stroke-width="4" transform="skewX(-8)"/>`,
    lighting: `<path d="M160 130 L240 130 L225 185 L175 185 Z" fill="${cushion}"/><line x1="200" y1="185" x2="200" y2="305" stroke="${wood}" stroke-width="7"/><ellipse cx="200" cy="312" rx="55" ry="14" fill="${bd}"/>`,
    mirrors: `<path d="M140 300 L140 170 A60 60 0 0 1 260 170 L260 300 Z" fill="${b}"/><path d="M155 295 L155 175 A45 45 0 0 1 245 175 L245 295 Z" fill="${p.bg1}" opacity="0.85"/>`,
    decor: `<path d="M175 210 C165 250 170 285 200 295 C230 285 235 250 225 210 C220 195 205 190 200 205 C195 190 180 195 175 210 Z" fill="${b}"/><ellipse cx="200" cy="208" rx="26" ry="8" fill="${bd}"/>`,
    outdoor: `<rect x="90" y="230" width="180" height="55" rx="14" fill="${cushion}"/><path d="M255 235 L320 175 L338 190 L280 250 Z" fill="${b}"/><circle cx="330" cy="120" r="18" fill="${p.accent}" opacity="0.9"/>`,
  };
  return S[category] ?? `<rect x="120" y="180" width="160" height="120" rx="16" fill="${b}"/>`;
}
function svg(product) {
  const seed = seedFrom(product.slug + ":0");
  const p = palette(product);
  const cx = 90 + (seed % 220),
    cy = 70 + ((seed >> 3) % 90),
    cr = 70 + ((seed >> 5) % 55);
  return `<svg viewBox="0 0 400 400" width="100%">
    <defs><linearGradient id="g-${product.slug}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${p.bg1}"/><stop offset="100%" stop-color="${p.bg2}"/></linearGradient></defs>
    <rect width="400" height="400" fill="url(#g-${product.slug})"/>
    <circle cx="${cx}" cy="${cy}" r="${cr}" fill="${p.accent}" opacity="0.5"/>
    <rect x="0" y="300" width="400" height="100" fill="${shade(p.bg2, -0.06)}" opacity="0.55"/>
    <g stroke="${p.line}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${scene(product.category, p, seed)}</g>
  </svg>`;
}

const cards = categories
  .map((c) => {
    const prod = products.find((p) => p.category === c.slug);
    if (!prod) return "";
    const sw = prod.colors
      .map(
        (col) =>
          `<span style="background:${colorSwatches[col.id].hex}" title="${col.label.en}"></span>`,
      )
      .join("");
    return `<figure>
      <div class="art">${svg(prod)}</div>
      <figcaption>
        <span class="cat">${c.name.en} · ${c.name.ar}</span>
        <strong>${prod.name}</strong>
        <span class="ar">${prod.nameAr}</span>
        <div class="swatches">${sw}</div>
        <span class="price">OMR ${prod.price.toFixed(3)}</span>
      </figcaption>
    </figure>`;
  })
  .join("\n");

const html = `<style>
  :root{--bg:#F5F1EA;--fg:#262019;--muted:#766C60;--border:#E4DCCF;--surface:#FBF8F3}
  body{margin:0;background:var(--bg);color:var(--fg);font-family:ui-sans-serif,system-ui,sans-serif}
  .wrap{max-width:1200px;margin:0 auto;padding:40px 24px}
  h1{font-family:Georgia,serif;font-weight:500;font-size:2rem;margin:0 0 6px}
  p.lede{color:var(--muted);margin:0 0 32px;max-width:60ch}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:24px}
  figure{margin:0}
  .art{aspect-ratio:1;border-radius:14px;overflow:hidden;border:1px solid var(--border)}
  figcaption{display:flex;flex-direction:column;gap:3px;margin-top:10px}
  .cat{font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:#9A5B3B;font-weight:600}
  strong{font-weight:600;font-size:.95rem}
  .ar{color:var(--muted);font-size:.9rem}
  .price{font-weight:600;font-variant-numeric:tabular-nums;margin-top:2px}
  .swatches{display:flex;gap:5px;margin-top:4px}
  .swatches span{width:14px;height:14px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}
  @media (prefers-color-scheme:dark){:root{--bg:#221E1A;--fg:#F3ECDE;--muted:#A99C8C;--border:#3A352F;--surface:#2A2521}}
</style>
<div class="wrap">
  <h1>Athathi — Generated Product Art (Phase 03 visual QA)</h1>
  <p class="lede">One representative product per catalog category. Each artwork is deterministic from the product slug and tinted by the product's real colour swatches, so no two cards look alike. This is the demo stand-in until real photography flows through the same <code>ProductImage</code> seam.</p>
  <div class="grid">${cards}</div>
</div>`;

const out = process.argv[2] ?? "art-preview.html";
writeFileSync(out, html);
console.log("wrote", out, "with", categories.length, "categories");
