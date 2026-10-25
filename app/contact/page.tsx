import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { gcsEmail, gcsUrl } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact placeholder for eb2niw.com. Messages are not collected here. GEO Credential Services can be reached at gcs.org.",
};

export default function ContactPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageIntro
        eyebrow="Coming soon"
        title="Contact"
        lede="eb2niw.com does not have a working contact form. Please do not send case facts or documents to this page. Nothing entered here would be delivered."
      />

      <div className="mt-10 max-w-3xl rounded-xl border border-line bg-raised p-6 sm:p-8">
        <h2 className="font-serif text-2xl text-navy">GEO Credential Services</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          For credential evaluations, translations, and expert opinion letters,
          use the contact details GEO Credential Services publishes:
        </p>
        <ul className="mt-5 space-y-3 text-sm">
          <li>
            <a
              href={gcsUrl}
              className="font-semibold text-navy underline decoration-brass underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              gcs.org
            </a>
          </li>
          <li>
            <a
              href={`mailto:${gcsEmail}`}
              className="font-semibold text-navy underline decoration-brass underline-offset-4"
            >
              {gcsEmail}
            </a>
          </li>
        </ul>
      </div>
    </article>
  );
}
