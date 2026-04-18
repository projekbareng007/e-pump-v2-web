"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Cpu,
  Radio,
  CircleAlert,
  TrendingUp,
  Cog,
  ToggleRight,
} from "lucide-react";

import { dashboardService } from "@/services/dashboard-service";
import { adminService } from "@/services/admin-service";
import { activityLogService } from "@/services/activity-log-service";
import { userService } from "@/services/user-service";
import {
  ActivityCategory,
  DeviceFilter,
  UserFilter,
  type UserResponse,
} from "@/types";
import StatusChip from "./module/status-chip";

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function activityTitle(category: ActivityCategory) {
  switch (category) {
    case ActivityCategory.DEVICE:
      return "Device Activity";
    case ActivityCategory.CONTROL:
      return "Pump Control";
    case ActivityCategory.ADMINISTRATIVE:
      return "Administrative Action";
  }
}

function activityIcon(category: ActivityCategory) {
  switch (category) {
    case ActivityCategory.DEVICE:
      return {
        bg: "bg-primary-container text-on-primary-container",
        Icon: Cpu,
      };
    case ActivityCategory.CONTROL:
      return {
        bg: "bg-tertiary-container text-on-tertiary-container",
        Icon: ToggleRight,
      };
    case ActivityCategory.ADMINISTRATIVE:
      return {
        bg: "bg-secondary-container text-on-secondary-container",
        Icon: Cog,
      };
  }
}

function describeActivity(data: Record<string, unknown>): string {
  if (!data || Object.keys(data).length === 0) return "—";
  return Object.entries(data)
    .filter(([, v]) => v !== null && v !== undefined)
    .slice(0, 3)
    .map(
      ([k, v]) =>
        `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`,
    )
    .join(" • ");
}

