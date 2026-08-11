/**
 * Deterministic Agent tools + the allowlisted registry.
 *
 * These are thin, typed wrappers over the Phase 03 catalog and Phase 04 design
 * engine — the ONLY things that touch product data, money, and design state.
 * The model (or Demo Agent) may only call registered tools by name, with
 * validated arguments; a tool never invents products, prices, or dimensions.
 * Money uses the exact 3-decimal OMR helpers — never model arithmetic.
 */

import {
  computeSubtotal,
  filterProducts,
  getProductBySlug,
  roundOmr,
  sortProducts,
  type Product,
  type SortKey,
} from "@/lib/catalog";
import {
  buildOption,
  buildReason,
  findReplacements,
  summarize,
  type BudgetSummary,
  type DesignInput,
  type DesignItem,
  type DesignOption,
  type DesignTier,
  type ReplacementMode,
} from "@/lib/design";
import {
  availability,
  categories,
  colors,
  materials,
  num,
  replacementMode,
  styles,
  validBudget,
  validCategory,
  validSlug,
} from "./validation";
import type { CartProposal } from "./types";
import { demoSuppliers } from "@/lib/repository";
import {
  budgetPosition,
  matchSuppliers,
  recommendQuote,
  sortQuotes,
  validateSpec,
  type Quote,
  type QuoteSort,
} from "@/lib/rfq";
import { buildCartDraft } from "@/lib/orders";
import { isPaid, AGENT_CAN_PAY, type PaymentStatus } from "@/lib/payments";
import { paymentMode } from "@/lib/payments/providers";
import { AGENT_CAN_MANAGE_FULFILLMENT, type FulfillmentStatus } from "@/lib/fulfillment";
import { AGENT_CAN_MANAGE_MANUFACTURING, type ManufacturingStatus } from "@/lib/manufacturing";

/** Compact product projection returned to the Agent (never the whole record). */
export interface ToolProduct {
  slug: string;
  name: string;
  price: number;
  category: string;
  styleTags: string[];
  colors: string[];
  materials: string[];
  widthCm: number;
  stockStatus: string;
}

function project(p: Product): ToolProduct {
  return {
    slug: p.slug,
    name: p.name,
    price: p.price,
    category: p.category,
    styleTags: [...p.styleTags],
    colors: p.colors.map((c) => c.id),
    materials: [...p.materials],
    widthCm: p.dimensions.widthCm,
    stockStatus: p.stockStatus,
  };
}

/** A tool: validates its own args and returns a JSON-serialisable result. */
export interface AgentTool {
  name: string;
  description: string;
  run: (args: Record<string, unknown>) => unknown;
}

// ── search_catalog ────────────────────────────────────────────────────────────
function searchCatalog(args: Record<string, unknown>) {
  const limit = Math.min(12, Math.max(1, num(args.limit) ?? 6));
  const filtered = filterProducts({
    categories: categories(args.category ?? args.categories),
    styles: styles(args.styles ?? args.style),
    colors: colors(args.colors ?? args.color),
    materials: materials(args.materials ?? args.material),
    availability: availability(args.availability),
    minPrice: num(args.minPrice),
    maxPrice: num(args.maxPrice),
    maxWidthCm: num(args.maxWidthCm),
    query: typeof args.query === "string" ? args.query : undefined,
  });
  const sort: SortKey =
    args.sort === "price-desc" ? "price-desc" : "price-asc";
  const products = sortProducts(filtered, sort).slice(0, limit).map(project);
  return { count: products.length, products };
}

// ── get_product ───────────────────────────────────────────────────────────────
function getProduct(args: Record<string, unknown>) {
  const slug = validSlug(args.slug ?? args.productSlug);
  if (!slug) return { found: false as const };
  return { found: true as const, product: project(getProductBySlug(slug)!) };
}

