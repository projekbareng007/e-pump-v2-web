"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  userCreateSchema,
  userUpdateSchema,
  type UserCreateForm,
  type UserUpdateForm,
} from "@/schemas/user.schema";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";
import { useAuthStore } from "@/stores/auth-store";
import { Role, type UserResponse } from "@/types";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserResponse | null;
}

export default function UserFormDialog({
  open,
  onOpenChange,
  user,
}: UserFormDialogProps) {
  const isEdit = !!user;
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const currentUser = useAuthStore((s) => s.user);
  const canAssignSuperuser = currentUser?.role === Role.SUPERUSER;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserCreateForm | UserUpdateForm>({
    resolver: zodResolver(isEdit ? userUpdateSchema : userCreateSchema),
    defaultValues: isEdit
      ? { nama: "", email: "", password: "", role: "user" }
      : { nama: "", email: "", password: "", role: "user" },
  });

  const roleValue = watch("role" as keyof UserUpdateForm);

  useEffect(() => {
    if (user) {
      reset({
        nama: user.nama,
        email: user.email,
        password: "",
        role: user.role as "user" | "admin" | "superuser",
      });
    } else {
      reset({ nama: "", email: "", password: "", role: "user" });
    }
  }, [user, reset]);

  const onSubmit = (values: UserCreateForm | UserUpdateForm) => {
    if (isEdit) {
      const data = values as UserUpdateForm;
      updateMutation.mutate(
        {
          userId: user!.id,
          data: {
            nama: data.nama,
            email: data.email,
            role: data.role,
            ...(data.password ? { password: data.password } : {}),
          },
        },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(values as UserCreateForm, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-bold">
            {isEdit ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update user information and role."
              : "Register a new user to the system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="nama"
              className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant"
            >
              Full Name
            </Label>
            <Input
              id="nama"
              placeholder="e.g. John Doe"
              {...register("nama" as any)}
              className="h-auto py-3 bg-surface-container border-none rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            {errors.nama && (
              <p className="text-xs text-red-500">
                {(errors as any).nama.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@company.com"
              {...register("email" as any)}
              className="h-auto py-3 bg-surface-container border-none rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            {errors.email && (
              <p className="text-xs text-red-500">
                {(errors as any).email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant"
            >
              Password{isEdit && " (leave blank to keep current)"}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={isEdit ? "Enter new password or leave blank" : "Min. 6 characters"}
              {...register("password" as any)}
              className="h-auto py-3 bg-surface-container border-none rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            {"password" in errors && errors.password && (
              <p className="text-xs text-red-500">
                {(errors as any).password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant">
              Role
            </Label>
            <Select
              value={(roleValue as string) ?? "user"}
              onValueChange={(v) =>
                setValue("role" as any, v as "user" | "admin" | "superuser")
              }
            >
              <SelectTrigger className="h-auto py-3 bg-surface-container border-none rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-primary/40">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                {canAssignSuperuser && (
                  <SelectItem value="superuser">Super Admin</SelectItem>
                )}
              </SelectContent>
            </Select>
            {(errors as any).role && (
              <p className="text-xs text-red-500">
                {(errors as any).role.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
