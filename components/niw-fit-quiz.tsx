"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type RefObject } from "react";
import { recordConsultClick, saveFitSubmission } from "@/app/actions/fit-submission";
import { eb2niw, fitDisclaimer } from "@/lib/content";
import { persistEligibility } from "@/lib/eligibility-draft";
import { normalizeOptInEmail } from "@/lib/fit-submission";
import {
  quizSteps,
  recommendPlan,
  signupPlanFor,
  toQuizAnswers,
  type DraftAnswers,
  type MultiKey,
  type QuizAnswers,
  type QuizStep,
  type SingleKey,
} from "@/lib/intake";
import { plans, type PlanId } from "@/lib/plans";

const answerCount = quizSteps.length;
const stepCount = answerCount + 1;
const newsQuestion = `Would you like to be kept up to date on the latest news surrounding the ${eb2niw}?`;
const thankYou = "Thanks for your submission. Based on your answers, you are eligible for a free consultation.";

type SingleStep = Extract<QuizStep, { kind: "single" }>;
type MultiStep = Extract<QuizStep, { kind: "multi" }>;
type NewsChoice = "yes" | "no" | "";

const headingClass =
  "quiz-heading mt-5 scroll-mt-24 font-serif text-3xl leading-tight text-balance text-navy outline-none sm:text-4xl";

