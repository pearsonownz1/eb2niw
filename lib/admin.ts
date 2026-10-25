import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { demoSources } from "@/lib/admin-demo";
import {
  buildSnapshot,
  emptySnapshot,
  readAdminQuery,
  type AdminSnapshot,
  type DateRange,
  type RawClick,
  type RawPlan,
  type RawSignup,
  type RawSubmission,
} from "@/lib/admin-model";
import { createClient } from "@/lib/supabase/server";

type SupabaseClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;

export type AdminGate = { demo: true; supabase: null } | { demo: false; supabase: SupabaseClient };

export const requireAdmin = cache(async function requireAdmin(): Promise<AdminGate> {
  const supabase = await createClient();
  if (!supabase) {
    return { demo: true, supabase: null };
  }

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) {
    redirect("/login?next=/admin");
  }

  const { data: profile, error } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (error || profile?.is_admin !== true) {
    notFound();
  }

  return { demo: false, supabase };
});

export async function loadAdmin(range: DateRange): Promise<AdminSnapshot> {
  const gate = await requireAdmin();
  if (gate.demo) {
    return buildSnapshot({ ...demoSources(), range, notice: null });
  }
  return loadLive(gate.supabase, range);
}

export function adminRangeFromParams(params: {
  from?: string | string[];
  to?: string | string[];
  q?: string | string[];
}): DateRange {
  return readAdminQuery({
    from: first(params.from),
    to: first(params.to),
    q: first(params.q),
  });
}

async function loadLive(supabase: SupabaseClient, range: DateRange): Promise<AdminSnapshot> {
  const start = `${range.from}T00:00:00.000Z`;
  const end = `${range.to}T23:59:59.999Z`;
  const [submissions, clicks, signups, plans] = await Promise.all([
    supabase
      .from("fit_submissions")
      .select("id, created_at, email, news_optin, plan_suggestion, degree, years_experience, progressive_experience, exceptional_criteria, prong_merit, prong_positioned, prong_balance")
      .gte("created_at", start)
      .lte("created_at", end)
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase
      .from("consult_clicks")
      .select("id, submission_id, created_at")
      .gte("created_at", start)
      .lte("created_at", end)
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase
      .from("profiles")
      .select("id, email, created_at, is_admin")
      .gte("created_at", start)
      .lte("created_at", end)
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase
      .from("plan_selections")
      .select("id, user_id, plan, status, created_at")
      .gte("created_at", start)
      .lte("created_at", end)
      .order("created_at", { ascending: false })
      .limit(1000),
  ]);

  if (submissions.error || clicks.error || signups.error || plans.error) {
    console.error(
      "admin read failed",
      submissions.error?.code ?? "ok",
      clicks.error?.code ?? "ok",
      signups.error?.code ?? "ok",
      plans.error?.code ?? "ok",
    );
    return emptySnapshot(range, "Some admin data is not available yet. Apply the latest Supabase migrations, then refresh.");
  }

  const submissionRows = (submissions.data ?? []).flatMap(mapSubmission);
  const known = new Set(submissionRows.map((row) => row.id));
  const missingIds = [...new Set((clicks.data ?? []).map((row) => String(row.submission_id)).filter((id) => !known.has(id)))];
  if (missingIds.length > 0) {
    const extra = await supabase
      .from("fit_submissions")
      .select("id, created_at, email, news_optin, plan_suggestion, degree, years_experience, progressive_experience, exceptional_criteria, prong_merit, prong_positioned, prong_balance")
      .in("id", missingIds);
    if (!extra.error) {
      submissionRows.push(...extra.data.flatMap(mapSubmission));
    }
  }

  const emails = new Map<string, string>();
  for (const row of signups.data ?? []) {
    if (typeof row.id === "string") emails.set(row.id, typeof row.email === "string" ? row.email : "");
  }
  const planUserIds = [...new Set((plans.data ?? []).map((row) => String(row.user_id)).filter((id) => !emails.has(id)))];
  if (planUserIds.length > 0) {
    const profiles = await supabase.from("profiles").select("id, email").in("id", planUserIds);
    if (!profiles.error) {
      for (const row of profiles.data ?? []) {
        if (typeof row.id === "string") emails.set(row.id, typeof row.email === "string" ? row.email : "");
      }
    }
  }

  const capped = [submissions.data, clicks.data, signups.data, plans.data].some((rows) => (rows?.length ?? 0) >= 1000);

  return buildSnapshot({
    submissions: submissionRows,
    clicks: (clicks.data ?? []).flatMap((row) => {
      if (typeof row.id !== "string" || typeof row.submission_id !== "string" || typeof row.created_at !== "string") {
        return [];
      }
      const click: RawClick = { id: row.id, submissionId: row.submission_id, createdAt: row.created_at };
      return [click];
    }),
    signups: (signups.data ?? []).flatMap((row) => {
      if (typeof row.id !== "string" || typeof row.created_at !== "string") return [];
      const signup: RawSignup = {
        id: row.id,
        createdAt: row.created_at,
        email: typeof row.email === "string" ? row.email : "",
        isAdmin: row.is_admin === true,
      };
      return [signup];
    }),
    plans: (plans.data ?? []).flatMap((row) => {
      if (typeof row.id !== "string" || typeof row.user_id !== "string" || typeof row.created_at !== "string") return [];
      if (typeof row.plan !== "string" || typeof row.status !== "string") return [];
      const plan: RawPlan = {
        id: row.id,
        createdAt: row.created_at,
        email: emails.get(row.user_id) ?? "",
        plan: row.plan,
        status: row.status,
      };
      return [plan];
    }),
    range,
    notice: capped ? "Showing the latest 1,000 rows in this range." : null,
  });
}

function mapSubmission(row: {
  id: unknown;
  created_at: unknown;
  email: unknown;
  news_optin: unknown;
  plan_suggestion: unknown;
  degree: unknown;
  years_experience: unknown;
  progressive_experience: unknown;
  exceptional_criteria: unknown;
  prong_merit: unknown;
  prong_positioned: unknown;
  prong_balance: unknown;
}): RawSubmission[] {
  if (
    typeof row.id !== "string" ||
    typeof row.created_at !== "string" ||
    typeof row.plan_suggestion !== "string" ||
    typeof row.degree !== "string" ||
    typeof row.years_experience !== "string" ||
    typeof row.progressive_experience !== "string" ||
    typeof row.prong_merit !== "string" ||
    typeof row.prong_positioned !== "string" ||
    typeof row.prong_balance !== "string" ||
    typeof row.news_optin !== "boolean"
  ) {
    return [];
  }
  return [
    {
      id: row.id,
      createdAt: row.created_at,
      email: typeof row.email === "string" ? row.email : null,
      newsOptIn: row.news_optin,
      plan: row.plan_suggestion,
      degree: row.degree,
      years: row.years_experience,
      progressive: row.progressive_experience,
      criteria: Array.isArray(row.exceptional_criteria)
        ? row.exceptional_criteria.filter((item): item is string => typeof item === "string")
        : [],
      merit: row.prong_merit,
      positioned: row.prong_positioned,
      balance: row.prong_balance,
    },
  ];
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
