import api from "@/lib/api";
import type { UserRegister, UserLogin, UserResponse, Token } from "@/types";

export const authService = {
  register(data: UserRegister) {
    return api.post<UserResponse>("/auth/register", data);
  },

  login(data: UserLogin) {
    return api.post<Token>("/auth/login", data);
  },

  getMe() {
    return api.get<UserResponse>("/auth/me");
  },
};
