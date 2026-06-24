/**
 * 프론트엔드 환경 변수 설정
 *
 * - API_URL: 서버 전용 FastAPI URL (actions.ts, route.ts)
 * - NEXT_PUBLIC_API_URL: 클라이언트 노출용 FastAPI URL fallback
 * - NEXT_PUBLIC_APP_URL: 프론트엔드 앱 URL
 */
export const FASTAPI_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

export const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
