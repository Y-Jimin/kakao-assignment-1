/**
 * getTodayDateString - 오늘 날짜를 'YYYY-MM-DD' 형식 문자열로 반환
 * Todo의 date 필드와 selectedDate state에 동일한 형식을 사용합니다.
 */
export function getTodayDateString() {
  return formatDateToString(new Date())
}

/**
 * formatDateToString - Date 객체를 'YYYY-MM-DD' 형식으로 변환
 */
export function formatDateToString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * parseDateString - 'YYYY-MM-DD' 문자열을 Date 객체로 변환 (로컬 시간 기준)
 */
export function parseDateString(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * shiftDateString - 날짜 문자열에 일(day) 단위로 이동
 * @param {string} dateString - 기준 날짜
 * @param {number} days - 이동할 일 수 (음수면 이전, 양수면 다음)
 */
export function shiftDateString(dateString, days) {
  const date = parseDateString(dateString)
  date.setDate(date.getDate() + days)
  return formatDateToString(date)
}

/**
 * formatDisplayDate - 화면에 표시할 날짜 라벨 반환
 * 오늘/어제/내일이면 접두어를 붙여 직관적으로 표시합니다.
 */
export function formatDisplayDate(dateString) {
  const today = getTodayDateString()
  const yesterday = shiftDateString(today, -1)
  const tomorrow = shiftDateString(today, 1)

  const date = parseDateString(dateString)
  const formatted = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  if (dateString === today) return `오늘 · ${formatted}`
  if (dateString === yesterday) return `어제 · ${formatted}`
  if (dateString === tomorrow) return `내일 · ${formatted}`
  return formatted
}
