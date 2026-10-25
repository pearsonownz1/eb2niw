import Link from "next/link";
import { WorkspaceHeader } from "@/components/workspace-header";
import { disclaimer } from "@/lib/content";
import { plans } from "@/lib/plans";
import { getWorkspace } from "@/lib/workspace";

export default async function AttorneyPage() {
  const workspace = await getWorkspace();
  const premium = plans.attorney_review;

  if (!workspace.premium) {
    return (
      <>
        <WorkspaceHeader
          title="Attorney Review"
          lede="This part of the workspace is on the Premium plan. DIY includes the software. It does not include an attorney."
        />
        <div className="px-5 py-8 sm:px-8">
          <section className="max-w-xl rounded-3xl border border-line bg-raised p-6">
            <p className="text-xs font-semibold tracking-[0.14em] text-brass">LOCKED</p>
            <h2 className="mt-3 font-serif text-3xl text-near">Upgrade to Premium</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              DIY + Attorney Review is {premium.priceLabel}, a placeholder price. Payment is not open yet.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-ink">
              {premium.features.slice(1).map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Link
              href="/get-started?plan=attorney_review"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-5 text-sm font-semibold text-near"
            >
              See Premium
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">{disclaimer}</p>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      <WorkspaceHeader
        title="Attorney Review"
        lede="Premium is on this account. These steps are not started. An independent attorney has not reviewed a package, because that review is not open yet."
      />
      <ul className="grid gap-3 px-5 py-8 sm:px-8">
        {premium.features.slice(1).map((feature) => (
          <li key={feature} className="rounded-2xl border border-line bg-raised px-5 py-4">
            <p className="font-semibold text-near">{feature}</p>
            <p className="mt-1 text-sm text-muted">Not started</p>
          </li>
        ))}
      </ul>
      <p className="px-5 pb-10 text-sm leading-relaxed text-muted sm:px-8">{disclaimer}</p>
    </>
  );
}
