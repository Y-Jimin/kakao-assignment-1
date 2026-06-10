import { useState } from 'react'

/**
 * TodoItem - 개별 Todo 항목을 표시하고 수정/완료/삭제를 처리하는 컴포넌트
 *
 * props(부모로부터 받는 데이터·콜백):
 *   - todo: 표시할 Todo 객체 { id, text, isCompleted }
 *   - onToggleComplete: 완료 상태 토글 콜백
 *   - onUpdateText: 텍스트 수정 콜백
 *   - onDelete: 삭제 콜백
 *
 * state(이 컴포넌트가 소유하는 UI 상태):
 *   - isEditing: 수정 모드 여부
 *   - editText: 수정 중인 텍스트
 */
function TodoItem({ todo, onToggleComplete, onUpdateText, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [editError, setEditError] = useState('')

  const handleStartEdit = () => {
    setEditText(todo.text)
    setEditError('')
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    const isSaved = onUpdateText(todo.id, editText)

    if (!isSaved) {
      setEditError('내용을 입력해주세요.')
      return
    }

    setIsEditing(false)
    setEditError('')
  }

  const handleCancelEdit = () => {
    setEditText(todo.text)
    setEditError('')
    setIsEditing(false)
  }

  const handleEditKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSaveEdit()
    } else if (event.key === 'Escape') {
      handleCancelEdit()
    }
  }

  return (
    <li className="group flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 transition-shadow hover:shadow-sm">
      {/* 완료 체크박스 */}
      <button
        type="button"
        onClick={() => onToggleComplete(todo.id)}
        aria-label={todo.isCompleted ? '완료 취소' : '완료 표시'}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          todo.isCompleted
            ? 'border-[#672be0] bg-[#672be0]'
            : 'border-gray-300 hover:border-[#672be0]'
        }`}
      >
        {todo.isCompleted && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Todo 텍스트 또는 수정 입력창 */}
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div>
            <input
              type="text"
              value={editText}
              onChange={(event) => {
                setEditText(event.target.value)
                if (editError) setEditError('')
              }}
              onKeyDown={handleEditKeyDown}
              autoFocus
              className="w-full rounded-md border border-[#672be0] px-2 py-1 text-sm text-gray-800 outline-none ring-2 ring-[#672be0]/20"
            />
            {editError && (
              <p className="mt-1 text-xs text-red-500">{editError}</p>
            )}
          </div>
        ) : (
          <span
            className={`block truncate text-sm ${
              todo.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="rounded-md px-2 py-1 text-xs font-medium text-[#672be0] hover:bg-[#672be0]/10"
            >
              저장
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
            >
              취소
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleStartEdit}
              className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-[#672be0]"
            >
              수정
            </button>
            <button
              type="button"
              onClick={() => onDelete(todo.id)}
              className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-500"
            >
              삭제
            </button>
          </>
        )}
      </div>
    </li>
  )
}

export default TodoItem
