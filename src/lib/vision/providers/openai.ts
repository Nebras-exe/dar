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
 * OpenAI vision provider via the Chat Completions REST API — no SDK dependency.
 * Server-side only; `OPENAI_API_KEY` is never exposed. Enable by setting the
 * key (and optionally `ATHATHI_VISION_MODEL`).
 */
const MODEL = process.env.ATHATHI_VISION_MODEL || "gpt-4o";

export const openaiProvider: VisionProvider = {
  name: "openai",
  model: MODEL,
  isConfigured: () => Boolean(process.env.OPENAI_API_KEY),
  async analyze(input: VisionImageInput, signal: AbortSignal): Promise<unknown> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("openai: not configured");

    const dataUrl = `data:${input.mimeType};base64,${toBase64(input.bytes)}`;
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: ROOM_ANALYSIS_SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: ROOM_ANALYSIS_USER_PROMPT },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
      }),
    });

    if (!res.ok) throw new Error(`openai: http ${res.status}`);

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content ?? "";
    return extractJson(text);
  },
};
