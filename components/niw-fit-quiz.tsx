"use client";

import Link from "next/link";
import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { submitIntake } from "@/app/actions/intake";
import { disclaimer } from "@/lib/content";
import {
  idleIntakeState,
  intakeFields,
  quizSteps,
  recommendationCopy,
  toQuizAnswers,
  type DraftAnswers,
  type MultiKey,
  type QuizAnswers,
  type QuizStep,
  type SingleKey,
} from "@/lib/intake";

const fieldClass =
  "mt-1 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-base text-ink";

const questionCount = quizSteps.length;

type SingleStep = Extract<QuizStep, { kind: "single" }>;
type MultiStep = Extract<QuizStep, { kind: "multi" }>;

export function NiwFitQuiz() {
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
      return { ...current, [key]: next };
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

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-raised shadow-[0_16px_40px_-28px_rgba(23,50,79,0.45)]">
      <div
        className="h-1 bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Fit check progress"
      >
        <div
          className="h-full bg-navy transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="p-6 sm:p-8">
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
        CHECK YOUR NIW FIT
      </p>
      <h2
        ref={headingRef}
        id={titleId}
        tabIndex={-1}
        className="mt-5 scroll-mt-24 font-serif text-3xl leading-tight text-balance text-navy outline-none sm:text-4xl"
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
        CHECK YOUR NIW FIT
      </p>
      <h2
        ref={headingRef}
        id={titleId}
        tabIndex={-1}
        className="mt-5 scroll-mt-24 font-serif text-3xl leading-tight text-balance text-navy outline-none sm:text-4xl"
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
  const [state, action, pending] = useActionState(submitIntake, idleIntakeState);
  const baseId = useId();
  const statusId = useId();
  const copy = recommendationCopy(answers);

  return (
    <div>
      <p className="inline-flex rounded-full bg-brass-soft px-3 py-1 text-xs font-semibold tracking-[0.14em] text-brass">
        RECOMMENDATION
      </p>
      <h2
        ref={headingRef}
        id={titleId}
        tabIndex={-1}
        className="mt-5 scroll-mt-24 font-serif text-3xl leading-tight text-balance text-navy outline-none sm:text-4xl"
      >
        {copy.title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted">{copy.body}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted">{disclaimer}</p>

      {state.status === "saved" ? (
        <div className="mt-6">
          <p id={statusId} role="status" className="text-sm font-semibold text-good">
            {state.message}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md bg-navy px-5 py-3 text-sm font-semibold text-paper"
            >
              Compare plans
            </Link>
          </div>
          <button
            type="button"
            onClick={onRestart}
            className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-navy underline decoration-brass underline-offset-4"
          >
            Answer again
          </button>
        </div>
      ) : (
        <form action={action} className="relative mt-8" aria-busy={pending}>
          <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
            <label>
              Company
              <input type="text" name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {intakeFields(answers).map((field) => (
            <input key={`${field.name}-${field.value}`} type="hidden" name={field.name} value={field.value} />
          ))}
          <h3 className="font-serif text-2xl text-navy">Save this recommendation</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Your answers stay on this page until you send them.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-navy" htmlFor={`${baseId}-first`}>
              First name
              <input
                id={`${baseId}-first`}
                name="first_name"
                type="text"
                autoComplete="given-name"
                required
                maxLength={80}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold text-navy" htmlFor={`${baseId}-last`}>
              Last name
              <input
                id={`${baseId}-last`}
                name="last_name"
                type="text"
                autoComplete="family-name"
                required
                maxLength={80}
                className={fieldClass}
              />
            </label>
          </div>
          <div className="mt-4 grid gap-4">
            <label className="block text-sm font-semibold text-navy" htmlFor={`${baseId}-email`}>
              Email
              <input
                id={`${baseId}-email`}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                maxLength={320}
                placeholder="you@example.com"
                aria-invalid={state.status === "error"}
                aria-describedby={state.message ? statusId : undefined}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold text-navy" htmlFor={`${baseId}-phone`}>
              Phone <span className="font-normal text-muted">(optional)</span>
              <input
                id={`${baseId}-phone`}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={40}
                className={fieldClass}
              />
            </label>
          </div>
          <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-ink">
            <input
              type="checkbox"
              name="marketing_consent"
              value="yes"
              className="mt-1 h-4 w-4 shrink-0 accent-navy"
            />
            <span>Email me when the guided petition software opens.</span>
          </label>
          {state.message ? (
            <p id={statusId} role="alert" className="mt-4 text-sm font-semibold text-danger">
              {state.message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-navy px-5 py-3 text-sm font-semibold text-paper disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? "Saving" : "Save my recommendation"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-navy"
          >
            Back
          </button>
        </form>
      )}
    </div>
  );
}
