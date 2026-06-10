import { TODO_STORAGE_KEY } from '../constants/todoStorage'

/**
 * loadTodoStorage - 로컬 스토리지에서 Todo 데이터 불러오기
 *
 * 저장 형식: { todos: Array, nextId: number }
 * - todos: { id, text, isCompleted, date } 객체 배열
 * - nextId: 다음 Todo 생성 시 사용할 ID
 *
 * @returns {{ todos: Array, nextId: number }}
 */
export function loadTodoStorage() {
  const storedData = localStorage.getItem(TODO_STORAGE_KEY)

  if (!storedData) {
    return { todos: [], nextId: 1 }
  }

  return JSON.parse(storedData)
}

/**
 * saveTodoStorage - Todo 데이터를 로컬 스토리지에 저장
 *
 * @param {{ todos: Array, nextId: number }} data - 저장할 Todo 데이터
 */
export function saveTodoStorage(data) {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(data))
}
