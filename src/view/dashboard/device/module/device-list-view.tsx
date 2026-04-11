"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Droplets, Pencil, Trash2 } from "lucide-react";
import { getStyle, formatLastSeen, isUrgent } from "./device-utils";
import type { DeviceResponse } from "@/types";

interface DeviceListViewProps {
  devices: DeviceResponse[];
  onEdit: (d: DeviceResponse) => void;
  onDelete: (id: string) => void;
}

export default function DeviceListView({ devices, onEdit, onDelete }: DeviceListViewProps) {
  return (
    <Card className="bg-surface-container-lowest border-none rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-container-low/50 border-none hover:bg-surface-container-low/50">
            <TableHead className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
              Device ID
            </TableHead>
            <TableHead className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
              Owner
            </TableHead>
            <TableHead className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
              Pump Status
            </TableHead>
            <TableHead className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
              Last Seen
            </TableHead>
            <TableHead className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                No devices found.
              </TableCell>
            </TableRow>
          ) : (
            devices.map((device) => {
              const style = getStyle(device.status_pompa);
              const lastSeen = formatLastSeen(device.last_seen);
              const urgent = isUrgent(device.last_seen);
              return (
                <TableRow
                  key={device.device_id}
                  className="border-outline-variant/10 hover:bg-surface-container-low/20 group"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Droplets className="size-5" />
                      </div>
                      <span className="font-heading font-bold text-on-surface group-hover:text-primary transition-colors">
                        {device.device_id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-on-surface-variant">
                    {device.owner_id ? `${device.owner_id.slice(0, 8)}...` : "Unclaimed"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div
                      className={`inline-flex items-center gap-2 ${style.bg} px-3 py-1 rounded-full`}
                      style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)" }}
                    >
                      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <span className={`text-[10px] font-bold ${style.text} uppercase`}>
                        {style.label}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`text-xs ${urgent ? "text-destructive font-bold" : "text-on-surface-variant"}`}
                    >
                      {lastSeen}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(device)}
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-[#ffdbcb] text-tertiary hover:bg-tertiary-container hover:text-white transition-colors"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(device.device_id)}
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
