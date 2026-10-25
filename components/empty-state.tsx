import type { LucideIcon } from "lucide-react";
import { accentClass, type AccentId } from "@/lib/workspace-sections";

export function EmptyState({
  icon: Icon,
  accent,
  title,
  body,
}: {
  icon: LucideIcon;
  accent: AccentId;
  title: string;
  body: string;
}) {
  const tone = accentClass[accent];

  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
      <span className="relative mx-auto grid h-24 w-24 place-items-center">
        <span className={`absolute inset-2 rounded-full ${tone.tile}`} aria-hidden="true" />
        <span className={`relative grid h-16 w-16 place-items-center rounded-3xl shadow-sm ring-1 ring-slate-200 ${tone.tile}`}>
          <Icon className={`h-8 w-8 ${tone.icon}`} aria-hidden="true" />
        </span>
      </span>
      <h2 className="mt-4 font-serif text-2xl text-slate-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}
