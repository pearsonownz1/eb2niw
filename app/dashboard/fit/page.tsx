import { WorkspaceHeader } from "@/components/workspace-header";
import { eb2niw, fitDisclaimer } from "@/lib/content";

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

export default function DashboardFitPage() {
  return (
    <>
      <WorkspaceHeader
        title={`Is ${eb2niw} right for me?`}
        lede="Notes for the three parts of a national-interest waiver, in your own words. Nothing here is sent to USCIS."
      />
      <ol className="grid gap-4 px-5 py-8 sm:px-8">
        {prongs.map((prong, index) => (
          <li key={prong.title} className="rounded-2xl border border-line bg-raised p-5">
            <p className="text-xs font-semibold tracking-[0.14em] text-brass">PART {index + 1}</p>
            <h2 className="mt-2 font-serif text-2xl text-near">{prong.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{prong.body}</p>
            <p className="mt-4 text-sm font-semibold text-near">Not started</p>
          </li>
        ))}
      </ol>
      <p className="px-5 pb-10 text-sm leading-relaxed text-muted sm:px-8">{fitDisclaimer}</p>
    </>
  );
}
