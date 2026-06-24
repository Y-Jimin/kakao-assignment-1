import { API_URL } from "./config";
import type { Todo } from "./types";

/**
 * Server Component에서 사용하는 API 호출 함수
 * FastAPI 백엔드에서 Todo 데이터를 가져옵니다.
 */
export async function getTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_URL}/todos`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Todo 목록을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function getTodoById(todoId: number): Promise<Todo | null> {
  const todos = await getTodos();
  return todos.find((todo) => todo.id === todoId) ?? null;
}
