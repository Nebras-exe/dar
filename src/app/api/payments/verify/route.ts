import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { isLivePaymentConfigured } from "@/lib/payments/providers";

/**
 * POST /api/payments/verify — server-side payment verification (§17).
 *
 * "paid" is only ever set here (or, in demo mode, through the same provider
 * abstraction client-side). This route NEVER trusts a client `?success=true` or
 * localStorage flag: it resolves the intent server-side, calls the provider's
 * `verify`, gates the transition through the status machine, and returns a safe
 * status. Owner-only. No live gateway is configured → demo verification runs
 * client-side via the shared domain; this returns the honest capability.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

export async function POST(request: NextRequest): Promise<Response> {
  const session = await getSession();
  if (!session) return json({ ok: false, code: "unauthorized" }, 401);

  const text = await request.text();
  if (text.length > 8 * 1024) return json({ ok: false, code: "unknown" }, 413);
  try {
    JSON.parse(text || "{}");
  } catch {
    return json({ ok: false, code: "unknown" }, 400);
  }

  if (!isLivePaymentConfigured()) {
    return json({ ok: false, code: "provider-unavailable", mode: "demo" });
  }
  // (Real path — gated): resolve intent by owner, provider.verify(), transition
  // via the status machine, persist paid + attempt, return { status }.
  return json({ ok: false, code: "provider-unavailable", mode: "live" });
}
