export const quizSteps = [
  {
    key: "degree",
    kind: "single",
    section: "ADVANCED DEGREE",
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
    section: "ADVANCED DEGREE",
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
    section: "ADVANCED DEGREE",
    question: "Were at least 5 years of that work progressive, and after your bachelor's degree?",
    options: [
      { value: "yes", label: "Yes. At least 5 years came after the degree and grew in responsibility in the specialty" },
      { value: "no", label: "No, or not 5 years after the degree" },
      { value: "not_applicable", label: "Not applicable. My highest degree is already above a bachelor's" },
    ],
  },
  {
    key: "criteria",
    kind: "multi",
    section: "EXCEPTIONAL ABILITY",
    question: "Which exceptional-ability criteria can you document?",
    hint: "Select every one that applies. At least three is the usual threshold.",
    exclusive: "none",
    options: [
      { value: "academic_record", label: "An official academic record of a degree, diploma, or certificate in your field" },
      { value: "ten_year_letters", label: "Employer letters showing at least 10 years of full-time experience in the occupation" },
      { value: "license", label: "A license or certification for your profession" },
      { value: "salary", label: "Pay or other compensation that shows a high level of ability" },
      { value: "membership", label: "Membership in a professional association" },
      { value: "recognition", label: "Recognition of your achievements by peers, a government, or a professional or business organization" },
      { value: "none", label: "None of these" },
    ],
  },
  {
    key: "merit",
    kind: "single",
    section: "NATIONAL INTEREST WAIVER",
    question: "Does the endeavor you propose have substantial merit and national importance?",
    options: [
      { value: "yes", label: "Yes. It matters beyond one employer, such as for a field, a region, or the public" },
      { value: "partly", label: "Partly. The broader importance is still unclear" },
      { value: "not_yet", label: "Not yet" },
    ],
  },
  {
    key: "positioned",
    kind: "single",
    section: "NATIONAL INTEREST WAIVER",
    question: "Are you well positioned to advance that endeavor?",
    options: [
      { value: "yes", label: "Yes. My education, record, and plan line up with the endeavor" },
      { value: "partly", label: "Partly. Some of that record is still thin" },
      { value: "not_yet", label: "Not yet" },
    ],
  },
  {
    key: "balance",
    kind: "single",
    section: "NATIONAL INTEREST WAIVER",
    question: "On balance, would it benefit the United States to waive the job offer and labor certification?",
    options: [
      { value: "yes", label: "Yes. A job offer would be impractical, or the work would help even if other workers are available" },
      { value: "partly", label: "Partly. That balance is still unclear" },
      { value: "not_yet", label: "Not yet" },
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
 * Suggests a product plan from the EB-2 rules. An advanced degree is a U.S.
 * master's or higher, or a foreign equivalent, or a bachelor's plus at least
 * 5 years of progressive post-degree experience. Exceptional ability is at
 * least three of the six criteria. The waiver also needs yes on all three
 * Dhanasar prongs. Missing the degree and the three criteria is a stretch.
 * A category basis without all three prongs suggests attorney review. A basis
 * plus all three prongs suggests DIY. This is not a finding that anyone qualifies.
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
    const basis = categoryBasis(answers);
    const basisText =
      basis.advanced && basis.exceptional
        ? "an advanced degree and at least three exceptional-ability criteria"
        : basis.advanced
          ? "an advanced degree (a master's or higher, or a bachelor's plus 5 years of progressive post-degree experience)"
          : "at least three exceptional-ability criteria";
    return {
      title: recommendationTitles.diy,
      body: `These answers line up with ${basisText}, and with yes on all three national-interest prongs. DIY is the plan to start with. You would use the questionnaire, the evidence checklist, and the petition letter builder. This is a suggestion about which product to use. It is not a finding that you qualify.`,
    };
  }

  if (plan === "attorney_review") {
    return {
      title: recommendationTitles.attorney_review,
      body: "These answers line up with an advanced degree or with at least three exceptional-ability criteria. At least one national-interest prong is only partly answered, or not yet. DIY + Attorney Review is the plan to start with. This is a suggestion about which product to use. It is not a finding that you qualify.",
    };
  }

  return {
    title: recommendationTitles.stretch,
    body: "These answers do not line up with a master's or higher, a bachelor's plus 5 years of progressive post-degree experience, or at least three exceptional-ability criteria. An independent immigration attorney can tell you whether an EB\u20112\u00A0NIW is worth preparing. EB2NIW does not make that call. This is not legal advice.",
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
