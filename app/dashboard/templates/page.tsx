import { DashboardHeader } from "@/components/dashboard-header";
import { EmptyState } from "@/components/empty-state";
import { workspaceIcons } from "@/components/workspace-icons";
import { WorkspaceItems } from "@/components/workspace-items";

const items = [
  "Petition letter outline",
  "Exhibit list",
  "Recommendation letter request",
] as const;

export default function TemplatesPage() {
  return (
    <>
      <DashboardHeader
        sectionId="templates"
        chip="Not published"
        lede="Petition templates will live here. None are published yet, so there is nothing to download."
      />
      <div className="grid gap-6 px-5 py-8 sm:px-8">
        <EmptyState
          icon={workspaceIcons.templates}
          accent="indigo"
          title="Nothing to download yet"
          body="Letter outlines, exhibit lists, and recommendation requests will show up here when they are published."
        />
        <WorkspaceItems items={items} note="Not published yet" accent="indigo" />
      </div>
    </>
  );
}
