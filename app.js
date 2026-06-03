// ===== DOM 요소 참조 =====
const todoInput = document.getElementById("todoInput");
const addTodoButton = document.getElementById("addTodoButton");
const todoListElement = document.getElementById("todoList");
const emptyInputMessage = document.getElementById("emptyInputMessage");
const emptyListMessage = document.getElementById("emptyListMessage");
const filterTabButtons = document.querySelectorAll(".filter-tabs__button");
const prevDateButton = document.getElementById("prevDateButton");
const nextDateButton = document.getElementById("nextDateButton");
const selectedDateLabel = document.getElementById("selectedDateLabel");

// ===== 필터 상수 =====
const FILTER_ALL = "all";
const FILTER_ACTIVE = "active";
const FILTER_COMPLETED = "completed";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// ===== 상태: Todo 목록을 메모리에 저장 =====
let todos = [];
let nextTodoId = 1;

// 현재 수정 중인 Todo의 id (null이면 수정 모드 아님)
let editingTodoId = null;

// 현재 선택된 필터 (전체 / 진행 중 / 완료)
let currentFilter = FILTER_ALL;

// 일간 뷰: 현재 선택된 날짜 (시간은 00:00:00으로 정규화)
let selectedDate = getTodayAtMidnight();

// ===== 이벤트 리스너 등록 =====
addTodoButton.addEventListener("click", handleAddTodo);

// 필터 탭 클릭 시 해당 상태의 Todo만 표시
filterTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setCurrentFilter(button.dataset.filter);
  });
});

// 이전 / 다음 날짜로 이동
prevDateButton.addEventListener("click", () => moveSelectedDate(-1));
nextDateButton.addEventListener("click", () => moveSelectedDate(1));

todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleAddTodo();
  }
});

// ===== Date: 날짜 유틸리티 =====
// 오늘 날짜를 자정(00:00:00)으로 반환
function getTodayAtMidnight() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// Date 객체를 YYYY-MM-DD 문자열로 변환 (Todo 저장·비교용)
function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 두 날짜가 같은 날인지 비교
function isSameDay(dateA, dateB) {
  return formatDateKey(dateA) === formatDateKey(dateB);
}

// 화면에 표시할 날짜 문자열 (오늘이면 '오늘' 접두사 포함)
function formatDisplayDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAY_LABELS[date.getDay()];
  const formatted = `${year}년 ${month}월 ${day}일 (${weekday})`;

  if (isSameDay(date, getTodayAtMidnight())) {
    return `오늘 · ${formatted}`;
  }

  return formatted;
}

// 선택된 날짜 라벨 갱신
function updateDateDisplay() {
  selectedDateLabel.textContent = formatDisplayDate(selectedDate);
}

// 날짜 이동 (dayOffset: -1이면 하루 전, +1이면 하루 후)
function moveSelectedDate(dayOffset) {
  const newDate = new Date(selectedDate);
  newDate.setDate(newDate.getDate() + dayOffset);
  newDate.setHours(0, 0, 0, 0);
  selectedDate = newDate;

  // 다른 날짜로 이동 시 수정 모드 해제
  editingTodoId = null;

  updateDateDisplay();
  renderTodoList();
}

// ===== Create: 새 Todo 추가 =====
function handleAddTodo() {
  const text = todoInput.value.trim();

  // 빈 입력값이면 생성하지 않고 안내 메시지 표시
  if (text === "") {
    showEmptyInputMessage();
    return;
  }

  hideEmptyInputMessage();

  const newTodo = {
    id: nextTodoId++,
    text: text,
    completed: false,
    // 현재 선택된 날짜를 함께 저장
    date: formatDateKey(selectedDate),
  };

  todos.push(newTodo);
  todoInput.value = "";
  todoInput.focus();
  renderTodoList();
}

// ===== Filter: 선택된 날짜의 Todo만 반환 =====
function getTodosForSelectedDate() {
  const selectedDateKey = formatDateKey(selectedDate);
  return todos.filter((todo) => todo.date === selectedDateKey);
}

// 현재 날짜 + 상태 필터에 맞는 Todo 목록 반환
function getFilteredTodos() {
  const dateTodos = getTodosForSelectedDate();

  switch (currentFilter) {
    case FILTER_ACTIVE:
      return dateTodos.filter((todo) => !todo.completed);
    case FILTER_COMPLETED:
      return dateTodos.filter((todo) => todo.completed);
    default:
      return dateTodos;
  }
}

// 필터 탭 변경
function setCurrentFilter(filter) {
  currentFilter = filter;
  updateFilterTabStyles();
  renderTodoList();
}

