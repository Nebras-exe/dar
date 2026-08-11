/**
 * Athathi/Dar site chatbot — domain contracts.
 *
 * A dedicated FURNITURE + INTERIOR-DESIGN assistant that reuses the existing
 * catalog, variant, budget, and Agent infrastructure. It never becomes the source
 * of truth: the model plans/answers, deterministic Athathi code grounds every
 * product/price/variant. User-scoped data (orders, memory, cart) is read ONLY on
 * the client from the per-user local stores — it never travels to the server, so
 * cross-user access is structurally impossible.
 *
 * Client-safe (no server-only / React imports, no secrets).
 */

import type { ColorId } from "@/lib/catalog";

/** Chat roles. `system` is never client-supplied. */
export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  /** Plain text only — rendered as text, never as HTML/markdown-as-HTML. */
  content: string;
}

/** The intents the assistant recognises (drives grounding + client handoffs). */
export type ChatIntent =
  | "greeting"
  | "find_furniture"
  | "choose_style"
  | "choose_color"
  | "budget_recommend"
  | "compare_products"
  | "explain_customization"
  | "find_variants"
  | "design_handoff"
  | "custom_rfq"
  | "cart_help"
  | "order_status"
  | "manufacturing_status"
  | "delivery_status"
  | "help"
  | "unknown";

/** A grounded product reference for a chat card (slug is real; UI resolves the rest). */
export interface ProductCardRef {
  slug: string;
  /** A verified colour variant of the product, when relevant. */
  colorId?: ColorId;
  /** Short, safe reason this product was surfaced (already localized). */
  reason?: string;
}

/** A quick action / suggested next step. `intentHint` is a safe canned message. */
export interface QuickAction {
  id: string;
  label: string;
  /** The message the button sends into the assistant, or a route handoff key. */
  intentHint: string;
  /** Optional client handoff: open a route instead of sending a message. */
  route?: "design" | "custom" | "cart" | "account";
}

/**
 * Client-side follow-ups the widget performs with the USER's own local data — the
 * server never sees or returns these. `design` carries safe context to pre-fill
 * the existing Design My Space wizard (never a second engine).
 */
export interface ChatFlags {
  /** Guide the user into Design My Space, optionally pre-filling context. */
  handoffDesign?: {
    roomType?: string;
    budget?: number;
    primaryStyle?: string;
    colorId?: ColorId;
  };
  /** The client should render the signed-in user's order/status summary. */
  showOrders?: boolean;
  /** The client may surface a saved-preferences suggestion (read-only). */
  showMemory?: boolean;
  /** Guide the user toward the custom-furniture / RFQ flow. */
  handoffCustom?: boolean;
}

/** A proposed add-to-cart — NEVER auto-applied; the user clicks to confirm. */
export interface ChatCartProposal {
  slug: string;
  colorId?: ColorId;
  quantity: number;
}

/** The structured response the widget renders. Never HTML. */
export interface ChatResponse {
  ok: true;
  /** Which engine produced this: a live Claude call, or the deterministic Demo. */
  mode: "claude" | "demo";
  intent: ChatIntent;
  /** Concise, locale-correct assistant text. Factual values come from tools. */
  message: string;
  /** Real catalog product cards to show inline (may be empty). */
  cards: ProductCardRef[];
  /** Suggested next actions (real, supported). */
  actions: QuickAction[];
  /** Client-side follow-ups (order lookup, memory, design/custom handoff). */
  flags: ChatFlags;
  /** A single proposed cart addition awaiting explicit user approval. */
  cartProposal?: ChatCartProposal;
}

/** Stable, user-safe error codes (mapped to friendly i18n text). */
export type ChatErrorCode =
  | "invalid-request"
  | "message-too-long"
  | "conversation-too-long"
  | "provider-error"
  | "timeout"
  | "unknown";

export type ChatResult = ChatResponse | { ok: false; code: ChatErrorCode };

/** The request envelope the client sends to /api/chat. No user order/memory data. */
export interface ChatRequest {
  locale: "en" | "ar";
  /** The bounded recent conversation (client caps length). */
  messages: ChatMessage[];
  /** Optional safe context the client already knows (budget/style the user typed). */
  context?: {
    budget?: number;
    roomType?: string;
    primaryStyle?: string;
  };
}
