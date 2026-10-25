import { Suspense } from "react";
import { AdminTablePage } from "@/components/admin-table-page";
import { leadColumns } from "@/lib/admin-model";

export const metadata = { title: "Leads" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function LeadsPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-sm text-muted">Loading leads</p>}>
      <AdminTablePage
        searchParams={searchParams}
        title="Leads"
        lede="News opt-in emails, and Book now clicks from the fit-check thank-you screen."
        path="/admin/leads"
        table="leads"
        columns={leadColumns}
        pick={(snapshot) => snapshot.leads}
      />
    </Suspense>
  );
}
