import type { Metadata } from "next";
import Link from "next/link";
import { eb2niw, fitDisclaimer } from "@/lib/content";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: `Booking a consultation for ${eb2niw} is coming soon. ${fitDisclaimer}`,
};

export default function BookPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <p className="text-sm font-semibold tracking-[0.14em] text-brass">CONSULTATION</p>
      <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight text-balance text-near sm:text-6xl">
        Book a consultation
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">Booking is coming soon.</p>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">{fitDisclaimer}</p>
      <Link
        href="/fit"
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-near"
      >
        Back to the fit check
      </Link>
    </article>
  );
}
