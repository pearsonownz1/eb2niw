import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/actions/auth";
import { AdminNav } from "@/components/admin-nav";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-sm text-muted">Loading admin</p>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}

async function AdminShell({ children }: { children: ReactNode }) {
  const gate = await requireAdmin();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-paper lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="border-b border-line bg-raised lg:min-h-screen lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div>
            <Link href="/" className="font-serif text-xl text-near">
              EB2NIW
            </Link>
            <p className="mt-1 text-xs font-semibold tracking-[0.14em] text-brass">ADMIN</p>
          </div>
          {gate.demo ? null : (
            <form action={signOut}>
              <button type="submit" className="text-sm font-semibold text-near underline decoration-brass underline-offset-4">
                Log out
              </button>
            </form>
          )}
        </div>
        <AdminNav />
      </aside>
      <main id="main" className="min-w-0">
        {gate.demo ? (
          <p className="border-b border-line bg-brass-soft px-5 py-3 text-sm text-near sm:px-8">
            Demo data. These figures are sample rows for this preview, not live accounts. Supabase is not configured here.
          </p>
        ) : null}
        {children}
      </main>
    </div>
  );
}
