import type { Metadata } from "next";
import Link from "next/link";
import { EmailSignup } from "@/components/email-signup";
import { offers, prongs } from "@/lib/content";

export const metadata: Metadata = {
  description:
    "Placeholder home for people preparing their own EB-2 National Interest Waiver petitions, including the three Dhanasar prongs and a free quiz that is not live yet.",
};

export default function HomePage() {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <p className="text-sm font-semibold text-brass">
          For people filing their own petition
        </p>
        <h1 className="mt-3 max-w-4xl font-serif text-4xl leading-[1.12] text-balance text-navy sm:text-6xl">
          A plain-language resource for the EB-2 National Interest Waiver.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted">
          eb2niw.com is a placeholder site from GEO Credential Services. It will
          help you understand the Dhanasar test and see what a self-filed
          petition usually involves. It is not a law firm, and it does not
          decide whether you qualify.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center rounded-md bg-navy px-5 py-3 text-sm font-semibold text-paper"
          >
            Free eligibility quiz
          </Link>
          <Link
            href="/guide"
            className="inline-flex items-center justify-center rounded-md border border-navy/15 bg-raised px-5 py-3 text-sm font-semibold text-navy"
          >
            See the $99 DIY guide
          </Link>
        </div>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          The quiz link opens a placeholder page. The quiz itself is not live,
          and it will not score you.
        </p>
      </section>

      <section className="border-y border-line bg-raised">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl text-navy sm:text-4xl">
              The three Dhanasar prongs
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              USCIS decides EB-2 NIW cases under the framework in Matter of
              Dhanasar, 26 I&amp;N Dec. 884 (AAO 2016). This is a short
              paraphrase for orientation, not a substitute for the decision.
            </p>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {prongs.map((prong) => (
              <li
                key={prong.number}
                className="rounded-xl border border-line bg-paper p-5"
              >
                <p className="font-serif text-2xl text-brass">{prong.number}</p>
                <h3 className="mt-3 font-serif text-2xl leading-snug text-navy">
                  {prong.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {prong.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl text-navy sm:text-4xl">
            What this site will offer
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            A ladder from free reading to a paid guide, a petition review, and
            document services from GEO Credential Services. Only the guide has
            a planned price ($99). Checkout on this site is not open. GCS
            services are ordered on gcs.org.
          </p>
        </div>
        <ol className="mt-10 divide-y divide-line overflow-hidden rounded-xl border border-line bg-raised">
          {offers.map((offer) => (
            <li
              key={offer.step}
              className="grid gap-4 p-5 sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:p-6"
            >
              <p className="font-serif text-2xl text-brass">{offer.step}</p>
              <div>
                <h3 className="font-serif text-2xl text-navy">{offer.name}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                  {offer.body}
                </p>
                <Link
                  href={offer.href}
                  className="mt-3 inline-block text-sm font-semibold text-navy underline decoration-brass underline-offset-4"
                >
                  {offer.linkLabel}
                </Link>
              </div>
              <div className="sm:text-right">
                <p className="font-semibold text-navy">{offer.price}</p>
                <p className="mt-1 text-sm text-brass">{offer.status}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-navy text-paper">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-serif text-3xl text-balance sm:text-4xl">
              Get a note when this site has something real to send.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-paper/80">
              Leave an email if you want to hear when the guide or the quiz
              opens. This is not a legal consultation.
            </p>
          </div>
          <EmailSignup />
        </div>
      </section>
    </>
  );
}
