"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signInAction, signUpAction } from "@/lib/auth/actions";
import type { AuthResult } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

/**
 * Shared auth form for /login and /signup. Submits to a server action (the
 * session cookie is set server-side); on success it navigates to the account
 * page and refreshes so the server re-reads the new session. In Demo Mode the
 * account is a clearly-labelled local session.
 */
export function AuthForm({
  mode,
  t,
  locale,
  isDemo,
  redirectTo,
}: {
  mode: "login" | "signup";
  t: Dictionary["auth"];
  locale: Locale;
  isDemo: boolean;
  redirectTo: string;
}) {
  const router = useRouter();
  const action = mode === "login" ? signInAction : signUpAction;
  const [state, formAction, pending] = useActionState<AuthResult | null, FormData>(
    action,
    null,
  );

  React.useEffect(() => {
    if (state?.ok) {
      router.push(redirectTo);
      router.refresh();
    }
  }, [state, router, redirectTo]);

  const Icon = mode === "login" ? LogIn : UserPlus;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl">{mode === "login" ? t.loginTitle : t.signupTitle}</h1>
          <p className="mt-2 text-muted">
            {mode === "login" ? t.loginSubtitle : t.signupSubtitle}
          </p>
        </div>
        {isDemo && <Badge tone="neutral">{t.demoBadge}</Badge>}
      </div>

      {isDemo && (
        <p className="mb-5 rounded-lg border border-border-subtle bg-surface px-4 py-3 text-xs leading-relaxed text-muted">
          {t.demoNote}
        </p>
      )}

      {state && !state.ok && (
        <p className="mb-4 rounded-lg border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-danger" role="alert">
          {t.errors[state.code]}
        </p>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="locale" value={locale} />

        {mode === "signup" && (
          <FormField id="displayName" label={t.displayName} name="displayName" autoComplete="name" required />
        )}
        <FormField
          id="email"
          label={t.email}
          name="email"
          type="email"
          placeholder={t.emailPlaceholder}
          autoComplete="email"
          dir="ltr"
          required
        />
        <FormField
          id="password"
          label={t.password}
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          hint={mode === "signup" ? t.passwordHint : undefined}
          required
        />

        <Button type="submit" size="lg" loading={pending} className="mt-1 w-full" iconStart={<Icon className="size-4.5" strokeWidth={1.75} />}>
          {mode === "login"
            ? pending ? t.signingIn : t.signIn
            : pending ? t.signingUp : t.signUp}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {mode === "login" ? t.noAccount : t.haveAccount}{" "}
        <Link
          href={mode === "login" ? `/${locale}/signup` : `/${locale}/login`}
          className="font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {mode === "login" ? t.toSignup : t.toLogin}
        </Link>
      </p>
    </div>
  );
}

function FormField({
  id,
  label,
  hint,
  className,
  ...props
}: {
  id: string;
  label: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={cn(
          "mt-1.5 h-11 w-full rounded-lg border border-border bg-elevated px-4 text-[0.95rem] text-foreground shadow-[var(--shadow-xs)]",
          "placeholder:text-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25",
          className,
        )}
        {...props}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-subtle">
          {hint}
        </p>
      )}
    </div>
  );
}
