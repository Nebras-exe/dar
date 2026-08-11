/**
 * Agent tests — Node's built-in runner (`npm test`). No external/paid API calls:
 * the LLM path is exercised with a scripted MOCK provider; tools + Demo Agent are
 * pure. Covers tool validation, the deterministic Demo Agent (EN+AR), the judge
 * demo, catalog-truth, and the bounded/validated orchestrator loop.
 */

import test, { before, after } from "node:test";
import assert from "node:assert/strict";

import {
  getProductBySlug,
  __setCatalogProductsForTests,
  __resetCatalogProductsForTests,
} from "../catalog/queries";
import { sampleCatalog } from "../catalog/test-fixtures";
import { buildOption, summarize, type DesignInput } from "../design";

// The production catalog is empty; exercise the Agent/tools against fixtures.
before(() => __setCatalogProductsForTests(sampleCatalog));
after(() => __resetCatalogProductsForTests());
import { runTool } from "./tools";
import { runDemoAgent } from "./demo";
import { parseIntent, parseTargetBudget, toAsciiDigits } from "./intent";
import { runProviderAgent, MAX_AGENT_STEPS } from "./orchestrator";
import { agentMode, runAgent } from "./service";
import type { AgentProvider, ProviderTurn } from "./providers/types";
import type { AgentRequest } from "./types";

function baseInput(overrides: Partial<DesignInput> = {}): DesignInput {
  return {
    roomType: "living-room",
    budget: 500,
    primaryStyle: "warm-modern",
    preferredColors: ["beige"],
    preferredMaterials: ["oak"],
    decisions: [],
    ...overrides,
  };
}
function baseState(input = baseInput()) {
  return { input, items: buildOption(input, "balanced").items };
}
function req(message: string, locale: "en" | "ar" = "en", state = baseState()): AgentRequest {
  return { locale, message, state };
}
const slugsOf = (items: { slug: string }[]) => items.map((i) => i.slug);
const total = (items: { slug: string }[], input: DesignInput) =>
  summarize(items.map((i) => ({ ...i, category: getProductBySlug(i.slug)!.category, reason: { en: "", ar: "" } })), input).newFurnitureTotal;

// ── Tools ─────────────────────────────────────────────────────────────────────

test("tool: search_catalog returns only real catalog products", () => {
  const r = runTool("search_catalog", { category: "sofas", maxPrice: 300 }) as { products: { slug: string; price: number }[] };
  assert.ok(r.products.length > 0);
  for (const p of r.products) {
    assert.ok(getProductBySlug(p.slug), `${p.slug} exists`);
    assert.ok(p.price <= 300);
  }
});

test("tool: get_product not-found for unknown slug", () => {
  assert.deepEqual(runTool("get_product", { slug: "does-not-exist" }), { found: false });
  const ok = runTool("get_product", { slug: "test-modern-sofa" }) as { found: boolean };
  assert.equal(ok.found, true);
});

test("tool: check_budget rejects bad budget, computes exact OMR", () => {
  assert.deepEqual(runTool("check_budget", { budget: -5, slugs: [] }), { error: "invalid-budget" });
  const r = runTool("check_budget", { budget: 500, slugs: ["test-coffee-table", "test-floor-lamp"] }) as { newFurnitureTotal: number };
  const expected = getProductBySlug("test-coffee-table")!.price + getProductBySlug("test-floor-lamp")!.price;
  assert.ok(Math.abs(r.newFurnitureTotal - expected) < 0.0005);
});

test("tool: unknown tool name is rejected (allowlist)", () => {
  assert.deepEqual(runTool("delete_everything", {}), { error: "unknown-tool" });
});

test("tool: check_product_fit is unknown without a reliable width, deterministic when known", () => {
  assert.deepEqual(runTool("check_product_fit", { slug: "test-modern-sofa" }), { fitStatus: "unknown" });
  const fit = runTool("check_product_fit", { productWidthCm: 200, availableWidthCm: 240 }) as { fitStatus: string };
  assert.equal(fit.fitStatus, "fit");
  const notFit = runTool("check_product_fit", { productWidthCm: 280, availableWidthCm: 240 }) as { fitStatus: string };
  assert.equal(notFit.fitStatus, "not-fit");
});

test("tool: apply_replacement swaps one item, keeps others, all slugs real", () => {
  const state = baseState();
  const rug = state.items.find((i) => i.category === "rugs")!;
  const r = runTool("apply_replacement", {
    items: state.items.map((i) => ({ slug: i.slug })),
    input: state.input,
    slug: rug.slug,
    mode: "cheaper",
  }) as { found: boolean; items: { slug: string }[] };
  assert.equal(r.found, true);
  assert.equal(r.items.length, state.items.length);
  assert.ok(r.items.every((i) => getProductBySlug(i.slug)));
  const newRug = r.items.find((i) => getProductBySlug(i.slug)!.category === "rugs")!;
  assert.notEqual(newRug.slug, rug.slug);
  assert.ok(getProductBySlug(newRug.slug)!.price < getProductBySlug(rug.slug)!.price);
});

