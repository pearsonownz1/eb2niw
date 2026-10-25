import type { TableColumn, TableRow } from "@/lib/admin-model";

export function AdminTable({
  columns,
  rows,
  query,
}: {
  columns: readonly TableColumn[];
  rows: readonly TableRow[];
  query: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted">{query ? "No rows match this search." : "No rows in this range."}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-raised">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs tracking-[0.12em] text-brass">
            {columns.map((column) => (
              <th key={column.key} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-line align-top">
              {columns.map((column) => (
                <td key={column.key} className="max-w-sm px-4 py-3 text-ink">
                  <span className="whitespace-pre-line">{row[column.key]}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
