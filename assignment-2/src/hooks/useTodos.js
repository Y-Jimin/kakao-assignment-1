import { useState } from 'react'

/**
 * useTodos - Todo 목록의 상태와 CRUD 로직을 관리하는 커스텀 훅
 *
 * state: todos(목록), inputValue(입력값), inputError(유효성 오류 메시지)
 * 이 훅이 데이터의 단일 출처(Single Source of Truth) 역할을 합니다.
 */
export function useTodos() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState('')

  /**
   * 새 Todo 추가 - 빈 값이면 예외 처리 후 생성하지 않음
   * @param {string} selectedDate - 현재 선택된 날짜 ('YYYY-MM-DD'), Todo에 자동 저장됨
   */
  const addTodo = (selectedDate) => {
    const trimmedText = inputValue.trim()

    if (!trimmedText) {
      setInputError('할 일을 입력해주세요.')
      return
    }

    const newTodo = {
      id: crypto.randomUUID(),
      text: trimmedText,
      isCompleted: false,
      date: selectedDate,
    }

    setTodos((prevTodos) => [...prevTodos, newTodo])
    setInputValue('')
    setInputError('')
  }

  /** Todo 삭제 */
  const deleteTodo = (todoId) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId))
  }

  /** Todo 완료 상태 토글 */
  const toggleTodoComplete = (todoId) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo,
      ),
    )
  }

  /** Todo 텍스트 수정 - 빈 값이면 수정하지 않고 false 반환 */
  const updateTodoText = (todoId, newText) => {
    const trimmedText = newText.trim()

    if (!trimmedText) {
      return false
    }

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, text: trimmedText } : todo,
      ),
    )
    return true
  }

  /** 입력값 변경 시 오류 메시지 초기화 */
  const handleInputChange = (value) => {
    setInputValue(value)
    if (inputError) {
      setInputError('')
    }
  }

  return {
    todos,
    inputValue,
    inputError,
    handleInputChange,
    addTodo,
    deleteTodo,
    toggleTodoComplete,
    updateTodoText,
  }
}
