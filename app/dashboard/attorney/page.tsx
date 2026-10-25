import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { WorkspaceItems } from "@/components/workspace-items";
import { disclaimer } from "@/lib/content";
import { plans } from "@/lib/plans";
import { getWorkspace } from "@/lib/workspace";

export default async function AttorneyPage() {
  const workspace = await getWorkspace();
  const premium = plans.attorney_review;

  if (!workspace.premium) {
    return (
      <>
        <DashboardHeader
          sectionId="attorney"
          chip="Locked"
          lede="This part of the workspace is on the Premium plan. DIY includes the software. It does not include an attorney."
        />
        <div className="px-5 py-8 sm:px-8">
          <section className="max-w-xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50">
              <LockKeyhole className="h-6 w-6 text-emerald-800" aria-hidden="true" />
            </span>
            <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-emerald-800">LOCKED</p>
            <h2 className="mt-2 font-serif text-3xl text-slate-950">Upgrade to Premium</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              DIY + Attorney Review is {premium.priceLabel}, a placeholder price. Payment is not open yet.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-slate-800">
              {premium.features.slice(1).map((feature) => (
                <li key={feature} className="rounded-2xl bg-slate-50 px-3 py-2">
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/get-started"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-800 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              See Premium
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{disclaimer}</p>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        sectionId="attorney"
        chip="Included"
        lede="Premium is on this account. These steps are not started. An independent attorney has not reviewed a package, because that review is not open yet."
      />
      <div className="grid gap-6 px-5 py-8 sm:px-8">
        <WorkspaceItems items={premium.features.slice(1)} note="Not started" accent="emerald" />
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">{disclaimer}</p>
      </div>
    </>
  );
}
