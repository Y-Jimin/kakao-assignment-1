import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import { useTodos } from './hooks/useTodos'

/**
 * App - Todo 앱의 최상위 컴포넌트
 *
 * state 관리는 useTodos 훅에 위임하고,
 * 하위 컴포넌트에는 필요한 데이터와 콜백만 props로 전달합니다.
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

  const completedCount = todos.filter((todo) => todo.isCompleted).length

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 px-4 py-12 sm:py-20">
      <div className="w-full max-w-lg">
        {/* 헤더 */}
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            My <span className="text-[#672be0]">Todo</span>
          </h1>
          {todos.length > 0 && (
            <p className="mt-2 text-sm text-gray-400">
              {completedCount} / {todos.length} 완료
            </p>
          )}
        </header>

        {/* 메인 카드 */}
        <main className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <TodoForm
            inputValue={inputValue}
            inputError={inputError}
            onInputChange={handleInputChange}
            onAddTodo={addTodo}
          />

          <div className="mt-6 border-t border-gray-100 pt-6">
            <TodoList
              todos={todos}
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
