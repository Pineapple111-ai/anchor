import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE_NAME = "anchor_admin_session";

function computeToken(password: string): string {
  return createHmac("sha256", password).update("anchor-admin-session").digest("hex");
}

export function createAdminSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD 환경 변수가 설정되어 있지 않습니다.");
  }
  return computeToken(password);
}

export function verifyAdminSession(cookieValue: string | undefined): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !cookieValue) return false;
  const expected = computeToken(password);
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function verifyPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
