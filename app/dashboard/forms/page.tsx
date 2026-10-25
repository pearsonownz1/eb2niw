import { WorkspaceHeader } from "@/components/workspace-header";

const forms = ["Form I-140", "Supporting forms that travel with the I-140"] as const;

export default function FormsPage() {
  return (
    <>
      <WorkspaceHeader
        title="Forms"
        lede="Form-filling assistance for the I-140 and supporting forms will live here. It is not published yet, and this page does not file anything."
      />
      <ul className="grid gap-3 px-5 py-8 sm:px-8">
        {forms.map((form) => (
          <li key={form} className="rounded-2xl border border-line bg-raised px-5 py-4">
            <p className="font-semibold text-near">{form}</p>
            <p className="mt-1 text-sm text-muted">Not published yet</p>
          </li>
        ))}
      </ul>
    </>
  );
}
