"use server";

import { createClient } from "@/lib/supabase/server";
import {
  idleIntakeState,
  readIntake,
  savedIntakeMessage,
  type IntakeState,
} from "@/lib/intake";

export async function submitIntake(
  previous: IntakeState = idleIntakeState,
  formData: FormData,
): Promise<IntakeState> {
  void previous;

  const honeypot = formData.get("company");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return {
      status: "saved",
      message: savedIntakeMessage(false),
      plan: null,
    };
  }

  const parsed = readIntake(formData);
  if (!parsed.ok) {
    return { status: "error", message: parsed.message, plan: null };
  }

  try {
    const supabase = await createClient();
    if (!supabase) {
      return {
        status: "error",
        plan: parsed.plan,
        message: "We could not store your answers because Supabase is not configured.",
      };
    }

    const { error } = await supabase.from("intake").insert({
      first_name: parsed.firstName,
      last_name: parsed.lastName,
      email: parsed.email,
      phone: parsed.phone,
      marketing_consent: parsed.marketingConsent,
      degree: parsed.answers.degree,
      years_experience: parsed.answers.years,
      progressive_experience: parsed.answers.progressive,
      exceptional_criteria: parsed.answers.criteria,
      prong_merit: parsed.answers.merit,
      prong_positioned: parsed.answers.positioned,
      prong_balance: parsed.answers.balance,
      plan_suggestion: parsed.plan,
    });

    if (error) {
      console.error("intake insert failed", error.code ?? "unknown");
      return {
        status: "error",
        plan: parsed.plan,
        message: "We could not store your answers. Please try again later.",
      };
    }
  } catch {
    console.error("intake insert failed", "exception");
    return {
      status: "error",
      plan: parsed.plan,
      message: "We could not store your answers. Please try again later.",
    };
  }

  return {
    status: "saved",
    plan: parsed.plan,
    message: savedIntakeMessage(parsed.marketingConsent),
  };
}
