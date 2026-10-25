import Link from "next/link";
import { Check } from "lucide-react";
import { plans } from "@/lib/plans";
import { getWorkspace } from "@/lib/workspace";
import { workspaceIcons } from "@/components/workspace-icons";
import { accentClass, greetingName, workspaceSections, type SectionId } from "@/lib/workspace-sections";

const tracked: SectionId[] = ["templates", "tutorials", "documents", "forms"];

export default async function OverviewPage() {
  const workspace = await getWorkspace();
  const plan = workspace.plan ? plans[workspace.plan] : null;
  const name = greetingName(workspace.fullName, workspace.email);
  const steps = workspace.premium ? [...tracked, "attorney" as const] : tracked;
  const percents = Object.fromEntries(steps.map((id) => [id, sectionPercent(id, workspace.documents.length)])) as Record<string, number>;
  const overall = Math.round(steps.reduce((sum, id) => sum + (percents[id] ?? 0), 0) / steps.length);
  const next = nextStep(Boolean(plan), workspace.documents.length);
  const badge = plan?.badge ?? plan?.name ?? "No plan yet";
  const categories = workspaceSections.filter((section) => section.id !== "overview");

  return (
    <div className="px-5 py-6 sm:px-8 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-sky-800">Petition workspace</p>
          <h1 className="mt-1 font-serif text-4xl tracking-tight text-slate-950 sm:text-5xl">
            {name ? `Welcome back, ${name}` : "Welcome back"}
          </h1>
          <p className="mt-2 max-w-2xl text-base text-slate-600">
            Nothing here is a filing status with USCIS, and nothing is sent until you decide to file.
          </p>
        </div>
        <p className="rounded-full bg-slate-950 px-3 py-1.5 text-sm font-semibold text-white">{badge}</p>
      </header>

      <section className="mt-6 grid items-center gap-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="text-sm font-semibold text-indigo-800">Overall progress</p>
          <h2 className="mt-1 font-serif text-3xl text-slate-950">Your petition is {overall}% started</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">{next.detail}</p>
          <Link
            href={next.href}
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            {next.label}
          </Link>
        </div>
        <ProgressRing value={overall} />
      </section>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((section) => {
          const Icon = workspaceIcons[section.id];
          const accent = accentClass[section.accent];
          const locked = section.id === "attorney" && !workspace.premium;
          const percent = locked ? 0 : (percents[section.id] ?? 0);
          const status = statusLabel(section.id, workspace.documents.length, workspace.premium);
          return (
            <li key={section.id}>
              <Link
                href={section.href}
                className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-2xl ${accent.tile}`}>
                    <Icon className={`h-5 w-5 ${accent.icon}`} aria-hidden="true" />
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${locked ? "bg-slate-100 text-slate-700" : accent.chip}`}>
                    {status}
                  </span>
                </span>
                <h2 className="mt-4 font-serif text-2xl text-slate-950">{section.label}</h2>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">{section.description}</p>
                <div
                  className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                  aria-label={`${section.label} progress`}
                >
                  <div className={`h-full rounded-full ${accent.bar}`} style={{ width: `${percent}%` }} />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={`mt-6 grid gap-4 ${workspace.premium ? "lg:grid-cols-[minmax(0,1fr)_22rem]" : ""}`}>
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <h2 className="font-serif text-2xl text-slate-950">Next steps</h2>
          <ol className="mt-4 grid gap-2">
            {checklist(Boolean(plan), workspace.documents.length).map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-slate-50">
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                      item.done ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.done ? <Check className="h-4 w-4" aria-hidden="true" /> : <span className="h-2 w-2 rounded-full bg-slate-400" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
                    <span className="block text-xs text-slate-600">{item.note}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
        {workspace.premium ? (
          <section className="rounded-3xl bg-emerald-800 p-6 text-white shadow-sm">
            <ScaleNote />
            <h2 className="mt-4 font-serif text-3xl">Attorney Review is included</h2>
            <p className="mt-2 text-sm leading-relaxed text-emerald-50">
              Premium is on this account. The review steps are not started, and an independent attorney has not seen a package yet.
            </p>
            <Link href="/dashboard/attorney" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-white px-4 text-sm font-semibold text-emerald-900">
              Open Attorney Review
            </Link>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg viewBox="0 0 140 140" className="mx-auto h-36 w-36" role="img" aria-label={`Petition progress ${value} percent`}>
      <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        stroke="#4f46e5"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 70 70)"
      />
      <text x="70" y="76" textAnchor="middle" fill="#0f172a" fontSize="28" fontWeight="700">
        {value}%
      </text>
    </svg>
  );
}

function ScaleNote() {
  const Icon = workspaceIcons.attorney;
  return <Icon className="h-8 w-8 text-white" aria-hidden="true" />;
}

function sectionPercent(id: SectionId, documentCount: number): number {
  if (id === "documents") {
    return Math.min(100, documentCount * 34);
  }
  return 0;
}

function statusLabel(id: SectionId, documentCount: number, premium: boolean): string {
  if (id === "documents") {
    return documentCount === 0 ? "Not started" : `${documentCount} uploaded`;
  }
  if (id === "attorney") {
    return premium ? "Included" : "Locked";
  }
  if (id === "community") {
    return "Not open";
  }
  return "Not published";
}

function nextStep(hasPlan: boolean, documentCount: number): { href: string; label: string; detail: string } {
  if (!hasPlan) {
    return {
      href: "/get-started",
      label: "Choose a plan",
      detail: "Start with DIY or Premium. Prices are placeholders, and payment is not open yet.",
    };
  }
  if (documentCount === 0) {
    return {
      href: "/dashboard/documents",
      label: "Upload an exhibit",
      detail: "The evidence file is empty. Add the first document when you are ready.",
    };
  }
  return {
    href: "/dashboard/templates",
    label: "Review templates",
    detail: "Templates are not published yet. You can still keep adding exhibits.",
  };
}

function checklist(hasPlan: boolean, documentCount: number) {
  return [
    { label: "Choose a plan", note: hasPlan ? "Plan selected" : "DIY or Premium", href: "/get-started", done: hasPlan },
    {
      label: "Upload an exhibit",
      note: documentCount === 0 ? "No files yet" : `${documentCount} uploaded`,
      href: "/dashboard/documents",
      done: documentCount > 0,
    },
    { label: "Open a petition template", note: "Not published yet", href: "/dashboard/templates", done: false },
    { label: "Watch a tutorial", note: "Not published yet", href: "/dashboard/tutorials", done: false },
    { label: "Start the I-140", note: "Not published yet", href: "/dashboard/forms", done: false },
  ];
}
