"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Droplets, Pencil, QrCode, Trash2 } from "lucide-react";
import { getStyle, formatLastSeen, isUrgent } from "./device-utils";
import type { DeviceResponse } from "@/types";

interface DeviceCardProps {
  device: DeviceResponse;
  onEdit: () => void;
  onDelete: () => void;
  onShowQr: () => void;
}

export default function DeviceCard({ device, onEdit, onDelete, onShowQr }: DeviceCardProps) {
  const style = getStyle(device.status_pompa);
  const lastSeen = formatLastSeen(device.last_seen);
  const urgent = isUrgent(device.last_seen);

  return (
    <Card
      className={`bg-surface-container-lowest border-none rounded-2xl shadow-sm border-b-4 ${style.border} hover:shadow-md transition-all flex flex-col h-full group`}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Droplets className="size-7" />
          </div>
          <div
            className={`flex items-center gap-2 ${style.bg} px-3 py-1 rounded-full`}
            style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)" }}
          >
            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
            <span className={`text-[10px] font-bold ${style.text} uppercase`}>
              {style.label}
            </span>
          </div>
        </div>
        <h3 className="font-heading font-bold text-xl mb-1 group-hover:text-primary transition-colors">
          {device.device_id}
        </h3>
        <p className="text-on-surface-variant text-sm font-body mb-1">
          Owner:{" "}
          <span className="text-on-surface">
            {device.owner_id ? `${device.owner_id.slice(0, 8)}...` : "Unclaimed"}
          </span>
        </p>
        <div className="mt-auto pt-6 border-t border-surface-container-low flex items-center justify-between">
          <div className="text-[10px] text-outline font-medium uppercase tracking-tighter">
            Last seen:{" "}
            <span className={urgent ? "text-destructive font-bold" : "text-on-surface"}>
              {lastSeen}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onShowQr}
              title="Generate QR Code"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <QrCode className="size-4" />
            </button>
            <button
              onClick={onEdit}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ffdbcb] text-tertiary hover:bg-tertiary-container hover:text-white transition-colors"
            >
              <Pencil className="size-4" />
            </button>
            <button
              onClick={onDelete}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
