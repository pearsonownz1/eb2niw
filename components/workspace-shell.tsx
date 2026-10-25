"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { signOut } from "@/app/actions/auth";
import { workspaceIcons } from "@/components/workspace-icons";
import { accentClass, workspaceSections } from "@/lib/workspace-sections";

export function WorkspaceShell({
  email,
  premium,
  preview,
  loadError,
  children,
}: {
  email: string | null;
  premium: boolean;
  preview: boolean;
  loadError: string | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  function toggle() {
    setOpenPath(open ? null : pathname);
  }

  function close() {
    setOpenPath(null);
  }

  return (
    <div className="flex min-h-full flex-1 bg-[#f5f7fb] text-slate-900">
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          aria-label="Close menu"
          onClick={close}
        />
      ) : null}
      <aside
        id="workspace-nav"
        className={`${open ? "flex" : "hidden"} fixed inset-y-0 left-0 z-40 w-72 flex-col bg-[#0e1a2b] text-slate-100 lg:flex lg:static lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/" className="rounded-lg" onClick={close}>
            <span className="block text-xs font-semibold tracking-[0.16em] text-sky-300">WORKSPACE</span>
            <span className="mt-1 block font-serif text-2xl leading-none text-white">EB2NIW</span>
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-slate-200 lg:hidden"
            onClick={close}
          >
            Close
          </button>
        </div>
        <nav aria-label="Workspace" className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4">
          {workspaceSections.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const locked = item.id === "attorney" && !premium;
            const Icon = workspaceIcons[item.id];
            const accent = accentClass[item.accent];
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={close}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-sky-300 ${
                  active ? "bg-white text-slate-950" : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${active ? accent.icon : "text-slate-300"}`} aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                {locked ? <span className={`text-xs ${active ? "text-emerald-800" : "text-emerald-300"}`}>Locked</span> : null}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-4 py-4">
          {email ? <p className="truncate text-xs text-slate-300">{email}</p> : null}
          <form action={signOut} className="mt-2">
            <button type="submit" className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-100 underline decoration-sky-400 underline-offset-4">
              Log out
            </button>
          </form>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-xl bg-[#0e1a2b] px-3 text-sm font-semibold text-white"
            aria-expanded={open}
            aria-controls="workspace-nav"
            onClick={toggle}
          >
            {open ? "Close" : "Menu"}
          </button>
          <span className="font-serif text-xl text-slate-950">EB2NIW</span>
        </div>
        <main id="main" className="min-w-0 flex-1">
          {preview ? (
            <p className="border-b border-sky-100 bg-sky-50 px-5 py-3 text-sm text-sky-950 sm:px-8">
              Supabase is not configured in this environment, so this is a preview of the workspace. On the live site this page requires an account.
            </p>
          ) : null}
          {loadError ? (
            <p role="status" className="border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm text-rose-950 sm:px-8">
              {loadError}
            </p>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
