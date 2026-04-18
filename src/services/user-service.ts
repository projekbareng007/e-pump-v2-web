import api from "@/lib/api";
import type { UserResponse, UserUpdateAdmin, UserCreate } from "@/types";

export const userService = {
  getAllUsers() {
    return api.get<UserResponse[]>("/admin/users/");
  },

  getUser(userId: string) {
    return api.get<UserResponse>(`/admin/users/${userId}`);
  },

  createUser(data: UserCreate) {
    return api.post<UserResponse>("/admin/users/", data);
  },

  updateUser(userId: string, data: UserUpdateAdmin) {
    return api.put<UserResponse>(`/admin/users/${userId}`, data);
  },

  deleteUser(userId: string) {
    return api.delete(`/admin/users/${userId}`);
  },
};
