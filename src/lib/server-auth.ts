import "server-only";
import { cookies } from "next/headers";
import type { UserResponse } from "@/types";

const TOKEN_COOKIE = "auth-token";

export async function getServerUser(): Promise<UserResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  if (!token) return null;

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return null;

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      cookieStore.delete(TOKEN_COOKIE);
      return null;
    }
    return (await res.json()) as UserResponse;
  } catch {
    cookieStore.delete(TOKEN_COOKIE);
    return null;
  }
}
