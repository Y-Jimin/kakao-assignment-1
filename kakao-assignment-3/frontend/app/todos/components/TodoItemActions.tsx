"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteTodo, updateTodo } from "@/lib/client-api";
import type { Todo } from "@/lib/types";

/**
 * TodoItemActions - Client Component
 * 수정·완료·삭제 버튼 클릭 인터랙션을 처리합니다.
 */
export default function TodoItemActions({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleToggleComplete = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      await updateTodo(todo.id, {
        text: todo.text,
        is_completed: !todo.is_completed,
      });
      router.refresh();
    } catch {
      setErrorMessage("완료 상태 변경에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      await deleteTodo(todo.id);
      router.refresh();
    } catch {
      setErrorMessage("삭제에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <div className="flex gap-1">
        <Link
          href={`/todos/${todo.id}`}
          className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#672be0]"
        >
          수정
        </Link>
        <button
          type="button"
          onClick={handleToggleComplete}
          disabled={isLoading}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
            todo.is_completed
              ? "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              : "text-[#672be0] hover:bg-[#672be0]/10"
          }`}
        >
          {todo.is_completed ? "미완료" : "완료"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
        >
          삭제
        </button>
      </div>
      {errorMessage && (
        <p className="text-xs text-red-500" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
