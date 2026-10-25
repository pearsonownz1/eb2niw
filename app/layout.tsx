import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { NotLegalAdvice } from "@/components/not-legal-advice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eb2niw.com"),
  title: {
    default: "EB2NIW — resources for people filing their own petition",
    template: "%s · EB2NIW",
  },
  description:
    "Placeholder resource from EB2NIW for people preparing their own EB-2 National Interest Waiver petitions. Not a law firm.",
  openGraph: {
    title: "EB2NIW",
    description:
      "A placeholder resource for people preparing their own EB-2 National Interest Waiver petitions.",
    url: "https://eb2niw.com",
    siteName: "EB2NIW",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-raised focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <div className="bg-brass-soft px-5 py-2 text-center text-sm text-ink">
          Placeholder launch. The quiz, guides, and checkout on this site are
          not live yet.
        </div>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
          <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
            <NotLegalAdvice />
          </div>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
