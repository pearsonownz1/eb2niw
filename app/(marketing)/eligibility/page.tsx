import type { Metadata } from "next";
import { NiwFitQuiz } from "@/components/niw-fit-quiz";
import { eb2niw } from "@/lib/content";

export const metadata: Metadata = {
  title: "Check your eligibility",
  description: `Answer a short set of questions about an ${eb2niw} petition. The result suggests a product plan. It is not a finding that you qualify.`,
};

export default function EligibilityPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
      <NiwFitQuiz variant="page" />
    </article>
  );
}
