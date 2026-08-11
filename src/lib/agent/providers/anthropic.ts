/**
 * Anthropic (Claude) Agent provider via the Messages REST API — no SDK. One
 * turn maps the generic message list to Anthropic tool-use blocks and back. The
 * API key is read server-side only and never logged or returned. Enable with
 * `ANTHROPIC_API_KEY` (+ optional `ATHATHI_AGENT_MODEL`).
 */

import type {
  AgentProvider,
  ProviderMessage,
  ProviderToolDef,
  ProviderTurn,
} from "./types";

const MODEL = process.env.ATHATHI_AGENT_MODEL || "claude-sonnet-5";

interface AnthropicBlock {
  type: string;
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
  tool_use_id?: string;
  content?: unknown;
}

function toAnthropicMessages(messages: ProviderMessage[]) {
  return messages.map((m) => {
    if (m.role === "user") return { role: "user", content: m.content };
    if (m.role === "assistant") {
      const blocks: AnthropicBlock[] = [];
      if (m.content) blocks.push({ type: "text", text: m.content });
      for (const call of m.toolCalls ?? [])
        blocks.push({ type: "tool_use", id: call.id, name: call.name, input: call.args });
      return { role: "assistant", content: blocks };
    }
    return {
      role: "user",
      content: [{ type: "tool_result", tool_use_id: m.toolCallId, content: m.content }],
    };
  });
}

export const anthropicAgentProvider: AgentProvider = {
  name: "anthropic",
  model: MODEL,
  isConfigured: () => Boolean(process.env.ANTHROPIC_API_KEY),
  async complete(
    system: string,
    messages: ProviderMessage[],
    tools: ProviderToolDef[],
    signal: AbortSignal,
  ): Promise<ProviderTurn> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("anthropic: not configured");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system,
        tools: tools.map((t) => ({
          name: t.name,
          description: t.description,
          input_schema: { type: "object", additionalProperties: true },
        })),
        messages: toAnthropicMessages(messages),
      }),
    });
    if (!res.ok) throw new Error(`anthropic: http ${res.status}`);

    const data = (await res.json()) as { content?: AnthropicBlock[] };
    const blocks = data.content ?? [];
    return {
      text: blocks.filter((b) => b.type === "text").map((b) => b.text ?? "").join("\n"),
      toolCalls: blocks
        .filter((b) => b.type === "tool_use")
        .map((b) => ({ id: b.id ?? "", name: b.name ?? "", args: b.input ?? {} })),
    };
  },
};
