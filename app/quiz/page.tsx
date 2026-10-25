import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { quizTopics } from "@/lib/content";

export const metadata: Metadata = {
  title: "Eligibility quiz",
  description:
    "Placeholder for a free EB-2 NIW eligibility quiz. The quiz is not live and does not score anyone.",
};

export default function QuizPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageIntro
        eyebrow="Coming soon"
        title="Free eligibility quiz"
        lede="The quiz is not open. When it is, it will be a set of reflection questions. It will not issue an eligibility decision, a score, or an approval estimate."
      />

      <div className="mt-10 max-w-3xl rounded-xl border border-dashed border-brass/50 bg-brass-soft px-5 py-5">
        <p className="font-semibold text-navy">Nothing here can be answered yet.</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          A placeholder quiz that produced a result would be misleading. This
          page only lists the topics the real quiz is expected to cover.
        </p>
      </div>

      <section className="mt-10 max-w-3xl">
        <h2 className="font-serif text-3xl text-navy">Planned topics</h2>
        <ul className="mt-6 space-y-3">
          {quizTopics.map((topic) => (
            <li
              key={topic}
              className="rounded-lg border border-line bg-raised px-4 py-3 text-ink"
            >
              {topic}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">
          The three-prong summary on the{" "}
          <Link
            href="/"
            className="font-semibold text-navy underline decoration-brass underline-offset-4"
          >
            home page
          </Link>{" "}
          is the orientation that exists today.
        </p>
      </section>
    </article>
  );
}
