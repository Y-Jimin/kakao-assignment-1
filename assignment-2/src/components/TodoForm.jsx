/**
 * TodoForm - 새 Todo를 입력하고 추가하는 폼 컴포넌트
 *
 * props(부모로부터 받는 데이터·콜백):
 *   - inputValue: 현재 입력값 (state는 부모가 소유)
 *   - inputError: 유효성 검사 오류 메시지
 *   - onInputChange: 입력값 변경 콜백
 *   - onAddTodo: 추가 버튼 클릭 콜백
 */
function TodoForm({ inputValue, inputError, onInputChange, onAddTodo }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onAddTodo()
    }
  }

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="할 일을 입력하세요"
          className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-colors focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/20"
        />
        <button
          type="button"
          onClick={onAddTodo}
          className="rounded-lg bg-[#672be0] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5a24c4] active:bg-[#4d1fa8]"
        >
          추가
        </button>
      </div>

      {inputError && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {inputError}
        </p>
      )}
    </div>
  )
}

export default TodoForm
