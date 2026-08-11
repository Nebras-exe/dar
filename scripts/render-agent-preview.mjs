/**
 * Visual-QA preview for the Phase 06 Agent panel. Runs the REAL Demo Agent over
 * a real design for a few commands and renders the resulting composer + activity
 * + approval UI as static HTML — so the Agent UX can be reviewed while the
 * browser tool is offline. No provider, no network.
 *   node --import ./scripts/register-ts-resolver.mjs scripts/render-agent-preview.mjs <out.html>
 */
import { writeFileSync } from "node:fs";
import { buildOption } from "../src/lib/design/index.ts";
import { runDemoAgent } from "../src/lib/agent/demo.ts";
import { formatOmr, getProductBySlug } from "../src/lib/catalog/index.ts";

const input = { roomType: "living-room", budget: 500, primaryStyle: "warm-modern", preferredColors: ["beige"], preferredMaterials: ["oak"], decisions: [{ category: "sofas", disposition: "keep" }] };
let state = { input, items: buildOption(input, "balanced").items };

const commands = ["make it cheaper", "replace the rug", "add this design to my cart"];
const turns = [];
for (const message of commands) {
  const res = runDemoAgent({ locale: "en", message, state });
  if (res.design) state = res.design;
  turns.push({ message, res });
}

function turnHtml({ message, res }) {
  const activity = res.activity
    .map((a) => `<li class="act">✓ ${a.text}</li>`)
    .join("");
  const budget = res.budgetSummary
    ? `<div class="bl">New total <b>${formatOmr(res.budgetSummary.newFurnitureTotal, "en")}</b>${res.budgetSummary.overBudget === 0 ? ` · Remaining <b class="ok">${formatOmr(res.budgetSummary.remaining, "en")}</b>` : ""}</div>`
    : "";
  const approval = res.requiresApproval && res.cartProposal
    ? `<div class="approve"><p>Add ${res.cartProposal.count} pieces to your cart for <b>${formatOmr(res.cartProposal.subtotal, "en")}</b>?</p><div class="btns"><span class="btn">Confirm add to cart</span><span class="ghost">Cancel</span></div></div>`
    : "";
  return `<div class="turn">
    <div class="user">🧑 ${message}</div>
    <div class="resp">
      <p class="msg">${res.message}</p>
      ${activity ? `<ul class="acts">${activity}</ul>` : ""}
      ${budget}
      ${approval}
    </div>
  </div>`;
}

const finalItems = state.items
  .map((i) => { const p = getProductBySlug(i.slug); return `<li>${p.name} — <b>${formatOmr(p.price, "en")}</b> <span class="cat">${i.category}</span></li>`; })
  .join("");

const html = `<style>
:root{--bg:#F5F1EA;--fg:#262019;--muted:#766C60;--subtle:#9A9184;--border:#E4DCCF;--surface:#FBF8F3;--elevated:#fff;--brand:#9A5B3B;--brandSoft:#F0E4DA;--accent:#5E6A53;--success:#4F6F52}
@media (prefers-color-scheme:dark){:root{--bg:#221E1A;--fg:#F3ECDE;--muted:#A99C8C;--subtle:#8A8073;--border:#3A352F;--surface:#2A2521;--elevated:#2f2a25;--brandSoft:#3a2c22}}
body{margin:0;background:var(--bg);color:var(--fg);font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.5}
.wrap{max-width:720px;margin:0 auto;padding:40px 24px}
h1{font-family:Georgia,serif;font-weight:500;font-size:1.8rem;margin:0 0 4px}
.lede{color:var(--muted);margin:0 0 22px;max-width:62ch}
.panel{border:1px solid var(--border);border-radius:16px;background:var(--surface);padding:18px}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
.head b{font-size:1rem}
.badge{font-size:.7rem;font-weight:600;border-radius:99px;padding:3px 10px;background:var(--border);color:var(--muted)}
.composer{display:flex;gap:8px;margin:12px 0}
.composer .inp{flex:1;border:1px solid var(--border);background:var(--elevated);border-radius:99px;padding:9px 16px;color:var(--subtle);font-size:.9rem}
.composer .go{background:var(--brand);color:#fbf8f3;border-radius:99px;padding:9px 16px;font-size:.85rem;font-weight:500}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}
.chip{border:1px solid var(--border);background:var(--elevated);border-radius:99px;padding:5px 12px;font-size:.8rem}
.turn{margin-top:16px;border-top:1px dashed var(--border);padding-top:14px}
.user{font-size:.85rem;color:var(--muted);margin-bottom:8px}
.resp{border:1px solid var(--border);background:var(--elevated);border-radius:12px;padding:14px}
.msg{margin:0;font-size:.9rem}
.acts{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-direction:column;gap:5px}
.act{font-size:.76rem;color:var(--muted)}
.bl{margin-top:10px;border-top:1px solid var(--border);padding-top:10px;font-size:.85rem;color:var(--muted)}
.bl b{color:var(--fg);font-variant-numeric:tabular-nums}
.bl .ok{color:var(--success)}
.approve{margin-top:12px;border:1px solid color-mix(in srgb,var(--brand) 40%,transparent);background:var(--brandSoft);border-radius:12px;padding:12px}
.approve p{margin:0 0 10px;font-size:.85rem}
.btns{display:flex;gap:8px}
.btn{background:var(--brand);color:#fbf8f3;border-radius:99px;padding:7px 14px;font-size:.8rem;font-weight:500}
.ghost{color:var(--muted);padding:7px 10px;font-size:.8rem}
h2{font-size:.9rem;margin:22px 0 6px}
.final{list-style:none;margin:0;padding:0;border:1px solid var(--border);border-radius:12px;background:var(--elevated);overflow:hidden}
.final li{padding:8px 14px;border-top:1px solid var(--border);font-size:.85rem}
.final li:first-child{border-top:none}
.final b{font-variant-numeric:tabular-nums}
.cat{color:var(--subtle);font-size:.7rem;text-transform:uppercase;letter-spacing:.05em;margin-inline-start:6px}
</style>
<div class="wrap">
  <h1>Athathi Agent — Phase 06 Visual QA</h1>
  <p class="lede">The Agent panel rendered from the REAL Demo Agent acting on a REAL design. Each turn: a concise explanation, real tool-activity lines (no JSON), the updated total, and — for the cart — an explicit approval card that never auto-commits. Every product and price resolves to the catalog. Labelled "Demo Agent" because no live provider is configured.</p>
  <div class="panel">
    <div class="head"><b>🪄 Ask Athathi</b><span class="badge">Demo Agent</span></div>
    <div style="color:var(--muted);font-size:.85rem">Adjust this design in your own words — Athathi searches real products, checks your budget, and updates your plan.</div>
    <div class="composer"><span class="inp">e.g. Make it cheaper and replace the rug</span><span class="go">Ask →</span></div>
    <div class="chips"><span class="chip">✦ Make it cheaper</span><span class="chip">✦ Keep under OMR 400</span><span class="chip">✦ Add to cart</span></div>
    ${turns.map(turnHtml).join("")}
  </div>
  <h2>Resulting design (all real catalog products)</h2>
  <ul class="final">${finalItems}</ul>
</div>`;

const out = process.argv[2] ?? "agent-preview.html";
writeFileSync(out, html);
console.log("wrote", out);
