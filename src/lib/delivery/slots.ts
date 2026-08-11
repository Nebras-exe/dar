/**
 * Delivery-slot rules (Phase 12, §11/§12). Deterministic + local — no external
 * calendar/logistics API, no invented live supplier availability. Windows are
 * fixed demo periods; validation rejects past dates, bad formats, and impossible
 * ranges. All dates are treated as local Oman calendar days (YYYY-MM-DD).
 */

import type { DeliverySlotPeriod, DeliveryWindow } from "./types";

export const SLOT_PERIODS: readonly DeliverySlotPeriod[] = ["morning", "afternoon", "evening"];

/** Human window bounds per period (display only). */
export const SLOT_HOURS: Record<DeliverySlotPeriod, { start: string; end: string }> = {
  morning: { start: "09:00", end: "12:00" },
  afternoon: { start: "12:00", end: "16:00" },
  evening: { start: "16:00", end: "20:00" },
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Parse a YYYY-MM-DD string to a UTC-midnight timestamp, or null if malformed. */
function parseDay(date: string): number | null {
  if (!DATE_RE.test(date)) return null;
  const [y, m, d] = date.split("-").map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const ts = Date.UTC(y, m - 1, d);
  const back = new Date(ts);
  // Reject overflow (e.g. 2026-02-31 rolling into March).
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== m - 1 || back.getUTCDate() !== d) return null;
  return ts;
}

/** The local calendar day (UTC-midnight) for a timestamp. */
function dayOf(now: number): number {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/**
 * Is a chosen window valid to schedule at `now`? Rejects malformed dates, past
 * days (today is allowed), and unknown periods (§12).
 */
export function isValidSlot(window: Pick<DeliveryWindow, "date" | "period">, now: number): boolean {
  if (!SLOT_PERIODS.includes(window.period)) return false;
  const day = parseDay(window.date);
  if (day === null) return false;
  return day >= dayOf(now);
}

/** Generate the next `count` selectable demo days (from tomorrow), as YYYY-MM-DD. */
export function upcomingDays(now: number, count = 7): string[] {
  const base = dayOf(now);
  const out: string[] = [];
  for (let i = 1; i <= count; i++) {
    const d = new Date(base + i * 86_400_000);
    out.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`);
  }
  return out;
}
