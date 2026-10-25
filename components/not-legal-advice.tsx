import { disclaimer } from "@/lib/content";

export function NotLegalAdvice() {
  return (
    <aside className="rounded-xl border border-line bg-brass-soft px-5 py-4 text-sm leading-relaxed text-ink">
      <p className="font-semibold">{disclaimer}</p>
      <p className="mt-1 text-muted">
        Filing an immigration petition depends on your own facts. This site
        cannot tell you whether you qualify, and it does not publish approval
        rates or client stories.
      </p>
    </aside>
  );
}
