"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/quizzes", label: "Quiz submissions", exact: false },
  { href: "/admin/leads", label: "Leads", exact: false },
  { href: "/admin/signups", label: "Signups", exact: false },
  { href: "/admin/purchases", label: "Purchases", exact: false },
  { href: "/admin/carts", label: "Abandoned carts", exact: false },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-6">
      {links.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 shrink-0 items-center rounded-xl px-3 text-sm font-semibold ${
              active ? "bg-brass-soft text-near" : "text-muted hover:bg-paper hover:text-near"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