export function NiwFitQuiz({ variant = "card" }: { variant?: "card" | "page" }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<DraftAnswers>({});
  const [newsChoice, setNewsChoice] = useState<NewsChoice>("");
  const [newsEmail, setNewsEmail] = useState("");
  const [newsError, setNewsError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [formGeneration, setFormGeneration] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasInteracted = useRef(false);
  const pendingAdvance = useRef<number | null>(null);
  const titleId = useId();
  const percent = Math.round((Math.min(stepIndex, stepCount) / stepCount) * 100);
  const completed = toQuizAnswers(answers);
  const onOptIn = stepIndex === answerCount && completed !== null;
  const onResult = stepIndex >= stepCount && completed !== null;
  const step = quizSteps[Math.min(stepIndex, answerCount - 1)];

  useEffect(() => {
    if (!hasInteracted.current) {
      return;
    }
    headingRef.current?.focus();
  }, [stepIndex, formGeneration]);

  useEffect(() => {
    if (stepIndex < stepCount) {
      return;
    }
    const ready = toQuizAnswers(answers);
    if (ready) {
      persistEligibility(ready);
    }
  }, [answers, stepIndex]);

  useEffect(() => {
    return () => {
      if (pendingAdvance.current !== null) {
        window.clearTimeout(pendingAdvance.current);
      }
    };
  }, []);

  function cancelAdvance() {
    if (pendingAdvance.current !== null) {
      window.clearTimeout(pendingAdvance.current);
      pendingAdvance.current = null;
    }
  }

  function choose(key: SingleKey, value: string) {
    hasInteracted.current = true;
    setAnswers((current) => ({ ...current, [key]: value }));
    cancelAdvance();
    pendingAdvance.current = window.setTimeout(() => {
      pendingAdvance.current = null;
      setStepIndex((current) => Math.min(current + 1, answerCount));
    }, 180);
  }

  function toggle(key: MultiKey, value: string) {
    hasInteracted.current = true;
    cancelAdvance();
    const exclusive = quizSteps.find((item) => item.key === key);
    const exclusiveValue = exclusive && exclusive.kind === "multi" ? exclusive.exclusive : null;
    setAnswers((current) => {
      const existing = [...(current[key] ?? [])] as string[];
      let next: string[];
      if (exclusiveValue && value === exclusiveValue) {
        next = existing.length === 1 && existing[0] === exclusiveValue ? [] : [exclusiveValue];
      } else if (existing.includes(value)) {
        next = existing.filter((item) => item !== value);
      } else {
        next = [...existing.filter((item) => item !== exclusiveValue), value];
      }
      const order = exclusive && exclusive.kind === "multi"
        ? exclusive.options.map((option) => option.value as string)
        : next;
      next = order.filter((item) => next.includes(item));
      return { ...current, [key]: next } as DraftAnswers;
    });
  }

  function continueMulti() {
    if (step.kind !== "multi") {
      return;
    }
    const selected = answers[step.key] ?? [];
    if (selected.length === 0) {
      return;
    }
    hasInteracted.current = true;
    cancelAdvance();
    setStepIndex((current) => Math.min(current + 1, answerCount));
  }

  function back() {
    hasInteracted.current = true;
    cancelAdvance();
    if (stepIndex >= stepCount) {
      setFormGeneration((current) => current + 1);
    }
    setStepIndex((current) => Math.max(0, current - 1));
  }

  function restart() {
    hasInteracted.current = true;
    cancelAdvance();
    setAnswers({});
    setNewsChoice("");
    setNewsEmail("");
    setNewsError("");
    setSubmissionId(null);
    setStepIndex(0);
    setFormGeneration((current) => current + 1);
  }

  function chooseNews(value: "yes" | "no") {
    hasInteracted.current = true;
    setNewsChoice(value);
    setNewsError("");
  }

  async function submitNews(company: string) {
    if (!completed || (newsChoice !== "yes" && newsChoice !== "no") || submitting) {
      return;
    }
    if (newsChoice === "yes" && !normalizeOptInEmail(newsEmail)) {
      setNewsError("Enter a valid email address.");
      return;
    }
    hasInteracted.current = true;
    setSubmitting(true);
    setNewsError("");
    const id = crypto.randomUUID();
    const result = await saveFitSubmission({
      submissionId: id,
      answers: completed,
      newsOptIn: newsChoice === "yes",
      email: newsEmail,
      company,
    });
    setSubmitting(false);
    if (!result.ok) {
      setNewsError(result.message);
      return;
    }
    setSubmissionId(id);
    setStepIndex(stepCount);
  }

  const shellClass =
    variant === "page"
      ? "quiz-page"
      : "overflow-hidden rounded-2xl border border-line bg-raised shadow-[0_16px_40px_-28px_rgba(23,50,79,0.45)]";

  return (
    <div className={shellClass}>
      <div
        className="h-1 bg-line"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={stepCount}
        aria-valuenow={Math.min(stepIndex + 1, stepCount)}
        aria-label={`Question ${Math.min(stepIndex + 1, stepCount)} of ${stepCount}`}
      >
        <div
          className="h-full bg-navy transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="p-6 sm:p-8">
        {onResult ? null : (
          <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-muted">
            {Math.min(stepIndex + 1, stepCount)} of {stepCount}
          </p>
        )}
        {onResult && completed && submissionId ? (
          <ResultScreen
            key={formGeneration}
            answers={completed}
            submissionId={submissionId}
            headingRef={headingRef}
            titleId={titleId}
            onBack={back}
            onRestart={restart}
          />
        ) : onOptIn ? (
          <NewsOptIn
            choice={newsChoice}
            email={newsEmail}
            error={newsError}
            pending={submitting}
            headingRef={headingRef}
            titleId={titleId}
            onChoice={chooseNews}
            onEmail={setNewsEmail}
            onSubmit={submitNews}
            onBack={back}
          />
        ) : step.kind === "single" ? (
          <SingleQuestion
            step={step}
            headingRef={headingRef}
            titleId={titleId}
            selected={answers[step.key]}
            showBack={stepIndex > 0}
            onChoose={choose}
            onBack={back}
          />
        ) : (
          <MultiQuestion
            step={step}
            headingRef={headingRef}
            titleId={titleId}
            selected={answers[step.key] ?? []}
            onToggle={toggle}
            onContinue={continueMulti}
            onBack={back}
          />
        )}
      </div>
    </div>
  );
}

function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number, count: number, refs: Array<HTMLButtonElement | null>) {
  const last = count - 1;
  let next = index;
  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    next = index === last ? 0 : index + 1;
  } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    next = index === 0 ? last : index - 1;
  } else if (event.key === "Home") {
    next = 0;
  } else if (event.key === "End") {
    next = last;
  } else {
    return;
  }
  event.preventDefault();
  refs[next]?.focus();
}

