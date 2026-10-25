import { workspaceIcons } from "@/components/workspace-icons";
import { accentClass, sectionById, type SectionId } from "@/lib/workspace-sections";

export function DashboardHeader({
  sectionId,
  lede,
  chip,
}: {
  sectionId: SectionId;
  lede: string;
  chip: string;
}) {
  const section = sectionById(sectionId);
  const accent = accentClass[section.accent];
  const Icon = workspaceIcons[section.id];

  return (
    <header className="border-b border-slate-200 bg-white px-5 py-6 sm:px-8">
      <div className="flex items-start gap-4">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${accent.tile}`}>
          <Icon className={`h-6 w-6 ${accent.icon}`} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-serif text-3xl tracking-tight text-slate-950 sm:text-4xl">{section.label}</h1>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${accent.chip}`}>{chip}</span>
          </div>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-600">{lede}</p>
        </div>
      </div>
    </header>
  );
}
