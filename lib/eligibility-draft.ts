import { recommendPlan, signupPlanFor, toQuizAnswers, type PlanSuggestion, type QuizAnswers } from "@/lib/intake";
import type { PlanId } from "@/lib/plans";

export const ELIGIBILITY_STORAGE_KEY = "eb2niw.eligibility";

export type EligibilityDraft = {
  answers: QuizAnswers;
  suggestion: PlanSuggestion;
  signupPlan: PlanId;
};

export function persistEligibility(answers: QuizAnswers): PlanId {
  const suggestion = recommendPlan(answers);
  const signupPlan = signupPlanFor(suggestion);
  const draft: EligibilityDraft = { answers, suggestion, signupPlan };
  sessionStorage.setItem(ELIGIBILITY_STORAGE_KEY, JSON.stringify(draft));
  return signupPlan;
}

export function readEligibilityDraft(): EligibilityDraft | null {
  const raw = sessionStorage.getItem(ELIGIBILITY_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  return parseEligibilityPayload(raw);
}

export function parseEligibilityPayload(raw: string): EligibilityDraft | null {
  if (raw.length > 8000) {
    return null;
  }
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!data || typeof data !== "object") {
    return null;
  }
  const answers = toQuizAnswers((data as { answers?: Parameters<typeof toQuizAnswers>[0] }).answers ?? {});
  if (!answers) {
    return null;
  }
  const suggestion = recommendPlan(answers);
  return { answers, suggestion, signupPlan: signupPlanFor(suggestion) };
}
