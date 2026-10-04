// F22/F25: Sitzungs-Cookie (nur in Server Actions und Route Handlern verwenden)
import { cookies } from "next/headers";
import { createSession, deleteSession, getUserBySession, SESSION_COOKIE, type User } from "./accounts";

export { SESSION_COOKIE };

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  return getUserBySession(store.get(SESSION_COOKIE)?.value);
}

export async function startSession(userId: number): Promise<void> {
  const { token, expiresAt } = createSession(userId);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  deleteSession(store.get(SESSION_COOKIE)?.value);
  store.delete(SESSION_COOKIE);
}
