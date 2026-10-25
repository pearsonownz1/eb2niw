import type { Metadata } from "next";
import { NiwFitQuiz } from "@/components/niw-fit-quiz";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Start your petition",
  description:
    "Check your EB‑2 NIW fit, see a plan suggestion, and save your contact details. The guided software is not open yet.",
};

export default function StartPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageIntro
        eyebrow="Not open yet"
        title="Start your petition"
        lede="Eight short questions, one screen at a time. The recommendation appears before we ask for your name. The guided software is not open yet, and the result is a suggestion about which plan to use."
      />
      <div className="mt-10 max-w-xl">
        <NiwFitQuiz />
      </div>
    </article>
  );
}
