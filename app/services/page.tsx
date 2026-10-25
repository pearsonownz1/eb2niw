import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { gcsEmail, gcsUrl } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Placeholder notes on petition review and on expert opinion letters, credential evaluations, and translations from GEO Credential Services.",
};

const services = [
  {
    id: "review",
    eyebrow: "Coming soon on this site",
    title: "Petition review",
    body: "A review of a draft EB-2 NIW petition is planned. Scope, timing, and price are not published, and there is no way to book it yet.",
  },
  {
    id: "letters",
    eyebrow: "GEO Credential Services",
    title: "Expert opinion letters",
    body: "GEO Credential Services prepares expert opinion letters, including for EB-2 NIW matters. This page does not take letter orders.",
  },
  {
    id: "evaluations",
    eyebrow: "GEO Credential Services",
    title: "Credential evaluations",
    body: "GEO Credential Services prepares academic credential evaluations. This page does not accept documents or payment for an evaluation.",
  },
  {
    id: "translations",
    eyebrow: "GEO Credential Services",
    title: "Translations",
    body: "GEO Credential Services prepares certified translations. This page does not accept documents or payment for a translation.",
  },
] as const;

export default function ServicesPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageIntro
        eyebrow="Placeholder"
        title="Services"
        lede="Petition review on eb2niw.com is not open. Expert opinion letters, credential evaluations, and translations are services of GEO Credential Services, and orders for those stay on gcs.org."
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

      <section id="gcs" className="mt-10 max-w-3xl rounded-xl border border-line bg-paper p-6">
        <h2 className="font-serif text-2xl text-navy">Start at GEO Credential Services</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          eb2niw.com does not describe turnaround times, prices, or outcomes for
          GCS work. Use the GCS site for the services they currently offer.
        </p>
        <p className="mt-4 text-sm">
          <a
            href={gcsUrl}
            className="font-semibold text-navy underline decoration-brass underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            gcs.org
          </a>
          <span className="text-muted"> · </span>
          <a
            href={`mailto:${gcsEmail}`}
            className="font-semibold text-navy underline decoration-brass underline-offset-4"
          >
            {gcsEmail}
          </a>
        </p>
      </section>
    </article>
  );
}
