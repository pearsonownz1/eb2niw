"use server";

import { redirect } from "next/navigation";
import { parseEligibilityPayload } from "@/lib/eligibility-draft";
import { readPlanId } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";

export type CheckoutState = {
  message: string;
};

export async function recordPendingPlan(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const plan = readPlanId(formData.get("plan"));
  if (!plan) {
    return { message: "Choose a plan before continuing." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { message: "Supabase is not configured, so the plan could not be saved." };
  }

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/checkout?plan=${plan}`)}`);
  }

  const { error: planError } = await supabase.from("plan_selections").insert({
    user_id: user.id,
    plan,
    status: "pending_payment",
    stripe_price_id: plan === "diy" ? "price_diy_placeholder" : "price_attorney_review_placeholder",
  });

  if (planError) {
    console.error("plan insert failed", planError.code ?? "unknown");
    return {
      message: "The plan could not be saved. Apply the latest Supabase migrations, then try again.",
    };
  }

  const draftRaw = formData.get("eligibility");
  if (typeof draftRaw === "string" && draftRaw.trim()) {
    const draft = parseEligibilityPayload(draftRaw);
    if (draft) {
      const { error: eligibilityError } = await supabase.from("eligibility_responses").insert({
        user_id: user.id,
        degree: draft.answers.degree,
        years_experience: draft.answers.years,
        progressive_experience: draft.answers.progressive,
        exceptional_criteria: draft.answers.criteria,
        prong_merit: draft.answers.merit,
        prong_positioned: draft.answers.positioned,
        prong_balance: draft.answers.balance,
        plan_suggestion: draft.suggestion,
      });
      if (eligibilityError) {
        console.error("eligibility insert failed", eligibilityError.code ?? "unknown");
      }
    }
  }

  redirect("/dashboard");
}