// ── check_budget ──────────────────────────────────────────────────────────────
function checkBudget(args: Record<string, unknown>): BudgetSummary | { error: string } {
  const budget = validBudget(args.budget);
  if (budget === undefined) return { error: "invalid-budget" };
  const slugs = Array.isArray(args.slugs) ? args.slugs : [];
  const items = slugs
    .map((s) => (typeof s === "string" ? getProductBySlug(s) : undefined))
    .filter((p): p is Product => Boolean(p))
    .map((p) => ({ price: p.price, quantity: 1 }));
  const total = computeSubtotal(items);
  const keptCount = num(args.keptCount) ?? 0;
  return {
    budget,
    newFurnitureTotal: total,
    remaining: roundOmr(Math.max(0, budget - total)),
    overBudget: roundOmr(Math.max(0, total - budget)),
    keptCount,
    itemCount: items.length,
  };
}

// ── build_design (reuse Phase 04 engine) ──────────────────────────────────────
function buildDesign(args: Record<string, unknown>): DesignOption | { error: string } {
  const input = args.input as DesignInput | undefined;
  if (!input || validBudget(input.budget) === undefined || !input.roomType || !input.primaryStyle) {
    return { error: "invalid-input" };
  }
  const tier: DesignTier =
    args.tier === "smart-saver" || args.tier === "premium" ? args.tier : "balanced";
  return buildOption(input, tier);
}

// ── find_replacement (reuse Phase 04 logic + optional constraints) ────────────
function findReplacement(args: Record<string, unknown>) {
  const slug = validSlug(args.slug ?? args.productSlug);
  const mode: ReplacementMode = replacementMode(args.mode) ?? "similar";
  if (!slug) return { found: false as const };
  const input = args.input as DesignInput | undefined;
  if (!input) return { found: false as const };
  const exclude = Array.isArray(args.exclude)
    ? args.exclude.filter((x): x is string => typeof x === "string")
    : [];

  let candidates = findReplacements(slug, mode, input, exclude);

  // Optional hard constraints (colour / material / max price).
  const wantColors = colors(args.colors ?? args.color);
  const wantMaterials = materials(args.materials ?? args.material);
  const maxPrice = num(args.maxPrice);
  if (wantColors.length)
    candidates = candidates.filter((p) => p.colors.some((c) => wantColors.includes(c.id)));
  if (wantMaterials.length)
    candidates = candidates.filter((p) => p.materials.some((m) => wantMaterials.includes(m)));
  if (maxPrice !== undefined) candidates = candidates.filter((p) => p.price <= maxPrice);

  const product = candidates[0];
  return product ? { found: true as const, product: project(product) } : { found: false as const };
}

// ── remove_item (pure list op) ────────────────────────────────────────────────
function removeItem(args: Record<string, unknown>) {
  const items = normItems(args.items);
  const category = validCategory(args.category);
  const slug = typeof args.slug === "string" ? args.slug : undefined;
  const next = items.filter((i) =>
    category ? i.category !== category : slug ? i.slug !== slug : true,
  );
  return { items: next, removed: items.length - next.length };
}

// ── apply_replacement (design-mutating: swaps one item in the list) ───────────
function applyReplacement(args: Record<string, unknown>) {
  const items = normItems(args.items);
  const input = args.input as DesignInput | undefined;
  const slug = validSlug(args.slug ?? args.productSlug);
  const mode: ReplacementMode = replacementMode(args.mode) ?? "similar";
  if (!input || !slug) return { found: false as const, items };
  const target = items.find((i) => i.slug === slug);
  if (!target) return { found: false as const, items };

  const others = items.filter((i) => i.slug !== slug).map((i) => i.slug);
  let candidates = findReplacements(slug, mode, input, others);
  const wantColors = colors(args.colors ?? args.color);
  const wantMaterials = materials(args.materials ?? args.material);
  const maxPrice = num(args.maxPrice);
  if (wantColors.length) candidates = candidates.filter((p) => p.colors.some((c) => wantColors.includes(c.id)));
  if (wantMaterials.length) candidates = candidates.filter((p) => p.materials.some((m) => wantMaterials.includes(m)));
  if (maxPrice !== undefined) candidates = candidates.filter((p) => p.price <= maxPrice);

  const replacement = candidates[0];
  if (!replacement) return { found: false as const, items };
  const next = items.map((i) =>
    i.slug === slug
      ? { slug: replacement.slug, category: replacement.category, colorId: replacement.colors[0]?.id, reason: buildReason(replacement, input) }
      : i,
  );
  return { found: true as const, items: next, replacedWith: project(replacement) };
}

