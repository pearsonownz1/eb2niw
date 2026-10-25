import type { Metadata } from "next";
import Image from "next/image";
import { NiwFitQuiz } from "@/components/niw-fit-quiz";
import { faqs, features, whyCards } from "@/lib/content";

export const metadata: Metadata = {
  description:
    "Start your EB-2 NIW petition with guided software. Two plans: DIY, or DIY plus review by an independent immigration attorney. Prices are TBD.",
};

export default function HomePage() {
  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl items-start gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-x-12 lg:gap-y-8">
        <div>
          <p className="text-sm font-semibold text-brass">EB-2 National Interest Waiver</p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.12] text-balance text-navy sm:text-6xl">
            Start your EB-2 NIW petition
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted">
            EB2NIW is guided software for one category. Answer a short set of questions, one screen at a time. You will see whether DIY looks like a fit, whether attorney review is the better plan, or whether an attorney consult comes first. The full petition flow is not open yet.
          </p>
        </div>
        <div className="grid grid-cols-5 items-stretch gap-2 sm:gap-3 lg:col-start-1">
          <div className="col-span-3 overflow-hidden rounded-2xl">
            <Image
              src="/photos/family-portrait.jpg"
              alt="A mother smiling with three children close around her"
              width={1800}
              height={2181}
              priority
              sizes="(min-width: 1024px) 34vw, 58vw"
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
                sizes="(min-width: 1024px) 18vw, 36vw"
                className="h-full w-full object-cover object-[center_30%]"
              />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/photos/professional.jpg"
                alt="A professional woman smiling, seated indoors in soft light"
                width={1600}
                height={2397}
                sizes="(min-width: 1024px) 18vw, 36vw"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
        <div className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <NiwFitQuiz />
        </div>
      </section>

      <section className="border-y border-line bg-raised">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl text-navy sm:text-4xl">What you get with EB2NIW</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Both plans use the same software. Items marked Attorney Review are only on the second plan. Prices are not set.
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
                <h3 className="mt-3 font-serif text-2xl text-navy">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="font-serif text-3xl text-navy sm:text-4xl">Why EB2NIW</h2>
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
              <h3 className="font-serif text-2xl leading-snug text-navy">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{card.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line bg-raised">
        <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
          <h2 className="font-serif text-3xl text-navy sm:text-4xl">Questions</h2>
          <div className="mt-8 divide-y divide-line rounded-xl border border-line bg-paper">
            {faqs.map((item) => (
              <details key={item.question} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-semibold text-navy [&::-webkit-details-marker]:hidden">
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
