import Link from "next/link";
import TodoCreateForm from "../components/TodoCreateForm";

/**
 * Todo 생성 페이지 - Server Component
 * 레이아웃을 제공하고, 폼 인터랙션은 Client Component에 위임합니다.
 */
export default function NewTodoPage() {
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
            새 <span className="text-[#672be0]">Todo</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            새로운 할 일을 추가해보세요.
          </p>
        </header>

        <main className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <TodoCreateForm redirectTo="/todos" />
        </main>
      </div>
    </div>
  );
}
