import type { Todo, TodoCreateInput, TodoUpdateInput } from "./types";

/**
 * Client Component에서 사용하는 API 호출 함수
 * 생성·수정·삭제는 Next.js API Route(/api/todos)를 거쳐 FastAPI로 전달됩니다.
 */
export async function createTodo(data: TodoCreateInput): Promise<Todo> {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: data.text,
      is_completed: data.is_completed ?? false,
    }),
  });

  if (!response.ok) {
    throw new Error("Todo 생성에 실패했습니다.");
  }

  return response.json();
}

export async function updateTodo(
  todoId: number,
  data: TodoUpdateInput,
): Promise<Todo> {
  const response = await fetch(`/api/todos/${todoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Todo 수정에 실패했습니다.");
  }

  return response.json();
}

export async function deleteTodo(todoId: number): Promise<void> {
  const response = await fetch(`/api/todos/${todoId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Todo 삭제에 실패했습니다.");
  }
}
