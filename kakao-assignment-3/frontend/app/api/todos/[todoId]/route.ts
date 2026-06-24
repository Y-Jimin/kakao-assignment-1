import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { FASTAPI_URL } from "@/lib/config";

interface RouteContext {
  params: Promise<{ todoId: string }>;
}

/**
 * PUT /api/todos/[todoId]
 * Client → route.ts → FastAPI 로 Todo 수정 요청을 전달하는 프록시
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { todoId } = await context.params;
    const body = await request.json();

    const response = await fetch(`${FASTAPI_URL}/todos/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { message: errorData?.detail ?? "Todo 수정에 실패했습니다." },
        { status: response.status },
      );
    }

    const data = await response.json();
    revalidatePath("/todos");
    revalidatePath(`/todos/${todoId}`);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/todos/[todoId]
 * Client → route.ts → FastAPI 로 Todo 삭제 요청을 전달하는 프록시
 */
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { todoId } = await context.params;

    const response = await fetch(`${FASTAPI_URL}/todos/${todoId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { message: errorData?.detail ?? "Todo 삭제에 실패했습니다." },
        { status: response.status },
      );
    }

    revalidatePath("/todos");
    revalidatePath(`/todos/${todoId}`);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
