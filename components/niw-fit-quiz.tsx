"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { fitDisclaimer } from "@/lib/content";
import { persistEligibility } from "@/lib/eligibility-draft";
import {
  quizSteps,
  recommendationCopy,
  recommendPlan,
  signupPlanFor,
  toQuizAnswers,
  type DraftAnswers,
  type MultiKey,
  type QuizAnswers,
  type QuizStep,
  type SingleKey,
} from "@/lib/intake";
import { plans } from "@/lib/plans";

const questionCount = quizSteps.length;

type SingleStep = Extract<QuizStep, { kind: "single" }>;
type MultiStep = Extract<QuizStep, { kind: "multi" }>;

const headingClass =
  "quiz-heading mt-5 scroll-mt-24 font-serif text-3xl leading-tight text-balance text-navy outline-none sm:text-4xl";

export function NiwFitQuiz({ variant = "card" }: { variant?: "card" | "page" }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<DraftAnswers>({});
  const [formGeneration, setFormGeneration] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasInteracted = useRef(false);
  const pendingAdvance = useRef<number | null>(null);
  const titleId = useId();
  const percent = Math.round((stepIndex / questionCount) * 100);
  const completed = toQuizAnswers(answers);
  const onResult = stepIndex >= questionCount && completed !== null;
  const step = quizSteps[Math.min(stepIndex, questionCount - 1)];

  useEffect(() => {
    if (!hasInteracted.current) {
      return;
    }
    headingRef.current?.focus();
  }, [stepIndex, formGeneration]);

  useEffect(() => {
    if (stepIndex < questionCount) {
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
      setStepIndex((current) => Math.min(current + 1, questionCount));
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
    setStepIndex((current) => Math.min(current + 1, questionCount));
  }

  function back() {
    hasInteracted.current = true;
    cancelAdvance();
    if (stepIndex >= questionCount) {
      setFormGeneration((current) => current + 1);
    }
    setStepIndex((current) => Math.max(0, current - 1));
  }

  function restart() {
    hasInteracted.current = true;
    cancelAdvance();
    setAnswers({});
    setStepIndex(0);
    setFormGeneration((current) => current + 1);
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
        aria-valuemax={questionCount}
        aria-valuenow={Math.min(stepIndex + 1, questionCount)}
        aria-label={`Question ${Math.min(stepIndex + 1, questionCount)} of ${questionCount}`}
      >
        <div
          className="h-full bg-navy transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="p-6 sm:p-8">
        {onResult ? null : (
          <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-muted">
            {stepIndex + 1} of {questionCount}
          </p>
        )}
        {onResult && completed ? (
          <ResultScreen
            key={formGeneration}
            answers={completed}
            headingRef={headingRef}
            titleId={titleId}
            onBack={back}
            onRestart={restart}
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
      <h2
        ref={headingRef}
        id={titleId}
        tabIndex={-1}
        className={headingClass}
      >
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
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-navy"
          >
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
      <h2
        ref={headingRef}
        id={titleId}
        tabIndex={-1}
        className={headingClass}
      >
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
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-navy"
        >
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

function ResultScreen({
  answers,
  headingRef,
  titleId,
  onBack,
  onRestart,
}: {
  answers: QuizAnswers;
  headingRef: RefObject<HTMLHeadingElement | null>;
  titleId: string;
  onBack: () => void;
  onRestart: () => void;
}) {
  const copy = recommendationCopy(answers);
  const plan = plans[signupPlanFor(recommendPlan(answers))];

  return (
    <div>
      <p className="inline-flex rounded-full bg-brass-soft px-3 py-1 text-xs font-semibold tracking-[0.14em] text-brass">
        YOUR FIT
      </p>
      <h2 ref={headingRef} id={titleId} tabIndex={-1} className={headingClass}>
        {copy.title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted">{copy.body}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted">{fitDisclaimer}</p>
      <div className="mt-8 rounded-2xl border border-line bg-paper p-5">
        <p className="text-xs font-semibold tracking-[0.14em] text-brass">SUGGESTED PLAN</p>
        <p className="mt-2 font-serif text-3xl text-near">
          {plan.name}
          {plan.badge ? <span className="ml-2 align-middle text-base font-sans font-semibold text-brass">{plan.badge}</span> : null}
        </p>
        <p className="mt-1 text-sm text-muted">{plan.priceLabel} · placeholder price</p>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href={`/signup?plan=${plan.id}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-near"
        >
          Continue with {plan.name}
        </Link>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-navy"
        >
          Back
        </button>
      </div>
      <button
        type="button"
        onClick={onRestart}
        className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-navy underline decoration-brass underline-offset-4"
      >
        Answer again
      </button>
    </div>
  );
}