// ── recalculate_design ────────────────────────────────────────────────────────
function recalculateDesign(args: Record<string, unknown>): BudgetSummary | { error: string } {
  const input = args.input as DesignInput | undefined;
  if (!input || validBudget(input.budget) === undefined) return { error: "invalid-input" };
  return summarize(normItems(args.items), input);
}

// ── check_product_fit (honest: unknown without reliable dimensions) ───────────
function checkProductFit(args: Record<string, unknown>) {
  const availableWidthCm = num(args.availableWidthCm);
  let productWidthCm = num(args.productWidthCm);
  const slug = validSlug(args.slug ?? args.productSlug);
  if (productWidthCm === undefined && slug) {
    productWidthCm = getProductBySlug(slug)!.dimensions.widthCm;
  }
  // Room scale is never inferred from a photo (Phase 05): without a reliable
  // available width supplied by the user, fit is honestly unknown.
  if (availableWidthCm === undefined || productWidthCm === undefined) {
    return { fitStatus: "unknown" as const };
  }
  return {
    fitStatus: (productWidthCm <= availableWidthCm ? "fit" : "not-fit") as "fit" | "not-fit",
    availableWidthCm,
    productWidthCm,
  };
}

// ── prepare_cart (proposal only — never commits) ──────────────────────────────
function prepareCart(args: Record<string, unknown>): CartProposal {
  // normItems already drops slugs that don't resolve to catalog products.
  const items = normItems(args.items);
  const subtotal = computeSubtotal(
    items.map((i) => ({ price: getProductBySlug(i.slug)!.price, quantity: 1 })),
  );
  return {
    items: items.map((i) => ({ slug: i.slug, colorId: i.colorId, quantity: 1 })),
    subtotal,
    count: items.length,
  };
}

// ── Phase 10A: summarize_checkout (deterministic; never confirms an order) ────
/**
 * Summarize the current cart as a checkout: real products grouped by supplier,
 * with per-supplier subtotals and an order total (exact OMR, computed in code).
 * The Agent may summarize/prepare checkout but MUST NOT confirm — confirmation is
 * always an explicit user action in the UI (§23).
 */
function summarizeCheckout(args: Record<string, unknown>) {
  const items = normItems(args.items);
  const draft = buildCartDraft(items.map((i) => ({ slug: i.slug, colorId: i.colorId, quantity: 1 })));
  return {
    supplierCount: draft.totals.supplierCount,
    itemCount: draft.totals.itemCount,
    grandTotal: draft.totals.grandTotal,
    groups: draft.groups.map((g) => ({
      supplier: g.supplierName,
      itemCount: g.items.length,
      subtotal: g.groupTotal,
    })),
    requiresApproval: true as const,
  };
}

// ── Phase 10B: summarize_payment (READ-ONLY; the Agent never pays) ────────────
/**
 * Report the payment picture for an order the customer is looking at. The Agent
 * is strictly READ-ONLY on payments (§9/§22): it may explain the mode and the
 * current status, but it can NEVER create an intent, pay, verify, complete, or
 * change a payment method — those are explicit user actions in the UI. This tool
 * takes an optional `status` (the client's own payment status for the order) and
 * echoes it safely; it never touches money and returns no secret/provider data.
 */
const PAYMENT_STATUSES: readonly PaymentStatus[] = [
  "not_started", "pending", "requires_action", "authorized",
  "paid", "failed", "cancelled", "expired",
];
function summarizePayment(args: Record<string, unknown>) {
  const raw = typeof args.status === "string" ? (args.status as PaymentStatus) : "not_started";
  const status: PaymentStatus = PAYMENT_STATUSES.includes(raw) ? raw : "not_started";
  return {
    mode: paymentMode(),          // "demo" until a certified gateway is configured
    status,
    isPaid: isPaid(status),
    agentCanPay: AGENT_CAN_PAY,   // always false — the Agent cannot pay or verify
    note: "read-only",
  };
}

