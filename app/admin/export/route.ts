import { adminRangeFromParams, loadAdmin } from "@/lib/admin";
import {
  cartColumns,
  leadColumns,
  purchaseColumns,
  quizColumns,
  signupColumns,
  toCsv,
  visibleRows,
  type TableRow,
} from "@/lib/admin-model";

const tables = {
  quizzes: { filename: "quiz-submissions.csv", columns: quizColumns },
  leads: { filename: "leads.csv", columns: leadColumns },
  signups: { filename: "signups.csv", columns: signupColumns },
  purchases: { filename: "purchases.csv", columns: purchaseColumns },
  carts: { filename: "abandoned-carts.csv", columns: cartColumns },
} as const;

type TableName = keyof typeof tables;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const name = url.searchParams.get("table");
  if (!name || !isTableName(name)) {
    return new Response("Unknown table", { status: 404 });
  }

  const range = adminRangeFromParams({
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
    q: url.searchParams.get("q") ?? undefined,
  });
  const snapshot = await loadAdmin(range);
  const spec = tables[name];
  const rows = visibleRows(rowsFor(name, snapshot), range.q, spec.columns);
  const body = toCsv(spec.columns, rows);

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${spec.filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

function isTableName(value: string): value is TableName {
  return value in tables;
}

function rowsFor(name: TableName, snapshot: Awaited<ReturnType<typeof loadAdmin>>): TableRow[] {
  if (name === "quizzes") return [...snapshot.quizzes];
  if (name === "leads") return [...snapshot.leads];
  if (name === "signups") return [...snapshot.signups];
  if (name === "purchases") return [...snapshot.purchases];
  return [...snapshot.carts];
}
