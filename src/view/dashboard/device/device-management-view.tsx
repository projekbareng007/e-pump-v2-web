"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, LayoutGrid, List, Router, ArrowRight } from "lucide-react";

import { useDevices } from "@/hooks/use-device";
import DeviceCard from "./module/device-card";
import DeviceListView from "./module/device-list-view";
import DeviceFormDialog from "./module/device-form-dialog";
import DeleteConfirmDialog from "./module/delete-confirm-dialog";
import FilterPill from "./module/filter-pill";
import type { DeviceResponse } from "@/types";

type PumpFilter = "all" | "on" | "off";

export default function DeviceManagementView() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [pumpFilter, setPumpFilter] = useState<PumpFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editDevice, setEditDevice] = useState<DeviceResponse | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: devices, isLoading } = useDevices();

  const filtered = useMemo(() => {
    if (!devices) return [];
    if (pumpFilter === "all") return devices;
    return devices.filter((d) =>
      pumpFilter === "on" ? d.status_pompa : !d.status_pompa,
    );
  }, [devices, pumpFilter]);

  const activeCount = devices?.filter((d) => d.status_pompa).length ?? 0;
  const totalCount = devices?.length ?? 0;

  const handleEdit = (device: DeviceResponse) => {
    setEditDevice(device);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditDevice(null);
    setFormOpen(true);
  };

  return (
    <div className="px-8 py-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-heading font-extrabold text-primary tracking-tight mb-2">
            Device Management
          </h2>
          <p className="text-on-surface-variant font-body">
            Monitor and configure your fluid control hardware ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-surface-container-high p-1 rounded-xl flex items-center">
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-1.5 rounded-lg flex items-center transition-all ${
                view === "grid"
                  ? "bg-surface-container-lowest shadow-sm text-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <LayoutGrid className="size-5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 rounded-lg flex items-center transition-all ${
                view === "list"
                  ? "bg-surface-container-lowest shadow-sm text-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <List className="size-5" />
            </button>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-primary-container text-white px-6 py-2.5 h-auto rounded-xl font-bold shadow-md hover:opacity-90"
          >
            <Plus className="size-5" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-low rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-6">
        <FilterPill
          label="Pump Status"
          value={pumpFilter}
          onValueChange={(v) => setPumpFilter(v as PumpFilter)}
        >
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="on">Active</SelectItem>
          <SelectItem value="off">Inactive</SelectItem>
        </FilterPill>
        <div className="ml-auto text-sm text-on-surface-variant font-medium">
          Showing{" "}
          <span className="text-primary font-bold">{filtered.length}</span> of{" "}
          {totalCount} devices
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="bg-surface-container-lowest border-none rounded-2xl shadow-sm"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="w-14 h-14 rounded-full" />
                  <Skeleton className="w-20 h-6 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((device) => (
            <DeviceCard
              key={device.device_id}
              device={device}
              onEdit={() => handleEdit(device)}
              onDelete={() => setDeleteId(device.device_id)}
            />
          ))}
          <div
            onClick={handleAdd}
            className="border-2 border-dashed border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full border-2 border-outline-variant flex items-center justify-center mb-4 group-hover:border-primary group-hover:text-primary transition-colors">
              <Plus className="size-6" />
            </div>
            <h4 className="font-heading font-bold text-lg mb-1">
              Provision Device
            </h4>
            <p className="text-xs font-body text-on-surface-variant px-4">
              Register a new controller or sensor to the network
            </p>
          </div>
        </div>
      ) : (
        <DeviceListView
          devices={filtered}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

      {/* Ecosystem Health + Network Map */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-primary p-8 rounded-[2rem] text-white flex flex-col justify-between relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10">
            <h4 className="font-heading text-3xl font-bold mb-4">
              Ecosystem Health
            </h4>
            <p className="text-white/70 max-w-md mb-8">
              System performance across {totalCount} connected devices.{" "}
              {totalCount - activeCount > 0
                ? `${totalCount - activeCount} pump(s) currently inactive.`
                : "All pumps are active."}
            </p>
          </div>
          <div className="relative z-10 flex gap-10">
            <div>
              <div className="text-4xl font-heading font-extrabold mb-1">
                {String(activeCount).padStart(2, "0")}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Active Pumps
              </div>
            </div>
            <div>
              <div className="text-4xl font-heading font-extrabold mb-1">
                {String(totalCount - activeCount).padStart(2, "0")}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Inactive
              </div>
            </div>
            <div>
              <div className="text-4xl font-heading font-extrabold mb-1">
                {totalCount > 0
                  ? `${Math.round((activeCount / totalCount) * 100)}%`
                  : "—"}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Active Rate
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-high rounded-[2rem] p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h5 className="font-heading font-bold">Network Map</h5>
            <Button
              variant="link"
              className="text-primary text-sm font-bold p-0 h-auto"
            >
              View <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
          <div className="flex-1 bg-surface-container-lowest rounded-xl overflow-hidden min-h-[160px] flex items-center justify-center text-on-surface-variant/40">
            <div className="text-center">
              <Router className="size-12 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-body">Network topology view</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <DeviceFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditDevice(null);
        }}
        device={editDevice}
      />
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        deviceId={deleteId}
      />
    </div>
  );
}
