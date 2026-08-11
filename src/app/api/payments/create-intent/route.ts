import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { paymentMode, isLivePaymentConfigured } from "@/lib/payments/providers";

/**
 * POST /api/payments/create-intent — the REAL-mode server boundary (Phase 10B).
 *
 * Security posture (§15/§20/§21):
 * - Requires an authenticated session; only the order-owning customer may pay.
 * - The amount is NEVER read from the request — the server loads the order and
 *   derives `amount = order.grand_total`. A client-sent amount is ignored.
 * - Returns only stable, user-safe codes; never a raw provider error or secret.
 *
 * No real gateway is configured in this environment, so this returns
 * `{ok:false, code:"provider-unavailable", mode:"demo"}` and the client uses the
 * Demo Payment flow (which enforces the same invariants client-side via the
 * shared `@/lib/payments` domain). Wiring a certified provider = registering it
 * in `@/lib/payments/providers` + a DB order lookup here; the contract is unchanged.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

export async function GET(): Promise<Response> {
  // Capability only — booleans/enum, never a credential.
  return json({ configured: isLivePaymentConfigured(), mode: paymentMode() });
}

export async function POST(request: NextRequest): Promise<Response> {
  const session = await getSession();
  if (!session) return json({ ok: false, code: "unauthorized" }, 401);

  // Parse only to reject oversized bodies / bad JSON — the amount is IGNORED.
  const text = await request.text();
  if (text.length > 8 * 1024) return json({ ok: false, code: "unknown" }, 413);
  try {
    JSON.parse(text || "{}");
  } catch {
    return json({ ok: false, code: "unknown" }, 400);
  }

  // No live gateway configured → the client runs the Demo Payment flow.
  if (!isLivePaymentConfigured()) {
    return json({ ok: false, code: "provider-unavailable", mode: "demo" });
  }

  // (Real path — gated): load the order server-side, derive the authoritative
  // amount, resolve the provider, create the intent idempotently, persist, and
  // return only { intentId, status, redirectUrl? }. Never the amount from the body.
  return json({ ok: false, code: "provider-unavailable", mode: "live" });
}
