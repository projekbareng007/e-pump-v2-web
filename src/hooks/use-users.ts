import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService } from "@/services/user-service";
import type { UserRegister, UserUpdateAdmin } from "@/types";

const USER_KEYS = {
  all: ["users"] as const,
  list: () => [...USER_KEYS.all, "list"] as const,
  detail: (id: string) => [...USER_KEYS.all, "detail", id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: USER_KEYS.list(),
    queryFn: () => userService.getAllUsers().then((r) => r.data),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UserRegister) => userService.createUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_KEYS.list() });
      toast.success("User created successfully");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.detail?.[0]?.msg ||
          err?.response?.data?.detail ||
          "Failed to create user",
      );
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UserUpdateAdmin;
    }) => userService.updateUser(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_KEYS.list() });
      toast.success("User updated successfully");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.detail?.[0]?.msg ||
          err?.response?.data?.detail ||
          "Failed to update user",
      );
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_KEYS.list() });
      toast.success("User deleted successfully");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.detail?.[0]?.msg ||
          err?.response?.data?.detail ||
          "Failed to delete user",
      );
    },
  });
}
