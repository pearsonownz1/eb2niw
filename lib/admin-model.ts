export type DateRange = {
  from: string;
  to: string;
  q: string;
};

export type TableColumn = {
  key: string;
  label: string;
};

export type TableRow = {
  id: string;
  [key: string]: string;
};

export type KpiCard = {
  label: string;
  value: string;
  note: string;
};

export type TrendPoint = {
  day: string;
  submissions: number;
  optIns: number;
  signups: number;
  purchases: number;
};

export type RawSubmission = {
  id: string;
  createdAt: string;
  email: string | null;
  newsOptIn: boolean;
  plan: string;
  degree: string;
  years: string;
  progressive: string;
  criteria: string[];
  merit: string;
  positioned: string;
  balance: string;
};

export type RawClick = {
  id: string;
  createdAt: string;
  submissionId: string;
};

export type RawSignup = {
  id: string;
  createdAt: string;
  email: string;
  isAdmin: boolean;
};

export type RawPlan = {
  id: string;
  createdAt: string;
  email: string;
  plan: string;
  status: string;
};

export type AdminSnapshot = {
  range: DateRange;
  notice: string | null;
  kpis: KpiCard[];
  rates: KpiCard[];
  trend: TrendPoint[];
  trendTruncated: boolean;
  quizzes: TableRow[];
  leads: TableRow[];
  signups: TableRow[];
  purchases: TableRow[];
  carts: TableRow[];
};

export const quizColumns: TableColumn[] = [
  { key: "when", label: "When" },
  { key: "email", label: "Email" },
  { key: "news", label: "News opt-in" },
  { key: "plan", label: "Suggested plan" },
  { key: "answers", label: "Answers" },
];

export const leadColumns: TableColumn[] = [
  { key: "when", label: "When" },
  { key: "kind", label: "Lead" },
  { key: "email", label: "Email" },
  { key: "plan", label: "Suggested plan" },
];

export const signupColumns: TableColumn[] = [
  { key: "when", label: "When" },
  { key: "email", label: "Email" },
  { key: "admin", label: "Admin" },
];

export const purchaseColumns: TableColumn[] = [
  { key: "when", label: "When" },
  { key: "email", label: "Email" },
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status" },
];

export const cartColumns: TableColumn[] = [
  { key: "when", label: "When" },
  { key: "email", label: "Email" },
  { key: "plan", label: "Plan" },
  { key: "waiting", label: "Pending for" },
];

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const HOUR_MS = 60 * 60 * 1000;

const degreeLabels: Record<string, string> = {
  bachelor: "Bachelor's",
  master: "Master's",
  phd: "Doctorate",
  other: "Other credential",
};

const yearLabels: Record<string, string> = {
  under_2: "Less than 2 years",
  two_to_four: "2-4 years",
  five_to_nine: "5-9 years",
  ten_plus: "10+ years",
};

const progressiveLabels: Record<string, string> = {
  yes: "5+ years grew in responsibility after a bachelor's",
  no: "Not that post-degree experience",
  not_applicable: "Degree already above a bachelor's",
};

const criteriaLabels: Record<string, string> = {
  academic_record: "Academic record",
  ten_year_letters: "10-year letters",
  license: "License",
  salary: "Distinctive pay",
  membership: "Association membership",
  recognition: "Recognition",
  none: "None of these",
};

const prongLabels: Record<string, string> = {
  yes: "Yes",
  partly: "Partly",
  not_yet: "Not yet",
};

export function defaultRange(now = new Date()): { from: string; to: string } {
  const to = now.toISOString().slice(0, 10);
  const fromDate = new Date(`${to}T00:00:00.000Z`);
  fromDate.setUTCDate(fromDate.getUTCDate() - 13);
  return { from: fromDate.toISOString().slice(0, 10), to };
}

export function readAdminQuery(input: { from?: string; to?: string; q?: string }, now = new Date()): DateRange {
  const fallback = defaultRange(now);
  const from = isDay(input.from) ? input.from : fallback.from;
  const to = isDay(input.to) ? input.to : fallback.to;
  const q = (input.q ?? "").replace(/[\u0000-\u001f]/g, "").trim().slice(0, 80);
  if (from <= to) {
    return { from, to, q };
  }
  return { from: to, to: from, q };
}

