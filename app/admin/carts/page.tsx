import { Suspense } from "react";
import { AdminTablePage } from "@/components/admin-table-page";
import { cartColumns } from "@/lib/admin-model";

export const metadata = { title: "Abandoned carts" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function AbandonedCartsPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-sm text-muted">Loading abandoned carts</p>}>
      <AdminTablePage
        searchParams={searchParams}
        title="Abandoned carts"
        lede="Plan selections still pending payment for more than an hour."
        path="/admin/carts"
        table="carts"
        columns={cartColumns}
        pick={(snapshot) => snapshot.carts}
      />
    </Suspense>
  );
}
