import Link from "next/link";
import { defaultRange, type DateRange } from "@/lib/admin-model";

export function AdminToolbar({ path, range, table }: { path: string; range: DateRange; table: string | null }) {
  const defaults = defaultRange();
  const filtered = Boolean(range.q) || range.from !== defaults.from || range.to !== defaults.to;
  const exportParams = new URLSearchParams({ table: table ?? "", from: range.from, to: range.to });
  if (range.q) exportParams.set("q", range.q);

  return (
    <form method="get" action={path} key={`${range.from}:${range.to}:${range.q}`} className="flex flex-wrap items-end gap-3">
      <label className="text-sm font-semibold text-near">
        From
        <input
          type="date"
          name="from"
          defaultValue={range.from}
          className="mt-1 block rounded-xl border border-line bg-raised px-3 py-2 text-base font-normal text-ink"
        />
      </label>
      <label className="text-sm font-semibold text-near">
        To
        <input
          type="date"
          name="to"
          defaultValue={range.to}
          className="mt-1 block rounded-xl border border-line bg-raised px-3 py-2 text-base font-normal text-ink"
        />
      </label>
      {table ? (
        <label className="min-w-48 flex-1 text-sm font-semibold text-near">
          Search
          <input
            type="search"
            name="q"
            defaultValue={range.q}
            placeholder="Email, plan, or answer"
            className="mt-1 block w-full rounded-xl border border-line bg-raised px-3 py-2 text-base font-normal text-ink"
          />
        </label>
      ) : null}
      <button type="submit" className="inline-flex min-h-11 items-center rounded-full bg-navy px-4 text-sm font-semibold text-paper">
        Apply
      </button>
      {filtered ? (
        <Link href={path} className="inline-flex min-h-11 items-center text-sm font-semibold text-navy">
          Last 14 days
        </Link>
      ) : null}
      {table ? (
        <a
          href={`/admin/export?${exportParams.toString()}`}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-navy underline decoration-brass underline-offset-4"
        >
          Export CSV
        </a>
      ) : null}
    </form>
  );
}