export function visibleRows(rows: TableRow[], q: string, columns: readonly TableColumn[]): TableRow[] {
  const needle = q.trim().toLowerCase();
  if (!needle) {
    return rows;
  }
  return rows.filter((row) => columns.some((column) => (row[column.key] ?? "").toLowerCase().includes(needle)));
}

export function toCsv(columns: readonly TableColumn[], rows: readonly TableRow[]): string {
  const header = columns.map((column) => csvCell(column.label)).join(",");
  const body = rows.map((row) => columns.map((column) => csvCell(row[column.key] ?? "")).join(","));
  return `\uFEFF${[header, ...body].join("\r\n")}\r\n`;
}

export function buildSnapshot(input: {
  submissions: RawSubmission[];
  clicks: RawClick[];
  signups: RawSignup[];
  plans: RawPlan[];
  range: DateRange;
  notice: string | null;
  now?: Date;
}): AdminSnapshot {
  const now = input.now ?? new Date();
  const submissions = input.submissions.filter((row) => inRange(row.createdAt, input.range));
  const clicks = input.clicks.filter((row) => inRange(row.createdAt, input.range));
  const signups = input.signups.filter((row) => inRange(row.createdAt, input.range));
  const plans = input.plans.filter((row) => inRange(row.createdAt, input.range));
  const bySubmission = new Map(input.submissions.map((row) => [row.id, row]));
  const abandonedCutoff = now.getTime() - HOUR_MS;

  const optIns = submissions.filter((row) => row.newsOptIn);
  const purchases = plans.filter((row) => row.status === "active");
  const carts = plans.filter(
    (row) => row.status === "pending_payment" && new Date(row.createdAt).getTime() <= abandonedCutoff,
  );

  const quizzes = submissions
    .map((row) => ({ at: new Date(row.createdAt).getTime(), row: quizRow(row) }))
    .sort((a, b) => b.at - a.at)
    .map((item) => item.row);

  const leads = [
    ...optIns.map((row) => ({
      at: new Date(row.createdAt).getTime(),
      row: {
        id: `opt-${row.id}`,
        when: formatStamp(row.createdAt),
        kind: "News opt-in",
        email: row.email ?? "—",
        plan: planLabel(row.plan),
      },
    })),
    ...clicks.map((click) => {
      const parent = bySubmission.get(click.submissionId);
      return {
        at: new Date(click.createdAt).getTime(),
        row: {
          id: `book-${click.id}`,
          when: formatStamp(click.createdAt),
          kind: "Book now",
          email: parent?.email ?? "—",
          plan: parent ? planLabel(parent.plan) : "—",
        },
      };
    }),
  ]
    .sort((a, b) => b.at - a.at)
    .map((item) => item.row);

  const signupRows = signups
    .map((row) => ({ at: new Date(row.createdAt).getTime(), row: signupRow(row) }))
    .sort((a, b) => b.at - a.at)
    .map((item) => item.row);

  const purchaseRows = purchases
    .map((row) => ({ at: new Date(row.createdAt).getTime(), row: planRow(row, "Active") }))
    .sort((a, b) => b.at - a.at)
    .map((item) => item.row);

  const cartRows = carts
    .map((row) => ({
      at: new Date(row.createdAt).getTime(),
      row: {
        ...planRow(row, "Pending payment"),
        waiting: waitingLabel(row.createdAt, now),
      },
    }))
    .sort((a, b) => b.at - a.at)
    .map((item) => item.row);

  const { days, truncated } = chartDays(input.range.from, input.range.to);
  const trend = days.map((day) => ({
    day,
    submissions: submissions.filter((row) => row.createdAt.slice(0, 10) === day).length,
    optIns: optIns.filter((row) => row.createdAt.slice(0, 10) === day).length,
    signups: signups.filter((row) => row.createdAt.slice(0, 10) === day).length,
    purchases: purchases.filter((row) => row.createdAt.slice(0, 10) === day).length,
  }));

  return {
    range: input.range,
    notice: input.notice,
    kpis: [
      { label: "Quiz submissions", value: String(submissions.length), note: "Completed fit checks" },
      { label: "News opt-ins", value: String(optIns.length), note: "Emails that asked for news" },
      { label: "Book now clicks", value: String(clicks.length), note: "Consultation interest" },
      { label: "Signups", value: String(signups.length), note: "Accounts created" },
      { label: "Purchases", value: String(purchases.length), note: "Plans marked active" },
      { label: "Abandoned carts", value: String(carts.length), note: "Pending payment for more than an hour" },
    ],
    rates: [
      {
        label: "Opt-in rate",
        value: rate(optIns.length, submissions.length),
        note: "News opt-ins ÷ quiz submissions",
      },
      {
        label: "Book now rate",
        value: rate(clicks.length, submissions.length),
        note: "Book now clicks ÷ quiz submissions",
      },
      {
        label: "Purchase rate",
        value: rate(purchases.length, signups.length),
        note: "Purchases ÷ signups",
      },
      {
        label: "Unpaid checkouts",
        value: rate(carts.length, carts.length + purchases.length),
        note: "Abandoned carts ÷ abandoned carts and purchases",
      },
    ],
    trend,
    trendTruncated: truncated,
    quizzes,
    leads,
    signups: signupRows,
    purchases: purchaseRows,
    carts: cartRows,
  };
}

