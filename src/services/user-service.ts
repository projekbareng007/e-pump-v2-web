import api from "@/lib/api";
import type { UserResponse, UserUpdateAdmin, UserCreate, PaginatedResponse, PaginatedQuery } from "@/types";

export const userService = {
  getAllUsers(params?: PaginatedQuery) {
    return api.get<PaginatedResponse<UserResponse>>("/admin/users/", { params });
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
