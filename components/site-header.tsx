"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { eb2niw, nav } from "@/lib/content";

const searchLinks = [
  { href: "/fit", label: `Is ${eb2niw} right for me?` },
  { href: "/get-started", label: "Get started" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/login", label: "Log in" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchId = useId();
  const matches = searchLinks.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  function closeMenus() {
    setOpen(false);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-3 rounded-sm" onClick={closeMenus}>
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-navy font-serif text-sm text-paper"
          >
            EB2
          </span>
          <span>
            <span className="block font-serif text-xl leading-none text-near">EB2NIW</span>
            <span className="mt-1 hidden text-xs text-muted lg:block">Guided {eb2niw} filing</span>
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = item.href === "/pricing" ? pathname.startsWith("/pricing") : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm font-semibold ${
                  active ? "bg-brass-soft text-near" : "text-muted hover:bg-raised hover:text-near"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-raised text-near"
            aria-expanded={searchOpen}
            aria-controls={searchId}
            onClick={() => {
              setSearchOpen((value) => !value);
              setOpen(false);
            }}
          >
            <span className="sr-only">{searchOpen ? "Close search" : "Search"}</span>
            <SearchIcon />
          </button>
          <Link
            href="/login"
            onClick={closeMenus}
            className="hidden min-h-11 items-center justify-center rounded-full border border-line bg-raised px-4 text-sm font-semibold text-near sm:inline-flex"
          >
            Log In
          </Link>
          <Link
            href="/get-started"
            onClick={closeMenus}
            className="hidden min-h-11 items-center justify-center rounded-full bg-gold px-4 text-sm font-semibold text-near sm:inline-flex"
          >
            Get Started
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-full border border-line px-3 text-sm font-semibold text-near md:hidden"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => {
              setOpen((value) => !value);
              setSearchOpen(false);
            }}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-2 px-5 pb-3 sm:hidden">
        <Link
          href="/login"
          onClick={closeMenus}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-raised px-4 text-sm font-semibold text-near"
        >
          Log In
        </Link>
        <Link
          href="/get-started"
          onClick={closeMenus}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-4 text-sm font-semibold text-near"
        >
          Get Started
        </Link>
      </div>
      {searchOpen ? (
        <div id={searchId} className="mx-auto w-full max-w-6xl px-5 pb-4 sm:px-8">
            <label className="block text-sm font-semibold text-near" htmlFor={`${searchId}-input`}>
              Search this site
              <input
                id={`${searchId}-input`}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="Fit check, plans, resources"
                className="mt-2 w-full rounded-xl border border-line bg-raised px-4 py-3 text-base font-normal text-ink"
              />
            </label>
            <ul className="mt-2 overflow-hidden rounded-xl border border-line bg-raised">
              {matches.length === 0 ? (
                <li className="px-4 py-3 text-sm text-muted">No matching pages.</li>
              ) : (
                matches.map((item) => (
                  <li key={item.href} className="border-t border-line first:border-t-0">
                    <Link href={item.href} onClick={closeMenus} className="block px-4 py-3 text-sm font-semibold text-near">
                      {item.label}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        ) : null}
      {open ? (
        <nav id="site-nav" aria-label="Primary" className="mx-auto grid w-full max-w-6xl gap-1 border-t border-line px-5 py-3 md:hidden">
          {nav.map((item) => {
            const active = item.href === "/pricing" ? pathname.startsWith("/pricing") : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={closeMenus}
                className={`rounded-md px-3 py-3 text-sm font-semibold ${
                  active ? "bg-brass-soft text-near" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5 20 20.5" strokeLinecap="round" />
    </svg>
  );
}