export function emptySnapshot(range: DateRange, notice: string): AdminSnapshot {
  return buildSnapshot({
    submissions: [],
    clicks: [],
    signups: [],
    plans: [],
    range,
    notice,
  });
}

function quizRow(row: RawSubmission): TableRow {
  return {
    id: row.id,
    when: formatStamp(row.createdAt),
    email: row.email ?? "—",
    news: row.newsOptIn ? "Yes" : "No",
    plan: planLabel(row.plan),
    answers: answerSummary(row),
  };
}

function signupRow(row: RawSignup): TableRow {
  return {
    id: row.id,
    when: formatStamp(row.createdAt),
    email: row.email || "—",
    admin: row.isAdmin ? "Yes" : "No",
  };
}

function planRow(row: RawPlan, status: string): TableRow {
  return {
    id: row.id,
    when: formatStamp(row.createdAt),
    email: row.email || "—",
    plan: productPlanLabel(row.plan),
    status,
  };
}

function answerSummary(row: RawSubmission): string {
  const background = row.criteria.map((item) => criteriaLabels[item] ?? item).join(", ");
  return [
    `Degree: ${degreeLabels[row.degree] ?? row.degree}`,
    `Experience: ${yearLabels[row.years] ?? row.years}`,
    `After a bachelor's: ${progressiveLabels[row.progressive] ?? row.progressive}`,
    `Background: ${background || "—"}`,
    `Endeavor: ${prongLabels[row.merit] ?? row.merit}`,
    `Prepared: ${prongLabels[row.positioned] ?? row.positioned}`,
    `Without a sponsor: ${prongLabels[row.balance] ?? row.balance}`,
  ].join("\n");
}

function planLabel(value: string): string {
  if (value === "diy") return "DIY";
  if (value === "attorney_review") return "DIY + Attorney Review";
  if (value === "stretch") return "Attorney first";
  return value;
}

function productPlanLabel(value: string): string {
  if (value === "diy") return "DIY";
  if (value === "attorney_review") return "DIY + Attorney Review";
  return value;
}

function formatStamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date)} UTC`;
}

function waitingLabel(iso: string, now: Date): string {
  const hours = Math.max(1, Math.floor((now.getTime() - new Date(iso).getTime()) / HOUR_MS));
  if (hours < 48) {
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day" : `${days} days`;
}

function rate(part: number, whole: number): string {
  if (whole <= 0) return "—";
  return `${Math.round((part / whole) * 1000) / 10}%`;
}

function inRange(iso: string, range: DateRange): boolean {
  const day = iso.slice(0, 10);
  return day >= range.from && day <= range.to;
}

function isDay(value: string | undefined): value is string {
  if (!value || !DAY_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function chartDays(from: string, to: string): { days: string[]; truncated: boolean } {
  const start = new Date(`${from}T00:00:00.000Z`);
  const end = new Date(`${to}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return { days: [], truncated: false };
  }
  const all: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end && all.length < 400) {
    all.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  if (all.length > 45) {
    return { days: all.slice(-45), truncated: true };
  }
  return { days: all, truncated: false };
}

function csvCell(value: string): string {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  if (/[",\r\n]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}
