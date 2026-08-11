import type { NextRequest } from "next/server";
import { isLivePaymentConfigured } from "@/lib/payments/providers";

/**
 * POST /api/payments/webhook/[provider] — a GENERIC webhook boundary (§18).
 *
 * This is a documented FOUNDATION only — Athathi does not invent a provider's
 * signature scheme. A real integration MUST, in this handler, before doing
 * anything:
 *   1. verify the provider's signature over the RAW request body,
 *   2. enforce a timestamp / replay window (reject stale events),
 *   3. deduplicate by (provider, event_id) via `payment_events` (idempotent
 *      processing — an event is applied at most once),
 *   4. apply only SAFE status transitions through the payment status machine
 *      (e.g. pending → paid), never a client-driven jump,
 *   5. return 2xx quickly and never leak internal/provider errors.
 *
 * With no gateway configured, there is no live webhook: this returns 404 so a
 * probe can't mistake it for an active endpoint. It never marks anything paid.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
): Promise<Response> {
  await params; // provider is part of the route contract; unused until a real gateway exists
  if (!isLivePaymentConfigured()) {
    // No live provider → no live webhook. Do not process, do not mark paid.
    return new Response(JSON.stringify({ ok: false, code: "provider-unavailable" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }
  // (Real path — gated): steps 1–5 above, then persist + transition. Not reachable
  // until a certified provider is registered.
  return new Response(JSON.stringify({ ok: false, code: "provider-unavailable" }), {
    status: 501,
    headers: { "content-type": "application/json" },
  });
}
