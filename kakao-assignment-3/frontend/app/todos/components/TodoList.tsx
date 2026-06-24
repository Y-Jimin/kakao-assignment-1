import type { Todo } from "@/lib/types";
import TodoItemActions from "./TodoItemActions";
import TodoItemDisplay from "./TodoItemDisplay";

/**
 * TodoList - Server Component
 * API에서 받은 Todo 목록을 화면에 표시합니다.
 */
export default function TodoList({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#672be0]/10">
          <svg
            className="h-6 w-6 text-[#672be0]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-400">아직 할 일이 없습니다</p>
        <p className="mt-1 text-xs text-gray-300">
          위 입력창에서 새로운 할 일을 추가해보세요
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 transition-shadow hover:shadow-sm"
        >
          <TodoItemDisplay todo={todo} />
          <TodoItemActions todo={todo} />
        </li>
      ))}
    </ul>
  );
}
