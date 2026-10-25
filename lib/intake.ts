export const quizSteps = [
  {
    key: "degree",
    kind: "single",
    question: "What is your highest completed degree?",
    options: [
      { value: "bachelor", label: "Bachelor's degree" },
      { value: "master", label: "Master's degree" },
      { value: "phd", label: "PhD or another doctorate" },
      { value: "other", label: "Another credential, or none yet" },
    ],
  },
  {
    key: "years",
    kind: "single",
    question: "How many years have you worked in your field?",
    options: [
      { value: "under_5", label: "Fewer than 5 years" },
      { value: "five_to_ten", label: "5 to 10 years" },
      { value: "ten_to_fifteen", label: "10 to 15 years" },
      { value: "fifteen_plus", label: "15 years or more" },
    ],
  },
  {
    key: "compensation",
    kind: "single",
    question: "What is your current annual compensation?",
    options: [
      { value: "under_80", label: "Under $80,000" },
      { value: "80_120", label: "$80,000 to $120,000" },
      { value: "120_200", label: "$120,000 to $200,000" },
      { value: "200_plus", label: "$200,000 or more" },
    ],
  },
  {
    key: "role",
    kind: "single",
    question: "Which best describes your role?",
    options: [
      { value: "entry", label: "Early career" },
      { value: "mid", label: "Mid-level" },
      { value: "senior", label: "Senior or lead" },
      { value: "principal", label: "Principal, director, or executive" },
    ],
  },
  {
    key: "signals",
    kind: "multi",
    question: "Which of these describe your record?",
    hint: "Select every one that applies.",
    exclusive: "none",
    options: [
      { value: "critical_role", label: "A critical role at an organization" },
      { value: "high_salary", label: "Pay that is high compared with peers" },
      { value: "original", label: "Original work, such as patents, inventions, or research" },
      { value: "authorship", label: "Publications or other authorship" },
      { value: "media", label: "Media coverage of the work" },
      { value: "judging", label: "Judging other people's work" },
      { value: "awards", label: "Awards for the work" },
      { value: "memberships", label: "Memberships that select their members" },
      { value: "commercial", label: "Commercial or business impact" },
      { value: "presentations", label: "Talks, exhibitions, or other public presentations" },
      { value: "none", label: "None of these" },
    ],
  },
  {
    key: "status",
    kind: "multi",
    question: "What is your current status?",
    hint: "Select every one that applies.",
    exclusive: null,
    options: [
      { value: "f1", label: "F-1 student" },
      { value: "h1b", label: "H-1B" },
      { value: "opt", label: "OPT or STEM OPT" },
      { value: "i485", label: "I-485 pending" },
      { value: "prior_denial", label: "A prior petition was denied" },
      { value: "outside_us", label: "I am outside the United States" },
      { value: "other", label: "Something else" },
    ],
  },
  {
    key: "writing",
    kind: "single",
    question: "How do you want to write the petition?",
    options: [
      { value: "confident", label: "I am confident drafting it myself" },
      { value: "guidance", label: "I can draft it, and I want guidance" },
      { value: "lawyer_check", label: "I want a lawyer to check the draft" },
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
  compensation: "compensation",
  role: "role_level",
  signals: "profile_signals",
  status: "current_status",
  writing: "writing_comfort",
};

export type PlanSuggestion = "diy" | "attorney_review" | "stretch";

export const recommendationTitles: Record<PlanSuggestion, string> = {
  diy: "DIY looks like a strong fit",
  attorney_review: "DIY + Attorney Review recommended",
  stretch: "NIW may be a stretch, an attorney consult is recommended",
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

/**
 * Suggests a product plan from the seven answers. The petition path is EB-2 NIW.
 * Profile signals carry the result. Zero or one signal is a stretch, even
 * with a doctorate, because the useful next step is an independent attorney.
 * Three or more signals are strong. Two signals are strong only when degree,
 * years, pay, and role add up. Strong signals plus confidence and no prior
 * denial suggest DIY. Anything else with enough signals suggests DIY +
 * Attorney Review. This is not a finding on eligibility.
 */
export function recommendPlan(answers: QuizAnswers): PlanSuggestion {
  const count = answers.signals.includes("none") ? 0 : answers.signals.length;
  if (count <= 1) {
    return "stretch";
  }

  let structure = 0;
  if (answers.degree === "phd") structure += 2;
  else if (answers.degree === "master") structure += 1;
  if (answers.years === "fifteen_plus") structure += 2;
  else if (answers.years === "ten_to_fifteen") structure += 1;
  if (answers.compensation === "200_plus") structure += 2;
  else if (answers.compensation === "120_200") structure += 1;
  if (answers.role === "principal") structure += 2;
  else if (answers.role === "senior") structure += 1;

  const strong = count >= 3 || structure >= 3;
  const priorDenial = answers.status.includes("prior_denial");
  if (strong && answers.writing === "confident" && !priorDenial) {
    return "diy";
  }

  return "attorney_review";
}

export function recommendationCopy(answers: QuizAnswers): { title: string; body: string } {
  const plan = recommendPlan(answers);

  if (plan === "diy") {
    return {
      title: recommendationTitles.diy,
      body: "DIY is the plan to start with. You would use the questionnaire, the evidence checklist, the petition letter builder for the three Dhanasar prongs, the recommendation letter kit, and a filing-ready package. Attorney review can be added later. This is a suggestion about which product to use. It is not a finding that you qualify for an NIW.",
    };
  }

  if (plan === "attorney_review") {
    return {
      title: recommendationTitles.attorney_review,
      body: "DIY + Attorney Review is the plan to start with. You would use the same guided software, then have an independent licensed immigration attorney review the full package and answer questions about the draft. This is a suggestion about which product to use. It is not a finding that you qualify for an NIW.",
    };
  }

  return {
    title: recommendationTitles.stretch,
    body: "These answers show few documented profile signals. An independent immigration attorney can tell you whether an EB‑2 NIW is worth preparing. EB2NIW does not make that call. This is not legal advice.",
  };
}

export function toQuizAnswers(input: DraftAnswers): QuizAnswers | null {
  const degree = readSingle("degree", input.degree);
  const years = readSingle("years", input.years);
  const compensation = readSingle("compensation", input.compensation);
  const role = readSingle("role", input.role);
  const writing = readSingle("writing", input.writing);
  const signals = readMulti("signals", input.signals ?? []);
  const status = readMulti("status", input.status ?? []);

  if (!degree || !years || !compensation || !role || !writing || !signals || !status) {
    return null;
  }

  return { degree, years, compensation, role, signals, status, writing };
}

export function intakeFields(answers: QuizAnswers): { name: string; value: string }[] {
  return [
    { name: answerFieldNames.degree, value: answers.degree },
    { name: answerFieldNames.years, value: answers.years },
    { name: answerFieldNames.compensation, value: answers.compensation },
    { name: answerFieldNames.role, value: answers.role },
    ...answers.signals.map((value) => ({ name: answerFieldNames.signals, value })),
    ...answers.status.map((value) => ({ name: answerFieldNames.status, value })),
    { name: answerFieldNames.writing, value: answers.writing },
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
    compensation: readSingle("compensation", formData.get(answerFieldNames.compensation)) ?? undefined,
    role: readSingle("role", formData.get(answerFieldNames.role)) ?? undefined,
    writing: readSingle("writing", formData.get(answerFieldNames.writing)) ?? undefined,
    signals: readMulti("signals", formStrings(formData, answerFieldNames.signals)) ?? undefined,
    status: readMulti("status", formStrings(formData, answerFieldNames.status)) ?? undefined,
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
