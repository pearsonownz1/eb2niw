import type { ReactNode } from "react";
import { Suspense } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { getWorkspace } from "@/lib/workspace";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="bg-[#f5f7fb] px-5 py-16 text-sm text-slate-600">Loading workspace</p>}>
      <DashboardFrame>{children}</DashboardFrame>
    </Suspense>
  );
}

async function DashboardFrame({ children }: { children: ReactNode }) {
  const workspace = await getWorkspace();

  return (
    <WorkspaceShell
      email={workspace.email}
      premium={workspace.premium}
      preview={!workspace.configured}
      loadError={workspace.loadError}
    >
      {children}
    </WorkspaceShell>
  );
}
