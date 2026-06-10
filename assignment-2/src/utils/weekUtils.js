import { formatDateToString, parseDateString, shiftDateString } from './dateUtils'

/** 요일 라벨 (일요일 시작) */
export const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

/**
 * getWeekStartDate - 주어진 날짜가 속한 주의 시작일(일요일) 반환
 */
export function getWeekStartDate(dateString) {
  const date = parseDateString(dateString)
  const dayOfWeek = date.getDay()
  date.setDate(date.getDate() - dayOfWeek)
  return formatDateToString(date)
}

/**
 * getWeekDates - 주 시작일 기준 7일간의 날짜 문자열 배열 반환
 */
export function getWeekDates(weekStartDate) {
  return Array.from({ length: 7 }, (_, index) => shiftDateString(weekStartDate, index))
}

/**
 * shiftWeekStartDate - 주 시작일을 주(week) 단위로 이동
 */
export function shiftWeekStartDate(weekStartDate, weeks) {
  return shiftDateString(weekStartDate, weeks * 7)
}

/**
 * formatWeekRange - 주간 캘린더 헤더에 표시할 날짜 범위 문자열 반환
 */
export function formatWeekRange(weekStartDate) {
  const weekEndDate = shiftDateString(weekStartDate, 6)
  const startDate = parseDateString(weekStartDate)
  const endDate = parseDateString(weekEndDate)

  const startMonth = startDate.getMonth() + 1
  const endMonth = endDate.getMonth() + 1
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()

  if (startMonth === endMonth) {
    return `${startMonth}월 ${startDay}일 - ${endDay}일`
  }

  return `${startMonth}월 ${startDay}일 - ${endMonth}월 ${endDay}일`
}

/**
 * getDayNumber - 날짜 문자열에서 일(day) 숫자만 반환
 */
export function getDayNumber(dateString) {
  return parseDateString(dateString).getDate()
}
