import { TODO_FILTERS } from '../constants/todoFilters'

/**
 * filterTodos - 선택된 필터에 맞는 Todo 목록만 반환
 *
 * @param {Array} todos - 전체 Todo 배열
 * @param {string} activeFilter - 현재 선택된 필터 값
 * @returns {Array} 필터링된 Todo 배열
 */
export function filterTodos(todos, activeFilter) {
  switch (activeFilter) {
    case TODO_FILTERS.ACTIVE:
      return todos.filter((todo) => !todo.isCompleted)
    case TODO_FILTERS.COMPLETED:
      return todos.filter((todo) => todo.isCompleted)
    case TODO_FILTERS.ALL:
    default:
      return todos
  }
}
