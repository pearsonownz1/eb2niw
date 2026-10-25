import type { RawClick, RawPlan, RawSignup, RawSubmission } from "@/lib/admin-model";

/**
 * Sample rows for the local preview when Supabase is not configured.
 * Every address is on example.com. These are not accounts or customers.
 */
export function demoSources(now = new Date()): {
  submissions: RawSubmission[];
  clicks: RawClick[];
  signups: RawSignup[];
  plans: RawPlan[];
} {
  const submissions: RawSubmission[] = [
    submission(now, "01", 1, 15, "demo.ada@example.com", true, "diy", "master", "five_to_nine", "not_applicable", ["academic_record", "license", "membership"], "yes", "yes", "yes"),
    submission(now, "02", 2, 11, "demo.ben@example.com", true, "diy", "phd", "ten_plus", "not_applicable", ["academic_record", "recognition", "membership"], "yes", "yes", "yes"),
    submission(now, "03", 2, 18, null, false, "diy", "bachelor", "five_to_nine", "yes", ["academic_record", "ten_year_letters", "salary"], "yes", "yes", "yes"),
    submission(now, "04", 3, 16, "demo.chao@example.com", true, "attorney_review", "master", "two_to_four", "not_applicable", ["academic_record", "license", "membership"], "partly", "yes", "yes"),
    submission(now, "05", 4, 13, null, false, "stretch", "other", "under_2", "no", ["none"], "not_yet", "not_yet", "not_yet"),
    submission(now, "06", 5, 17, "demo.dina@example.com", true, "attorney_review", "bachelor", "under_2", "no", ["license", "membership", "recognition"], "yes", "partly", "not_yet"),
    submission(now, "07", 6, 12, "demo.eli@example.com", true, "attorney_review", "phd", "ten_plus", "not_applicable", ["academic_record", "recognition", "membership", "salary"], "yes", "partly", "yes"),
    submission(now, "08", 7, 19, null, false, "diy", "master", "five_to_nine", "not_applicable", ["academic_record", "license", "recognition"], "yes", "yes", "yes"),
    submission(now, "09", 8, 10, "demo.faye@example.com", true, "stretch", "other", "two_to_four", "no", ["academic_record", "membership"], "not_yet", "partly", "not_yet"),
    submission(now, "10", 9, 14, "demo.gus@example.com", true, "diy", "bachelor", "ten_plus", "yes", ["ten_year_letters", "license", "salary", "recognition"], "yes", "yes", "yes"),
    submission(now, "11", 11, 16, null, false, "attorney_review", "master", "five_to_nine", "not_applicable", ["academic_record", "membership", "recognition"], "yes", "yes", "not_yet"),
    submission(now, "12", 12, 15, "demo.hana@example.com", true, "diy", "phd", "ten_plus", "not_applicable", ["academic_record", "license", "membership"], "yes", "yes", "yes"),
  ];

  const clickTargets = ["01", "04", "07", "08", "12"];
  const clicks: RawClick[] = clickTargets.map((suffix, index) => ({
    id: `demo-click-${suffix}`,
    submissionId: `demo-submission-${suffix}`,
    createdAt: stamp(now, index + 1, 20),
  }));

  const signups: RawSignup[] = [
    signup(now, "ada", 1, 16, false),
    signup(now, "ben", 2, 12, false),
    signup(now, "chao", 3, 17, false),
    signup(now, "ira", 6, 9, false),
    signup(now, "june", 1, 8, false),
    signup(now, "owner", 0, 18, true),
    signup(now, "leo", 8, 11, false),
    signup(now, "mina", 0, now.getUTCHours(), false),
  ];

  const plans: RawPlan[] = [
    plan(now, "ada", 2, 15, "diy", "active"),
    plan(now, "ben", 4, 13, "attorney_review", "active"),
    plan(now, "ira", 6, 10, "diy", "active"),
    plan(now, "chao", 3, 18, "attorney_review", "pending_payment"),
    plan(now, "june", 1, 9, "diy", "pending_payment"),
    plan(now, "leo", 8, 12, "attorney_review", "pending_payment"),
    {
      id: "demo-plan-kai",
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      email: "demo.kai@example.com",
      plan: "diy",
      status: "pending_payment",
    },
    {
      id: "demo-plan-mina",
      createdAt: new Date(now.getTime() - 20 * 60 * 1000).toISOString(),
      email: "demo.mina@example.com",
      plan: "diy",
      status: "pending_payment",
    },
  ];

  return { submissions, clicks, signups, plans };
}

function submission(
  now: Date,
  suffix: string,
  daysAgo: number,
  hour: number,
  email: string | null,
  newsOptIn: boolean,
  plan: string,
  degree: string,
  years: string,
  progressive: string,
  criteria: string[],
  merit: string,
  positioned: string,
  balance: string,
): RawSubmission {
  return {
    id: `demo-submission-${suffix}`,
    createdAt: stamp(now, daysAgo, hour),
    email,
    newsOptIn,
    plan,
    degree,
    years,
    progressive,
    criteria,
    merit,
    positioned,
    balance,
  };
}

function signup(now: Date, name: string, daysAgo: number, hour: number, isAdmin: boolean): RawSignup {
  return {
    id: `demo-signup-${name}`,
    createdAt: stamp(now, daysAgo, hour),
    email: `demo.${name}@example.com`,
    isAdmin,
  };
}

function plan(now: Date, name: string, daysAgo: number, hour: number, product: string, status: string): RawPlan {
  return {
    id: `demo-plan-${name}`,
    createdAt: stamp(now, daysAgo, hour),
    email: `demo.${name}@example.com`,
    plan: product,
    status,
  };
}

function stamp(now: Date, daysAgo: number, hour: number): string {
  const date = new Date(now);
  date.setUTCHours(hour, 5, 0, 0);
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString();
}
