import { useEffect, useMemo, useState } from 'react'
import TodoWeekCalendar from './components/TodoWeekCalendar'
import TodoForm from './components/TodoForm'
import TodoFilter from './components/TodoFilter'
import TodoList from './components/TodoList'
import { TODO_FILTERS } from './constants/todoFilters'
import { useTodos } from './hooks/useTodos'
import { countTodosByDate } from './utils/countTodosByDate'
import { loadViewStorage, saveViewStorage } from './utils/viewStorage'
import { filterTodos } from './utils/filterTodos'
import { filterTodosByDate } from './utils/filterTodosByDate'
import { shiftWeekStartDate } from './utils/weekUtils'

/** 초기 뷰 상태를 한 번만 불러오기 위한 캐시 */
let cachedInitialViewState = null

function getInitialViewState() {
  if (!cachedInitialViewState) {
    cachedInitialViewState = loadViewStorage()
  }
  return cachedInitialViewState
}

/**
 * App - Todo 앱의 최상위 컴포넌트
 *
 * Todo 데이터 state는 useTodos 훅이 관리하고,
 * 필터·주간 뷰 state는 이 컴포넌트에서 useState로 관리합니다.
 * 주간 뷰 상태는 useEffect로 로컬 스토리지에 저장되어 새로고침 후에도 유지됩니다.
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

  // 주간 뷰 상태 - 선택된 날짜와 현재 표시 중인 주의 시작일
  const [selectedDate, setSelectedDate] = useState(() => getInitialViewState().selectedDate)
  const [weekStartDate, setWeekStartDate] = useState(() => getInitialViewState().weekStartDate)

  /**
   * 주간 뷰 상태 변경 시 로컬 스토리지에 자동 저장
   * 새로고침 후에도 선택된 날짜와 주가 유지됩니다.
   */
  useEffect(() => {
    saveViewStorage({ selectedDate, weekStartDate })
  }, [selectedDate, weekStartDate])

  const todoCountByDate = useMemo(() => countTodosByDate(todos), [todos])
  const dateFilteredTodos = filterTodosByDate(todos, selectedDate)
  const filteredTodos = filterTodos(dateFilteredTodos, activeFilter)
  const completedCount = dateFilteredTodos.filter((todo) => todo.isCompleted).length

  const handleSelectDate = (dateString) => {
    setSelectedDate(dateString)
  }

  const handlePreviousWeek = () => {
    setWeekStartDate((prevWeekStart) => shiftWeekStartDate(prevWeekStart, -1))
  }

  const handleNextWeek = () => {
    setWeekStartDate((prevWeekStart) => shiftWeekStartDate(prevWeekStart, 1))
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
          <TodoWeekCalendar
            weekStartDate={weekStartDate}
            selectedDate={selectedDate}
            todoCountByDate={todoCountByDate}
            onSelectDate={handleSelectDate}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
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
