/**
 * The bounded, validated tool loop for the LLM path (server-side only).
 *
 * The orchestrator — not the model — owns control flow, tool execution, and the
 * working design. Each turn: the provider proposes tool calls; the orchestrator
 * rejects unknown tool names (allowlist), forces the CURRENT server-side design
 * into design-scoped tool args (so the model can't smuggle a different design),
 * executes the validated tool, and feeds the result back. Any tool result
 * carrying `items` updates the working design; `prepare_cart` sets an approval
 * gate. The loop is capped at MAX_AGENT_STEPS. Final products always come from
 * tool results, never model prose.
 */

import { summarize, type DesignItem } from "@/lib/design";
import { getProductBySlug } from "@/lib/catalog";
import { AGENT_SYSTEM_PROMPT, describeState } from "./prompts";
import { runTool, toolNames, toolRegistry } from "./tools";
import type {
  ActivityLine,
  AgentRequest,
  AgentResponse,
  CartProposal,
} from "./types";
import type { AgentProvider, ProviderMessage } from "./providers/types";

export const MAX_AGENT_STEPS = 8;

/** Tools whose design context (items + input) is forced from server state. */
const DESIGN_SCOPED = new Set([
  "remove_item",
  "apply_replacement",
  "recalculate_design",
  "prepare_cart",
  "build_design",
  "find_replacement",
  "check_product_fit",
]);

function rebuildItems(raw: unknown): DesignItem[] | null {
  if (!Array.isArray(raw)) return null;
  const items: DesignItem[] = [];
  for (const r of raw) {
    const o = (r ?? {}) as Record<string, unknown>;
    const slug = typeof o.slug === "string" ? o.slug : "";
    const p = getProductBySlug(slug);
    if (!p) continue;
    items.push({
      slug,
      category: p.category,
      colorId: p.colors[0]?.id,
      reason:
        o.reason && typeof o.reason === "object"
          ? (o.reason as DesignItem["reason"])
          : { en: "", ar: "" },
    });
  }
  return items;
}

function activityFor(name: string): ActivityLine | null {
  switch (name) {
    case "search_catalog":
    case "find_replacement":
      return { kind: "search", text: "Searched the catalog" };
    case "check_budget":
    case "recalculate_design":
      return { kind: "budget", text: "Checked your budget" };
    case "apply_replacement":
      return { kind: "replace", text: "Updated a piece in your design" };
    case "remove_item":
      return { kind: "remove", text: "Removed a piece" };
    case "build_design":
      return { kind: "build", text: "Built a design option" };
    case "prepare_cart":
      return { kind: "cart", text: "Prepared your cart" };
    default:
      return null;
  }
}

export async function runProviderAgent(
  req: AgentRequest,
  provider: AgentProvider,
  signal: AbortSignal,
): Promise<AgentResponse> {
  let workingItems: DesignItem[] = req.state.items.slice();
  let cartProposal: CartProposal | undefined;
  let requiresApproval: boolean | undefined;
  const activity: ActivityLine[] = [];

  const toolDefs = toolNames.map((n) => ({
    name: n,
    description: toolRegistry[n].description,
  }));

  const messages: ProviderMessage[] = [
    {
      role: "user",
      content: `Locale: ${req.locale}\nUser request: ${req.message}\nCurrent design (data): ${describeState(
        { input: req.state.input, items: workingItems },
      )}`,
    },
  ];

  let finalText = "";

  for (let step = 0; step < MAX_AGENT_STEPS; step++) {
    const turn = await provider.complete(AGENT_SYSTEM_PROMPT, messages, toolDefs, signal);

    if (!turn.toolCalls || turn.toolCalls.length === 0) {
      finalText = turn.text ?? "";
      break;
    }

    messages.push({ role: "assistant", content: turn.text ?? "", toolCalls: turn.toolCalls });

    for (const call of turn.toolCalls) {
      // Allowlist: unknown tool names are rejected, never executed.
      if (!toolNames.includes(call.name)) {
        messages.push({
          role: "tool",
          toolCallId: call.id,
          name: call.name,
          content: JSON.stringify({ error: "unknown-tool" }),
        });
        continue;
      }

      // Force current server-side design into design-scoped tools.
      const args: Record<string, unknown> = { ...(call.args ?? {}) };
      if (DESIGN_SCOPED.has(call.name)) {
        args.items = workingItems.map((i) => ({ slug: i.slug }));
        args.input = req.state.input;
      }

      const result = runTool(call.name, args) as Record<string, unknown>;

      // Any result carrying an items list updates the working design.
      const rebuilt = rebuildItems((result as { items?: unknown }).items);
      if (rebuilt) workingItems = rebuilt;
      if (call.name === "prepare_cart") {
        cartProposal = result as unknown as CartProposal;
        requiresApproval = true;
      }
      const line = activityFor(call.name);
      if (line) activity.push(line);

      messages.push({
        role: "tool",
        toolCallId: call.id,
        name: call.name,
        // Cap the size fed back to the model.
        content: JSON.stringify(result).slice(0, 4000),
      });
    }
  }

  const budgetSummary = summarize(workingItems, req.state.input);

  return {
    ok: true,
    mode: "provider",
    intent: "unknown",
    message:
      finalText.trim() ||
      "Here's your updated design.",
    activity,
    design: { input: req.state.input, items: workingItems },
    budgetSummary,
    cartProposal,
    requiresApproval,
  };
}
