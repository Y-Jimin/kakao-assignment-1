"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { updateTodo } from "@/lib/client-api";
import type { Todo } from "@/lib/types";

/**
 * TodoEditForm - Client Component
 * Todo 수정 폼 제출·라우팅 인터랙션을 처리합니다.
 */
export default function TodoEditForm({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [text, setText] = useState(todo.text);
  const [isCompleted, setIsCompleted] = useState(todo.is_completed);
  const [inputError, setInputError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText) {
      setInputError("할 일을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setInputError("");

    try {
      await updateTodo(todo.id, {
        text: trimmedText,
        is_completed: isCompleted,
      });
      router.push("/todos");
      router.refresh();
    } catch {
      setInputError("Todo 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="todo-text"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          할 일
        </label>
        <input
          id="todo-text"
          type="text"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (inputError) setInputError("");
          }}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/20"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(event) => setIsCompleted(event.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-[#672be0] focus:ring-[#672be0]/20"
        />
        완료됨
      </label>

      {inputError && (
        <p className="text-sm text-red-500" role="alert">
          {inputError}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#672be0] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5a24c4] disabled:opacity-50"
        >
          저장
        </button>
        <button
          type="button"
          onClick={() => router.push("/todos")}
          className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          취소
        </button>
      </div>
    </form>
  );
}
