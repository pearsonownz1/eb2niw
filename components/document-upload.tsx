"use client";

import { useActionState } from "react";
import { uploadDocument, type DocumentState } from "@/app/actions/documents";

const idle: DocumentState = { message: "", ok: false };

export function DocumentUpload() {
  const [state, action, pending] = useActionState(uploadDocument, idle);

  return (
    <form action={action} className="rounded-3xl border border-dashed border-slate-300 bg-white p-5 shadow-sm">
      <label className="block text-sm font-semibold text-slate-950" htmlFor="petition-file">
        Upload a file
        <input
          id="petition-file"
          name="file"
          type="file"
          required
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,application/pdf,image/png,image/jpeg"
          className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-900"
        />
      </label>
      <p className="mt-3 text-sm text-slate-600">PDF, PNG, JPG, DOC, or DOCX. 10 MB maximum.</p>
      {state.message ? (
        <p role={state.ok ? "status" : "alert"} className={`mt-3 text-sm font-semibold ${state.ok ? "text-good" : "text-danger"}`}>
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-violet-700 px-5 text-sm font-semibold text-white transition hover:bg-violet-600 disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Uploading" : "Upload"}
      </button>
    </form>
  );
}
