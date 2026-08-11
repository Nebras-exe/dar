"use client";

import * as React from "react";
import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { submitSupplierApplicationAction, type ApplyResult } from "@/lib/repository/actions";
import type { SupplierType } from "@/lib/repository";
import { cn } from "@/lib/utils";

const TYPES: SupplierType[] = ["showroom", "factory", "workshop", "importer", "studio"];

/**
 * Supplier application form (§18). Submits to a validated server action.
 * Applications are reviewed — never auto-approved. In Demo Mode the submission is
 * acknowledged locally and clearly labelled.
 */
export function SupplierApplyForm({
  t,
  tTypes,
  isDemo,
  signedIn,
}: {
  t: Dictionary["suppliers"];
  tTypes: Dictionary["suppliers"]["types"];
  isDemo: boolean;
  signedIn: boolean;
}) {
  const [state, formAction, pending] = useActionState<ApplyResult | null, FormData>(
    submitSupplierApplicationAction,
    null,
  );
  const ta = t.apply;
  const errors = state && !state.ok ? state.errors : [];
  const errorFor = (field: string) => errors.find((e) => e.field === field);

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-success/40 bg-success-soft p-6 text-center">
        <CheckCircle2 className="mx-auto size-8 text-success" strokeWidth={1.75} aria-hidden="true" />
        <h2 className="mt-3 text-xl font-semibold text-foreground">{ta.submittedTitle}</h2>
        <p className="mt-2 text-sm text-muted">{ta.submittedBody}</p>
        {state.demo && <p className="mt-3 text-xs text-subtle">{ta.demoNote}</p>}
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {isDemo && (
        <p className="rounded-lg border border-border-subtle bg-surface px-4 py-3 text-xs leading-relaxed text-muted">
          {ta.demoNote}
        </p>
      )}
      {!signedIn && <Badge tone="neutral" className="w-fit">{ta.signedOutNote}</Badge>}

      {errors.length > 0 && (
        <p className="rounded-lg border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-danger" role="alert">
          {ta.errorsTitle}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="businessName" name="businessName" label={ta.businessName} required error={errorFor("businessName") && ta.errors.businessName} />
        <TextField id="businessNameAr" name="businessNameAr" label={ta.businessNameAr} dir="rtl" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className="text-sm font-medium text-foreground">{ta.type}</label>
          <select
            id="type"
            name="type"
            defaultValue="showroom"
            className="mt-1.5 h-11 w-full rounded-lg border border-border bg-elevated px-3 text-[0.95rem] text-foreground shadow-[var(--shadow-xs)] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
          >
            {TYPES.map((ty) => (
              <option key={ty} value={ty}>{tTypes[ty]}</option>
            ))}
          </select>
        </div>
        <TextField id="location" name="location" label={ta.location} required error={errorFor("location") && ta.errors.location} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="contactEmail" name="contactEmail" label={ta.contactEmail} type="email" dir="ltr" required error={errorFor("contactEmail") && ta.errors.contactEmail} />
        <TextField id="contactPhone" name="contactPhone" label={ta.contactPhone} type="tel" dir="ltr" />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium text-foreground">{ta.description}</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={2000}
          className="mt-1.5 w-full resize-y rounded-lg border border-border bg-elevated px-4 py-2.5 text-[0.95rem] leading-relaxed text-foreground shadow-[var(--shadow-xs)] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
        />
      </div>

      <Button type="submit" size="lg" loading={pending} className="w-fit" iconStart={<Send className="size-4.5" strokeWidth={1.75} />}>
        {pending ? ta.submitting : ta.submit}
      </Button>
    </form>
  );
}

function TextField({
  id,
  label,
  hint,
  error,
  className,
  ...props
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string | false;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        className={cn(
          "mt-1.5 h-11 w-full rounded-lg border bg-elevated px-4 text-[0.95rem] text-foreground shadow-[var(--shadow-xs)]",
          "focus:outline-none focus:ring-2 focus:ring-brand/25",
          error ? "border-danger focus:border-danger" : "border-border focus:border-brand",
          className,
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-danger" role="alert">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-subtle">{hint}</p>
      ) : null}
    </div>
  );
}
