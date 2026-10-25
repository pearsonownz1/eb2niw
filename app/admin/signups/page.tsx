import { Suspense } from "react";
import { AdminTablePage } from "@/components/admin-table-page";
import { signupColumns } from "@/lib/admin-model";

export const metadata = { title: "Signups" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function SignupsPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-sm text-muted">Loading signups</p>}>
      <AdminTablePage
        searchParams={searchParams}
        title="Signups"
        lede="Accounts created in the selected dates."
        path="/admin/signups"
        table="signups"
        columns={signupColumns}
        pick={(snapshot) => snapshot.signups}
      />
    </Suspense>
  );
}
