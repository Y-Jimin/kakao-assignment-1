/**
 * filterTodosByDate - 선택된 날짜에 해당하는 Todo만 반환
 *
 * @param {Array} todos - 전체 Todo 배열
 * @param {string} selectedDate - 'YYYY-MM-DD' 형식의 선택된 날짜
 * @returns {Array} 해당 날짜의 Todo 배열
 */
export function filterTodosByDate(todos, selectedDate) {
  return todos.filter((todo) => todo.date === selectedDate)
}
