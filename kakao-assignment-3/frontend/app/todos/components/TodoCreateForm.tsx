"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createTodo } from "@/lib/client-api";

/**
 * TodoCreateForm - Client Component
 * 텍스트 입력·추가 버튼·폼 제출 인터랙션을 처리합니다.
 */
export default function TodoCreateForm() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedText = inputValue.trim();
    if (!trimmedText) {
      setInputError("할 일을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setInputError("");

    try {
      await createTodo({ text: trimmedText });
      setInputValue("");
      router.refresh();
    } catch {
      setInputError("Todo 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
            if (inputError) setInputError("");
          }}
          placeholder="할 일을 입력하세요"
          className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-colors focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/20"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#672be0] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5a24c4] active:bg-[#4d1fa8] disabled:opacity-50"
        >
          추가
        </button>
      </div>
      {inputError && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {inputError}
        </p>
      )}
    </form>
  );
}