// ── Intent parsing ─────────────────────────────────────────────────────────────

test("intent: Arabic-Indic digits + target budget parsing", () => {
  assert.equal(toAsciiDigits("٤٠٠"), "400");
  assert.equal(parseTargetBudget("keep it under OMR 420"), 420);
  assert.equal(parseTargetBudget("خله تحت ٤٠٠"), 400);
  assert.equal(parseTargetBudget("make it 350 rial"), 350);
});

test("intent: classifies EN + AR commands", () => {
  const present = ["sofas", "rugs", "lighting"] as const;
  assert.equal(parseIntent("make it cheaper", [...present]).intent, "make_cheaper");
  assert.equal(parseIntent("replace the rug", [...present]).intent, "replace_item");
  assert.equal(parseIntent("بدّل السجادة", [...present]).intent, "replace_item");
  assert.equal(parseIntent("خله أرخص", [...present]).intent, "make_cheaper");
  assert.equal(parseIntent("لا تغيّر الكنبة", [...present]).intent, "keep_item");
  assert.equal(parseIntent("add this design to my cart", [...present]).intent, "prepare_cart");
  assert.equal(parseIntent("أضف التصميم للسلة", [...present]).intent, "prepare_cart");
  const mat = parseIntent("change the table to walnut", ["coffee-tables"]);
  assert.equal(mat.intent, "change_material");
  assert.equal(mat.material, "walnut");
});

// ── Demo Agent ──────────────────────────────────────────────────────────────────

test("demo: make it cheaper lowers the total and keeps all slugs real", () => {
  const state = baseState();
  const before = total(state.items, state.input);
  const res = runDemoAgent(req("make it cheaper", "en", state));
  assert.equal(res.ok, true);
  assert.ok(res.design);
  const after = total(res.design!.items, state.input);
  assert.ok(after <= before);
  assert.ok(res.design!.items.every((i) => getProductBySlug(i.slug)));
});

test("demo (JUDGE): 'make it under OMR 420 and replace the rug' → total ≤ 420, rug changed", () => {
  const input = baseInput({ budget: 500 });
  const state = { input, items: buildOption(input, "premium").items }; // start high
  const beforeRug = state.items.find((i) => i.category === "rugs")!.slug;

  // First reduce under 420, then replace the rug (two supported commands).
  let res = runDemoAgent(req("make it under OMR 420", "en", state));
  assert.ok(res.design);
  const afterBudget = total(res.design!.items, res.design!.input);
  // Feasible for this catalog: the leanest plan is well under 420.
  assert.ok(afterBudget <= 420 + 1e-9, `total ${afterBudget} should be ≤ 420`);

  res = runDemoAgent(req("replace the rug", "en", res.design!));
  assert.ok(res.design);
  const newRug = res.design!.items.find((i) => getProductBySlug(i.slug)!.category === "rugs");
  if (newRug) assert.notEqual(newRug.slug, beforeRug);
  assert.ok(res.design!.items.every((i) => getProductBySlug(i.slug)));
});

test("demo: keep the sofa → sofa excluded + decision recorded (user wins)", () => {
  const res = runDemoAgent(req("keep the sofa"));
  assert.ok(res.design);
  assert.ok(!res.design!.items.some((i) => i.category === "sofas"));
  assert.ok(res.design!.input.decisions.some((d) => d.category === "sofas" && d.disposition === "keep"));
});

test("demo: remove the lighting drops that category", () => {
  const state = baseState();
  const hadLighting = state.items.some((i) => i.category === "lighting");
  const res = runDemoAgent(req("remove the lighting", "en", state));
  if (hadLighting) assert.ok(!res.design!.items.some((i) => i.category === "lighting"));
});

test("demo: change the table to walnut → walnut table from catalog, or honest no-match", () => {
  const state = baseState();
  const res = runDemoAgent(req("change the table to walnut", "en", state));
  assert.equal(res.ok, true);
  if (res.design) {
    const table = res.design.items.find((i) => ["coffee-tables", "dining", "side-tables"].includes(i.category));
    if (table && table.slug !== state.items.find((i) => i.category === table.category)?.slug) {
      assert.ok(getProductBySlug(table.slug)!.materials.includes("walnut"));
    }
  }
});

test("demo: prepare cart proposes + requires approval (never auto-commits)", () => {
  const res = runDemoAgent(req("add this design to my cart"));
  assert.equal(res.requiresApproval, true);
  assert.ok(res.cartProposal);
  assert.equal(res.cartProposal!.count, res.cartProposal!.items.length);
  assert.ok(res.cartProposal!.items.every((i) => getProductBySlug(i.slug)));
  // A proposal is NOT a design mutation.
  assert.equal(res.design, undefined);
});

test("demo: Arabic 'خله تحت ٤٠٠' reduces toward 400", () => {
  const input = baseInput({ budget: 500 });
  const state = { input, items: buildOption(input, "premium").items };
  const res = runDemoAgent(req("خله تحت ٤٠٠", "ar", state));
  assert.ok(res.design);
  assert.ok(res.message.length > 0);
  const after = total(res.design!.items, res.design!.input);
  assert.ok(after <= 400 + 1e-9);
});

