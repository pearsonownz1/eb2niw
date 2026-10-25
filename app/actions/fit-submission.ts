"use server";

import { isUuid, readFitSubmission } from "@/lib/fit-submission";
import { createClient } from "@/lib/supabase/server";

export type FitActionResult = { ok: true } | { ok: false; message: string };

function honeypotFilled(company: unknown): boolean {
  return typeof company === "string" && company.trim() !== "";
}

export async function saveFitSubmission(input: {
  submissionId: string;
  answers: unknown;
  newsOptIn: boolean;
  email: string;
  company: string;
}): Promise<FitActionResult> {
  if (honeypotFilled(input.company)) {
    return { ok: true };
  }

  const parsed = readFitSubmission(input);
  if (!parsed.ok) {
    return parsed;
  }

  try {
    const supabase = await createClient();
    if (!supabase) {
      return { ok: true };
    }

    const { error } = await supabase.from("fit_submissions").insert(parsed.row);
    if (error) {
      console.error("fit submission insert failed", error.code ?? "unknown");
      if (error.code === "23514" || error.code === "22P02") {
        return { ok: false, message: "Enter a valid email address." };
      }
      return { ok: false, message: "We could not save your submission. Please try again." };
    }
  } catch {
    console.error("fit submission insert failed", "exception");
    return { ok: false, message: "We could not save your submission. Please try again." };
  }

  return { ok: true };
}

export async function recordConsultClick(input: {
  submissionId: string;
  company: string;
}): Promise<FitActionResult> {
  if (honeypotFilled(input.company)) {
    return { ok: true };
  }
  if (!isUuid(input.submissionId)) {
    return { ok: false, message: "The consultation click was not recorded." };
  }

  try {
    const supabase = await createClient();
    if (!supabase) {
      return { ok: true };
    }

    const { error } = await supabase.from("consult_clicks").insert({ submission_id: input.submissionId });
    if (error) {
      console.error("consult click insert failed", error.code ?? "unknown");
      return { ok: false, message: "The consultation click was not recorded." };
    }
  } catch {
    console.error("consult click insert failed", "exception");
    return { ok: false, message: "The consultation click was not recorded." };
  }

  return { ok: true };
}
