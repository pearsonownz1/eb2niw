"use client";

import { useActionState } from "react";
import { signIn, signInWithGoogle, signUp, type AuthFormState } from "@/app/actions/auth";

const idle: AuthFormState = { message: "" };

const fieldClass =
  "mt-2 w-full rounded-xl border border-line bg-raised px-4 py-3 text-base font-normal text-ink";

export function AuthForm({
  mode,
  plan,
  nextPath,
}: {
  mode: "signup" | "login";
  plan: string | null;
  nextPath: string | null;
}) {
  const action = mode === "signup" ? signUp : signIn;
  const [state, formAction, pending] = useActionState(action, idle);
  const [googleState, googleAction, googlePending] = useActionState(signInWithGoogle, idle);
  const emailId = mode === "signup" ? "signup-email" : "login-email";
  const passwordId = mode === "signup" ? "signup-password" : "login-password";

  return (
    <div className="mt-8">
      <form action={googleAction}>
        {plan ? <input type="hidden" name="plan" value={plan} /> : null}
        {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
        <button
          type="submit"
          disabled={googlePending || pending}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-line bg-raised px-5 text-sm font-semibold text-near disabled:cursor-wait disabled:opacity-70"
        >
          {googlePending ? "Connecting" : "Continue with Google"}
        </button>
      </form>
      {googleState.message ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-danger">
          {googleState.message}
        </p>
      ) : null}
      <p className="my-6 text-center text-xs font-semibold tracking-[0.14em] text-muted">OR</p>
      <form action={formAction} className="grid gap-4">
        {plan ? <input type="hidden" name="plan" value={plan} /> : null}
        {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
        <label className="block text-sm font-semibold text-near" htmlFor={emailId}>
          Email
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={320}
            placeholder="you@example.com"
            aria-invalid={Boolean(state.message)}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold text-near" htmlFor={passwordId}>
          Password
          <input
            id={passwordId}
            name="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={mode === "signup" ? 8 : 1}
            maxLength={72}
            className={fieldClass}
          />
        </label>
        {mode === "signup" ? (
          <p className="text-sm text-muted">Use at least 8 characters.</p>
        ) : null}
        {state.message ? (
          <p role="alert" className="text-sm font-semibold text-danger">
            {state.message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending || googlePending}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-5 text-sm font-semibold text-near disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Working" : mode === "signup" ? "Create account" : "Log in"}
        </button>
      </form>
    </div>
  );
}
