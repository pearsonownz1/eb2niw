import Link from "next/link";
import { WorkspaceHeader } from "@/components/workspace-header";
import { plans } from "@/lib/plans";
import { getWorkspace } from "@/lib/workspace";

export default async function OverviewPage() {
  const workspace = await getWorkspace();
  const plan = workspace.plan ? plans[workspace.plan] : null;
  const planLabel = plan ? `${plan.name}${plan.badge ? ` (${plan.badge})` : ""}` : "No plan selected";
  const statusLabel =
    workspace.planStatus === "pending_payment"
      ? "Pending payment"
      : workspace.planStatus === "active"
        ? "Active"
        : workspace.planStatus === "canceled"
          ? "Canceled"
          : "Not started";

  const rows = [
    {
      title: "Eligibility check",
      status: workspace.eligibilitySaved ? "Eligibility check saved" : "Not started",
      href: "/dashboard/eligibility",
    },
    {
      title: "Plan",
      status: plan ? `${planLabel} · ${statusLabel}` : "Not started",
      href: "/get-started",
    },
    {
      title: "Documents",
      status: workspace.documents.length === 0 ? "Not started" : `${workspace.documents.length} uploaded`,
      href: "/dashboard/documents",
    },
    {
      title: "Templates",
      status: "Not published yet",
      href: "/dashboard/templates",
    },
    {
      title: "Forms",
      status: "Not published yet",
      href: "/dashboard/forms",
    },
    {
      title: "Attorney review",
      status: workspace.premium ? "Included · not started" : "Locked on DIY",
      href: "/dashboard/attorney",
    },
  ];

  return (
    <>
      <WorkspaceHeader
        title="Overview"
        lede="Progress across the petition requirements. Nothing here is a filing status with USCIS, and nothing is sent until you decide to file."
      />
      <div className="px-5 py-8 sm:px-8">
        <ul className="grid gap-3">
          {rows.map((row) => (
            <li key={row.title}>
              <Link href={row.href} className="flex flex-col gap-1 rounded-2xl border border-line bg-raised px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold text-near">{row.title}</span>
                <span className="text-sm text-muted">{row.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
