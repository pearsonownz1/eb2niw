"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/eligibility", label: "Eligibility", exact: false },
  { href: "/dashboard/templates", label: "Templates", exact: false },
  { href: "/dashboard/tutorials", label: "Tutorials", exact: false },
  { href: "/dashboard/documents", label: "Documents", exact: false },
  { href: "/dashboard/forms", label: "Forms", exact: false },
  { href: "/dashboard/community", label: "Community", exact: false },
  { href: "/dashboard/attorney", label: "Attorney Review", exact: false, premium: true },
] as const;

export function WorkspaceNav({ premium }: { premium: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Workspace" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-6">
      {links.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const locked = "premium" in item && item.premium && !premium;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 shrink-0 items-center justify-between gap-3 rounded-xl px-3 text-sm font-semibold ${
              active ? "bg-brass-soft text-near" : "text-muted hover:bg-paper hover:text-near"
            }`}
          >
            <span>{item.label}</span>
            {locked ? <span className="text-xs font-semibold tracking-wide text-brass">Locked</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
