"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { activityLogs, actionStyles } from "./activity-constants";

export default function ActivityLogTable() {
  return (
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
          <Button variant="ghost" size="icon" disabled className="rounded-lg">
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
  );
}
