import type { NextRequest } from "next/server";
import { runChat, chatMode } from "@/lib/chatbot/service";
import { CHAT_LIMITS } from "@/lib/chatbot/config";
import type { ChatErrorCode, ChatMessage, ChatRequest } from "@/lib/chatbot/types";

/**
 * POST /api/chat — the Athathi/Dar assistant boundary.
 *
 * Understands the conversation (Claude when configured, else the deterministic
 * Demo engine) and returns a GROUNDED structured response: assistant text + real
 * catalog product cards + safe intent flags. Catalog truth/prices are always
 * deterministic — the model can never supply them. The `ANTHROPIC_API_KEY` is read
 * only inside the provider and is NEVER returned, logged, or exposed here.
 *
 * PRIVACY: this endpoint neither accepts nor returns user order/memory/cart data —
 * those live only in the user's browser and are rendered client-side, so
 * cross-user access is structurally impossible. Only conversation text + safe
 * context (a budget/style the user typed) is processed.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}
function fail(code: ChatErrorCode, status = 200): Response {
  return json({ ok: false, code }, status);
}

/** Capability only — enum, never a credential. */
export async function GET(): Promise<Response> {
  return json({ chatMode: chatMode() });
}

export async function POST(request: NextRequest): Promise<Response> {
  // Reject oversized bodies before parsing.
  const text = await request.text();
  if (text.length > 32 * 1024) return fail("conversation-too-long", 413);

  let body: unknown;
  try {
    body = JSON.parse(text || "{}");
  } catch {
    return fail("invalid-request", 400);
  }
  const o = (body ?? {}) as Record<string, unknown>;

  const locale = o.locale === "ar" ? "ar" : "en";

  if (!Array.isArray(o.messages) || o.messages.length === 0) return fail("invalid-request", 400);
  if (o.messages.length > CHAT_LIMITS.maxMessages) return fail("conversation-too-long", 400);

  const messages: ChatMessage[] = [];
  for (const raw of o.messages) {
    const m = (raw ?? {}) as Record<string, unknown>;
    const role = m.role === "assistant" ? "assistant" : "user";
    const content = typeof m.content === "string" ? m.content : "";
    if (!content) continue;
    if (content.length > CHAT_LIMITS.maxMessageChars) return fail("message-too-long", 400);
    messages.push({ role, content });
  }
  if (messages.length === 0) return fail("invalid-request", 400);

  // Safe context only (numbers/strings the user typed) — never user order/memory data.
  const ctxRaw = (o.context ?? {}) as Record<string, unknown>;
  const context: ChatRequest["context"] = {
    ...(typeof ctxRaw.budget === "number" && ctxRaw.budget > 0 && ctxRaw.budget < 1_000_000 ? { budget: ctxRaw.budget } : {}),
    ...(typeof ctxRaw.roomType === "string" && ctxRaw.roomType.length < 40 ? { roomType: ctxRaw.roomType } : {}),
    ...(typeof ctxRaw.primaryStyle === "string" && ctxRaw.primaryStyle.length < 40 ? { primaryStyle: ctxRaw.primaryStyle } : {}),
  };

  try {
    const res = await runChat({ locale, messages, context });
    return json(res);
  } catch {
    return fail("unknown");
  }
}
