import { getTodayDateString } from '../utils/dateUtils'
import { getDayNumber, getWeekDates, formatWeekRange, WEEKDAY_LABELS } from '../utils/weekUtils'

/**
 * getDateCellStyle - 날짜 셀의 시각적 스타일 반환
 *
 * - 오늘만: 연한 보라 배경 + 보라 텍스트
 * - 선택만: 진한 보라 배경 + 흰 텍스트
 * - 오늘 + 선택: 그라데이션 배경 + 링 강조 (혼합 스타일)
 */
function getDateCellStyle(isToday, isSelected) {
  if (isToday && isSelected) {
    return 'bg-gradient-to-br from-[#672be0] to-[#8b5cf6] text-white ring-2 ring-[#672be0]/40 ring-offset-2 shadow-md'
  }
  if (isToday) {
    return 'bg-[#672be0]/10 text-[#672be0] ring-1 ring-[#672be0]/30'
  }
  if (isSelected) {
    return 'bg-[#672be0] text-white shadow-sm'
  }
  return 'text-gray-700 hover:bg-gray-100'
}

/**
 * TodoWeekCalendar - 주별 캘린더 UI
 *
 * props(부모로부터 받는 데이터·콜백):
 *   - weekStartDate: 현재 표시 중인 주의 시작일 (state는 부모 App이 useState로 관리)
 *   - selectedDate: 선택된 날짜
 *   - todoCountByDate: 날짜별 Todo 개수 맵
 *   - onSelectDate: 날짜 선택 콜백
 *   - onPreviousWeek: 이전 주 이동 콜백
 *   - onNextWeek: 다음 주 이동 콜백
 *
 * 이 컴포넌트는 자체 state 없이 props만으로 주간 캘린더를 렌더링합니다.
 */
function TodoWeekCalendar({
  weekStartDate,
  selectedDate,
  todoCountByDate,
  onSelectDate,
  onPreviousWeek,
  onNextWeek,
}) {
  const todayDate = getTodayDateString()
  const weekDates = getWeekDates(weekStartDate)

  return (
    <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
      {/* 주 이동 헤더 */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onPreviousWeek}
          aria-label="이전 주"
          className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-white hover:text-[#672be0]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span className="text-sm font-medium text-gray-800">
          {formatWeekRange(weekStartDate)}
        </span>

        <button
          type="button"
          onClick={onNextWeek}
          aria-label="다음 주"
          className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-white hover:text-[#672be0]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 요일 라벨 */}
      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center text-xs font-medium text-gray-400">
            {label}
          </div>
        ))}
      </div>

      {/* 날짜 셀 */}
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((dateString) => {
          const isToday = dateString === todayDate
          const isSelected = dateString === selectedDate
          const todoCount = todoCountByDate[dateString] || 0

          return (
            <button
              key={dateString}
              type="button"
              onClick={() => onSelectDate(dateString)}
              aria-label={`${dateString}, 할 일 ${todoCount}개`}
              aria-pressed={isSelected}
              className={`flex flex-col items-center rounded-lg px-1 py-2 transition-colors ${getDateCellStyle(isToday, isSelected)}`}
            >
              <span className={`text-sm font-semibold ${isToday && isSelected ? 'text-white' : ''}`}>
                {getDayNumber(dateString)}
              </span>
              <span
                className={`mt-0.5 text-[10px] leading-none ${
                  isSelected
                    ? isToday
                      ? 'text-white/80'
                      : 'text-white/70'
                    : isToday
                      ? 'text-[#672be0]/70'
                      : 'text-gray-400'
                }`}
              >
                {todoCount > 0 ? `${todoCount}개` : '·'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TodoWeekCalendar