// 선택된 탭에 활성 스타일 적용
function updateFilterTabStyles() {
  filterTabButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("filter-tabs__button--active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

// ===== Read: Todo 목록을 화면에 렌더링 =====
function renderTodoList() {
  todoListElement.innerHTML = "";

  const filteredTodos = getFilteredTodos();

  filteredTodos.forEach((todo) => {
    const listItem = createTodoListItem(todo);
    todoListElement.appendChild(listItem);
  });

  updateEmptyListMessage();
}

// Todo 항목 DOM 요소 생성
function createTodoListItem(todo) {
  const listItem = document.createElement("li");
  listItem.className = "todo-item";
  listItem.dataset.todoId = todo.id;

  if (todo.completed) {
    listItem.classList.add("todo-item--completed");
  }

  const isEditing = editingTodoId === todo.id;

  if (isEditing) {
    // 수정 모드: 입력창 + 저장/취소 버튼
    listItem.appendChild(createEditModeContent(todo));
  } else {
    // 일반 모드: 텍스트 + 수정/완료/삭제 버튼
    listItem.appendChild(createViewModeContent(todo));
  }

  return listItem;
}

// 일반 보기 모드 UI
function createViewModeContent(todo) {
  const textSpan = document.createElement("span");
  textSpan.className = "todo-item__text";
  textSpan.textContent = todo.text;

  if (todo.completed) {
    textSpan.classList.add("todo-item__text--completed");
  }

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "todo-item__actions";

  const editButton = createActionButton("수정", "todo-item__button--edit", () =>
    startEditingTodo(todo.id)
  );
  const completeButton = createActionButton(
    todo.completed ? "취소" : "완료",
    "todo-item__button--complete",
    () => toggleTodoComplete(todo.id)
  );
  const deleteButton = createActionButton(
    "삭제",
    "todo-item__button--delete",
    () => deleteTodo(todo.id)
  );

  actionsDiv.append(editButton, completeButton, deleteButton);

  const fragment = document.createDocumentFragment();
  fragment.append(textSpan, actionsDiv);
  return fragment;
}

// 수정 모드 UI
function createEditModeContent(todo) {
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "todo-item__edit-input";
  editInput.value = todo.text;
  editInput.maxLength = 200;

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "todo-item__actions";

  const saveButton = createActionButton(
    "저장",
    "todo-item__button--save",
    () => saveEditedTodo(todo.id, editInput.value)
  );
  const cancelButton = createActionButton(
    "취소",
    "todo-item__button--cancel",
    () => cancelEditingTodo()
  );

  actionsDiv.append(saveButton, cancelButton);

  // Enter로 저장, Escape로 취소
  editInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      saveEditedTodo(todo.id, editInput.value);
    } else if (event.key === "Escape") {
      cancelEditingTodo();
    }
  });

  editInput.focus();

  const fragment = document.createDocumentFragment();
  fragment.append(editInput, actionsDiv);
  return fragment;
}

// 공통 액션 버튼 생성 헬퍼
function createActionButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `todo-item__button ${className}`;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

// ===== Update: Todo 수정 =====
function startEditingTodo(todoId) {
  editingTodoId = todoId;
  renderTodoList();
}

function saveEditedTodo(todoId, newText) {
  const trimmedText = newText.trim();

  if (trimmedText === "") {
    showEmptyInputMessage();
    return;
  }

  hideEmptyInputMessage();

  const todo = todos.find((item) => item.id === todoId);
  if (todo) {
    todo.text = trimmedText;
  }

  editingTodoId = null;
  renderTodoList();
}

function cancelEditingTodo() {
  editingTodoId = null;
  renderTodoList();
}

// ===== Update: Todo 완료 토글 =====
function toggleTodoComplete(todoId) {
  const todo = todos.find((item) => item.id === todoId);
  if (todo) {
    todo.completed = !todo.completed;
  }
  renderTodoList();
}

// ===== Delete: Todo 삭제 =====
function deleteTodo(todoId) {
  // 삭제 대상이 수정 중이었다면 수정 모드 해제
  if (editingTodoId === todoId) {
    editingTodoId = null;
  }

  todos = todos.filter((item) => item.id !== todoId);
  renderTodoList();
}

// ===== 안내 메시지 표시/숨김 =====
function showEmptyInputMessage() {
  emptyInputMessage.hidden = false;
  todoInput.focus();
}

function hideEmptyInputMessage() {
  emptyInputMessage.hidden = true;
}

function updateEmptyListMessage() {
  const dateTodos = getTodosForSelectedDate();
  const filteredTodos = getFilteredTodos();
  emptyListMessage.hidden = filteredTodos.length > 0;

  // 날짜·필터별 빈 목록 안내 문구
  if (dateTodos.length === 0) {
    emptyListMessage.textContent = "이 날짜에 등록된 할 일이 없습니다.";
  } else if (currentFilter === FILTER_ACTIVE) {
    emptyListMessage.textContent = "진행 중인 할 일이 없습니다.";
  } else if (currentFilter === FILTER_COMPLETED) {
    emptyListMessage.textContent = "완료된 할 일이 없습니다.";
  } else {
    emptyListMessage.textContent = "등록된 할 일이 없습니다.";
  }
}

// 입력 시 빈 값 안내 메시지 자동 숨김
todoInput.addEventListener("input", hideEmptyInputMessage);

// ===== 초기 렌더링 =====
updateDateDisplay();
updateFilterTabStyles();
renderTodoList();
