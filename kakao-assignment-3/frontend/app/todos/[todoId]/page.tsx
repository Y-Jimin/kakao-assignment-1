import Link from "next/link";
import { notFound } from "next/navigation";
import { getTodoById } from "@/lib/api";
import TodoEditForm from "../components/TodoEditForm";
import TodoItemDisplay from "../components/TodoItemDisplay";

interface EditTodoPageProps {
  params: Promise<{ todoId: string }>;
}

/**
 * Todo 수정 페이지 - Server Component
 * API에서 Todo 상세를 가져와 표시하고, 수정 폼은 Client Component에 위임합니다.
 */
export default async function EditTodoPage({ params }: EditTodoPageProps) {
  const { todoId } = await params;
  const parsedId = Number(todoId);

  if (Number.isNaN(parsedId)) {
    notFound();
  }

  const todo = await getTodoById(parsedId);

  if (!todo) {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 px-4 py-12 sm:py-20">
      <div className="w-full max-w-lg">
        <header className="mb-8">
          <Link
            href="/todos"
            className="text-sm text-gray-400 transition-colors hover:text-[#672be0]"
          >
            ← 목록으로
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            Todo <span className="text-[#672be0]">수정</span>
          </h1>
        </header>

        <main className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="mb-2 text-xs font-medium text-gray-400">현재 내용</p>
            <TodoItemDisplay todo={todo} />
          </div>

          <TodoEditForm todo={todo} />
        </main>
      </div>
    </div>
  );
}
