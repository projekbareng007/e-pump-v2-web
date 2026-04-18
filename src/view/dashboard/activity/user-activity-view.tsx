"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Cpu, Settings, ToggleRight } from "lucide-react";
import { activityLogService } from "@/services/activity-log-service";
import { ActivityCategory } from "@/types";
import ActivityTrendChart from "./module/activity-trend-chart";
import ActivityLogTable from "./module/activity-log-table";

function useCount(category?: ActivityCategory) {
  return useQuery({
    queryKey: ["activity-logs-count", category ? { category } : {}],
    queryFn: async () =>
      (await activityLogService.count(category ? { category } : {})).data.count,
  });
}

export default function UserActivityView() {
  const total = useCount();
  const device = useCount(ActivityCategory.DEVICE);
  const control = useCount(ActivityCategory.CONTROL);
  const administrative = useCount(ActivityCategory.ADMINISTRATIVE);

  const stats = [
    {
      label: "Total Activities",
      value: total.data,
      icon: Activity,
      bg: "bg-primary-container",
      fg: "text-on-primary-container",
      accent: "text-white",
    },
    {
      label: "Device",
      value: device.data,
      icon: Cpu,
      bg: "bg-secondary",
      fg: "text-secondary-container",
      accent: "text-white",
    },
    {
      label: "Control",
      value: control.data,
      icon: ToggleRight,
      bg: "bg-tertiary-container",
      fg: "text-[#ffdbcb]",
      accent: "text-white",
    },
    {
      label: "Administrative",
      value: administrative.data,
      icon: Settings,
      bg: "bg-surface-container",
      fg: "text-on-surface-variant",
      accent: "text-on-surface",
    },
  ];

  return (
    <div className="px-8 py-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <span className="text-xs font-bold text-primary-container tracking-widest uppercase mb-2 block">
            System Logs
          </span>
          <h2 className="text-4xl font-extrabold font-heading text-on-surface tracking-tight">
            User Activity
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Audit trail of device, control, and administrative actions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-10">
        {stats.map(({ label, value, icon: Icon, bg, fg, accent }) => (
          <Card
            key={label}
            className={`col-span-12 md:col-span-3 ${bg} border-none rounded-2xl h-40`}
          >
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <p
                  className={`${fg} text-xs font-bold uppercase tracking-wider`}
                >
                  {label}
                </p>
                <Icon className={`size-5 ${fg}`} />
              </div>
              <h3
                className={`${accent} text-4xl font-extrabold font-heading tracking-tighter`}
              >
                {value ?? "—"}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <ActivityTrendChart />

      <ActivityLogTable />
    </div>
  );
}
