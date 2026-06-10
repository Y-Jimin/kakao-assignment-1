import { useState } from 'react'
import TodoDateNav from './components/TodoDateNav'
import TodoForm from './components/TodoForm'
import TodoFilter from './components/TodoFilter'
import TodoList from './components/TodoList'
import { TODO_FILTERS } from './constants/todoFilters'
import { useTodos } from './hooks/useTodos'
import { getTodayDateString, shiftDateString } from './utils/dateUtils'
import { filterTodos } from './utils/filterTodos'
import { filterTodosByDate } from './utils/filterTodosByDate'

/**
 * App - Todo 앱의 최상위 컴포넌트
 *
 * Todo 데이터 state는 useTodos 훅이 관리하고,
 * 필터·날짜 state는 이 컴포넌트에서 useState로 관리합니다.
 * addTodo 시 현재 selectedDate가 Todo에 저장되며, 필터·날짜 선택은 유지됩니다.
 */
function App() {
  const {
    todos,
    inputValue,
    inputError,
    handleInputChange,
    addTodo,
    deleteTodo,
    toggleTodoComplete,
    updateTodoText,
  } = useTodos()

  // 필터 탭 상태 - Todo 추가/수정/삭제와 독립적으로 유지됨
  const [activeFilter, setActiveFilter] = useState(TODO_FILTERS.ALL)

  // 선택된 날짜 상태 - 일간 뷰의 기준 날짜 (초기값: 오늘)
  const [selectedDate, setSelectedDate] = useState(getTodayDateString)

  const dateFilteredTodos = filterTodosByDate(todos, selectedDate)
  const filteredTodos = filterTodos(dateFilteredTodos, activeFilter)
  const completedCount = dateFilteredTodos.filter((todo) => todo.isCompleted).length

  const handlePreviousDate = () => {
    setSelectedDate((prevDate) => shiftDateString(prevDate, -1))
  }

  const handleNextDate = () => {
    setSelectedDate((prevDate) => shiftDateString(prevDate, 1))
  }

  const handleAddTodo = () => {
    addTodo(selectedDate)
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 px-4 py-12 sm:py-20">
      <div className="w-full max-w-lg">
        {/* 헤더 */}
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            My <span className="text-[#672be0]">Todo</span>
          </h1>
          {dateFilteredTodos.length > 0 && (
            <p className="mt-2 text-sm text-gray-400">
              {completedCount} / {dateFilteredTodos.length} 완료
            </p>
          )}
        </header>

        {/* 메인 카드 */}
        <main className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <TodoDateNav
            selectedDate={selectedDate}
            onPreviousDate={handlePreviousDate}
            onNextDate={handleNextDate}
          />

          <TodoForm
            inputValue={inputValue}
            inputError={inputError}
            onInputChange={handleInputChange}
            onAddTodo={handleAddTodo}
          />

          {dateFilteredTodos.length > 0 && (
            <div className="mt-6">
              <TodoFilter
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>
          )}

          <div className={`${dateFilteredTodos.length > 0 ? 'mt-4' : 'mt-6'} border-t border-gray-100 pt-6`}>
            <TodoList
              todos={filteredTodos}
              activeFilter={activeFilter}
              hasTodosOnDate={dateFilteredTodos.length > 0}
              onToggleComplete={toggleTodoComplete}
              onUpdateText={updateTodoText}
              onDelete={deleteTodo}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
