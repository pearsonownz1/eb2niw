import { recommendPlan, toQuizAnswers, type DraftAnswers, type QuizAnswers } from "@/lib/intake";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function normalizeOptInEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  if (email.length < 6 || email.length > 320 || !EMAIL_PATTERN.test(email)) {
    return null;
  }
  return email;
}

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export type FitSubmissionRow = {
  id: string;
  degree: QuizAnswers["degree"];
  years_experience: QuizAnswers["years"];
  progressive_experience: QuizAnswers["progressive"];
  exceptional_criteria: QuizAnswers["criteria"];
  prong_merit: QuizAnswers["merit"];
  prong_positioned: QuizAnswers["positioned"];
  prong_balance: QuizAnswers["balance"];
  plan_suggestion: ReturnType<typeof recommendPlan>;
  news_optin: boolean;
  email: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function readFitSubmission(input: {
  submissionId: unknown;
  answers: unknown;
  newsOptIn: unknown;
  email: unknown;
}): { ok: true; row: FitSubmissionRow } | { ok: false; message: string } {
  if (typeof input.submissionId !== "string" || !isUuid(input.submissionId)) {
    return { ok: false, message: "We could not save this submission. Please try again." };
  }

  const source = isRecord(input.answers) ? input.answers : {};
  const draft: DraftAnswers = {
    degree: typeof source.degree === "string" ? (source.degree as DraftAnswers["degree"]) : undefined,
    years: typeof source.years === "string" ? (source.years as DraftAnswers["years"]) : undefined,
    progressive: typeof source.progressive === "string" ? (source.progressive as DraftAnswers["progressive"]) : undefined,
    criteria: Array.isArray(source.criteria)
      ? source.criteria.filter((item): item is string => typeof item === "string") as DraftAnswers["criteria"]
      : undefined,
    merit: typeof source.merit === "string" ? (source.merit as DraftAnswers["merit"]) : undefined,
    positioned: typeof source.positioned === "string" ? (source.positioned as DraftAnswers["positioned"]) : undefined,
    balance: typeof source.balance === "string" ? (source.balance as DraftAnswers["balance"]) : undefined,
  };
  const answers = toQuizAnswers(draft);
  if (!answers) {
    return { ok: false, message: "Answer each question before submitting." };
  }

  if (input.newsOptIn !== true && input.newsOptIn !== false) {
    return { ok: false, message: "Choose yes or no before submitting." };
  }

  let email: string | null = null;
  if (input.newsOptIn) {
    email = typeof input.email === "string" ? normalizeOptInEmail(input.email) : null;
    if (!email) {
      return { ok: false, message: "Enter a valid email address." };
    }
  }

  return {
    ok: true,
    row: {
      id: input.submissionId,
      degree: answers.degree,
      years_experience: answers.years,
      progressive_experience: answers.progressive,
      exceptional_criteria: [...answers.criteria],
      prong_merit: answers.merit,
      prong_positioned: answers.positioned,
      prong_balance: answers.balance,
      plan_suggestion: recommendPlan(answers),
      news_optin: input.newsOptIn,
      email,
    },
  };
}
