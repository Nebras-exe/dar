/**
 * Chatbot service (SERVER ONLY).
 *
 * Orchestrates a chat turn: pick engine (Claude when configured, else Demo) →
 * for Claude, get a structured plan and GROUND it deterministically (the model's
 * `catalogQuery` is turned into REAL products; the model can never supply product
 * truth) → return a structured `ChatResponse`. Never throws; bounded by
 * `CHAT_LIMITS`. Falls back to the deterministic Demo engine on any failure.
 *
 * User-scoped data (orders/memory/cart) is NOT handled here — the client renders
 * the user's own local data. The server only sees the conversation text + safe
 * context, and returns grounded catalog data + intent flags.
 */

import { isStyleTag, isColorId, isMaterialId, type CategorySlug, type ColorId, type MaterialId, type StyleTag } from "@/lib/catalog";
import { claudeChatProvider } from "./claude-provider";
import { demoRespond, defaultQuickActions } from "./demo-engine";
import { searchCatalog } from "./tools";
import { isCategory } from "./intents";
import { CHAT_LIMITS } from "./config";
import type { ChatIntent, ChatRequest, ChatResponse } from "./types";

/** True when the chatbot will use Claude (key present). Enum-safe for the client. */
export function chatMode(): "claude" | "demo" {
  return claudeChatProvider.isConfigured() ? "claude" : "demo";
}

const INTENTS = new Set<ChatIntent>([
  "greeting", "find_furniture", "choose_style", "choose_color", "budget_recommend",
  "compare_products", "explain_customization", "find_variants", "design_handoff",
  "custom_rfq", "cart_help", "order_status", "manufacturing_status", "delivery_status",
  "help", "unknown",
]);

/** Ground a Claude plan into a safe, real response. Never trusts model product data. */
function groundClaudePlan(raw: unknown, locale: "en" | "ar", context: ChatRequest["context"]): ChatResponse | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  const intent: ChatIntent = INTENTS.has(o.intent as ChatIntent) ? (o.intent as ChatIntent) : "unknown";
  const reply = typeof o.reply === "string" ? o.reply.slice(0, 1200) : "";
  if (!reply) return null;

  // Ground the model's product REQUEST into real catalog slugs (never model ids).
  let cards: ChatResponse["cards"] = [];
  const q = o.catalogQuery && typeof o.catalogQuery === "object" ? (o.catalogQuery as Record<string, unknown>) : null;
  if (q) {
    const category = typeof q.category === "string" && isCategory(q.category) ? (q.category as CategorySlug) : undefined;
    const style = typeof q.style === "string" && isStyleTag(q.style) ? (q.style as StyleTag) : undefined;
    const color = typeof q.color === "string" && isColorId(q.color) ? (q.color as ColorId) : undefined;
    const material = typeof q.material === "string" && isMaterialId(q.material) ? (q.material as MaterialId) : undefined;
    const maxPrice = typeof q.maxPrice === "number" && q.maxPrice > 0 ? q.maxPrice : (context?.budget ?? undefined);
    const slugs = searchCatalog({ category, style, color, material, maxPrice });
    // When a colour was requested, surface each result's matching variant photo
    // (variant-aware) — never the default colour for a colour-specific ask.
    cards = slugs.map((slug) => ({ slug, ...(color ? { colorId: color } : {}) }));
  }

  // Map intents to safe client flags (order/memory/cart data stays on the client).
  const flags: ChatResponse["flags"] = {};
  if (intent === "order_status" || intent === "manufacturing_status" || intent === "delivery_status") flags.showOrders = true;
  if (intent === "design_handoff") {
    flags.handoffDesign = {
      ...(context?.roomType ? { roomType: context.roomType } : {}),
      ...(context?.budget ? { budget: context.budget } : {}),
      ...(context?.primaryStyle ? { primaryStyle: context.primaryStyle } : {}),
    };
  }
  if (intent === "custom_rfq" || intent === "explain_customization") flags.handoffCustom = true;

  return {
    ok: true, mode: "claude", intent, message: reply, cards, flags,
    actions: defaultQuickActions(locale),
  };
}

/** Run a chat turn. Bounded, never throws. */
export async function runChat(req: ChatRequest): Promise<ChatResponse> {
  const messages = req.messages.slice(-CHAT_LIMITS.maxMessages);

  // No key → deterministic Demo engine (no network call).
  if (!claudeChatProvider.isConfigured()) {
    return demoRespond(messages, req.locale, req.context);
  }

  // Claude path — plan then ground; fall back to Demo on any failure.
  for (let attempt = 0; attempt < CHAT_LIMITS.maxClaudeCalls; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CHAT_LIMITS.timeoutMs);
    let res;
    try {
      res = await claudeChatProvider.plan(messages, controller.signal);
    } finally {
      clearTimeout(timer);
    }
    if (res.ok) {
      const grounded = groundClaudePlan(res.raw, req.locale, req.context);
      if (grounded) return grounded;
    }
    // else retry within the strict limit
  }

  // Fallback — always yields a valid, grounded response.
  return demoRespond(messages, req.locale, req.context);
}
