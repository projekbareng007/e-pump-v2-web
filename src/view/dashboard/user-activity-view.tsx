"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Download,
  Calendar,
  TrendingUp,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

type ActionType = "Login" | "Create" | "Update" | "Delete"

interface ActivityLog {
  user: string
  avatar?: string
  initials: string
  action: ActionType
  module: string
  description: string
  ip: string
  timestamp: string
}

const actionStyles: Record<ActionType, string> = {
  Login: "bg-primary/10 text-primary",
  Create: "bg-secondary-container text-on-secondary-container",
  Update: "bg-tertiary-container text-white",
  Delete: "bg-destructive/10 text-destructive",
}

const activityLogs: ActivityLog[] = [
  {
    user: "Elena Rodriguez",
    avatar: "/avatars/elena.jpg",
    initials: "ER",
    action: "Login",
    module: "Authentication",
    description: "Successful authentication via OAuth2",
    ip: "192.168.1.104",
    timestamp: "Oct 19, 14:24:02",
  },
  {
    user: "Sarah Chen",
    avatar: "/avatars/sarah.jpg",
    initials: "SC",
    action: "Create",
    module: "Device Profile",
    description: "Registered new IoT Flow Sensor #B-12",
    ip: "192.168.1.112",
    timestamp: "Oct 19, 13:58:15",
  },
  {
    user: "Marcus Sterling",
    avatar: "/avatars/marcus.jpg",
    initials: "MS",
    action: "Update",
    module: "Valve Control",
    description: "Modified pressure threshold to 45 PSI",
    ip: "192.168.1.005",
    timestamp: "Oct 19, 13:42:09",
  },
  {
    user: "James Hunter",
    initials: "JH",
    action: "Delete",
    module: "System Policy",
    description: "Removed legacy 'Guest Access' policy",
    ip: "192.168.1.201",
    timestamp: "Oct 19, 12:15:33",
  },
]

const timeLabels = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"]
const chartHeights = [64, 32, 80, 160, 96, 192]

