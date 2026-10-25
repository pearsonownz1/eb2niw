import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
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
    default: "EB2NIW — start your EB‑2 NIW petition",
    template: "%s · EB2NIW",
  },
  description:
    "Guided software for people preparing their own EB‑2 National Interest Waiver petition. EB2NIW is not a law firm.",
  openGraph: {
    title: "EB2NIW",
    description:
      "Guided software for an EB‑2 National Interest Waiver petition. Two plans, prices are placeholders.",
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
        {children}
      </body>
    </html>
  );
}
