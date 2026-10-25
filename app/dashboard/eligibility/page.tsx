import { WorkspaceHeader } from "@/components/workspace-header";
import { eb2niw } from "@/lib/content";

const prongs = [
  {
    title: "Substantial merit and national importance",
    body: "Describe the endeavor and why it matters beyond you and your employer. This workspace step is not started.",
  },
  {
    title: "Well positioned to advance it",
    body: "Education, record, and a plan for the work in the United States. This workspace step is not started.",
  },
  {
    title: "On balance, waive the job offer",
    body: "Why it would benefit the United States to waive the job offer and labor certification. This workspace step is not started.",
  },
] as const;

export default function DashboardEligibilityPage() {
  return (
    <>
      <WorkspaceHeader
        title="Eligibility"
        lede={`The three Dhanasar prongs, as requirements to work through for an ${eb2niw} petition. Each one is not started. This is a checklist, not a finding that you qualify.`}
      />
      <ol className="grid gap-4 px-5 py-8 sm:px-8">
        {prongs.map((prong, index) => (
          <li key={prong.title} className="rounded-2xl border border-line bg-raised p-5">
            <p className="text-xs font-semibold tracking-[0.14em] text-brass">PRONG {index + 1}</p>
            <h2 className="mt-2 font-serif text-2xl text-near">{prong.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{prong.body}</p>
            <p className="mt-4 text-sm font-semibold text-near">Not started</p>
          </li>
        ))}
      </ol>
    </>
  );
}