export default function UserActivityView() {
  const [activeRange, setActiveRange] = useState<"hourly" | "daily" | "weekly">("daily")

  return (
    <div className="px-8 py-8 pb-12">
      {/* Header & Action Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <span className="text-xs font-bold text-primary-container tracking-widest uppercase mb-2 block">
            System Logs
          </span>
          <h2 className="text-4xl font-extrabold font-heading text-on-surface tracking-tight">
            User Activity
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-surface-container-lowest px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm border border-outline-variant/10">
            <Calendar className="size-4 text-outline" />
            <span className="text-sm font-medium text-on-surface-variant">
              Oct 12, 2023 - Oct 19, 2023
            </span>
          </div>
          <Button className="bg-primary-container text-white px-5 py-2.5 h-auto rounded-xl font-bold shadow-lg hover:opacity-90">
            <Download className="size-5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Bento Grid Summary */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        {/* Activities Today */}
        <Card className="col-span-12 md:col-span-4 bg-primary-container border-none rounded-2xl relative overflow-hidden h-48 group">
          <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
            <div>
              <p className="text-on-primary-container text-sm font-bold uppercase tracking-wider mb-1">
                Activities Today
              </p>
              <h3 className="text-white text-5xl font-extrabold font-heading tracking-tighter">
                1,284
              </h3>
            </div>
            <div className="flex items-center text-on-primary-container text-sm">
              <TrendingUp className="size-4 mr-1" />
              <span>12% from yesterday</span>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
          </CardContent>
        </Card>

        {/* Most Active User */}
        <Card className="col-span-12 md:col-span-4 bg-secondary border-none rounded-2xl shadow-lg shadow-secondary/10 h-48">
          <CardContent className="p-6 flex items-center justify-between h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="text-secondary-container text-sm font-bold uppercase tracking-wider mb-1">
                  Most Active User
                </p>
                <h3 className="text-white text-2xl font-bold font-heading">
                  Marcus Sterling
                </h3>
                <p className="text-secondary-container text-xs mt-1">
                  428 actions today
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary-container rounded-full animate-pulse shadow-[0_0_8px_rgba(144,239,239,0.8)]" />
                <span className="text-secondary-container text-xs font-bold">
                  Currently Online
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-secondary-container/30 rotate-3">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage
                    src="/avatars/marcus.jpg"
                    alt="Marcus Sterling"
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-none bg-secondary-container/50 text-white text-xl font-bold">
                    MS
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most Used Module */}
        <Card className="col-span-12 md:col-span-4 bg-tertiary-container border border-tertiary/20 rounded-2xl h-48 overflow-hidden">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div>
              <p className="text-[#ffdbcb] text-sm font-bold uppercase tracking-wider mb-1">
                Most Used Module
              </p>
              <h3 className="text-white text-3xl font-bold font-heading">
                Valve Control
              </h3>
            </div>
            <div className="flex items-end gap-1.5">
              <div className="w-2 bg-white/20 h-4 rounded-full" />
              <div className="w-2 bg-white/40 h-6 rounded-full" />
              <div className="w-2 bg-white/60 h-9 rounded-full" />
              <div className="w-2 bg-white h-14 rounded-full" />
              <div className="w-2 bg-white/40 h-5 rounded-full ml-2" />
              <span className="text-white text-xs font-bold mb-0.5 ml-3 italic">
                Critical Node Path
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Trend Chart */}
      <Card className="bg-surface-container-lowest border-none rounded-3xl shadow-sm border border-outline-variant/10 mb-10">
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold font-heading text-on-surface">
                Activity Trends
              </h3>
              <p className="text-sm text-on-surface-variant">
                Hourly aggregate of system-wide user interactions
              </p>
            </div>
            <div className="flex gap-2">
              {(["hourly", "daily", "weekly"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveRange(range)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${
                    activeRange === range
                      ? "bg-primary text-white"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Visualization */}
          <div className="h-64 flex items-end justify-between px-4 relative">
            {/* Grid Lines */}
            <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-5">
              <div className="border-t border-on-surface w-full" />
              <div className="border-t border-on-surface w-full" />
              <div className="border-t border-on-surface w-full" />
              <div className="border-t border-on-surface w-full" />
            </div>

            {/* SVG Chart Line */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 1000 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#003d7c" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 80 Q 125 70, 250 90 T 500 40 T 750 60 T 1000 20"
                  fill="none"
                  stroke="#003d7c"
                  strokeWidth="4"
                />
                <path
                  d="M0 80 Q 125 70, 250 90 T 500 40 T 750 60 T 1000 20 L 1000 100 L 0 100 Z"
                  fill="url(#chartGradient)"
                  opacity="0.1"
                />
              </svg>
            </div>

            {/* Data Points */}
            {chartHeights.map((h, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-primary rounded-full ring-4 ring-primary/20 z-10"
                style={{ marginBottom: `${h}px` }}
              />
            ))}
          </div>
          <div className="flex justify-between px-4 mt-6 text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
            {timeLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Log Table */}
      <Card className="bg-surface-container-lowest border-none rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
        <div className="px-8 py-6 border-b border-surface-container flex justify-between items-center bg-surface-container-low/30">
          <h3 className="text-xl font-bold font-heading text-on-surface">
            Recent Activity Logs
          </h3>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Filter className="size-4" />
            <span className="font-bold">Filters Applied</span>
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs font-bold uppercase">
              All Actions
            </span>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-surface-container-low/50 border-none hover:bg-surface-container-low/50">
              <TableHead className="px-8 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
                User
              </TableHead>
              <TableHead className="px-8 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
                Action
              </TableHead>
              <TableHead className="px-8 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
                Module
              </TableHead>
              <TableHead className="px-8 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
                Description
              </TableHead>
              <TableHead className="px-8 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
                IP Address
              </TableHead>
              <TableHead className="px-8 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
                Timestamp
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityLogs.map((log) => (
              <TableRow
                key={`${log.user}-${log.timestamp}`}
                className="border-surface-container-low hover:bg-surface-container-low/40 transition-colors"
              >
                <TableCell className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarImage src={log.avatar} alt={log.user} />
                      <AvatarFallback className="bg-surface-container text-on-surface text-xs font-bold">
                        {log.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold text-on-surface">
                      {log.user}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${actionStyles[log.action]}`}
                  >
                    {log.action}
                  </span>
                </TableCell>
                <TableCell className="px-8 py-5 text-sm text-on-surface-variant font-medium">
                  {log.module}
                </TableCell>
                <TableCell className="px-8 py-5 text-sm text-on-surface-variant">
                  {log.description}
                </TableCell>
                <TableCell className="px-8 py-5 text-xs font-mono text-outline">
                  {log.ip}
                </TableCell>
                <TableCell className="px-8 py-5 text-xs text-on-surface-variant">
                  {log.timestamp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="px-8 py-4 bg-surface-container-low/30 border-t border-surface-container flex justify-between items-center">
          <span className="text-xs text-on-surface-variant font-medium">
            Showing 1 to 4 of 1,284 results
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              disabled
              className="rounded-lg"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold">
              1
            </Button>
            <Button
              variant="ghost"
              className="w-8 h-8 rounded-lg text-on-surface text-xs font-bold"
            >
              2
            </Button>
            <Button
              variant="ghost"
              className="w-8 h-8 rounded-lg text-on-surface text-xs font-bold"
            >
              3
            </Button>
            <Button variant="ghost" size="icon" className="rounded-lg">
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
