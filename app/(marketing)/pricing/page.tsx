import type { Metadata } from "next";
import Link from "next/link";
import { comparison, steps } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Two EB2NIW plans: DIY at $XXX, and DIY plus attorney review at $X,XXX. Prices are placeholders.",
};

export default function PricingPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-brass">Two plans</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-navy sm:text-5xl">
          DIY, or DIY with an independent attorney
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Both plans are the same guided software. The second plan adds review of your package by an independent licensed immigration attorney before you file. Prices below are placeholders.
        </p>
      </header>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-line bg-raised p-6">
          <h2 className="font-serif text-3xl text-navy">DIY</h2>
          <p className="mt-2 text-sm text-muted">Full self-service through the guided software.</p>
          <p className="mt-6 font-serif text-5xl text-navy">$XXX</p>
          <p className="mt-2 text-sm text-muted">Placeholder price.</p>
        </section>
        <section className="rounded-2xl border border-navy bg-navy p-6 text-paper">
          <p className="text-xs font-semibold tracking-wide text-brass-soft">Attorney Review</p>
          <h2 className="mt-2 font-serif text-3xl">DIY + Attorney Review</h2>
          <p className="mt-2 text-sm text-paper/80">
            The same software, plus review by an independent licensed immigration attorney.
          </p>
          <p className="mt-6 font-serif text-5xl">$X,XXX</p>
          <p className="mt-2 text-sm text-paper/70">Placeholder price. Premium.</p>
        </section>
      </div>

      <section id="how-it-works" className="mt-16 scroll-mt-24">
        <h2 className="font-serif text-3xl text-navy sm:text-4xl">How it works</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {steps.map((step) => (
            <li key={step.number} className="rounded-xl border border-line bg-raised p-5">
              <p className="font-serif text-2xl text-brass">{step.number}</p>
              <h3 className="mt-2 font-serif text-2xl text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-3xl text-navy sm:text-4xl">Compare the plans</h2>
        <div className="mt-8 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              DIY compared with DIY plus attorney review. Prices are placeholders.
            </caption>
            <thead className="bg-raised text-navy">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Feature
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  DIY
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  DIY + Attorney Review
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-t border-line">
                  <th scope="row" className="px-4 py-3 font-medium text-ink">
                    {row.feature}
                  </th>
                  <td className="px-4 py-3 text-muted">{row.diy}</td>
                  <td className="px-4 py-3 text-muted">{row.review}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-10">
        <Link
          href="/get-started"
          className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-near"
        >
          Get started
        </Link>
      </p>
    </article>
  );
}
