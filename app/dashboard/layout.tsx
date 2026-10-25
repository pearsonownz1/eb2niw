import type { ReactNode } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/actions/auth";
import { WorkspaceNav } from "@/components/workspace-nav";
import { getWorkspace } from "@/lib/workspace";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-sm text-muted">Loading workspace</p>}>
      <DashboardFrame>{children}</DashboardFrame>
    </Suspense>
  );
}

async function DashboardFrame({ children }: { children: ReactNode }) {
  const workspace = await getWorkspace();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-paper lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="border-b border-line bg-raised lg:min-h-screen lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <Link href="/" className="font-serif text-xl text-near">
            EB2NIW
          </Link>
          <form action={signOut}>
            <button type="submit" className="text-sm font-semibold text-near underline decoration-brass underline-offset-4">
              Log out
            </button>
          </form>
        </div>
        {workspace.email ? <p className="px-5 pb-3 text-xs text-muted">{workspace.email}</p> : null}
        <WorkspaceNav premium={workspace.premium} />
      </aside>
      <main id="main" className="min-w-0">
        {!workspace.configured ? (
          <p className="border-b border-line bg-brass-soft px-5 py-3 text-sm text-near sm:px-8">
            Supabase is not configured in this environment, so this is a preview of the workspace. On the live site this page requires an account.
          </p>
        ) : null}
        {workspace.loadError ? (
          <p role="status" className="border-b border-line bg-brass-soft px-5 py-3 text-sm text-near sm:px-8">
            {workspace.loadError}
          </p>
        ) : null}
        {children}
      </main>
    </div>
  );
}
