import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "About",
  description:
    "EB2NIW is a standalone placeholder site for people preparing their own EB-2 National Interest Waiver petitions.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageIntro
        eyebrow="Placeholder"
        title="About EB2NIW"
        lede="EB2NIW is a standalone site for people who plan to prepare their own EB-2 National Interest Waiver petitions. This launch is a placeholder."
      />

      <div className="mt-10 max-w-3xl space-y-6 text-base leading-relaxed text-muted">
        <p>
          What is planned: free guides, a free reflection quiz, a $99 DIY guide
          and toolkit, petition review, expert opinion letters, credential
          evaluations, and translations. The document services do not name a
          provider, and there is no way to order them yet.
        </p>
        <p>
          What this site is not: a law firm, a lawyer referral service, or a
          source of legal advice. Team biographies, an office address, and a
          company history are not on this placeholder page. This site does not
          publish statistics, testimonials, or approval rates.
        </p>
      </div>
    </article>
  );
}
