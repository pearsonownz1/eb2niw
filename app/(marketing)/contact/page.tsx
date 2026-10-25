import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Contact",
  description: "EB2NIW does not publish a contact address yet. The eligibility check is a short questionnaire.",
};

export default function ContactPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageIntro
        eyebrow="Coming soon"
        title="Contact"
        lede="EB2NIW does not publish a contact address yet, and this page does not accept messages. Please do not send case facts or documents here."
      />
      <p className="mt-8">
        <Link
          href="/eligibility"
          className="font-semibold text-navy underline decoration-brass underline-offset-4"
        >
          Check your eligibility
        </Link>
      </p>
    </article>
  );
}
