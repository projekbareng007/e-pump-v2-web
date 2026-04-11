import api from "@/lib/api";
import type { UserResponse, UserUpdateAdmin, UserRegister } from "@/types";

export const userService = {
  getAllUsers() {
    return api.get<UserResponse[]>("/admin/users/");
  },

  getUser(userId: string) {
    return api.get<UserResponse>(`/admin/users/${userId}`);
  },

  createUser(data: UserRegister) {
    return api.post<UserResponse>("/auth/register", data);
  },

  updateUser(userId: string, data: UserUpdateAdmin) {
    return api.patch<UserResponse>(`/admin/users/${userId}`, data);
  },

  deleteUser(userId: string) {
    return api.delete(`/admin/users/${userId}`);
  },
};
