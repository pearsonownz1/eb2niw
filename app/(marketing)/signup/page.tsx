import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { plans, readPlanId } from "@/lib/plans";
import { firstParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create an EB2NIW account with email and password, or continue with Google.",
};

type SignupProps = {
  searchParams: Promise<{ plan?: string | string[] }>;
};

export default function SignupPage({ searchParams }: SignupProps) {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-sm text-muted">Loading account form</p>}>
      <SignupContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SignupContent({ searchParams }: SignupProps) {
  const params = await searchParams;
  const planId = readPlanId(firstParam(params.plan));

  if (!planId) {
    return (
      <article className="mx-auto w-full max-w-xl px-5 py-16 sm:px-8">
        <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-near">Choose a plan first</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          The account is created after you pick DIY or Premium.
        </p>
        <Link
          href="/get-started"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-near"
        >
          See the plans
        </Link>
      </article>
    );
  }

  const plan = plans[planId];
  const loginNext = `/checkout?plan=${plan.id}`;

  return (
    <article className="mx-auto w-full max-w-xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-sm font-semibold tracking-[0.14em] text-brass">ACCOUNT</p>
      <h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-tight text-near sm:text-6xl">Create your account</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        {plan.name}
        {plan.badge ? ` · ${plan.badge}` : ""} · {plan.priceLabel}. You will confirm the plan before entering the workspace. Payment is not collected yet.
      </p>
      <AuthForm mode="signup" plan={plan.id} nextPath={null} />
      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={`/login?plan=${plan.id}&next=${encodeURIComponent(loginNext)}`}
          className="font-semibold text-near underline decoration-brass underline-offset-4"
        >
          Log in
        </Link>
      </p>
    </article>
  );
}
