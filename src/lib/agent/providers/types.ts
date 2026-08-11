/**
 * Agent provider abstraction (server-side only). A provider performs ONE model
 * turn: given the system prompt, the running message list, and the tool
 * definitions, it returns either tool calls to execute or a final text answer.
 * The orchestrator owns the bounded loop, validation, and execution — providers
 * never execute tools themselves. Adding a vendor = one file implementing this.
 */

export interface ProviderToolDef {
  name: string;
  description: string;
}

export interface ProviderToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

/** A message in the running conversation the orchestrator maintains. */
export type ProviderMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; toolCalls?: ProviderToolCall[] }
  | { role: "tool"; toolCallId: string; name: string; content: string };

/** One model turn: tool calls to run, and/or final text. */
export interface ProviderTurn {
  toolCalls: ProviderToolCall[];
  text: string;
}

export interface AgentProvider {
  readonly name: string;
  readonly model: string;
  isConfigured(): boolean;
  complete(
    system: string,
    messages: ProviderMessage[],
    tools: ProviderToolDef[],
    signal: AbortSignal,
  ): Promise<ProviderTurn>;
}
