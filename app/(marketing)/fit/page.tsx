import type { Metadata } from "next";
import { NiwFitQuiz } from "@/components/niw-fit-quiz";
import { eb2niw, fitDisclaimer } from "@/lib/content";

export const metadata: Metadata = {
  title: `Is ${eb2niw} right for me?`,
  description: `A short self-assessment that suggests a plan for an ${eb2niw} petition. ${fitDisclaimer}`,
};

export default function FitPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
      <header className="mb-8">
        <h1 className="font-serif text-4xl leading-[1.05] tracking-tight text-balance text-near sm:text-5xl">
          Is {eb2niw} right for me?
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          A short self-assessment. It suggests which plan to start with.
        </p>
      </header>
      <NiwFitQuiz variant="page" />
    </article>
  );
}
