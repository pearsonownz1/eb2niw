import Link from "next/link";
import { disclaimer, gcsUrl, nav } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-paper">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-serif text-2xl">EB-2 NIW</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/80">
            A placeholder site from GEO Credential Services for people preparing
            their own EB-2 National Interest Waiver petitions.
          </p>
          <p className="mt-4 text-sm text-paper/80">
            <a
              href={gcsUrl}
              className="font-semibold text-paper underline decoration-brass underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              GEO Credential Services (gcs.org)
            </a>
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-2 text-sm">
          <Link href="/" className="rounded-sm py-1 text-paper/90 hover:text-paper">
            Home
          </Link>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm py-1 text-paper/90 hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
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
