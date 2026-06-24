import type { Todo } from "@/lib/types";

/**
 * TodoItemDisplay - Server Component
 * Todo 텍스트와 완료 상태를 화면에 표시합니다.
 */
export default function TodoItemDisplay({ todo }: { todo: Todo }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          todo.is_completed ? "bg-gray-300" : "bg-[#672be0]"
        }`}
      />
      <span
        className={`truncate text-sm ${
          todo.is_completed ? "text-gray-400 line-through" : "text-gray-800"
        }`}
      >
        {todo.text}
      </span>
    </div>
  );
}
