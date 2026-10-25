import { WorkspaceHeader } from "@/components/workspace-header";

export default function CommunityPage() {
  return (
    <>
      <WorkspaceHeader
        title="Community"
        lede="A place to talk with other people preparing an NIW petition. The community is not open yet, so there are no posts."
      />
      <div className="px-5 py-8 sm:px-8">
        <div className="rounded-2xl border border-line bg-raised p-6">
          <p className="font-semibold text-near">Not open yet</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            When it opens, this page will show discussions. Do not put case facts in a public thread.
          </p>
        </div>
      </div>
    </>
  );
}
