import { getTodos } from "@/app/actions";
import TodoCreateForm from "./components/TodoCreateForm";
import TodoList from "./components/TodoList";

/**
 * Todo 목록 페이지 - Server Component
 * Server Action(getTodos)으로 Todo 목록을 가져오고, 표시용 컴포넌트와 Client 폼을 조합합니다.
 */
export default async function TodosPage() {
  const todos = await getTodos();
  const completedCount = todos.filter((todo) => todo.is_completed).length;

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 px-4 py-12 sm:py-20">
      <div className="w-full max-w-lg">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            My <span className="text-[#672be0]">Todo</span>
          </h1>
          {todos.length > 0 && (
            <p className="mt-2 text-sm text-gray-400">
              {completedCount} / {todos.length} 완료
            </p>
          )}
        </header>

        <main className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <TodoCreateForm />

          <div className="mt-6 border-t border-gray-100 pt-6">
            <TodoList todos={todos} />
          </div>
        </main>
      </div>
    </div>
  );
}