// ── Phase 11A: summarize_fulfillment (READ-ONLY; the Agent never manages) ─────
/**
 * Summarize an order's per-supplier fulfillment progress and explain the next
 * step. The Agent is strictly READ-ONLY on fulfillment (§25): it may summarize
 * and explain, but it can NEVER accept, decline, mark preparing, or mark ready —
 * those are the supplier's explicit actions. This takes the client's own
 * fulfillment statuses (one per supplier group) and echoes a safe summary.
 */
const FULFILLMENT_STATUSES: readonly FulfillmentStatus[] = [
  "awaiting_supplier", "accepted", "preparing", "ready_for_next_stage", "declined", "cancelled",
];
function summarizeFulfillmentTool(args: Record<string, unknown>) {
  const raw = Array.isArray(args.statuses) ? args.statuses : (args.status !== undefined ? [args.status] : []);
  const statuses = raw.filter((s): s is FulfillmentStatus =>
    typeof s === "string" && (FULFILLMENT_STATUSES as readonly string[]).includes(s));
  const counts = { awaiting: 0, accepted: 0, preparing: 0, ready: 0, declined: 0, cancelled: 0 };
  for (const s of statuses) {
    if (s === "awaiting_supplier") counts.awaiting++;
    else if (s === "accepted") counts.accepted++;
    else if (s === "preparing") counts.preparing++;
    else if (s === "ready_for_next_stage") counts.ready++;
    else if (s === "declined") counts.declined++;
    else if (s === "cancelled") counts.cancelled++;
  }
  const total = statuses.length;
  const allReady = total > 0 && counts.ready === total;
  const nextStep =
    total === 0 ? "no-fulfillment-yet"
    : allReady ? "ready-for-next-stage"
    : counts.awaiting > 0 ? "awaiting-supplier"
    : counts.preparing > 0 ? "preparing"
    : counts.accepted > 0 ? "accepted"
    : counts.declined > 0 ? "some-declined"
    : "in-progress";
  return {
    total, counts, allReady, nextStep,
    agentCanManage: AGENT_CAN_MANAGE_FULFILLMENT, // always false — read-only
    note: "read-only",
  };
}

// ── Phase 11B: summarize_manufacturing (READ-ONLY; the Agent never manages) ───
/**
 * Summarize a custom order's manufacturing/QC progress and explain the next step,
 * in customer-safe terms. The Agent is strictly READ-ONLY on manufacturing (§23):
 * it may summarize (e.g. "your custom sofa has completed manufacturing and is
 * undergoing quality review"), but it can NEVER start/complete manufacturing, pass
 * or fail QC, create a QC result, or mark ready for delivery — those are the
 * supplier's explicit actions. Takes the client's own manufacturing statuses.
 */
const MANUFACTURING_STATUSES: readonly ManufacturingStatus[] = [
  "not_started", "manufacturing", "manufacturing_completed", "quality_check",
  "qc_passed", "qc_failed", "rework", "ready_for_delivery",
];
function summarizeManufacturingTool(args: Record<string, unknown>) {
  const raw = Array.isArray(args.statuses) ? args.statuses : (args.status !== undefined ? [args.status] : []);
  const statuses = raw.filter((s): s is ManufacturingStatus =>
    typeof s === "string" && (MANUFACTURING_STATUSES as readonly string[]).includes(s));
  const counts = { notStarted: 0, inProduction: 0, inQualityReview: 0, readyForDelivery: 0, completed: 0 };
  for (const s of statuses) {
    if (s === "not_started") counts.notStarted++;
    else if (s === "manufacturing" || s === "rework") counts.inProduction++;
    else if (s === "quality_check" || s === "qc_failed") counts.inQualityReview++;
    else if (s === "ready_for_delivery") counts.readyForDelivery++;
    else if (s === "manufacturing_completed" || s === "qc_passed") counts.completed++;
  }
  const total = statuses.length;
  const allReady = total > 0 && counts.readyForDelivery === total;
  // Customer-safe next-step hint — never exposes "failed"/"rework" (calm wording).
  const nextStep =
    total === 0 ? "no-custom-manufacturing"
    : allReady ? "ready-for-delivery"
    : counts.inQualityReview > 0 ? "quality-review-in-progress"
    : counts.inProduction > 0 ? "in-production"
    : counts.notStarted > 0 ? "manufacturing-to-begin"
    : "in-progress";
  return {
    total, counts, allReady, nextStep,
    agentCanManage: AGENT_CAN_MANAGE_MANUFACTURING, // always false — read-only
    note: "read-only",
  };
}

