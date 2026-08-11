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
 * Google Gemini vision provider via the Generative Language REST API — no SDK
 * dependency. Server-side only; `GOOGLE_GENERATIVE_AI_API_KEY` is never
 * exposed. Enable by setting the key (and optionally `ATHATHI_VISION_MODEL`).
 */
const MODEL = process.env.ATHATHI_VISION_MODEL || "gemini-1.5-flash";

export const geminiProvider: VisionProvider = {
  name: "gemini",
  model: MODEL,
  isConfigured: () => Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
  async analyze(input: VisionImageInput, signal: AbortSignal): Promise<unknown> {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) throw new Error("gemini: not configured");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: "POST",
      signal,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: ROOM_ANALYSIS_SYSTEM_PROMPT }] },
        contents: [
          {
            role: "user",
            parts: [
              { text: ROOM_ANALYSIS_USER_PROMPT },
              {
                inline_data: {
                  mime_type: input.mimeType,
                  data: toBase64(input.bytes),
                },
              },
            ],
          },
        ],
        generationConfig: { responseMimeType: "application/json", maxOutputTokens: 1024 },
      }),
    });

    if (!res.ok) throw new Error(`gemini: http ${res.status}`);

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("\n") ??
      "";
    return extractJson(text);
  },
};
