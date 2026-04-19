"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Shield, UserRound } from "lucide-react";

import {
  userUpdateSchema,
  type UserUpdateForm,
} from "@/schemas/user.schema";
import { useUpdateUser } from "@/hooks/use-users";
import { useAuthStore } from "@/stores/auth-store";
import type { UserResponse } from "@/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatRole(role: string) {
  switch (role) {
    case "superuser":
      return "Super Admin";
    case "admin":
      return "Administrator";
    default:
      return "User";
  }
}

export default function ProfileView({
  initialUser,
}: {
  initialUser: UserResponse;
}) {
  const storeUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const user = storeUser ?? initialUser;

  const updateMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserUpdateForm>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      nama: user.nama,
      email: user.email,
      password: "",
    },
  });

  useEffect(() => {
    reset({ nama: user.nama, email: user.email, password: "" });
  }, [user.nama, user.email, reset]);

  const onSubmit = (values: UserUpdateForm) => {
    const payload = {
      nama: values.nama ?? undefined,
      email: values.email ?? undefined,
      ...(values.password ? { password: values.password } : {}),
    };

    updateMutation.mutate(
      { userId: user.id, data: payload },
      {
        onSuccess: (res) => {
          setUser(res.data);
          reset({ nama: res.data.nama, email: res.data.email, password: "" });
          toast.success("Profile updated");
        },
      },
    );
  };

  return (
    <div className="px-8 py-8 pb-12 max-w-5xl">
      <div className="mb-10">
        <span className="text-xs font-bold text-primary-container tracking-widest uppercase mb-2 block">
          Account
        </span>
        <h2 className="text-4xl font-extrabold font-heading text-on-surface tracking-tight">
          My Profile
        </h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Update your personal information and password.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Identity Card */}
        <Card className="lg:col-span-1 bg-surface-container-lowest border-none rounded-2xl shadow-sm border border-outline-variant/10">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="size-24 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center text-3xl font-heading font-extrabold shadow-lg shadow-primary/10 mb-4">
              {getInitials(user.nama)}
            </div>
            <h3 className="font-heading text-xl font-bold text-on-surface">
              {user.nama}
            </h3>
            <p className="text-sm text-on-surface-variant mb-4">{user.email}</p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
              <Shield className="size-3.5" />
              {formatRole(user.role)}
            </span>

            <div className="w-full border-t border-outline-variant/20 mt-6 pt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <UserRound className="size-4 text-outline" />
                <span className="text-on-surface-variant truncate">
                  ID: <span className="font-mono text-xs">{user.id}</span>
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-outline" />
                <span className="text-on-surface-variant truncate">
                  {user.email}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2 bg-surface-container-lowest border-none rounded-2xl shadow-sm border border-outline-variant/10">
          <CardContent className="p-8">
            <h3 className="font-heading text-lg font-bold text-on-surface mb-1">
              Personal Information
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Changes apply immediately after saving.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="nama"
                  className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant"
                >
                  Full Name
                </Label>
                <Input
                  id="nama"
                  {...register("nama")}
                  className="h-auto py-3 bg-surface-container border-none rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-primary/40"
                />
                {errors.nama && (
                  <p className="text-xs text-red-500">{errors.nama.message}</p>
                )}
              </div>

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
                  {...register("email")}
                  className="h-auto py-3 bg-surface-container border-none rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-primary/40"
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant"
                >
                  New Password (leave blank to keep current)
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  {...register("password")}
                  className="h-auto py-3 bg-surface-container border-none rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-primary/40"
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant">
                  Role
                </Label>
                <Input
                  value={formatRole(user.role)}
                  disabled
                  className="h-auto py-3 bg-surface-container border-none rounded-lg text-sm text-on-surface-variant"
                />
                <p className="text-[11px] text-outline">
                  Roles can only be changed by a super admin.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    reset({
                      nama: user.nama,
                      email: user.email,
                      password: "",
                    })
                  }
                  disabled={!isDirty || updateMutation.isPending}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={!isDirty || updateMutation.isPending}
                  className="bg-primary text-white"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