// ── Phase 09 RFQ tools (deterministic; never invent quotes/suppliers/prices) ──

/** create_custom_spec — validate a proposed custom-furniture spec (user still reviews). */
function createCustomSpec(args: Record<string, unknown>) {
  const parsed = validateSpec(args.spec ?? args);
  if (!parsed.ok) return { ok: false as const, errors: parsed.errors };
  return { ok: true as const, spec: parsed.value };
}

/** find_custom_suppliers — eligible suppliers for a spec, with transparent reasons. */
function findCustomSuppliers(args: Record<string, unknown>) {
  const parsed = validateSpec(args.spec ?? args);
  if (!parsed.ok) return { count: 0, suppliers: [] as unknown[] };
  const matches = matchSuppliers(demoSuppliers, parsed.value);
  return {
    count: matches.length,
    suppliers: matches.map((m) => ({
      supplierId: m.supplier.id,
      name: m.supplier.name,
      reasons: m.reasons,
    })),
  };
}

/** list_quotes — echo a set of quotes (from the client/DB) with budget position. */
function listQuotes(args: Record<string, unknown>) {
  const quotes = normQuotes(args.quotes);
  const budget = validBudget(args.budget);
  return {
    count: quotes.length,
    quotes: quotes.map((q) => ({
      id: q.id,
      supplierId: q.supplierId,
      total: q.total,
      manufacturingDays: q.manufacturingDays,
      budget: budgetPosition(q.total, budget),
    })),
  };
}

/** compare_quotes — deterministic sort of quotes by a chosen key. */
function compareQuotes(args: Record<string, unknown>) {
  const quotes = normQuotes(args.quotes);
  const budget = validBudget(args.budget);
  const sort: QuoteSort =
    args.sort === "lowest-price" || args.sort === "fastest" || args.sort === "within-budget"
      ? args.sort
      : "recommended";
  return { order: sortQuotes(quotes, sort, budget).map((q) => q.id) };
}

/** recommend_quote — a transparent "best value" pick with reasons (no opaque score). */
function recommendQuoteTool(args: Record<string, unknown>) {
  const quotes = normQuotes(args.quotes);
  const budget = validBudget(args.budget);
  const rec = recommendQuote(quotes, budget);
  return rec ?? { quoteId: null, reasons: [] };
}

/** Normalise a quotes argument, keeping only well-formed numeric quotes. */
function normQuotes(v: unknown): Quote[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((raw) => {
      const o = (raw ?? {}) as Record<string, unknown>;
      const total = num(o.total);
      const days = num(o.manufacturingDays);
      if (typeof o.id !== "string" || total === undefined || days === undefined) return null;
      return {
        id: o.id,
        requestId: typeof o.requestId === "string" ? o.requestId : "",
        supplierId: typeof o.supplierId === "string" ? o.supplierId : "",
        basePrice: num(o.basePrice) ?? total,
        deliveryFee: num(o.deliveryFee) ?? 0,
        installationFee: num(o.installationFee) ?? 0,
        total,
        currency: "OMR" as const,
        manufacturingDays: days,
        warrantyText: "",
        notes: "",
        status: o.status === "accepted" ? "accepted" : "submitted",
        isDemo: true,
        validUntil: 0,
        createdAt: 0,
      } as Quote;
    })
    .filter((x): x is Quote => x !== null);
}

/** Normalise an items argument to `{slug, category, colorId}[]`, dropping unknowns. */
function normItems(v: unknown): DesignItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((raw) => {
      const o = (raw ?? {}) as Record<string, unknown>;
      const slug = typeof o.slug === "string" ? o.slug : "";
      const p = slug ? getProductBySlug(slug) : undefined;
      if (!p) return null;
      return {
        slug,
        category: p.category,
        colorId: p.colors[0]?.id,
        reason: { en: "", ar: "" },
      } as DesignItem;
    })
    .filter((x): x is DesignItem => x !== null);
}

// ── Registry (allowlist) ──────────────────────────────────────────────────────

