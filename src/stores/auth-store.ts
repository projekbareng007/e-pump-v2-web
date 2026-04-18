import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserResponse } from "@/types";

const TOKEN_COOKIE = "auth-token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export function setAuthToken(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=${TOKEN_MAX_AGE}; SameSite=Lax`;
}

export function getAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${TOKEN_COOKIE}=([^;]+)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearAuthToken() {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

interface AuthState {
  user: UserResponse | null;
  setUser: (user: UserResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null });
        clearAuthToken();
      },
    }),
    { name: "auth-storage" },
  ),
);