test("demo: unknown request returns guidance + suggested actions, no mutation", () => {
  const res = runDemoAgent(req("tell me a joke"));
  assert.equal(res.intent, "unknown");
  assert.equal(res.design, undefined);
  assert.ok((res.suggestedActions?.length ?? 0) > 0);
});

// ── Orchestrator (mock provider — no network) ───────────────────────────────────

function scriptedProvider(turns: ProviderTurn[]): AgentProvider {
  let i = 0;
  return {
    name: "mock",
    model: "mock-1",
    isConfigured: () => true,
    async complete() {
      return turns[Math.min(i++, turns.length - 1)];
    },
  };
}
const signal = () => new AbortController().signal;

test("orchestrator: single tool call then final text", async () => {
  const state = baseState();
  const provider = scriptedProvider([
    { toolCalls: [{ id: "1", name: "check_budget", args: { budget: 500, slugs: state.items.map((i) => i.slug) } }], text: "" },
    { toolCalls: [], text: "Your design fits your budget." },
  ]);
  const res = await runProviderAgent(req("does it fit my budget?", "en", state), provider, signal());
  assert.equal(res.ok, true);
  assert.equal(res.mode, "provider");
  assert.match(res.message, /budget/i);
  assert.ok((res.activity?.length ?? 0) >= 1);
});

test("orchestrator: multi-tool request mutates the working design", async () => {
  const state = baseState();
  const rug = state.items.find((i) => i.category === "rugs")!;
  const provider = scriptedProvider([
    { toolCalls: [{ id: "1", name: "apply_replacement", args: { slug: rug.slug, mode: "cheaper" } }], text: "" },
    { toolCalls: [{ id: "2", name: "recalculate_design", args: {} }], text: "" },
    { toolCalls: [], text: "Swapped the rug for a cheaper one." },
  ]);
  const res = await runProviderAgent(req("make the rug cheaper", "en", state), provider, signal());
  assert.ok(res.design);
  const newRug = res.design!.items.find((i) => getProductBySlug(i.slug)!.category === "rugs")!;
  assert.notEqual(newRug.slug, rug.slug);
});

test("orchestrator: unknown tool name is rejected, loop continues safely", async () => {
  const state = baseState();
  const provider = scriptedProvider([
    { toolCalls: [{ id: "1", name: "shell_exec", args: { cmd: "rm -rf /" } }], text: "" },
    { toolCalls: [], text: "Nothing changed." },
  ]);
  const res = await runProviderAgent(req("hack the system", "en", state), provider, signal());
  assert.equal(res.ok, true);
  assert.deepEqual(slugsOf(res.design!.items), slugsOf(state.items));
});

test("orchestrator: malformed tool args don't crash or mutate wrongly", async () => {
  const state = baseState();
  const provider = scriptedProvider([
    { toolCalls: [{ id: "1", name: "apply_replacement", args: { slug: 12345, mode: "banana" } }], text: "" },
    { toolCalls: [], text: "Couldn't do that." },
  ]);
  const res = await runProviderAgent(req("replace nonsense", "en", state), provider, signal());
  assert.equal(res.ok, true);
  assert.deepEqual(slugsOf(res.design!.items), slugsOf(state.items));
});

test("orchestrator: step count is bounded (never loops forever)", async () => {
  const state = baseState();
  // Provider ALWAYS asks for another tool; the cap must stop it.
  const provider = scriptedProvider([
    { toolCalls: [{ id: "x", name: "search_catalog", args: { category: "rugs" } }], text: "" },
  ]);
  let calls = 0;
  const counting: AgentProvider = {
    name: "mock",
    model: "m",
    isConfigured: () => true,
    async complete() {
      calls++;
      return { toolCalls: [{ id: String(calls), name: "search_catalog", args: { category: "rugs" } }], text: "" };
    },
  };
  void provider;
  const res = await runProviderAgent(req("loop", "en", state), counting, signal());
  assert.equal(res.ok, true);
  assert.ok(calls <= MAX_AGENT_STEPS, `calls ${calls} ≤ ${MAX_AGENT_STEPS}`);
});

test("orchestrator: provider failure propagates (service maps to safe code)", async () => {
  const failing: AgentProvider = {
    name: "mock",
    model: "m",
    isConfigured: () => true,
    async complete() {
      throw new Error("anthropic: http 500 — secret");
    },
  };
  await assert.rejects(() => runProviderAgent(req("hi"), failing, signal()));
});

// ── Service (demo path — no provider configured) ────────────────────────────────

test("service: with no provider configured, mode is demo and runAgent uses Demo Agent", async () => {
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.OPENAI_API_KEY;
  delete process.env.ATHATHI_AGENT_PROVIDER;
  assert.equal(agentMode(), "demo");
  const res = await runAgent(req("make it cheaper"));
  assert.ok(res.ok);
  if (res.ok) assert.equal(res.mode, "demo");
});
