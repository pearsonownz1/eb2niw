export const quizSteps = [
  {
    key: "degree",
    kind: "single",
    section: "YOUR BACKGROUND",
    question: "What is your highest completed degree?",
    options: [
      { value: "bachelor", label: "Bachelor's degree, from the U.S. or a foreign equivalent" },
      { value: "master", label: "U.S. master's degree, or a foreign equivalent" },
      { value: "phd", label: "U.S. doctorate, or another degree above a master's, or a foreign equivalent" },
      { value: "other", label: "Another credential, or none yet" },
    ],
  },
  {
    key: "years",
    kind: "single",
    section: "YOUR BACKGROUND",
    question: "How many years of experience do you have in your field?",
    options: [
      { value: "under_2", label: "Less than 2 years" },
      { value: "two_to_four", label: "2-4 years" },
      { value: "five_to_nine", label: "5-9 years" },
      { value: "ten_plus", label: "10+ years" },
    ],
  },
  {
    key: "progressive",
    kind: "single",
    section: "YOUR BACKGROUND",
    question: "Thinking about work after a bachelor's degree, which of these is closer?",
    options: [
      { value: "yes", label: "At least 5 years came after the degree and grew in responsibility in the specialty" },
      { value: "no", label: "That does not describe my experience" },
      { value: "not_applicable", label: "My highest degree is already above a bachelor's" },
    ],
  },
  {
    key: "criteria",
    kind: "multi",
    section: "YOUR BACKGROUND",
    question: "Which of these describe your background?",
    hint: "Select every one that applies.",
    exclusive: "none",
    options: [
      { value: "academic_record", label: "An official academic record of a degree, diploma, or certificate in your field" },
      { value: "ten_year_letters", label: "Employer letters showing at least 10 years of full-time experience in the occupation" },
      { value: "license", label: "A license or certification for your profession" },
      { value: "salary", label: "Pay or other compensation that stands out in your field" },
      { value: "membership", label: "Membership in a professional association" },
      { value: "recognition", label: "Recognition of your achievements by peers, a government, or a professional or business organization" },
      { value: "none", label: "None of these" },
    ],
  },
  {
    key: "merit",
    kind: "single",
    section: "YOUR ENDEAVOR",
    question: "How would you describe the endeavor you have in mind?",
    options: [
      { value: "yes", label: "It has real substance, and it matters beyond one employer" },
      { value: "partly", label: "The broader importance is still unclear to me" },
      { value: "not_yet", label: "I have not shaped the endeavor yet" },
    ],
  },
  {
    key: "positioned",
    kind: "single",
    section: "YOUR ENDEAVOR",
    question: "How prepared do you feel to carry that endeavor forward?",
    options: [
      { value: "yes", label: "My education, record, and plan feel aligned with it" },
      { value: "partly", label: "Some of that record still feels thin" },
      { value: "not_yet", label: "I am not there yet" },
    ],
  },
  {
    key: "balance",
    kind: "single",
    section: "YOUR ENDEAVOR",
    question: "How do you feel about moving ahead without an employer sponsor?",
    options: [
      { value: "yes", label: "A job offer would be a poor fit, or the work could help even if other people do similar jobs" },
      { value: "partly", label: "I am unsure about that balance" },
      { value: "not_yet", label: "I have not thought this through yet" },
    ],
  },
] as const;

export type QuizStep = (typeof quizSteps)[number];
export type QuizStepKey = QuizStep["key"];
type SingleStep = Extract<QuizStep, { kind: "single" }>;
type MultiStep = Extract<QuizStep, { kind: "multi" }>;
export type SingleKey = SingleStep["key"];
export type MultiKey = MultiStep["key"];

type OptionValue<K extends QuizStepKey> = Extract<QuizStep, { key: K }>["options"][number]["value"];

export type QuizAnswers = {
  [K in SingleKey]: OptionValue<K>;
} & {
  [K in MultiKey]: OptionValue<K>[];
};

export type DraftAnswers = {
  [K in SingleKey]?: QuizAnswers[K];
} & {
  [K in MultiKey]?: QuizAnswers[K];
};

