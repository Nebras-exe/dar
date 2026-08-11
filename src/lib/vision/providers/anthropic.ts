import {
  extractJson,
  toBase64,
  type VisionImageInput,
  type VisionProvider,
} from "./types";
import {
  ROOM_ANALYSIS_SYSTEM_PROMPT,
  ROOM_ANALYSIS_USER_PROMPT,
} from "../prompt";

/**
 * Anthropic (Claude) vision provider via the Messages REST API — no SDK
 * dependency. The API key is read server-side only and never leaves this
 * module; it is not logged and not returned to the client. Enable by setting
 * `ANTHROPIC_API_KEY` (and optionally `ATHATHI_VISION_MODEL`).
 */
const MODEL = process.env.ATHATHI_VISION_MODEL || "claude-sonnet-5";

export const anthropicProvider: VisionProvider = {
  name: "anthropic",
  model: MODEL,
  isConfigured: () => Boolean(process.env.ANTHROPIC_API_KEY),
  async analyze(input: VisionImageInput, signal: AbortSignal): Promise<unknown> {
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
        system: ROOM_ANALYSIS_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: input.mimeType,
                  data: toBase64(input.bytes),
                },
              },
              { type: "text", text: ROOM_ANALYSIS_USER_PROMPT },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      // Never surface provider bodies to callers; the service maps this to a code.
      throw new Error(`anthropic: http ${res.status}`);
    }

    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text = (data.content ?? [])
      .filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("\n");
    return extractJson(text);
  },
};
