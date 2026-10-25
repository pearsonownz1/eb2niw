import { accentClass, type AccentId } from "@/lib/workspace-sections";

export function WorkspaceItems({
  items,
  note,
  accent,
}: {
  items: readonly string[];
  note: string;
  accent: AccentId;
}) {
  const tone = accentClass[accent];

  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
        >
          <p className="font-semibold text-slate-950">{item}</p>
          <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone.chip}`}>{note}</p>
        </li>
      ))}
    </ul>
  );
}