export const answerFieldNames: Record<QuizStepKey, string> = {
  degree: "degree",
  years: "years_experience",
  progressive: "progressive_experience",
  criteria: "exceptional_criteria",
  merit: "prong_merit",
  positioned: "prong_positioned",
  balance: "prong_balance",
};

export type PlanSuggestion = "diy" | "attorney_review" | "stretch";

export const recommendationTitles: Record<PlanSuggestion, string> = {
  diy: "Based on your answers, our DIY tools look like a good fit",
  attorney_review: "You may want attorney review",
  stretch: "You may want to talk with an attorney first",
};

export type IntakeState = {
  status: "idle" | "saved" | "error";
  message: string;
  plan: PlanSuggestion | null;
};

export const idleIntakeState: IntakeState = {
  status: "idle",
  message: "",
  plan: null,
};

function readSingle<K extends SingleKey>(key: K, value: unknown): QuizAnswers[K] | null {
  if (typeof value !== "string") {
    return null;
  }
  const step = quizSteps.find((item) => item.key === key);
  if (!step || step.kind !== "single") {
    return null;
  }
  const match = step.options.find((option) => option.value === value);
  return match ? (match.value as QuizAnswers[K]) : null;
}

function readMulti<K extends MultiKey>(key: K, values: readonly string[]): QuizAnswers[K] | null {
  const step = quizSteps.find((item) => item.key === key);
  if (!step || step.kind !== "multi") {
    return null;
  }
  const allowed = step.options.map((option) => option.value);
  const unique = [...new Set(values)];
  if (unique.length === 0 || unique.some((item) => !allowed.includes(item as (typeof allowed)[number]))) {
    return null;
  }
  if (step.exclusive && unique.includes(step.exclusive) && unique.length !== 1) {
    return null;
  }
  const ordered = allowed.filter((item) => unique.includes(item));
  return ordered as QuizAnswers[K];
}

function categoryBasis(answers: QuizAnswers): { advanced: boolean; exceptional: boolean } {
  const fiveYears = answers.years === "five_to_nine" || answers.years === "ten_plus";
  const advanced =
    answers.degree === "master" ||
    answers.degree === "phd" ||
    (answers.degree === "bachelor" && fiveYears && answers.progressive === "yes");
  const criteriaCount = answers.criteria.includes("none") ? 0 : answers.criteria.length;
  return { advanced, exceptional: criteriaCount >= 3 };
}

function waiverProngsReady(answers: QuizAnswers): boolean {
  return answers.merit === "yes" && answers.positioned === "yes" && answers.balance === "yes";
}

/**
 * Suggests a product plan from the self-assessment. The same facts the EB-2
 * category is built around — degree level, post-degree experience, the six
 * background items, and the three endeavor questions — choose the plan.
 * DIY when the background and the endeavor answers are all in the stronger
 * set. Attorney review when the background is there and an endeavor answer
 * is still partial. An attorney-first suggestion when the background answers
 * are thin. Nothing here is a score or a decision for USCIS.
 */
export function recommendPlan(answers: QuizAnswers): PlanSuggestion {
  const basis = categoryBasis(answers);
  if (!basis.advanced && !basis.exceptional) {
    return "stretch";
  }
  if (waiverProngsReady(answers)) {
    return "diy";
  }
  return "attorney_review";
}

export function recommendationCopy(answers: QuizAnswers): { title: string; body: string } {
  const plan = recommendPlan(answers);

  if (plan === "diy") {
    return {
      title: recommendationTitles.diy,
      body: "Start with DIY. You would use the questionnaire, the evidence checklist, and the petition letter builder. Attorney review can be added later.",
    };
  }

  if (plan === "attorney_review") {
    return {
      title: recommendationTitles.attorney_review,
      body: "Start with DIY + Attorney Review. You would use the same guided software, with an independent attorney on the package.",
    };
  }

  return {
    title: recommendationTitles.stretch,
    body: "The Premium plan includes an attorney consultation and case strategy call. That is the plan to start with from these answers.",
  };
}

