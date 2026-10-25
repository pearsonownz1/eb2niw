import { AdminTable } from "@/components/admin-table";
import { AdminToolbar } from "@/components/admin-toolbar";
import { WorkspaceHeader } from "@/components/workspace-header";
import { visibleRows, type TableColumn, type TableRow, type DateRange } from "@/lib/admin-model";

export function AdminSection({
  title,
  lede,
  path,
  range,
  table,
  columns,
  rows,
  notice,
}: {
  title: string;
  lede: string;
  path: string;
  range: DateRange;
  table: string;
  columns: readonly TableColumn[];
  rows: readonly TableRow[];
  notice: string | null;
}) {
  const visible = visibleRows([...rows], range.q, columns);

  return (
    <>
      <WorkspaceHeader title={title} lede={lede} />
      <div className="grid gap-6 px-5 py-8 sm:px-8">
        {notice ? <p className="text-sm text-near">{notice}</p> : null}
        <AdminToolbar path={path} range={range} table={table} />
        <AdminTable columns={columns} rows={visible} query={range.q} />
      </div>
    </>
  );
}
