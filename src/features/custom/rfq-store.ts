"use client";

import * as React from "react";
import {
  alwaysFalse,
  alwaysTrue,
  createPersistentStore,
} from "@/features/shop/persistent-store";
import { demoSuppliers } from "@/lib/repository";
import {
  buildRecipients,
  generateDemoQuotes,
  isAcceptedLocked,
  quoteTotal,
  type CustomFurnitureSpec,
  type CustomRequest,
  type Quote,
  type QuoteInput,
} from "@/lib/rfq";

/**
 * Demo RFQ store (Phase 09, §21). With no backend, a customer's custom requests +
 * their Demo Quotes live here in `localStorage`, clearly labelled. When Supabase
 * is configured, `custom_requests`/`quotes` (RLS-scoped) are the source of truth
 * and this is the honest local fallback with the same shape. Demo quotes are
 * deterministic (same spec+supplier → same quote), so nothing is random.
 */

interface RFQData {
  requests: CustomRequest[];
  quotes: Quote[];
}

function validate(value: unknown): RFQData {
  const v = value as Partial<RFQData> | null;
  return {
    requests: Array.isArray(v?.requests) ? v!.requests : [],
    quotes: Array.isArray(v?.quotes) ? v!.quotes : [],
  };
}

const store = createPersistentStore<RFQData>("athathi.rfq.v1", { requests: [], quotes: [] }, validate);

export function useRFQ(customerId: string) {
  const data = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);

  const requests = React.useMemo(
    () => data.requests.filter((r) => r.customerId === customerId).sort((a, b) => b.createdAt - a.createdAt),
    [data.requests, customerId],
  );

  const quotesFor = React.useCallback(
    (requestId: string) => data.quotes.filter((q) => q.requestId === requestId),
    [data.quotes],
  );

  /**
   * Submit an RFQ: create the request for the chosen (validated) suppliers and
   * generate their deterministic Demo Quotes. Returns the new request id.
   */
  const submit = React.useCallback(
    (spec: CustomFurnitureSpec, chosenSupplierIds: string[]) => {
      const now = Date.now();
      const id = `cr_${now.toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
      const recipients = buildRecipients(demoSuppliers, spec, chosenSupplierIds);
      const request: CustomRequest = {
        id,
        customerId,
        spec,
        recipients,
        status: "quotes_received",
        isDemo: true,
        createdAt: now,
        updatedAt: now,
      };
      const recipientSuppliers = demoSuppliers.filter((s) => recipients.some((r) => r.supplierId === s.id));
      const quotes = generateDemoQuotes(id, spec, recipientSuppliers, now);
      const cur = store.get();
      store.set({ requests: [request, ...cur.requests], quotes: [...quotes, ...cur.quotes] });
      return id;
    },
    [customerId],
  );

  /** Accept a quote (owner only in demo — this store is per-browser). Locks it. */
  const accept = React.useCallback((requestId: string, quoteId: string) => {
    const cur = store.get();
    const req = cur.requests.find((r) => r.id === requestId && r.customerId === customerId);
    if (!req) return;
    // An already-accepted quote on this request is locked (§16/§29).
    const alreadyAccepted = cur.quotes.some((q) => q.requestId === requestId && isAcceptedLocked(q.status));
    if (alreadyAccepted) return;
    store.set({
      requests: cur.requests.map((r) =>
        r.id === requestId ? { ...r, status: "accepted", updatedAt: Date.now() } : r,
      ),
      quotes: cur.quotes.map((q) =>
        q.requestId === requestId
          ? { ...q, status: q.id === quoteId ? "accepted" : q.status === "submitted" ? "declined" : q.status }
          : q,
      ),
    });
  }, [customerId]);

  const cancel = React.useCallback((requestId: string) => {
    const cur = store.get();
    store.set({
      requests: cur.requests.filter((r) => !(r.id === requestId && r.customerId === customerId)),
      quotes: cur.quotes.filter((q) => q.requestId !== requestId),
    });
  }, [customerId]);

  return { requests, quotesFor, hydrated, submit, accept, cancel };
}

/**
 * Persist a supplier-submitted quote (§23). Only applies to a request the
 * supplier was actually addressed (recipient check), and never overwrites an
 * already-accepted quote (§16). Replaces the supplier's own prior quote if any.
 * A module function (not a hook) so the supplier form can call it on submit.
 */
export function submitSupplierQuote(requestId: string, supplierId: string, input: QuoteInput): boolean {
  const cur = store.get();
  const req = cur.requests.find((r) => r.id === requestId);
  // Authorization mirror: the supplier must be an addressed recipient.
  if (!req || !req.recipients.some((rc) => rc.supplierId === supplierId)) return false;
  const existing = cur.quotes.find((q) => q.requestId === requestId && q.supplierId === supplierId);
  if (existing && isAcceptedLocked(existing.status)) return false; // accepted is locked
  const total = quoteTotal(input.basePrice, input.deliveryFee, input.installationFee);
  const now = Date.now();
  const quote: Quote = {
    id: existing?.id ?? `sq_${now.toString(36)}_${supplierId}`,
    requestId,
    supplierId,
    basePrice: input.basePrice,
    deliveryFee: input.deliveryFee,
    installationFee: input.installationFee,
    total,
    currency: "OMR",
    manufacturingDays: input.manufacturingDays,
    warrantyText: input.warrantyText,
    notes: input.notes,
    status: "submitted",
    isDemo: true,
    validUntil: now + input.validDays * 24 * 60 * 60 * 1000,
    createdAt: now,
  };
  const quotes = existing
    ? cur.quotes.map((q) => (q.id === existing.id ? quote : q))
    : [quote, ...cur.quotes];
  store.set({ requests: cur.requests, quotes });
  return true;
}

/** Read-only view for the supplier RFQ dashboard: requests addressed to a supplier. */
export function useSupplierRFQ(supplierId: string) {
  const data = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = React.useSyncExternalStore(store.subscribe, alwaysTrue, alwaysFalse);

  const requests = React.useMemo(
    () => data.requests.filter((r) => r.recipients.some((rc) => rc.supplierId === supplierId)),
    [data.requests, supplierId],
  );
  const quoteFor = React.useCallback(
    (requestId: string) => data.quotes.find((q) => q.requestId === requestId && q.supplierId === supplierId) ?? null,
    [data.quotes, supplierId],
  );

  return { requests, quoteFor, hydrated };
}
