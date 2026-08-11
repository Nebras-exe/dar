/**
 * Athathi chatbot — CLIENT-SAFE barrel.
 *
 * Re-exports only types + the deterministic intent/demo helpers the widget needs.
 * The Claude provider, service, and prompts live behind the server boundary and
 * are imported directly by the API route — never from here — so no secret-reading
 * code or model call reaches the client bundle.
 */

export type {
  ChatRole,
  ChatMessage,
  ChatIntent,
  ProductCardRef,
  QuickAction,
  ChatFlags,
  ChatCartProposal,
  ChatResponse,
  ChatErrorCode,
  ChatResult,
  ChatRequest,
} from "./types";

export { defaultQuickActions } from "./demo-engine";
export { CHAT_LIMITS } from "./config";
