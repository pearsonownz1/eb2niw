import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact placeholder for EB2NIW. No address is published, and messages are not collected here.",
};

export default function ContactPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageIntro
        eyebrow="Coming soon"
        title="Contact"
        lede="EB2NIW does not publish a contact address yet, and this site does not have a working contact form. Please do not send case facts or documents to this page. Nothing entered here would be delivered."
      />

      <div className="mt-10 max-w-3xl rounded-xl border border-line bg-raised p-6 sm:p-8">
        <h2 className="font-serif text-2xl text-navy">No mailbox yet</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          A way to write to EB2NIW will be added before the guide, quiz, or
          document services open. Until then, this page only explains that
          messages are not received.
        </p>
      </div>
    </article>
  );
}
