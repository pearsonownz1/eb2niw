"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/lib/content";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-raised/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 px-5 py-3 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-sm"
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden="true"
            className="grid h-10 w-10 place-items-center rounded-md bg-navy font-serif text-sm text-paper"
          >
            NIW
          </span>
          <span>
            <span className="block font-serif text-xl leading-none text-navy">
              EB-2 NIW
            </span>
            <span className="mt-1 block text-xs text-muted">
              by GEO Credential Services
            </span>
          </span>
        </Link>
        <button
          type="button"
          className="inline-flex min-h-11 items-center rounded-md border border-line px-3 text-sm font-semibold text-navy md:hidden"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav
          id="site-nav"
          aria-label="Primary"
          className={`${open ? "grid" : "hidden"} w-full gap-1 border-t border-line py-3 md:flex md:w-auto md:items-center md:gap-1 md:border-0 md:py-0`}
        >
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-3 text-sm font-semibold md:py-2 ${
                  active
                    ? "bg-brass-soft text-navy"
                    : "text-muted hover:bg-paper hover:text-navy"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
