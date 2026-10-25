"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type DocumentState = {
  message: string;
  ok: boolean;
};

const allowedTypes = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function uploadDocument(
  _previous: DocumentState,
  formData: FormData,
): Promise<DocumentState> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Choose a file to upload." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { ok: false, message: "Files must be 10 MB or smaller." };
  }

  const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : "";
  const allowedExtension = [".pdf", ".png", ".jpg", ".jpeg", ".doc", ".docx"].includes(extension);
  if ((file.type && !allowedTypes.has(file.type)) || !allowedExtension) {
    return { ok: false, message: "Upload a PDF, PNG, JPG, DOC, or DOCX file." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured, so the file could not be stored." };
  }

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) {
    return { ok: false, message: "Log in before uploading a file." };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from("petition-documents").upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (uploadError) {
    console.error("document upload failed", uploadError.message);
    return {
      ok: false,
      message: "The file could not be stored. Apply the Supabase migrations, then try again.",
    };
  }

  const { error: rowError } = await supabase.from("documents").insert({
    user_id: user.id,
    storage_path: path,
    file_name: safeName,
  });
  if (rowError) {
    console.error("document row failed", rowError.code ?? "unknown");
    await supabase.storage.from("petition-documents").remove([path]);
    return {
      ok: false,
      message: "The file could not be listed in your workspace. Apply the Supabase migrations, then try again.",
    };
  }

  revalidatePath("/dashboard/documents");
  revalidatePath("/dashboard");
  return { ok: true, message: "Uploaded." };
}
