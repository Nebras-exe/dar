/**
 * The Agent service (server-side). Single entry point the route handler calls.
 *
 * Chooses the engine — a live LLM provider when configured, otherwise the
 * deterministic Demo Agent — runs it with a timeout, and returns a discriminated
 * result. It never throws to the caller, never leaks raw provider errors or
 * secrets, and enforces the timeout/step bounds. Business rules are enforced in
 * code (tools/orchestrator), not just the prompt.
 *
 * SERVER BOUNDARY (structural): this module + `orchestrator` + `providers` +
 * `prompts` read `process.env` secrets and are imported ONLY by the API route.
 * The client-safe barrel (`./index`) never re-exports them.
 */

import { runDemoAgent } from "./demo";
import { runProviderAgent } from "./orchestrator";
import type { AgentProvider } from "./providers/types";
import { anthropicAgentProvider } from "./providers/anthropic";
import { openaiAgentProvider } from "./providers/openai";
import type { AgentRequest, AgentResult } from "./types";

const TIMEOUT_MS = 30_000;

const REAL_PROVIDERS: Record<string, AgentProvider> = {
  anthropic: anthropicAgentProvider,
  openai: openaiAgentProvider,
};

/** The active real provider, or null when none is configured. */
export function resolveAgentProvider(): AgentProvider | null {
  const explicit = process.env.ATHATHI_AGENT_PROVIDER?.toLowerCase().trim();
  if (explicit && REAL_PROVIDERS[explicit]) {
    return REAL_PROVIDERS[explicit].isConfigured() ? REAL_PROVIDERS[explicit] : null;
  }
  for (const p of Object.values(REAL_PROVIDERS)) if (p.isConfigured()) return p;
  return null;
}

export function agentMode(): "provider" | "demo" {
  return resolveAgentProvider() ? "provider" : "demo";
}

function log(event: Record<string, unknown>) {
  try {
    console.info("[agent]", JSON.stringify({ ts: Date.now(), ...event }));
  } catch {
    /* never break the request */
  }
}

export async function runAgent(req: AgentRequest): Promise<AgentResult> {
  const provider = resolveAgentProvider();

  // No provider → deterministic Demo Agent (synchronous, no network).
  if (!provider) {
    try {
      log({ event: "demo", intentMsgLen: req.message.length });
      return runDemoAgent(req);
    } catch {
      log({ event: "demo-error" });
      return { ok: false, code: "unknown" };
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    log({ event: "provider-start", provider: provider.name });
    const res = await runProviderAgent(req, provider, controller.signal);
    log({ event: "provider-success", provider: provider.name });
    return res;
  } catch (err) {
    const code = err instanceof Error && err.name === "AbortError" ? "timeout" : "provider-error";
    log({ event: "provider-error", provider: provider.name, code });
    return { ok: false, code };
  } finally {
    clearTimeout(timer);
  }
}
