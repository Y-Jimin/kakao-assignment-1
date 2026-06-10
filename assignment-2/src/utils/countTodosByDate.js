/**
 * countTodosByDate - Todo 배열을 날짜별 개수 맵으로 변환
 *
 * @param {Array} todos - 전체 Todo 배열
 * @returns {Record<string, number>} { 'YYYY-MM-DD': count } 형태의 맵
 */
export function countTodosByDate(todos) {
  return todos.reduce((countMap, todo) => {
    countMap[todo.date] = (countMap[todo.date] || 0) + 1
    return countMap
  }, {})
}
