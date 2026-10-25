import { Suspense } from "react";
import { AdminTablePage } from "@/components/admin-table-page";
import { purchaseColumns } from "@/lib/admin-model";

export const metadata = { title: "Purchases" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function PurchasesPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-sm text-muted">Loading purchases</p>}>
      <AdminTablePage
        searchParams={searchParams}
        title="Purchases"
        lede="Plans marked active. Payment is not collected yet, so live rows stay empty until a payment provider marks them active."
        path="/admin/purchases"
        table="purchases"
        columns={purchaseColumns}
        pick={(snapshot) => snapshot.purchases}
      />
    </Suspense>
  );
}
