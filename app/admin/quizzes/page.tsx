import { Suspense } from "react";
import { AdminTablePage } from "@/components/admin-table-page";
import { quizColumns } from "@/lib/admin-model";

export const metadata = { title: "Quiz submissions" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function QuizSubmissionsPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-sm text-muted">Loading quiz submissions</p>}>
      <AdminTablePage
        searchParams={searchParams}
        title="Quiz submissions"
        lede="Answers from the fit check, and the plan those answers suggest."
        path="/admin/quizzes"
        table="quizzes"
        columns={quizColumns}
        pick={(snapshot) => snapshot.quizzes}
      />
    </Suspense>
  );
}
