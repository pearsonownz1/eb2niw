import type { Metadata } from "next";
import { BuyButton } from "@/components/buy-button";
import { PageIntro } from "@/components/page-intro";
import { guideOutline } from "@/lib/content";

export const metadata: Metadata = {
  title: "DIY guide",
  description:
    "Placeholder page for the $99 EB-2 NIW DIY guide and toolkit. Checkout is not connected.",
};

export default function GuidePage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageIntro
        eyebrow="Placeholder product"
        title="The $99 DIY guide and toolkit"
        lede="A guide for people preparing their own EB-2 NIW petition is planned at $99. The manuscript is not written, and checkout is not connected."
      />

      <div className="mt-10 max-w-3xl rounded-xl border border-line bg-raised p-6 sm:p-8">
        <p className="text-sm font-semibold text-brass">Planned price</p>
        <p className="mt-2 font-serif text-5xl text-navy">$99</p>
        <p className="mt-3 text-muted">
          One-time price for the guide and toolkit when they exist. Paying is
          not possible on this placeholder page.
        </p>
        <BuyButton />
      </div>

      <section className="mt-12 max-w-3xl">
        <h2 className="font-serif text-3xl text-navy">Planned contents</h2>
        <p className="mt-3 text-muted">
          This outline is a placeholder. These chapters have not been written,
          and they are not legal advice.
        </p>
        <ol className="mt-6 space-y-3">
          {guideOutline.map((item, index) => (
            <li
              key={item}
              className="flex gap-4 rounded-lg border border-line bg-raised px-4 py-3"
            >
              <span className="font-serif text-lg text-brass">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-ink">{item}</span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
