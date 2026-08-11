/**
 * Chatbot configuration — the ONE place for the model default + limits.
 * Reads only a NON-secret model name; never the API key.
 */

/** Claude model for the chatbot; configurable, never a secret. Reuses the shared key. */
export function chatbotModel(): string {
  return process.env.ATHATHI_CHATBOT_MODEL?.trim() || process.env.ATHATHI_AGENT_MODEL?.trim() || "claude-sonnet-5";
}

/** Cost / call controls (§17) — bound every turn even after Claude is enabled. */
export const CHAT_LIMITS = {
  /** Max messages accepted in one request's conversation window. */
  maxMessages: 24,
  /** Max characters in a single user message. */
  maxMessageChars: 1_000,
  /** Max Claude calls per user turn (the planner runs once, plus a retry). */
  maxClaudeCalls: 2,
  /** Max grounded product cards returned per turn. */
  maxCards: 6,
  /** Per-turn network timeout (ms). */
  timeoutMs: 20_000,
} as const;
