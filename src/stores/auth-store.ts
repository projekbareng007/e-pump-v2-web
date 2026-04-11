import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserResponse } from "@/types";

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  setUser: (user: UserResponse, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      logout: () => {
        set({ user: null, token: null });
        if (typeof document !== "undefined") {
          document.cookie =
            "auth-token=; path=/; max-age=0; SameSite=Lax";
        }
      },
    }),
    { name: "auth-storage" },
  ),
);
