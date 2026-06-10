import { VIEW_STORAGE_KEY } from '../constants/viewStorage'
import { getTodayDateString } from './dateUtils'
import { getWeekStartDate } from './weekUtils'

/**
 * loadViewStorage - 로컬 스토리지에서 주간 뷰 상태 불러오기
 *
 * 저장 형식: { selectedDate: string, weekStartDate: string }
 *
 * @returns {{ selectedDate: string, weekStartDate: string }}
 */
export function loadViewStorage() {
  const storedData = localStorage.getItem(VIEW_STORAGE_KEY)

  if (!storedData) {
    const today = getTodayDateString()
    return {
      selectedDate: today,
      weekStartDate: getWeekStartDate(today),
    }
  }

  return JSON.parse(storedData)
}

/**
 * saveViewStorage - 주간 뷰 상태를 로컬 스토리지에 저장
 *
 * @param {{ selectedDate: string, weekStartDate: string }} viewState
 */
export function saveViewStorage(viewState) {
  localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(viewState))
}
