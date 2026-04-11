"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Calendar, TrendingUp } from "lucide-react"
import ActivityTrendChart from "./module/activity-trend-chart"
import ActivityLogTable from "./module/activity-log-table"

export default function UserActivityView() {
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
      <ActivityTrendChart />

      {/* Activity Log Table */}
      <ActivityLogTable />
    </div>
  )
}
