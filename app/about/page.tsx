import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { gcsUrl } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "eb2niw.com is a placeholder project of GEO Credential Services for people preparing their own EB-2 NIW petitions.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageIntro
        eyebrow="Placeholder"
        title="About this site"
        lede="GEO Credential Services (gcs.org) owns eb2niw.com. The site is being built as a public resource for people who plan to prepare their own EB-2 National Interest Waiver petitions."
      />

      <div className="mt-10 max-w-3xl space-y-6 text-base leading-relaxed text-muted">
        <p>
          What is planned: free guides, a free reflection quiz, a $99 DIY guide
          and toolkit, and a petition review. Expert opinion letters, credential
          evaluations, and translations remain services of GEO Credential
          Services.
        </p>
        <p>
          What this site is not: a law firm, a lawyer referral service, or a
          source of legal advice. Team biographies, an office address, and a
          company history are not on this placeholder page. This site does not
          publish statistics, testimonials, or approval rates.
        </p>
        <p>
          <a
            href={gcsUrl}
            className="font-semibold text-navy underline decoration-brass underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit GEO Credential Services
          </a>
        </p>
      </div>
    </article>
  );
}
