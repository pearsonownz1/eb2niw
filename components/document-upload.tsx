"use client";

import { useActionState } from "react";
import { uploadDocument, type DocumentState } from "@/app/actions/documents";

const idle: DocumentState = { message: "", ok: false };

export function DocumentUpload() {
  const [state, action, pending] = useActionState(uploadDocument, idle);

  return (
    <form action={action} className="mt-6 rounded-2xl border border-dashed border-line bg-raised p-5">
      <label className="block text-sm font-semibold text-near" htmlFor="petition-file">
        Upload a file
        <input
          id="petition-file"
          name="file"
          type="file"
          required
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,application/pdf,image/png,image/jpeg"
          className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border file:border-line file:bg-paper file:px-4 file:py-2 file:text-sm file:font-semibold file:text-near"
        />
      </label>
      <p className="mt-3 text-sm text-muted">PDF, PNG, JPG, DOC, or DOCX. 10 MB maximum.</p>
      {state.message ? (
        <p role={state.ok ? "status" : "alert"} className={`mt-3 text-sm font-semibold ${state.ok ? "text-good" : "text-danger"}`}>
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-navy px-5 text-sm font-semibold text-paper disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Uploading" : "Upload"}
      </button>
    </form>
  );
}
