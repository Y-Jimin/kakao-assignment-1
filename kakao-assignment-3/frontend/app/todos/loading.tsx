/**
 * loading.tsx - Server Component
 * Todo 데이터 로딩 중 표시할 스켈레톤 UI입니다.
 */
export default function TodosLoading() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 px-4 py-12 sm:py-20">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto h-8 w-32 animate-pulse rounded-lg bg-gray-200" />
          <div className="mx-auto mt-2 h-4 w-24 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex gap-2">
            <div className="h-11 flex-1 animate-pulse rounded-lg bg-gray-100" />
            <div className="h-11 w-16 animate-pulse rounded-lg bg-[#672be0]/20" />
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-gray-100 px-4 py-3"
              >
                <div className="h-4 flex-1 animate-pulse rounded bg-gray-100" />
                <div className="h-6 w-24 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
