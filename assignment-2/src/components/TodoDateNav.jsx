import { formatDisplayDate } from '../utils/dateUtils'

/**
 * TodoDateNav - 선택된 날짜 표시 및 이전/다음 날짜 이동 UI
 *
 * props(부모로부터 받는 데이터·콜백):
 *   - selectedDate: 현재 선택된 날짜 문자열 (state는 부모 App이 useState로 관리)
 *   - onPreviousDate: 이전 날짜로 이동 콜백
 *   - onNextDate: 다음 날짜로 이동 콜백
 *
 * 이 컴포넌트는 자체 state 없이 props만으로 날짜 네비게이션 UI를 렌더링합니다.
 */
function TodoDateNav({ selectedDate, onPreviousDate, onNextDate }) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
      <button
        type="button"
        onClick={onPreviousDate}
        aria-label="이전 날짜"
        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-white hover:text-[#672be0]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <time dateTime={selectedDate} className="text-sm font-medium text-gray-800">
        {formatDisplayDate(selectedDate)}
      </time>

      <button
        type="button"
        onClick={onNextDate}
        aria-label="다음 날짜"
        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-white hover:text-[#672be0]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default TodoDateNav
