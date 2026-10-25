import { DocumentUpload } from "@/components/document-upload";
import { WorkspaceHeader } from "@/components/workspace-header";
import { getWorkspace } from "@/lib/workspace";

export default async function DocumentsPage() {
  const workspace = await getWorkspace();

  return (
    <>
      <WorkspaceHeader
        title="Documents"
        lede="Upload exhibits for your own petition. Files stay in your account. Nothing here is sent to USCIS."
      />
      <div className="px-5 py-8 sm:px-8">
        <DocumentUpload />
        <h2 className="mt-10 font-serif text-2xl text-near">Your files</h2>
        {workspace.documents.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No files uploaded yet.</p>
        ) : (
          <ul className="mt-4 grid gap-2">
            {workspace.documents.map((document) => (
              <li key={document.id} className="rounded-xl border border-line bg-raised px-4 py-3 text-sm text-near">
                {document.fileName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
