import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { articles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Free EB‑2 NIW reading from EB2NIW. These articles are not written yet, and they are not a paid guide.",
};

export default function ResourcesPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageIntro
        eyebrow="Free reading"
        title="Resources"
        lede="Short explainers for people preparing their own petition. Nothing here is a paid ebook. The titles below are not published yet."
      />
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <li key={article.title} className="rounded-xl border border-line bg-raised p-6">
            <p className="text-sm font-semibold text-brass">Coming soon</p>
            <h2 className="mt-2 font-serif text-2xl text-navy">{article.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{article.summary}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}