export function toQuizAnswers(input: DraftAnswers): QuizAnswers | null {
  const degree = readSingle("degree", input.degree);
  const years = readSingle("years", input.years);
  const progressive = readSingle("progressive", input.progressive);
  const criteria = readMulti("criteria", input.criteria ?? []);
  const merit = readSingle("merit", input.merit);
  const positioned = readSingle("positioned", input.positioned);
  const balance = readSingle("balance", input.balance);

  if (!degree || !years || !progressive || !criteria || !merit || !positioned || !balance) {
    return null;
  }

  return { degree, years, progressive, criteria, merit, positioned, balance };
}

export function intakeFields(answers: QuizAnswers): { name: string; value: string }[] {
  return [
    { name: answerFieldNames.degree, value: answers.degree },
    { name: answerFieldNames.years, value: answers.years },
    { name: answerFieldNames.progressive, value: answers.progressive },
    ...answers.criteria.map((value) => ({ name: answerFieldNames.criteria, value })),
    { name: answerFieldNames.merit, value: answers.merit },
    { name: answerFieldNames.positioned, value: answers.positioned },
    { name: answerFieldNames.balance, value: answers.balance },
  ];
}

function readName(value: FormDataEntryValue | null, label: string): { ok: true; name: string } | { ok: false; message: string } {
  if (typeof value !== "string") {
    return { ok: false, message: `Enter your ${label}.` };
  }

  const name = value.trim().replace(/\s+/g, " ");
  if (name.length < 1 || name.length > 80 || !/\p{L}/u.test(name)) {
    return { ok: false, message: `Enter your ${label}.` };
  }

  return { ok: true, name };
}

function formStrings(formData: FormData, name: string): string[] {
  return formData.getAll(name).filter((value): value is string => typeof value === "string");
}

export function readIntake(formData: FormData):
  | {
      ok: true;
      answers: QuizAnswers;
      plan: PlanSuggestion;
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
      marketingConsent: boolean;
    }
  | { ok: false; message: string } {
  const raw: DraftAnswers = {
    degree: readSingle("degree", formData.get(answerFieldNames.degree)) ?? undefined,
    years: readSingle("years", formData.get(answerFieldNames.years)) ?? undefined,
    progressive: readSingle("progressive", formData.get(answerFieldNames.progressive)) ?? undefined,
    criteria: readMulti("criteria", formStrings(formData, answerFieldNames.criteria)) ?? undefined,
    merit: readSingle("merit", formData.get(answerFieldNames.merit)) ?? undefined,
    positioned: readSingle("positioned", formData.get(answerFieldNames.positioned)) ?? undefined,
    balance: readSingle("balance", formData.get(answerFieldNames.balance)) ?? undefined,
  };

  const answers = toQuizAnswers(raw);
  if (!answers) {
    return { ok: false, message: "Answer each question before saving." };
  }

  const firstName = readName(formData.get("first_name"), "first name");
  if (!firstName.ok) {
    return firstName;
  }
  const lastName = readName(formData.get("last_name"), "last name");
  if (!lastName.ok) {
    return lastName;
  }

  const emailRaw = formData.get("email");
  const email = typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length < 6 || email.length > 320) {
    return { ok: false, message: "Enter a valid email address." };
  }

  const phoneRaw = formData.get("phone");
  const phoneText = typeof phoneRaw === "string" ? phoneRaw.trim() : "";
  let phone: string | null = null;
  if (phoneText) {
    if (!/^[0-9+().\-\s]{7,40}$/.test(phoneText)) {
      return { ok: false, message: "Enter a phone number, or leave it blank." };
    }
    phone = phoneText;
  }

  return {
    ok: true,
    answers,
    plan: recommendPlan(answers),
    firstName: firstName.name,
    lastName: lastName.name,
    email,
    phone,
    marketingConsent: formData.get("marketing_consent") === "yes",
  };
}

export function signupPlanFor(plan: PlanSuggestion): "diy" | "attorney_review" {
  return plan === "diy" ? "diy" : "attorney_review";
}

export function savedIntakeMessage(marketingConsent: boolean): string {
  if (marketingConsent) {
    return "Saved. We will email you when the guided software opens.";
  }
  return "Saved. The petition software is not open yet.";
}
