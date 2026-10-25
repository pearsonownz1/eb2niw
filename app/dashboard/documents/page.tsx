import { DashboardHeader } from "@/components/dashboard-header";
import { DocumentUpload } from "@/components/document-upload";
import { EmptyState } from "@/components/empty-state";
import { workspaceIcons } from "@/components/workspace-icons";
import { getWorkspace } from "@/lib/workspace";

export default async function DocumentsPage() {
  const workspace = await getWorkspace();
  const count = workspace.documents.length;

  return (
    <>
      <DashboardHeader
        sectionId="documents"
        chip={count === 0 ? "No files" : `${count} uploaded`}
        lede="Upload exhibits for your own petition. Files stay in your account. Nothing here is sent to USCIS."
      />
      <div className="grid gap-8 px-5 py-8 sm:px-8">
        <DocumentUpload />
        <section>
          <h2 className="font-serif text-2xl text-slate-950">Your files</h2>
          {count === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={workspaceIcons.documents}
                accent="violet"
                title="No files uploaded yet"
                body="Add a PDF or image when you are ready. Uploads stay in this account and are not sent to USCIS."
              />
            </div>
          ) : (
            <ul className="mt-4 grid gap-2">
              {workspace.documents.map((document) => (
                <li
                  key={document.id}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 shadow-sm"
                >
                  {document.fileName}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
