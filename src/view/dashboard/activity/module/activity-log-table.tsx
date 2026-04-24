"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Loader2 } from "lucide-react";
import { activityLogService } from "@/services/activity-log-service";
import { userService } from "@/services/user-service";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";
import { ActivityCategory, Role } from "@/types";
import type { UserResponse } from "@/types";
import PaginationBar from "@/components/ui/pagination-bar";
import {
  categoryLabels,
  categoryStyles,
  formatTimestamp,
} from "./activity-constants";
import ActivityDescription from "./activity-description";

const PAGE_SIZE = 10;
const CATEGORY_ALL = "all" as const;

type CategoryFilter = ActivityCategory | typeof CATEGORY_ALL;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function UserCell({
  userId,
  userMap,
  meId,
  meRole,
}: {
  userId: string;
  userMap: Map<string, UserResponse>;
  meId: string | null;
  meRole: string | null;
}) {
  const cached = userMap.get(userId);

  // fetch only when not in userMap
  const { data: fetched } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => (await userService.getUser(userId)).data,
    enabled: !cached,
    staleTime: 5 * 60 * 1000,
  });

  const user = cached ?? fetched;
  const isMe = userId === meId;
  const isSuperuser = (user?.role ?? meRole) === Role.SUPERUSER;
  const displayName = user?.nama ?? (isMe ? "Me" : userId);

  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-8">
        <AvatarFallback className="bg-surface-container text-on-surface text-xs font-bold">
          {getInitials(displayName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-on-surface">
            {displayName}
          </span>
          {isMe && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-primary/15 text-primary">
              Me
            </span>
          )}
          {isSuperuser && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-tertiary-container text-white">
              Superadmin
            </span>
          )}
        </div>
        {user?.email && (
          <span className="text-xs text-outline">{user.email}</span>
        )}
        {!user && !isMe && (
          <span className="font-mono text-[10px] text-outline">{userId}</span>
        )}
      </div>
    </div>
  );
}

export default function ActivityLogTable() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<CategoryFilter>(CATEGORY_ALL);

  const storeUser = useAuthStore((s) => s.user);

  // fallback: fetch /auth/me if store is empty
  const meQuery = useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => (await authService.getMe()).data,
    enabled: !storeUser,
    staleTime: 10 * 60 * 1000,
  });

  const me = storeUser ?? meQuery.data ?? null;

  const queryParams = useMemo(() => {
    const params: { category?: ActivityCategory; page: number; page_size: number } = {
      page,
      page_size: PAGE_SIZE,
    };
    if (category !== CATEGORY_ALL) params.category = category;
    return params;
  }, [category, page]);

  const countParams = useMemo(
    () => (category !== CATEGORY_ALL ? { category } : {}),
    [category],
  );

  const logsQuery = useQuery({
    queryKey: ["activity-logs", queryParams],
    queryFn: async () => (await activityLogService.list(queryParams)).data,
  });

  const countQuery = useQuery({
    queryKey: ["activity-logs-count", countParams],
    queryFn: async () => (await activityLogService.count(countParams)).data.count,
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await userService.getAllUsers({ page_size: 100 })).data.items,
  });

  const userMap = useMemo(() => {
    const map = new Map<string, UserResponse>();
    usersQuery.data?.forEach((u) => map.set(u.id, u));
    return map;
  }, [usersQuery.data]);

  const total = countQuery.data ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const logs = logsQuery.data?.items ?? [];

  const handleCategoryChange = (value: unknown) => {
    if (typeof value !== "string") return;
    setCategory(value as CategoryFilter);
    setPage(1);
  };

  return (
    <Card className="bg-surface-container-lowest border-none rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
      <div className="px-8 py-6 border-b border-surface-container flex justify-between items-center bg-surface-container-low/30">
        <h3 className="text-xl font-bold font-heading text-on-surface">
          Recent Activity Logs
        </h3>
        <div className="flex items-center gap-3 text-sm text-on-surface-variant">
          <Filter className="size-4" />
          <span className="font-bold">Category</span>
          <Select
            value={category as unknown as string}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-40 h-9 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CATEGORY_ALL}>All</SelectItem>
              {Object.values(ActivityCategory).map((c) => (
                <SelectItem key={c} value={c}>
                  {categoryLabels[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-surface-container-low/50 border-none hover:bg-surface-container-low/50">
            <TableHead className="px-8 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
              User
            </TableHead>
            <TableHead className="px-8 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
              Category
            </TableHead>
            <TableHead className="px-8 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
              Description
            </TableHead>
            <TableHead className="px-8 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
              Timestamp
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logsQuery.isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="px-8 py-10 text-center">
                <Loader2 className="size-5 animate-spin inline-block text-outline" />
              </TableCell>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="px-8 py-10 text-center text-sm text-on-surface-variant"
              >
                No activity logs found.
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow
                key={log.id}
                className="border-surface-container-low hover:bg-surface-container-low/40 transition-colors"
              >
                <TableCell className="px-8 py-5">
                  <UserCell
                    userId={log.user_id}
                    userMap={userMap}
                    meId={me?.id ?? null}
                    meRole={me?.role ?? null}
                  />
                </TableCell>
                <TableCell className="px-8 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${categoryStyles[log.category]}`}
                  >
                    {categoryLabels[log.category]}
                  </span>
                </TableCell>
                <TableCell className="px-8 py-5 whitespace-normal break-words max-w-xs">
                  <ActivityDescription
                    category={log.category}
                    data={log.data}
                    userMap={userMap}
                  />
                </TableCell>
                <TableCell className="px-8 py-5 text-xs text-on-surface-variant whitespace-nowrap">
                  {formatTimestamp(log.created_at)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PaginationBar
        page={page}
        totalPages={totalPages}
        from={from}
        to={to}
        total={total}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </Card>
  );
}
