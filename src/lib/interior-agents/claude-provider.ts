/**
 * Claude Designer provider (SERVER ONLY).
 *
 * Calls the Anthropic Messages REST API to produce a design PLAN (structured
 * JSON). It uses the SAME server-side fetch pattern as the existing Athathi
 * Anthropic vision provider (no SDK dependency, consistent with the codebase),
 * reading `process.env.ANTHROPIC_API_KEY` inside this module only.
 *
 * SECRET RULES:
 * - The key is read here, sent only in the `x-api-key` header, and NEVER logged,
 *   returned to the caller, embedded in output, or exposed to the client.
 * - No NEXT_PUBLIC_* is ever used for the key.
 * - When the key is absent, `isConfigured()` is false and this provider is never
 *   selected (the orchestrator uses the deterministic Demo provider instead).
 * - This module makes a network call ONLY when `plan()` is invoked at runtime with
 *   a key present. It is never called during tests or the build.
 */

import { anthropicModel } from "./config";
import { DESIGNER_SYSTEM_PROMPT, designerUserPrompt } from "./prompts";
import { categories, styleTags, colorIds, materialIds } from "@/lib/catalog";
import type { DesignerPlanResult, InteriorRunInput } from "./types";
import type { RoomAnalysis } from "@/lib/vision";
import type { DesignerProvider } from "./provider";

/** Defensive JSON extraction — models sometimes wrap JSON in prose/fences. */
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

const VOCAB = {
  categories: categories.map((c) => c.slug),
  styles: [...styleTags],
  colors: [...colorIds],
  materials: [...materialIds],
};

export const claudeDesignerProvider: DesignerProvider = {
  name: "claude",
  get model() {
    return anthropicModel();
  },
  isConfigured: () => Boolean(process.env.ANTHROPIC_API_KEY),

  async plan(input: InteriorRunInput, analysis: RoomAnalysis, signal: AbortSignal): Promise<DesignerPlanResult> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return { ok: false, code: "not-configured" };
    const model = anthropicModel();

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
          max_tokens: 1500,
          system: DESIGNER_SYSTEM_PROMPT,
          messages: [
            { role: "user", content: designerUserPrompt(input, analysis, VOCAB) },
          ],
        }),
      });

      if (!res.ok) {
        // Never surface the provider body; the orchestrator maps this to a safe code.
        return { ok: false, code: "provider-error" };
      }

      const data = (await res.json()) as { content?: { type: string; text?: string }[] };
      const text = (data.content ?? [])
        .filter((b) => b.type === "text")
        .map((b) => b.text ?? "")
        .join("\n");
      return { ok: true, raw: extractJson(text), model };
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return { ok: false, code: "timeout" };
      return { ok: false, code: "provider-error" };
    }
  },
};
