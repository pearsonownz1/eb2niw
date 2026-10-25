"use client";

import { useActionState, useId } from "react";
import { joinWaitlist } from "@/app/actions/waitlist";
import { idleWaitlistState } from "@/lib/waitlist";

export function EmailSignup({
  tone = "dark",
  note = "The guided software is not open yet. This saves your email so we can write when you can start a petition.",
  buttonLabel = "Join the waitlist",
}: {
  tone?: "dark" | "light";
  note?: string;
  buttonLabel?: string;
}) {
  const [state, action, pending] = useActionState(joinWaitlist, idleWaitlistState);
  const emailId = useId();
  const statusId = useId();
  const onDark = tone === "dark";

  return (
    <form action={action} className="relative space-y-3">
      <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label
        htmlFor={emailId}
        className={`block text-sm font-semibold ${onDark ? "text-paper" : "text-navy"}`}
      >
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={emailId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={320}
          placeholder="you@example.com"
          aria-invalid={state.status === "error"}
          aria-describedby={state.message ? statusId : undefined}
          className="min-w-0 flex-1 rounded-md border border-line bg-raised px-3 py-3 text-base text-ink placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={pending}
          className={`rounded-md px-5 py-3 text-sm font-semibold disabled:cursor-wait disabled:opacity-70 ${
            onDark ? "bg-paper text-navy" : "bg-navy text-paper"
          }`}
        >
          {pending ? "Saving" : buttonLabel}
        </button>
      </div>
      <p className={`text-sm leading-relaxed ${onDark ? "text-paper/75" : "text-muted"}`}>
        {note}
      </p>
      {state.message ? (
        <p
          id={statusId}
          role={state.status === "error" ? "alert" : "status"}
          className={`text-sm font-semibold ${
            state.status === "error"
              ? onDark
                ? "text-red-100"
                : "text-danger"
              : onDark
                ? "text-emerald-100"
                : "text-good"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
