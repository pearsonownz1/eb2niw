import { cache } from "react";
import { redirect } from "next/navigation";
import { premiumUnlocked, readPlanId, type PlanId } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";

export type WorkspaceDocument = {
  id: string;
  fileName: string;
  createdAt: string;
};

export type Workspace = {
  configured: boolean;
  email: string | null;
  fullName: string | null;
  userId: string | null;
  plan: PlanId | null;
  planStatus: string | null;
  premium: boolean;
  documents: WorkspaceDocument[];
  loadError: string | null;
};

export const getWorkspace = cache(async function getWorkspace(): Promise<Workspace> {
  const supabase = await createClient();
  if (!supabase) {
    return {
      configured: false,
      email: null,
      fullName: null,
      userId: null,
      plan: null,
      planStatus: null,
      premium: false,
      documents: [],
      loadError: null,
    };
  }

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const [planResult, documentResult, profileResult] = await Promise.all([
    supabase
      .from("plan_selections")
      .select("plan, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("documents")
      .select("id, file_name, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
  ]);

  const loadError =
    planResult.error || documentResult.error
      ? "Some workspace data is not available yet. Apply the Supabase migrations, then refresh."
      : null;

  const latest = planResult.data?.[0];
  const plan = readPlanId(latest?.plan);

  return {
    configured: true,
    email: user.email ?? null,
    fullName: typeof profileResult.data?.full_name === "string" ? profileResult.data.full_name : null,
    userId: user.id,
    plan,
    planStatus: typeof latest?.status === "string" ? latest.status : null,
    premium: premiumUnlocked(plan),
    documents: (documentResult.data ?? []).flatMap((row) => {
      if (typeof row.id !== "string" || typeof row.file_name !== "string") {
        return [];
      }
      return [{ id: row.id, fileName: row.file_name, createdAt: String(row.created_at ?? "") }];
    }),
    loadError,
  };
});
