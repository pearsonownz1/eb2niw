import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "About",
  description:
    "EB2NIW is guided software for people preparing their own EB‑2 National Interest Waiver petition.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageIntro
        eyebrow="EB2NIW"
        title="About this product"
        lede="EB2NIW is a standalone product for one visa category: the EB‑2 National Interest Waiver. It is guided software for individuals who plan to prepare their own petition."
      />
      <div className="mt-10 max-w-3xl space-y-6 text-base leading-relaxed text-muted">
        <p>
          The product has two plans. DIY is self-service through the software. DIY + Attorney Review is the same software plus a review of the package by an independent licensed immigration attorney before filing. Prices are not set. The full flow is not open yet.
        </p>
        <p>
          EB2NIW is not a law firm. It does not publish approval rates, client counts, or testimonials. Team biographies and an office address are not on this page.
        </p>
      </div>
    </article>
  );
}
