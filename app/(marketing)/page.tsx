import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { eb2, eb2niw, faqs, features, whyCards } from "@/lib/content";

export const metadata: Metadata = {
  description: `Start your ${eb2} NIW petition with guided software. Two plans: DIY, or DIY plus review by an independent immigration attorney. Prices are placeholders.`,
};

export default function HomePage() {
  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="text-sm font-semibold text-brass">{eb2} National Interest Waiver</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-tight text-balance text-near sm:text-6xl lg:text-7xl">
            Start your {eb2niw} petition
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted">
            Guided software for one category. See whether DIY or DIY plus an independent attorney is the plan to start with, then open a workspace for the petition.
          </p>
          <div className="mt-8 flex max-w-md flex-col gap-3">
            <Link
              href="/fit"
              className="rounded-2xl border border-line bg-raised px-5 py-4 transition-colors hover:border-near/30"
            >
              <span className="block font-serif text-2xl leading-snug text-near">Is {eb2niw} right for me?</span>
              <span className="mt-1 block text-sm font-semibold text-brass">A short self-assessment</span>
            </Link>
            <Link
              href="/get-started"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-6 py-3 text-base font-semibold text-near"
            >
              Get started
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-5 items-stretch gap-2 sm:gap-3">
          <div className="col-span-3 overflow-hidden rounded-2xl">
            <Image
              src="/photos/family-portrait.jpg"
              alt="A mother smiling with three children close around her"
              width={1800}
              height={2181}
              priority
              sizes="(min-width: 1024px) 28vw, 58vw"
              className="aspect-[4/5] h-full w-full object-cover object-[center_18%]"
            />
          </div>
          <div className="col-span-2 grid grid-rows-2 gap-2 sm:gap-3">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/photos/family-street.jpg"
                alt="A mother standing outdoors with her son and daughter"
                width={1400}
                height={1999}
                sizes="(min-width: 1024px) 16vw, 36vw"
                className="h-full w-full object-cover object-[center_30%]"
              />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/photos/professional.jpg"
                alt="A professional woman smiling, seated indoors in soft light"
                width={1600}
                height={2397}
                sizes="(min-width: 1024px) 16vw, 36vw"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-raised">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="font-serif text-4xl tracking-tight text-near sm:text-5xl">What you get with EB2NIW</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Both plans use the same software. Items marked Attorney Review are only on the Premium plan. Prices are placeholders.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <li key={feature.title} className="rounded-xl border border-line bg-paper p-5">
                <p
                  className={
                    feature.attorneyOnly
                      ? "inline-flex rounded-full bg-brass-soft px-2.5 py-1 text-xs font-semibold tracking-wide text-brass"
                      : "inline-flex rounded-full bg-raised px-2.5 py-1 text-xs font-semibold tracking-wide text-muted ring-1 ring-line"
                  }
                >
                  {feature.attorneyOnly ? "Attorney Review" : "Both plans"}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-near">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="font-serif text-4xl tracking-tight text-near sm:text-5xl">Why EB2NIW</h2>
        <div className="mt-8 overflow-hidden rounded-2xl">
          <Image
            src="/photos/family-kitchen.jpg"
            alt="A family at a kitchen table, with a child on a parent's lap"
            width={1800}
            height={2700}
            sizes="(min-width: 1024px) 72rem, 100vw"
            className="aspect-[16/9] w-full object-cover object-[center_42%]"
          />
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {whyCards.map((card) => (
            <li key={card.title} className="rounded-xl border border-line bg-raised p-5">
              <h3 className="font-serif text-2xl leading-snug text-near">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{card.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line bg-raised">
        <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
          <h2 className="font-serif text-4xl tracking-tight text-near sm:text-5xl">Questions</h2>
          <div className="mt-8 divide-y divide-line rounded-xl border border-line bg-paper">
            {faqs.map((item) => (
              <details key={item.question} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-semibold text-near [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {item.question}
                    <span aria-hidden="true" className="text-brass group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