export const toolRegistry: Record<string, AgentTool> = {
  search_catalog: {
    name: "search_catalog",
    description: "Search the real Athathi catalog by category, price, style, colour, material.",
    run: searchCatalog,
  },
  get_product: {
    name: "get_product",
    description: "Look up one catalog product by slug.",
    run: getProduct,
  },
  check_budget: {
    name: "check_budget",
    description: "Compute subtotal/remaining/over-budget for a set of product slugs (exact OMR).",
    run: checkBudget,
  },
  build_design: {
    name: "build_design",
    description: "Ask the deterministic design engine for a budget-aware design option.",
    run: buildDesign,
  },
  find_replacement: {
    name: "find_replacement",
    description: "Find a catalog replacement for a product (cheaper/similar/upgrade) with optional constraints.",
    run: findReplacement,
  },
  apply_replacement: {
    name: "apply_replacement",
    description: "Swap one item in the current design for a catalog replacement (cheaper/similar/upgrade + optional colour/material/maxPrice). Returns the updated item list.",
    run: applyReplacement,
  },
  remove_item: {
    name: "remove_item",
    description: "Remove an item (by category or slug) from a design item list.",
    run: removeItem,
  },
  recalculate_design: {
    name: "recalculate_design",
    description: "Recompute the budget summary for a design item list.",
    run: recalculateDesign,
  },
  check_product_fit: {
    name: "check_product_fit",
    description: "Deterministic width fit check; returns 'unknown' when no reliable width is supplied.",
    run: checkProductFit,
  },
  prepare_cart: {
    name: "prepare_cart",
    description: "Prepare a cart proposal (does not commit; requires user approval).",
    run: prepareCart,
  },
  summarize_checkout: {
    name: "summarize_checkout",
    description: "Summarize the cart as a supplier-grouped checkout with exact OMR totals. Does NOT confirm an order — the user confirms in checkout.",
    run: summarizeCheckout,
  },
  summarize_payment: {
    name: "summarize_payment",
    description: "Read-only: report the payment mode (demo/live) and an order's payment status. The Agent can NEVER pay, verify, complete, or change payment — the customer does that in the UI.",
    run: summarizePayment,
  },
  summarize_fulfillment: {
    name: "summarize_fulfillment",
    description: "Read-only: summarize an order's per-supplier fulfillment progress and the next step. The Agent can NEVER accept, decline, mark preparing, or mark ready — the supplier does that in the UI.",
    run: summarizeFulfillmentTool,
  },
  summarize_manufacturing: {
    name: "summarize_manufacturing",
    description: "Read-only: summarize a custom order's manufacturing + quality-check progress and the customer-safe next step. The Agent can NEVER start/complete manufacturing, pass/fail QC, or mark ready for delivery — the supplier does that in the UI.",
    run: summarizeManufacturingTool,
  },
  // ── Phase 09 RFQ tools ──────────────────────────────────────────────────────
  create_custom_spec: {
    name: "create_custom_spec",
    description: "Validate a proposed custom-furniture spec (the user still reviews/edits before RFQ).",
    run: createCustomSpec,
  },
  find_custom_suppliers: {
    name: "find_custom_suppliers",
    description: "Find eligible custom-furniture suppliers for a spec, with transparent match reasons (real suppliers only).",
    run: findCustomSuppliers,
  },
  list_quotes: {
    name: "list_quotes",
    description: "Summarise a set of quotes with their budget position (money computed in code).",
    run: listQuotes,
  },
  compare_quotes: {
    name: "compare_quotes",
    description: "Deterministically sort quotes (lowest-price/fastest/within-budget/recommended).",
    run: compareQuotes,
  },
  recommend_quote: {
    name: "recommend_quote",
    description: "Pick a transparent 'best value' quote with reasons (never an opaque score; never favours promoted suppliers).",
    run: recommendQuoteTool,
  },
};

export const toolNames = Object.keys(toolRegistry);

/** Execute a registered tool by name. Unknown names are rejected (allowlist). */
export function runTool(name: string, args: Record<string, unknown>): unknown {
  const tool = toolRegistry[name];
  if (!tool) return { error: "unknown-tool" };
  try {
    return tool.run(args ?? {});
  } catch {
    return { error: "tool-failed" };
  }
}
