/**
 * OpenAI Agent provider via the Chat Completions REST API — no SDK. One turn
 * maps the generic message list to OpenAI tool-calls and back. Server-side only;
 * `OPENAI_API_KEY` is never exposed. Enable with the key (+ optional
 * `ATHATHI_AGENT_MODEL`).
 */

import type {
  AgentProvider,
  ProviderMessage,
  ProviderToolDef,
  ProviderTurn,
} from "./types";

const MODEL = process.env.ATHATHI_AGENT_MODEL || "gpt-4o";

function toOpenAiMessages(system: string, messages: ProviderMessage[]) {
  const out: Record<string, unknown>[] = [{ role: "system", content: system }];
  for (const m of messages) {
    if (m.role === "user") out.push({ role: "user", content: m.content });
    else if (m.role === "assistant")
      out.push({
        role: "assistant",
        content: m.content || null,
        tool_calls: (m.toolCalls ?? []).map((c) => ({
          id: c.id,
          type: "function",
          function: { name: c.name, arguments: JSON.stringify(c.args) },
        })),
      });
    else out.push({ role: "tool", tool_call_id: m.toolCallId, content: m.content });
  }
  return out;
}

export const openaiAgentProvider: AgentProvider = {
  name: "openai",
  model: MODEL,
  isConfigured: () => Boolean(process.env.OPENAI_API_KEY),
  async complete(
    system: string,
    messages: ProviderMessage[],
    tools: ProviderToolDef[],
    signal: AbortSignal,
  ): Promise<ProviderTurn> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("openai: not configured");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal,
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        tools: tools.map((t) => ({
          type: "function",
          function: {
            name: t.name,
            description: t.description,
            parameters: { type: "object", additionalProperties: true },
          },
        })),
        messages: toOpenAiMessages(system, messages),
      }),
    });
    if (!res.ok) throw new Error(`openai: http ${res.status}`);

    const data = (await res.json()) as {
      choices?: { message?: { content?: string; tool_calls?: { id: string; function: { name: string; arguments: string } }[] } }[];
    };
    const msg = data.choices?.[0]?.message;
    return {
      text: msg?.content ?? "",
      toolCalls: (msg?.tool_calls ?? []).map((c) => {
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(c.function.arguments) as Record<string, unknown>;
        } catch {
          args = {};
        }
        return { id: c.id, name: c.function.name, args };
      }),
    };
  },
};
