import { TODO_FILTER_TABS } from '../constants/todoFilters'

/**
 * TodoFilter - 전체/진행 중/완료 필터 탭 UI
 *
 * props(부모로부터 받는 데이터·콜백):
 *   - activeFilter: 현재 선택된 필터 값 (state는 부모 App이 useState로 관리)
 *   - onFilterChange: 필터 탭 클릭 시 호출되는 콜백
 *
 * 이 컴포넌트는 자체 state 없이 props만으로 탭 UI를 렌더링합니다.
 */
function TodoFilter({ activeFilter, onFilterChange }) {
  return (
    <div className="flex rounded-lg bg-gray-100 p-1" role="tablist" aria-label="Todo 필터">
      {TODO_FILTER_TABS.map((tab) => {
        const isSelected = activeFilter === tab.value

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onFilterChange(tab.value)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-white text-[#672be0] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default TodoFilter
