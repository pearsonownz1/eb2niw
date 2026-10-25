import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { articles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Placeholder list of EB-2 NIW articles. None of these guides have been written.",
};

export default function ResourcesPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageIntro
        eyebrow="Coming soon"
        title="Resources"
        lede="These titles are a planned reading list. They are not published articles, and they are not legal advice."
      />

      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <li key={article.title} className="rounded-xl border border-line bg-raised p-6">
            <p className="text-sm font-semibold text-brass">Placeholder</p>
            <h2 className="mt-2 font-serif text-2xl text-navy">{article.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{article.summary}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}
