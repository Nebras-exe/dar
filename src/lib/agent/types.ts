/**
 * Athathi AI Agent — domain contracts (Phase 06).
 *
 * The Agent ORCHESTRATES (understand intent → choose tools → explain); it is
 * never the source of truth. Deterministic application logic (Phase 03 catalog,
 * Phase 04 design engine, Phase 05 vision) validates, filters, calculates and
 * mutates state. Every product/price/total in an `AgentResponse` resolves to a
 * real catalog product via a tool — the model may not invent any of them.
 *
 * Kept free of server-only / React imports so types + validators run on the
 * client (to build requests / render responses) and in Node tests.
 */

import type {
  BudgetSummary,
  DesignInput,
  DesignItem,
} from "@/lib/design";
import type { RoomAnalysis } from "@/lib/vision";
import type { ColorId } from "@/lib/catalog";

/** High-level intents the Agent recognises. */
export type AgentIntent =
  | "design_room"
  | "make_cheaper"
  | "set_budget"
  | "replace_item"
  | "find_cheaper"
  | "upgrade_item"
  | "change_material"
  | "change_color"
  | "remove_item"
  | "keep_item"
  | "explain"
  | "prepare_cart"
  | "unknown";

/**
 * The current, structured design the Agent operates on — sent by the client and
 * returned (possibly modified). Item slugs always resolve to catalog products.
 */
export interface AgentDesignState {
  input: DesignInput;
  items: DesignItem[];
}

/** What the client sends to the Agent. No hidden app state may be modified. */
export interface AgentRequest {
  locale: "en" | "ar";
  message: string;
  state: AgentDesignState;
  /** Optional Phase 05 room context (already analysed; not re-run here). */
  roomAnalysis?: RoomAnalysis | null;
}

/** A single human-readable tool-activity line (no raw JSON, no internals). */
export interface ActivityLine {
  /** A stable key so the UI can pick an icon; text is already localized. */
  kind: "search" | "budget" | "replace" | "remove" | "build" | "cart" | "info" | "keep";
  text: string;
}

/** A proposed cart addition — never auto-committed (requires user approval). */
export interface CartProposal {
  items: { slug: string; colorId?: ColorId; quantity: number }[];
  subtotal: number;
  count: number;
}

/** Structured Agent result the UI consumes (never free-form-only). */
export interface AgentResponse {
  ok: true;
  /** Which engine produced this: a live provider, or the deterministic Demo Agent. */
  mode: "provider" | "demo";
  intent: AgentIntent;
  /** Concise, locale-correct explanation. Factual values come from tools. */
  message: string;
  activity: ActivityLine[];
  /** The updated design, when the request changed it. */
  design?: AgentDesignState;
  budgetSummary?: BudgetSummary;
  /** Present when the Agent proposes a cart addition awaiting approval. */
  cartProposal?: CartProposal;
  requiresApproval?: boolean;
  /** Contextual quick commands (real, supported actions). */
  suggestedActions?: { intentHint: string; label: string }[];
}

/** Stable, user-safe error codes (mapped to friendly i18n text). */
export type AgentErrorCode =
  | "invalid-request"
  | "message-too-long"
  | "state-too-large"
  | "provider-error"
  | "timeout"
  | "unknown";

export type AgentResult = AgentResponse | { ok: false; code: AgentErrorCode };

/** Agent flow states (simplified for the UI; never expose developer jargon). */
export type AgentPhase =
  | "idle"
  | "understanding"
  | "working"
  | "awaiting_approval"
  | "completed"
  | "error";
