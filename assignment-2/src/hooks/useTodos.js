import { useEffect, useState } from 'react'
import { loadTodoStorage, saveTodoStorage } from '../utils/todoStorage'

/** 초기 데이터를 한 번만 불러오기 위한 캐시 (useState 초기화 시 중복 호출 방지) */
let cachedInitialData = null

function getInitialTodoData() {
  if (!cachedInitialData) {
    cachedInitialData = loadTodoStorage()
  }
  return cachedInitialData
}

/**
 * useTodos - Todo 목록의 상태와 CRUD 로직을 관리하는 커스텀 훅
 *
 * state: todos(목록), nextId(다음 ID), inputValue(입력값), inputError(유효성 오류 메시지)
 * todos·nextId 변경 시 useEffect로 로컬 스토리지에 자동 저장됩니다.
 */
export function useTodos() {
  const [todos, setTodos] = useState(() => getInitialTodoData().todos)
  const [nextId, setNextId] = useState(() => getInitialTodoData().nextId)
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState('')

  /**
   * Todo 또는 nextId가 변경될 때마다 로컬 스토리지에 자동 저장
   * JSON.stringify로 직렬화하여 저장합니다.
   */
  useEffect(() => {
    saveTodoStorage({ todos, nextId })
  }, [todos, nextId])

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
      id: nextId,
      text: trimmedText,
      isCompleted: false,
      date: selectedDate,
    }

    setTodos((prevTodos) => [...prevTodos, newTodo])
    setNextId((prevId) => prevId + 1)
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
