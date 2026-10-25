import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout-form";
import { disclaimer } from "@/lib/content";
import { plans, readPlanId } from "@/lib/plans";
import { firstParam } from "@/lib/search-params";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Confirm your EB2NIW plan. Payment is not collected yet.",
};

type CheckoutProps = {
  searchParams: Promise<{ plan?: string | string[] }>;
};

export default function CheckoutPage({ searchParams }: CheckoutProps) {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-sm text-muted">Loading checkout</p>}>
      <CheckoutContent searchParams={searchParams} />
    </Suspense>
  );
}

async function CheckoutContent({ searchParams }: CheckoutProps) {
  const params = await searchParams;
  const planId = readPlanId(firstParam(params.plan));
  if (!planId) {
    return (
      <article className="mx-auto w-full max-w-xl px-5 py-16 sm:px-8">
        <h1 className="font-serif text-5xl tracking-tight text-near">Choose a plan first</h1>
        <Link href="/get-started" className="mt-6 inline-flex font-semibold text-near underline decoration-brass underline-offset-4">
          See the plans
        </Link>
      </article>
    );
  }

  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      redirect(`/login?next=${encodeURIComponent(`/checkout?plan=${planId}`)}&plan=${planId}`);
    }
  }

  const plan = plans[planId];

  return (
    <article className="mx-auto w-full max-w-xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-sm font-semibold tracking-[0.14em] text-brass">CHECKOUT</p>
      <h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-tight text-near sm:text-6xl">Confirm your plan</h1>
      <section className="mt-8 rounded-3xl border border-line bg-raised p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-3xl text-near">{plan.name}</h2>
          {plan.badge ? (
            <p className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-near">{plan.badge}</p>
          ) : null}
        </div>
        <p className="mt-4 font-serif text-5xl text-near">{plan.priceLabel}</p>
        <p className="mt-1 text-sm text-muted">Placeholder price. No charge is created.</p>
        <ul className="mt-5 grid gap-2 text-sm text-muted">
          {plan.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>
      <CheckoutForm plan={plan.id} />
      <p className="mt-6 text-sm leading-relaxed text-muted">{disclaimer}</p>
    </article>
  );
}