function ChoiceMark({ selected, multi }: { selected: boolean; multi: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border ${
        multi ? "rounded-[5px]" : "rounded-full"
      } ${selected ? "border-navy bg-navy text-paper" : "border-muted/40 bg-raised"}`}
    >
      {selected && multi ? (
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 6.2 4.6 8.8 10 3.2" />
        </svg>
      ) : null}
      {selected && !multi ? <span className="h-2.5 w-2.5 rounded-full bg-paper" /> : null}
    </span>
  );
}

function SingleQuestion({
  step,
  headingRef,
  titleId,
  selected,
  showBack,
  onChoose,
  onBack,
}: {
  step: SingleStep;
  headingRef: RefObject<HTMLHeadingElement | null>;
  titleId: string;
  selected: string | undefined;
  showBack: boolean;
  onChoose: (key: SingleKey, value: string) => void;
  onBack: () => void;
}) {
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  return (
    <div>
      <p className="inline-flex rounded-full bg-brass-soft px-3 py-1 text-xs font-semibold tracking-[0.14em] text-brass">
        {step.section}
      </p>
      <h2 ref={headingRef} id={titleId} tabIndex={-1} className={headingClass}>
        {step.question}
      </h2>
      <div role="radiogroup" aria-labelledby={titleId} className="mt-6 grid gap-3">
        {step.options.map((option, index) => {
          const isSelected = option.value === selected;
          return (
            <button
              key={option.value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChoose(step.key, option.value)}
              onKeyDown={(event) => moveFocus(event, index, step.options.length, optionRefs.current)}
              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-4 text-left text-base font-semibold text-navy ${
                isSelected ? "border-navy bg-brass-soft" : "border-line bg-paper hover:border-navy/40"
              }`}
            >
              <ChoiceMark selected={isSelected} multi={false} />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-6 min-h-11">
        {showBack ? (
          <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center text-sm font-semibold text-navy">
            Back
          </button>
        ) : null}
      </div>
    </div>
  );
}

