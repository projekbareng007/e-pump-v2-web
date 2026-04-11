"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, ShieldCheck } from "lucide-react";

import { useUsers } from "@/hooks/use-users";
import UserTable from "./module/user-table";
import UserFormDialog from "./module/user-form-dialog";
import UserDeleteDialog from "./module/user-delete-dialog";
import type { UserResponse } from "@/types";

type RoleFilter = "all" | "superuser" | "admin" | "user";

export default function UserManagementView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserResponse | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserResponse | null>(null);

  const { data: users, isLoading } = useUsers();

  const filtered = useMemo(() => {
    if (!users) return [];
    let result = users;

    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.nama.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q),
      );
    }

    return result;
  }, [users, roleFilter, searchQuery]);

  const totalCount = users?.length ?? 0;
  const adminCount = users?.filter((u) => u.role === "admin").length ?? 0;

  const handleEdit = (user: UserResponse) => {
    setEditUser(user);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditUser(null);
    setFormOpen(true);
  };

  return (
    <div className="px-8 py-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-heading font-extrabold text-primary tracking-tight">
            User Management
          </h2>
          <p className="text-on-surface-variant mt-2 font-body text-lg">
            Manage access levels and monitor operator permissions for the
            HydroStream IoT ecosystem.
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-primary-container hover:bg-primary text-white px-6 py-3 h-auto rounded-xl font-bold shadow-lg shadow-primary/20"
        >
          <Plus className="size-5" />
          Add New User
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-surface-container-lowest border-none rounded-2xl shadow-sm border border-outline-variant/10">
          <CardContent className="p-6">
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              Total Users
            </span>
            <div className="text-3xl font-bold font-heading text-primary mt-2">
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                totalCount.toLocaleString()
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-none rounded-2xl shadow-sm border border-outline-variant/10">
          <CardContent className="p-6">
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              Admins
            </span>
            <div className="text-3xl font-bold font-heading text-secondary mt-2">
              {isLoading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                adminCount
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 bg-gradient-to-br from-primary to-primary-container border-none rounded-2xl shadow-xl overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between text-white">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest opacity-80">
                Security Status
              </span>
              <div className="text-xl font-bold font-heading mt-1">
                Multi-Factor Auth Active
              </div>
              <p className="text-sm opacity-90 mt-1">
                {isLoading
                  ? "Loading..."
                  : `${totalCount} registered user${totalCount !== 1 ? "s" : ""} in system.`}
              </p>
            </div>
            <ShieldCheck className="size-12 opacity-30" />
          </CardContent>
        </Card>
      </div>

      {/* Table Container */}
      <Card className="bg-surface-container-lowest border-none rounded-3xl shadow-xl shadow-surface-dim/50 overflow-hidden border border-outline-variant/10">
        {/* Filter Bar */}
        <div className="p-6 flex flex-col lg:flex-row gap-4 items-center justify-between bg-surface-container-low/30 border-b border-outline-variant/10">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
            <Input
              placeholder="Filter by name, email or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 h-auto rounded-2xl bg-white border border-outline-variant/30 focus-visible:ring-4 focus-visible:ring-primary/10"
            />
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Select
              value={roleFilter}
              onValueChange={(v) => setRoleFilter((v ?? "all") as RoleFilter)}
            >
              <SelectTrigger className="bg-white border border-outline-variant/30 rounded-xl px-4 py-3 h-auto flex-1 lg:flex-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="superuser">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-on-surface-variant font-medium whitespace-nowrap">
              Showing{" "}
              <span className="font-bold text-primary">{filtered.length}</span>{" "}
              of {totalCount}
            </div>
          </div>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <UserTable
            users={filtered}
            onEdit={handleEdit}
            onDelete={(user) => setDeleteUser(user)}
          />
        )}
      </Card>

      {/* Dialogs */}
      <UserFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditUser(null);
        }}
        user={editUser}
      />
      <UserDeleteDialog
        open={!!deleteUser}
        onOpenChange={(open) => {
          if (!open) setDeleteUser(null);
        }}
        user={deleteUser}
      />
    </div>
  );
}
