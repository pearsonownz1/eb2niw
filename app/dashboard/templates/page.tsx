import { WorkspaceHeader } from "@/components/workspace-header";

const items = [
  "Petition letter outline",
  "Exhibit list",
  "Recommendation letter request",
] as const;

export default function TemplatesPage() {
  return (
    <>
      <WorkspaceHeader
        title="Templates"
        lede="Petition templates will live here. None are published yet, so there is nothing to download."
      />
      <ul className="grid gap-3 px-5 py-8 sm:px-8">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-line bg-raised px-5 py-4">
            <p className="font-semibold text-near">{item}</p>
            <p className="mt-1 text-sm text-muted">Not published yet</p>
          </li>
        ))}
      </ul>
    </>
  );
}
