import { DashboardHeader } from "@/components/dashboard-header";
import { EmptyState } from "@/components/empty-state";
import { workspaceIcons } from "@/components/workspace-icons";
import { WorkspaceItems } from "@/components/workspace-items";

const items = [
  "How the three prongs are organized in the letter",
  "Collecting exhibits in the order the letter cites them",
  "Filling the I-140 and the supporting forms",
] as const;

export default function TutorialsPage() {
  return (
    <>
      <DashboardHeader
        sectionId="tutorials"
        chip="Not published"
        lede="Step-by-step video tutorials will live here. None are published yet."
      />
      <div className="grid gap-6 px-5 py-8 sm:px-8">
        <EmptyState
          icon={workspaceIcons.tutorials}
          accent="teal"
          title="No videos yet"
          body="Short walkthroughs for the letter, exhibits, and forms will appear here when they are published."
        />
        <WorkspaceItems items={items} note="Not published yet" accent="teal" />
      </div>
    </>
  );
}