function MultiQuestion({
  step,
  headingRef,
  titleId,
  selected,
  onToggle,
  onContinue,
  onBack,
}: {
  step: MultiStep;
  headingRef: RefObject<HTMLHeadingElement | null>;
  titleId: string;
  selected: readonly string[];
  onToggle: (key: MultiKey, value: string) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const canContinue = selected.length > 0;

  return (
    <div>
      <p className="inline-flex rounded-full bg-brass-soft px-3 py-1 text-xs font-semibold tracking-[0.14em] text-brass">
        {step.section}
      </p>
      <h2 ref={headingRef} id={titleId} tabIndex={-1} className={headingClass}>
        {step.question}
      </h2>
      <p className="mt-3 text-sm text-muted">{step.hint}</p>
      <div role="group" aria-labelledby={titleId} className="mt-6 grid gap-2.5">
        {step.options.map((option, index) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => onToggle(step.key, option.value)}
              onKeyDown={(event) => moveFocus(event, index, step.options.length, optionRefs.current)}
              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-base font-semibold text-navy ${
                isSelected ? "border-navy bg-brass-soft" : "border-line bg-paper hover:border-navy/40"
              }`}
            >
              <ChoiceMark selected={isSelected} multi />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center text-sm font-semibold text-navy">
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-navy px-5 py-3 text-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function NewsOptIn({
  choice,
  email,
  error,
  pending,
  headingRef,
  titleId,
  onChoice,
  onEmail,
  onSubmit,
  onBack,
}: {
  choice: NewsChoice;
  email: string;
  error: string;
  pending: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  titleId: string;
  onChoice: (value: "yes" | "no") => void;
  onEmail: (value: string) => void;
  onSubmit: (company: string) => void;
  onBack: () => void;
}) {
  const emailId = useId();
  const errorId = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const options = [
    { value: "yes" as const, label: "Yes" },
    { value: "no" as const, label: "No" },
  ];

  useEffect(() => {
    if (choice === "yes") {
      emailRef.current?.focus();
    }
  }, [choice]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const company = String(new FormData(event.currentTarget).get("company") ?? "");
    onSubmit(company);
  }

  return (
    <form onSubmit={submit} className="relative">
      <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="inline-flex rounded-full bg-brass-soft px-3 py-1 text-xs font-semibold tracking-[0.14em] text-brass">
        UPDATES
      </p>
      <h2 ref={headingRef} id={titleId} tabIndex={-1} className={headingClass}>
        {newsQuestion}
      </h2>
      <div role="radiogroup" aria-labelledby={titleId} className="mt-6 grid gap-3">
        {options.map((option, index) => {
          const isSelected = choice === option.value;
          return (
            <button
              key={option.value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChoice(option.value)}
              onKeyDown={(event) => moveFocus(event, index, options.length, optionRefs.current)}
              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-4 text-left text-base font-semibold text-navy ${
                isSelected ? "border-navy bg-brass-soft" : "border-line bg-paper hover:border-navy/40"
              }`}
            >
              <ChoiceMark selected={isSelected} multi={false} />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
      {choice === "yes" ? (
        <div className="mt-6">
          <label htmlFor={emailId} className="block text-sm font-semibold text-near">
            Email
          </label>
          <input
            ref={emailRef}
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={320}
            spellCheck={false}
            required
            value={email}
            onChange={(event) => onEmail(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-base font-normal text-ink"
          />
        </div>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="mt-3 text-sm font-semibold text-danger">
          {error}
        </p>
      ) : null}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center text-sm font-semibold text-navy">
          Back
        </button>
        {choice ? (
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-navy px-5 py-3 text-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? "Saving" : "Submit"}
          </button>
        ) : null}
      </div>
    </form>
  );
}

function ResultScreen({
  answers,
  submissionId,
  headingRef,
  titleId,
  onBack,
  onRestart,
}: {
  answers: QuizAnswers;
  submissionId: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
  titleId: string;
  onBack: () => void;
  onRestart: () => void;
}) {
  const router = useRouter();
  const [booking, setBooking] = useState(false);
  const companyRef = useRef<HTMLInputElement>(null);
  const suggested = signupPlanFor(recommendPlan(answers));
  const order: PlanId[] = ["diy", "attorney_review"];

  async function book() {
    if (booking) return;
    setBooking(true);
    await recordConsultClick({
      submissionId,
      company: companyRef.current?.value ?? "",
    });
    router.push("/book");
  }

  return (
    <div>
      <p className="inline-flex rounded-full bg-brass-soft px-3 py-1 text-xs font-semibold tracking-[0.14em] text-brass">
        YOUR FIT
      </p>
      <h2 ref={headingRef} id={titleId} tabIndex={-1} className={headingClass}>
        {thankYou}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted">{fitDisclaimer}</p>
      <input ref={companyRef} type="text" name="company" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      <button
        type="button"
        onClick={() => void book()}
        disabled={booking}
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-near disabled:opacity-60"
      >
        Book Now
      </button>
      <h3 className="mt-10 font-serif text-3xl text-near">Getting started anyway?</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {order.map((id) => {
          const plan = plans[id];
          const highlighted = id === suggested;
          return (
            <section
              key={plan.id}
              className={`flex flex-col rounded-2xl border p-5 ${
                highlighted ? "border-2 border-gold bg-brass-soft" : "border-line bg-paper"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-serif text-2xl text-near">{plan.name}</h4>
                {highlighted ? (
                  <p className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-near">Suggested</p>
                ) : plan.badge ? (
                  <p className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-near">{plan.badge}</p>
                ) : null}
              </div>
              <p className="mt-3 font-serif text-4xl text-near">{plan.priceLabel}</p>
              <Link
                href={`/signup?plan=${plan.id}`}
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-navy px-4 text-sm font-semibold text-paper"
              >
                Continue with {plan.name}
              </Link>
            </section>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center text-sm font-semibold text-navy">
          Back
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-navy underline decoration-brass underline-offset-4"
        >
          Answer again
        </button>
      </div>
    </div>
  );
}
