import { DashboardHeader } from "@/components/dashboard-header";
import { EmptyState } from "@/components/empty-state";
import { workspaceIcons } from "@/components/workspace-icons";

export default function CommunityPage() {
  return (
    <>
      <DashboardHeader
        sectionId="community"
        chip="Not open"
        lede="A place to talk with other people preparing an NIW petition. The community is not open yet, so there are no posts."
      />
      <div className="px-5 py-8 sm:px-8">
        <EmptyState
          icon={workspaceIcons.community}
          accent="rose"
          title="Not open yet"
          body="When it opens, this page will show discussions. Do not put case facts in a public thread."
        />
      </div>
    </>
  );
}
