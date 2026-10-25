import { Suspense } from "react";
import { AdminToolbar } from "@/components/admin-toolbar";
import { AdminTrend } from "@/components/admin-trend";
import { WorkspaceHeader } from "@/components/workspace-header";
import { adminRangeFromParams, loadAdmin } from "@/lib/admin";

export const metadata = {
  title: "Overview",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function AdminOverviewPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-sm text-muted">Loading overview</p>}>
      <Overview searchParams={searchParams} />
    </Suspense>
  );
}

async function Overview({ searchParams }: PageProps) {
  const range = adminRangeFromParams(await searchParams);
  const snapshot = await loadAdmin(range);

  return (
    <>
      <WorkspaceHeader
        title="Overview"
        lede="Fit-check submissions, news opt-ins, Book now clicks, accounts, purchases, and checkouts still waiting on payment."
      />
      <div className="grid gap-6 px-5 py-8 sm:px-8">
        {snapshot.notice ? <p className="text-sm text-near">{snapshot.notice}</p> : null}
        <AdminToolbar path="/admin" range={snapshot.range} table={null} />
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {snapshot.kpis.map((card) => (
            <li key={card.label} className="rounded-2xl border border-line bg-raised p-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-brass">{card.label}</p>
              <p className="mt-2 font-serif text-4xl text-near tabular-nums">{card.value}</p>
              <p className="mt-2 text-sm text-muted">{card.note}</p>
            </li>
          ))}
        </ul>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {snapshot.rates.map((card) => (
            <li key={card.label} className="rounded-2xl border border-line bg-paper p-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-brass">{card.label}</p>
              <p className="mt-2 font-serif text-3xl text-near tabular-nums">{card.value}</p>
              <p className="mt-2 text-sm text-muted">{card.note}</p>
            </li>
          ))}
        </ul>
        <AdminTrend points={snapshot.trend} truncated={snapshot.trendTruncated} />
      </div>
    </>
  );
}
