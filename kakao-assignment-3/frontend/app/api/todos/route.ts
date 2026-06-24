import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { FASTAPI_URL } from "@/lib/config";

/**
 * POST /api/todos
 * Client → route.ts → FastAPI 로 Todo 생성 요청을 전달하는 프록시
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${FASTAPI_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { message: errorData?.detail ?? "Todo 생성에 실패했습니다." },
        { status: response.status },
      );
    }

    const data = await response.json();
    revalidatePath("/todos");
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
