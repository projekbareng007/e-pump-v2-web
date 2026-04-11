"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { getRoleStyle, getInitials, formatDate, formatRoleLabel } from "./user-utils";
import type { UserResponse } from "@/types";

interface UserTableProps {
  users: UserResponse[];
  onEdit: (user: UserResponse) => void;
  onDelete: (user: UserResponse) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-surface-container-low/50 border-none hover:bg-surface-container-low/50">
          <TableHead className="px-8 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            User Profile
          </TableHead>
          <TableHead className="px-6 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Email Address
          </TableHead>
          <TableHead className="px-6 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Role
          </TableHead>
          <TableHead className="px-6 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Joined
          </TableHead>
          <TableHead className="px-8 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="px-8 py-12 text-center text-on-surface-variant"
            >
              No users found.
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => {
            const isSuperuser = user.role === "superuser";
            return (
              <TableRow
                key={user.id}
                className="border-outline-variant/10 hover:bg-surface-container-low/20 group"
              >
                <TableCell className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-12 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                      <AvatarFallback className="bg-surface-container-high text-on-surface-variant font-bold">
                        {getInitials(user.nama)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-on-surface font-heading">
                        {user.nama}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        Joined {formatDate(user.created_at)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5 text-sm text-on-surface-variant font-body">
                  {user.email}
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Badge
                    variant="outline"
                    className={`border-none px-3 py-1 rounded-full text-xs font-bold ${getRoleStyle(user.role)}`}
                  >
                    {formatRoleLabel(user.role)}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-5 text-sm text-on-surface-variant">
                  {formatDate(user.created_at)}
                </TableCell>
                <TableCell className="px-8 py-5 text-right">
                  {!isSuperuser && (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-tertiary-container/10 text-tertiary hover:bg-tertiary-container hover:text-white transition-all shadow-sm"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
