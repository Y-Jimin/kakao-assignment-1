"use server";

import { FASTAPI_URL } from "@/lib/config";
import type { Todo } from "@/lib/types";

/**
 * getTodos - Server Action
 * Server Component에서 호출하여 FastAPI로부터 Todo 목록을 가져옵니다.
 */
export async function getTodos(): Promise<Todo[]> {
  const response = await fetch(`${FASTAPI_URL}/todos`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Todo 목록을 불러오지 못했습니다.");
  }

  return response.json();
}

/**
 * getTodoById - Server Action
 * Server Component에서 호출하여 특정 Todo를 조회합니다.
 */
export async function getTodoById(todoId: number): Promise<Todo | null> {
  const todos = await getTodos();
  return todos.find((todo) => todo.id === todoId) ?? null;
}
