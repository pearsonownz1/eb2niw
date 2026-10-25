import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { eb2niw } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "EB2NIW does not publish a contact address yet. A short self-assessment suggests which plan to start with.",
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
          href="/fit"
          className="font-semibold text-navy underline decoration-brass underline-offset-4"
        >
          Is {eb2niw} right for me?
        </Link>
      </p>
    </article>
  );
}
