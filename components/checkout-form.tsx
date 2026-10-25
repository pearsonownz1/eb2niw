"use client";

import { useActionState, type FormEvent } from "react";
import { recordPendingPlan, type CheckoutState } from "@/app/actions/checkout";
import { ELIGIBILITY_STORAGE_KEY } from "@/lib/eligibility-draft";
import type { PlanId } from "@/lib/plans";

const idle: CheckoutState = { message: "" };

export function CheckoutForm({ plan }: { plan: PlanId }) {
  const [state, action, pending] = useActionState(recordPendingPlan, idle);

  function attachDraft(event: FormEvent<HTMLFormElement>) {
    const field = event.currentTarget.elements.namedItem("eligibility");
    if (field instanceof HTMLInputElement) {
      field.value = sessionStorage.getItem(ELIGIBILITY_STORAGE_KEY) ?? "";
    }
  }

  return (
    <form action={action} className="mt-8" onSubmit={attachDraft}>
      <input type="hidden" name="plan" value={plan} />
      <input type="hidden" name="eligibility" defaultValue="" />
      <p className="text-sm leading-relaxed text-muted">
        Stripe is not connected. This step does not charge a card. It saves the plan as pending payment and opens the workspace.
      </p>
      {state.message ? (
        <p role="alert" className="mt-4 text-sm font-semibold text-danger">
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gold px-5 text-sm font-semibold text-near disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {pending ? "Saving" : "Continue (payment coming soon)"}
      </button>
    </form>
  );
}
