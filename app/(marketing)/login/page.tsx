import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { readPlanId } from "@/lib/plans";
import { safeNextPath } from "@/lib/safe-next";
import { firstParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your EB2NIW workspace.",
};

type LoginProps = {
  searchParams: Promise<{ plan?: string | string[]; next?: string | string[]; error?: string | string[] }>;
};

export default function LoginPage({ searchParams }: LoginProps) {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-sm text-muted">Loading log in</p>}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginContent({ searchParams }: LoginProps) {
  const params = await searchParams;
  const plan = readPlanId(firstParam(params.plan));
  const fallback = plan ? `/checkout?plan=${plan}` : "/dashboard";
  const nextPath = safeNextPath(firstParam(params.next), fallback);
  const error = firstParam(params.error);

  return (
    <article className="mx-auto w-full max-w-xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-sm font-semibold tracking-[0.14em] text-brass">ACCOUNT</p>
      <h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-tight text-near sm:text-6xl">Log in</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">Use the email and password for your EB2NIW account.</p>
      {error === "auth" ? (
        <p role="alert" className="mt-4 text-sm font-semibold text-danger">
          That sign-in link could not be completed. Try email and password.
        </p>
      ) : null}
      {error === "config" ? (
        <p role="alert" className="mt-4 text-sm font-semibold text-danger">
          Accounts are unavailable until Supabase is configured.
        </p>
      ) : null}
      <AuthForm mode="login" plan={plan} nextPath={nextPath} />
      <p className="mt-6 text-sm text-muted">
        New here?{" "}
        <Link
          href={plan ? `/signup?plan=${plan}` : "/get-started"}
          className="font-semibold text-near underline decoration-brass underline-offset-4"
        >
          {plan ? "Create an account" : "Choose a plan"}
        </Link>
      </p>
    </article>
  );
}
