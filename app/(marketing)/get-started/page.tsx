import type { Metadata } from "next";
import Link from "next/link";
import { disclaimer, eb2niw } from "@/lib/content";
import { plans, type PlanId } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Get started",
  description: `Choose DIY or DIY + Attorney Review for an ${eb2niw} petition. Prices are placeholders.`,
};

const order: PlanId[] = ["diy", "attorney_review"];

export default function GetStartedPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.14em] text-brass">PLANS</p>
        <h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-tight text-balance text-near sm:text-6xl lg:text-7xl">
          What kind of service do you need?
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          Both plans use the same guided software. Premium adds an independent attorney. Prices are placeholders, and payment is not open yet.
        </p>
      </header>
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {order.map((id) => {
          const plan = plans[id];
          const premium = id === "attorney_review";
          return (
            <section
              key={plan.id}
              className={`flex flex-col rounded-3xl border p-6 sm:p-8 ${
                premium ? "border-near bg-raised" : "border-line bg-raised"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-serif text-3xl text-near">{plan.name}</h2>
                {plan.badge ? (
                  <p className="rounded-full bg-gold px-3 py-1 text-xs font-semibold tracking-wide text-near">{plan.badge}</p>
                ) : null}
              </div>
              <p className="mt-4 font-serif text-5xl tracking-tight text-near">{plan.priceLabel}</p>
              <p className="mt-1 text-sm text-muted">Placeholder price</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{plan.summary}</p>
              <ul className="mt-6 grid flex-1 gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-ink">
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/signup?plan=${plan.id}`}
                className={`mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-semibold ${
                  premium ? "bg-gold text-near" : "border border-line bg-paper text-near"
                }`}
              >
                Choose {plan.badge ?? plan.name}
              </Link>
            </section>
          );
        })}
      </div>
      <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted">{disclaimer}</p>
    </article>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-good" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="8" />
      <path d="M6.2 10.2 8.7 12.6 13.8 7.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
