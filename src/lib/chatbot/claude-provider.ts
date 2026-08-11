/**
 * Claude chatbot provider (SERVER ONLY).
 *
 * Produces a structured chat PLAN (intent + reply + optional catalogQuery) via the
 * Anthropic Messages REST API, using the SAME server-side fetch pattern as the
 * existing Athathi Anthropic agent/vision providers (no SDK). The model never
 * supplies product truth — Athathi grounds `catalogQuery` deterministically.
 *
 * SECRET RULES: `ANTHROPIC_API_KEY` is read here only, sent solely in the
 * `x-api-key` header, and NEVER logged, returned, embedded in output, or exposed
 * to the client. When absent, `isConfigured()` is false and the Demo engine runs.
 * A network call happens ONLY when `plan()` runs at runtime with a key present —
 * never during tests or the build.
 */

import { chatbotModel } from "./config";
import { CHATBOT_SYSTEM_PROMPT, chatUserPrompt } from "./prompts";
import type { ChatMessage } from "./types";

export type ChatPlanResult =
  | { ok: true; raw: unknown; model: string }
  | { ok: false; code: "not-configured" | "provider-error" | "timeout" };

function extractJson(text: string): unknown {
  if (!text) return undefined;
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return undefined;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return undefined;
  }
}

export const claudeChatProvider = {
  name: "claude" as const,
  get model() {
    return chatbotModel();
  },
  isConfigured: () => Boolean(process.env.ANTHROPIC_API_KEY),

  async plan(messages: ChatMessage[], signal: AbortSignal): Promise<ChatPlanResult> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return { ok: false, code: "not-configured" };
    const model = chatbotModel();

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal,
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 700,
          system: CHATBOT_SYSTEM_PROMPT,
          messages: [{ role: "user", content: chatUserPrompt(messages) }],
        }),
      });

      if (!res.ok) return { ok: false, code: "provider-error" };
      const data = (await res.json()) as { content?: { type: string; text?: string }[] };
      const out = (data.content ?? []).filter((b) => b.type === "text").map((b) => b.text ?? "").join("\n");
      return { ok: true, raw: extractJson(out), model };
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return { ok: false, code: "timeout" };
      return { ok: false, code: "provider-error" };
    }
  },
};
