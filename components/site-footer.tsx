import Link from "next/link";
import { brand, disclaimer, nav, photoCredits } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-paper">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-serif text-2xl">{brand}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/80">
            Guided software for people preparing their own EB‑2 National Interest Waiver petition. Two plans. Prices are placeholders, and payment is not open yet.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-paper/70">
            Photos:{" "}
            {photoCredits.map((credit, index) => (
              <span key={credit.href}>
                {index > 0 ? ", " : null}
                <a
                  href={credit.href}
                  className="underline decoration-brass underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {credit.name}
                </a>
                {` on ${credit.source}`}
              </span>
            ))}
            .
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-2 text-sm">
          <Link href="/" className="rounded-sm py-1 text-paper/90 hover:text-paper">
            Home
          </Link>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-sm py-1 text-paper/90 hover:text-paper">
              {item.label}
            </Link>
          ))}
          <Link href="/eligibility" className="rounded-sm py-1 text-paper/90 hover:text-paper">
            Check your eligibility
          </Link>
          <Link href="/get-started" className="rounded-sm py-1 text-paper/90 hover:text-paper">
            Get started
          </Link>
          <Link href="/contact" className="rounded-sm py-1 text-paper/90 hover:text-paper">
            Contact
          </Link>
        </nav>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto w-full max-w-6xl px-5 py-4 text-sm font-semibold text-paper sm:px-8">
          {disclaimer}
        </p>
      </div>
    </footer>
  );
}
