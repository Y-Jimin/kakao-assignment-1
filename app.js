// ===== DOM 요소 참조 =====
const todoInput = document.getElementById("todoInput");
const addTodoButton = document.getElementById("addTodoButton");
const todoListElement = document.getElementById("todoList");
const emptyInputMessage = document.getElementById("emptyInputMessage");
const emptyListMessage = document.getElementById("emptyListMessage");
const filterTabButtons = document.querySelectorAll(".filter-tabs__button");
const prevWeekButton = document.getElementById("prevWeekButton");
const nextWeekButton = document.getElementById("nextWeekButton");
const weekRangeLabel = document.getElementById("weekRangeLabel");
const weekDaysContainer = document.getElementById("weekDaysContainer");

// ===== 필터 상수 =====
const FILTER_ALL = "all";
const FILTER_ACTIVE = "active";
const FILTER_COMPLETED = "completed";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// 로컬 스토리지에 저장할 데이터 키
const STORAGE_KEY = "todoAppData";

// ===== 상태: Todo 목록을 메모리에 저장 =====
let todos = [];
let nextTodoId = 1;

// 현재 수정 중인 Todo의 id (null이면 수정 모드 아님)
let editingTodoId = null;

// 현재 선택된 필터 (전체 / 진행 중 / 완료)
let currentFilter = FILTER_ALL;

// 일간 뷰: 현재 선택된 날짜 (시간은 00:00:00으로 정규화)
let selectedDate = getTodayAtMidnight();

// 주간 뷰: 화면에 표시 중인 주의 시작일 (일요일)
let weekStartDate = getWeekStartDate(getTodayAtMidnight());

// ===== 이벤트 리스너 등록 =====
addTodoButton.addEventListener("click", handleAddTodo);

// 필터 탭 클릭 시 해당 상태의 Todo만 표시
filterTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setCurrentFilter(button.dataset.filter);
  });
});

// 이전 / 다음 주로 이동
prevWeekButton.addEventListener("click", () => moveWeek(-1));
nextWeekButton.addEventListener("click", () => moveWeek(1));

todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleAddTodo();
  }
});

// ===== Storage: 로컬 스토리지 저장·불러오기 =====
// Todo 변경사항을 JSON 형식으로 로컬 스토리지에 저장
function saveTodosToLocalStorage() {
  const dataToSave = {
    todos: todos,
    nextTodoId: nextTodoId,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

// 로컬 스토리지에서 Todo 데이터를 JSON 형식으로 불러오기
function loadTodosFromLocalStorage() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return;
  }

  try {
    const parsedData = JSON.parse(savedData);

    if (Array.isArray(parsedData.todos)) {
      todos = parsedData.todos;
    }

    if (typeof parsedData.nextTodoId === "number" && parsedData.nextTodoId > 0) {
      nextTodoId = parsedData.nextTodoId;
    } else {
      // nextTodoId가 없으면 기존 Todo id 기준으로 재계산
      updateNextTodoIdFromTodos();
    }
  } catch (error) {
    // JSON 파싱 실패 시 저장 데이터를 무시하고 빈 목록으로 시작
    console.error("로컬 스토리지 데이터를 불러오지 못했습니다.", error);
    todos = [];
    nextTodoId = 1;
  }
}

// Todo 목록에서 다음 id 값 계산
function updateNextTodoIdFromTodos() {
  if (todos.length === 0) {
    nextTodoId = 1;
    return;
  }

  const maxId = Math.max(...todos.map((todo) => todo.id));
  nextTodoId = maxId + 1;
}

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

// 해당 날짜가 속한 주의 시작일(일요일) 반환
function getWeekStartDate(date) {
  const weekStart = new Date(date);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

// 주 시작일부터 7일간의 Date 배열 반환
function getWeekDates(weekStart) {
  const weekDates = [];

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + dayIndex);
    weekDates.push(date);
  }

  return weekDates;
}

// 주간 캘린더 상단에 표시할 기간 문자열
function formatWeekRange(weekStart) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const year = weekStart.getFullYear();
  const startMonth = weekStart.getMonth() + 1;
  const startDay = weekStart.getDate();
  const endMonth = weekEnd.getMonth() + 1;
  const endDay = weekEnd.getDate();

  if (startMonth === endMonth) {
    return `${year}년 ${startMonth}월 ${startDay}일 - ${endDay}일`;
  }

  return `${year}년 ${startMonth}월 ${startDay}일 - ${endMonth}월 ${endDay}일`;
}

// 특정 날짜의 Todo 개수 반환
function getTodoCountByDateKey(dateKey) {
  return todos.filter((todo) => todo.date === dateKey).length;
}

// 날짜 선택
function selectDate(date) {
  selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);
  editingTodoId = null;
  renderWeekCalendar();
  renderTodoList();
}

// 주 이동 (weekOffset: -1이면 이전 주, +1이면 다음 주)
function moveWeek(weekOffset) {
  const newWeekStart = new Date(weekStartDate);
  newWeekStart.setDate(newWeekStart.getDate() + weekOffset * 7);
  weekStartDate = newWeekStart;
  renderWeekCalendar();
}

// 주간 캘린더 UI 렌더링
function renderWeekCalendar() {
  weekRangeLabel.textContent = formatWeekRange(weekStartDate);
  weekDaysContainer.innerHTML = "";

  const weekDates = getWeekDates(weekStartDate);
  const today = getTodayAtMidnight();

  weekDates.forEach((date) => {
    const dateKey = formatDateKey(date);
    const todoCount = getTodoCountByDateKey(dateKey);
    const isToday = isSameDay(date, today);
    const isSelected = isSameDay(date, selectedDate);

    const dayButton = document.createElement("button");
    dayButton.type = "button";
    dayButton.className = "week-calendar__day";
    dayButton.setAttribute("aria-label", `${formatDateKey(date)} 할 일 보기`);

    if (isToday) {
      dayButton.classList.add("week-calendar__day--today");
    }

    if (isSelected) {
      dayButton.classList.add("week-calendar__day--selected");
    }

    if (isToday && isSelected) {
      dayButton.setAttribute("aria-current", "date");
    }

    const weekdaySpan = document.createElement("span");
    weekdaySpan.className = "week-calendar__weekday";
    weekdaySpan.textContent = WEEKDAY_LABELS[date.getDay()];

    const dateSpan = document.createElement("span");
    dateSpan.className = "week-calendar__date";
    dateSpan.textContent = String(date.getDate());

    const countSpan = document.createElement("span");
    countSpan.className = "week-calendar__count";
    countSpan.textContent = todoCount > 0 ? `${todoCount}개` : "-";

    dayButton.append(weekdaySpan, dateSpan, countSpan);
    dayButton.addEventListener("click", () => selectDate(date));
    weekDaysContainer.appendChild(dayButton);
  });
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
  saveTodosToLocalStorage();
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
  renderWeekCalendar();
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
    saveTodosToLocalStorage();
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
    saveTodosToLocalStorage();
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
  saveTodosToLocalStorage();
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
loadTodosFromLocalStorage();
weekStartDate = getWeekStartDate(selectedDate);
updateFilterTabStyles();
renderWeekCalendar();
renderTodoList();