export default function DashboardView() {
  const totalUsers = useQuery({
    queryKey: ["dashboard", "users-count", UserFilter.INCLUDE_ADMIN],
    queryFn: async () =>
      (await dashboardService.usersCount(UserFilter.INCLUDE_ADMIN)).data.count,
  });

  const adminUsers = useQuery({
    queryKey: ["dashboard", "users-count", UserFilter.ONLY_ADMIN],
    queryFn: async () =>
      (await dashboardService.usersCount(UserFilter.ONLY_ADMIN)).data.count,
  });

  const totalDevices = useQuery({
    queryKey: ["dashboard", "devices-count", DeviceFilter.ALL],
    queryFn: async () =>
      (await dashboardService.devicesCount(DeviceFilter.ALL)).data.count,
  });

  const unclaimed = useQuery({
    queryKey: ["dashboard", "devices-count", DeviceFilter.UNCLAIMED],
    queryFn: async () =>
      (await dashboardService.devicesCount(DeviceFilter.UNCLAIMED)).data.count,
  });

  const devicesQuery = useQuery({
    queryKey: ["devices", "all"],
    queryFn: async () => (await adminService.getAllDevices()).data,
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await userService.getAllUsers()).data,
  });

  const recentActivities = useQuery({
    queryKey: ["activity-logs", "recent"],
    queryFn: async () =>
      (await activityLogService.list({ limit: 6, offset: 0 })).data,
  });

  const activePumps = useMemo(
    () => devicesQuery.data?.filter((d) => d.status_pompa).length ?? 0,
    [devicesQuery.data],
  );

  const recentDevices = useMemo(
    () => (devicesQuery.data ?? []).slice(0, 5),
    [devicesQuery.data],
  );

  const userMap = useMemo(() => {
    const m = new Map<string, UserResponse>();
    usersQuery.data?.forEach((u) => m.set(u.id, u));
    return m;
  }, [usersQuery.data]);

  const statCards = [
    {
      label: "Total Users",
      value: totalUsers.data,
      subtitle:
        adminUsers.data != null
          ? `${adminUsers.data} admin${adminUsers.data === 1 ? "" : "s"}`
          : "Loading...",
      subtitleColor: "text-on-surface-variant",
      icon: <Users className="size-6" />,
      iconBg: "bg-[#d6e3ff] text-primary",
      isLoading: totalUsers.isLoading,
    },
    {
      label: "Total Devices",
      value: totalDevices.data,
      subtitle:
        unclaimed.data != null
          ? `${unclaimed.data} unclaimed`
          : "Loading...",
      subtitleColor: "text-on-surface-variant",
      icon: <Cpu className="size-6" />,
      iconBg: "bg-secondary-container text-secondary",
      isLoading: totalDevices.isLoading,
    },
    {
      label: "Active Pumps",
      value: devicesQuery.data ? activePumps : undefined,
      subtitle:
        devicesQuery.data && devicesQuery.data.length > 0
          ? `${Math.round(
              (activePumps / devicesQuery.data.length) * 100,
            )}% of fleet`
          : "No devices yet",
      subtitleColor: "text-on-surface-variant",
      icon: <Radio className="size-6" />,
      iconBg:
        "bg-secondary-container text-secondary shadow-[inset_0_0_8px_rgba(0,128,128,0.2)]",
      live: true,
      isLoading: devicesQuery.isLoading,
    },
    {
      label: "Inactive Pumps",
      value:
        devicesQuery.data != null
          ? devicesQuery.data.length - activePumps
          : undefined,
      subtitle: "Pumps currently off",
      subtitleColor: "text-tertiary",
      icon: <CircleAlert className="size-6" />,
      iconBg: "bg-[#ffdbcb] text-tertiary",
      borderAccent: true,
      isLoading: devicesQuery.isLoading,
    },
  ];

  return (
    <div className="px-8 py-8 pb-12">
      {/* Page Header */}
      <div className="mb-10">
        <h2 className="text-[3.5rem] font-heading font-extrabold text-primary leading-tight tracking-tight mb-2">
          Dashboard
        </h2>
        <p className="text-on-surface-variant font-body text-sm">
          System health and real-time operational overview.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card) => (
          <Card
            key={card.label}
            className={`bg-surface-container-lowest border-none shadow-[0_32px_64px_-12px_rgba(25,28,30,0.06)] rounded-xl ${
              card.borderAccent ? "border-l-4 border-l-tertiary" : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-outline">
                  {card.label}
                </span>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${card.iconBg}`}
                >
                  {card.icon}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div
                  className={`text-3xl font-bold ${
                    card.borderAccent ? "text-tertiary" : "text-on-surface"
                  }`}
                >
                  {card.isLoading || card.value == null ? (
                    <Skeleton className="h-9 w-20" />
                  ) : (
                    card.value.toLocaleString()
                  )}
                </div>
                {card.live && (
                  <div className="flex items-center mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-secondary mr-1 animate-pulse" />
                    <span className="text-xs text-secondary font-bold">
                      LIVE
                    </span>
                  </div>
                )}
              </div>
              <div
                className={`mt-2 flex items-center text-sm font-medium ${card.subtitleColor}`}
              >
                {card.label === "Total Users" && (
                  <TrendingUp className="size-4 mr-1" />
                )}
                {card.subtitle}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bento Layout: Table + Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Devices Table */}
        <Card className="lg:col-span-2 bg-surface-container-lowest border-none shadow-[0_32px_64px_-12px_rgba(25,28,30,0.06)] rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-surface-container">
            <CardTitle className="font-heading text-xl font-bold text-on-surface">
              Recent Devices
            </CardTitle>
            <Link
              href="/dashboard/device-management"
              className="text-primary text-sm font-bold hover:underline"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body">
                <thead>
                  <tr className="bg-surface-container-low text-outline text-xs uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Device ID</th>
                    <th className="px-6 py-4">Owner</th>
                    <th className="px-6 py-4">Last Seen</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {devicesQuery.isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-5" colSpan={4}>
                          <Skeleton className="h-5 w-full" />
                        </td>
                      </tr>
                    ))
                  ) : recentDevices.length === 0 ? (
                    <tr>
                      <td
                        className="px-6 py-10 text-center text-sm text-on-surface-variant"
                        colSpan={4}
                      >
                        No devices registered yet.
                      </td>
                    </tr>
                  ) : (
                    recentDevices.map((device) => {
                      const owner = device.owner_id
                        ? (userMap.get(device.owner_id)?.nama ??
                          device.owner_id)
                        : "Unclaimed";
                      return (
                        <tr
                          key={device.device_id}
                          className="hover:bg-surface-container-low transition-colors"
                        >
                          <td className="px-6 py-5 font-medium text-primary">
                            {device.device_id}
                          </td>
                          <td className="px-6 py-5 text-on-surface-variant">
                            {owner}
                          </td>
                          <td className="px-6 py-5 text-on-surface-variant">
                            {device.last_seen
                              ? formatRelative(device.last_seen)
                              : "—"}
                          </td>
                          <td className="px-6 py-5">
                            <StatusChip
                              status={device.status_pompa ? "Active" : "Offline"}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities Feed */}
        <Card className="bg-surface-container-lowest border-none shadow-[0_32px_64px_-12px_rgba(25,28,30,0.06)] rounded-xl flex flex-col">
          <CardHeader className="p-6 border-b border-surface-container">
            <CardTitle className="font-heading text-xl font-bold text-on-surface">
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6 flex-1">
            {recentActivities.isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))
            ) : (recentActivities.data?.length ?? 0) === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-6">
                No recent activity.
              </p>
            ) : (
              recentActivities.data!.map((log) => {
                const { bg, Icon } = activityIcon(log.category);
                const userName =
                  userMap.get(log.user_id)?.nama ?? "Unknown user";
                return (
                  <div key={log.id} className="flex gap-4">
                    <div
                      className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${bg}`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-on-surface">
                        {activityTitle(log.category)}
                      </p>
                      <p className="text-xs text-on-surface-variant truncate">
                        <span className="font-semibold">{userName}</span>
                        {" — "}
                        {describeActivity(log.data)}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-outline mt-1">
                        {formatRelative(log.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
          <div className="p-4 bg-surface-container-low rounded-b-xl">
            <Link
              href="/dashboard/user-activity"
              className="flex items-center justify-center w-full h-10 rounded-md bg-surface-container-highest text-on-surface hover:bg-surface-container-high text-sm font-bold"
            >
              View Log History
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
