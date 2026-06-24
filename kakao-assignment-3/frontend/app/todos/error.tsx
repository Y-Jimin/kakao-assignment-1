"use client";

/**
 * error.tsx - Client Component
 * Todo 페이지 에러 발생 시 보여주는 UI와 재시도 버튼을 처리합니다.
 */
export default function TodosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 px-4 py-12 sm:py-20">
      <div className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          문제가 발생했습니다
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {error.message || "Todo 데이터를 불러오지 못했습니다."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-[#672be0] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5a24c4]"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
