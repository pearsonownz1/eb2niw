import { AdminSection } from "@/components/admin-section";
import { adminRangeFromParams, loadAdmin } from "@/lib/admin";
import type { AdminSnapshot, TableColumn, TableRow } from "@/lib/admin-model";

export async function AdminTablePage({
  searchParams,
  title,
  lede,
  path,
  table,
  columns,
  pick,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  title: string;
  lede: string;
  path: string;
  table: string;
  columns: readonly TableColumn[];
  pick: (snapshot: AdminSnapshot) => readonly TableRow[];
}) {
  const params = await searchParams;
  const range = adminRangeFromParams(params);
  const snapshot = await loadAdmin(range);

  return (
    <AdminSection
      title={title}
      lede={lede}
      path={path}
      range={range}
      table={table}
      columns={columns}
      rows={pick(snapshot)}
      notice={snapshot.notice}
    />
  );
}
