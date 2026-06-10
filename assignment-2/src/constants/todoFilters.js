/** Todo 필터 탭에서 사용하는 필터 값 상수 */
export const TODO_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
}

/** 필터 탭 UI에 표시할 라벨 목록 */
export const TODO_FILTER_TABS = [
  { value: TODO_FILTERS.ALL, label: '전체' },
  { value: TODO_FILTERS.ACTIVE, label: '진행 중' },
  { value: TODO_FILTERS.COMPLETED, label: '완료' },
]
