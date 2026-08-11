"use client";

import Link from "next/link";
import { PackagePlus, Trash2 } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { categoryBySlug, formatOmr, label } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRFQ } from "./rfq-store";

/**
 * Custom-furniture requests in the account (§25). Read-only summary of the
 * customer's requests + how many quotes each received; not a project-management
 * dashboard. Demo mode reads the local RFQ store; owner-scoped by RLS on Supabase.
 */
export function AccountCustomRequests({
  t,
  locale,
  customerId,
}: {
  t: Dictionary["custom"];
  locale: Locale;
  customerId: string;
}) {
  const { requests, quotesFor, hydrated, cancel } = useRFQ(customerId);
  const ta = t.account;

  if (!hydrated) return null;

  return (
    <section>
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <PackagePlus className="size-5 text-brand" strokeWidth={1.75} aria-hidden="true" />
        {ta.title}
      </h2>

      {requests.length === 0 ? (
        <div className="mt-3 rounded-xl border border-border-subtle bg-surface px-4 py-6">
          <p className="text-sm text-muted">{ta.empty}</p>
          <Button href={`/${locale}/custom`} size="sm" variant="secondary" className="mt-3">
            {ta.startCta}
          </Button>
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {requests.map((r) => {
            const cat = categoryBySlug.get(r.spec.category);
            const quoteCount = quotesFor(r.id).length;
            return (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-subtle bg-elevated p-4">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {cat ? label(cat.name, locale) : r.spec.category}
                    {r.spec.budget !== undefined && (
                      <span className="text-muted"> · {formatOmr(r.spec.budget, locale)}</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    {ta.quotesCount.replace("{count}", String(quoteCount))}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={r.status === "accepted" ? "success" : "neutral"}>
                    {ta.status[r.status]}
                  </Badge>
                  <Link
                    href={`/${locale}/custom`}
                    className="rounded-full border border-border bg-elevated px-3 py-1.5 text-sm font-medium text-foreground hover:border-taupe hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {ta.view}
                  </Link>
                  <button
                    type="button"
                    onClick={() => cancel(r.id)}
                    aria-label={ta.remove}
                    className="inline-flex size-8 items-center justify-center rounded-full text-muted hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
