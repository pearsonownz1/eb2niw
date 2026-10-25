import { DashboardHeader } from "@/components/dashboard-header";
import { EmptyState } from "@/components/empty-state";
import { workspaceIcons } from "@/components/workspace-icons";
import { WorkspaceItems } from "@/components/workspace-items";

const forms = ["Form I-140", "Supporting forms that travel with the I-140"] as const;

export default function FormsPage() {
  return (
    <>
      <DashboardHeader
        sectionId="forms"
        chip="Not published"
        lede="Form-filling assistance for the I-140 and supporting forms will live here. It is not published yet, and this page does not file anything."
      />
      <div className="grid gap-6 px-5 py-8 sm:px-8">
        <EmptyState
          icon={workspaceIcons.forms}
          accent="orange"
          title="Forms are not open yet"
          body="This page will help with the I-140 and the forms that travel with it. It does not file anything with USCIS."
        />
        <WorkspaceItems items={forms} note="Not published yet" accent="orange" />
      </div>
    </>
  );
}
