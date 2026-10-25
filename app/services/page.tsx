import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Placeholder notes on petition review, expert opinion letters, credential evaluations, and translations. No provider is named, and nothing can be ordered yet.",
};

const services = [
  {
    id: "review",
    eyebrow: "Coming soon",
    title: "Petition review",
    body: "A review of a draft EB-2 NIW petition is planned. Scope, timing, and price are not published, and there is no way to book it yet.",
  },
  {
    id: "letters",
    eyebrow: "Coming soon",
    title: "Expert opinion letters",
    body: "Letters about a proposed endeavor are planned. No provider is named, and this page does not take letter orders.",
  },
  {
    id: "evaluations",
    eyebrow: "Coming soon",
    title: "Credential evaluations",
    body: "Academic credential evaluations are planned. This page does not accept documents or payment for an evaluation.",
  },
  {
    id: "translations",
    eyebrow: "Coming soon",
    title: "Translations",
    body: "Certified translations are planned. This page does not accept documents or payment for a translation.",
  },
] as const;

export default function ServicesPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageIntro
        eyebrow="Placeholder"
        title="Services"
        lede="Petition review, expert opinion letters, credential evaluations, and translations are planned. No provider is named, and none of them can be ordered on this site yet."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <section
            key={service.id}
            id={service.id}
            className="rounded-xl border border-line bg-raised p-6"
          >
            <p className="text-sm font-semibold text-brass">{service.eyebrow}</p>
            <h2 className="mt-2 font-serif text-2xl text-navy">{service.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{service.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
