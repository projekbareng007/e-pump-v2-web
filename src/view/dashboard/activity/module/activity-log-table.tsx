"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { ChevronLeft, ChevronRight, Filter, Loader2 } from "lucide-react";
import { activityLogService } from "@/services/activity-log-service";
import { userService } from "@/services/user-service";
import { ActivityCategory } from "@/types";
import type { UserResponse } from "@/types";
import {
  categoryLabels,
  categoryStyles,
  describeActivity,
  formatTimestamp,
} from "./activity-constants";

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

export default function ActivityLogTable() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<CategoryFilter>(CATEGORY_ALL);

  const queryParams = useMemo(() => {
    const params: { category?: ActivityCategory; limit: number; offset: number } = {
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
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
    queryFn: async () => (await userService.getAllUsers()).data,
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
  const logs = logsQuery.data ?? [];

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
            logs.map((log) => {
              const user = userMap.get(log.user_id);
              const displayName = user?.nama ?? log.user_id;
              return (
                <TableRow
                  key={log.id}
                  className="border-surface-container-low hover:bg-surface-container-low/40 transition-colors"
                >
                  <TableCell className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-surface-container text-on-surface text-xs font-bold">
                          {getInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-on-surface">
                          {displayName}
                        </span>
                        {user?.email && (
                          <span className="text-xs text-outline">
                            {user.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${categoryStyles[log.category]}`}
                    >
                      {categoryLabels[log.category]}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 py-5 text-sm text-on-surface-variant">
                    {describeActivity(log.category, log.data)}
                  </TableCell>
                  <TableCell className="px-8 py-5 text-xs text-on-surface-variant whitespace-nowrap">
                    {formatTimestamp(log.created_at)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="px-8 py-4 bg-surface-container-low/30 border-t border-surface-container flex justify-between items-center">
        <span className="text-xs text-on-surface-variant font-medium">
          Showing {from} to {to} of {total} results
        </span>
        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            size="icon"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <span className="text-xs font-bold text-on-surface px-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-lg"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
