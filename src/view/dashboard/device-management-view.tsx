"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Plus,
  Droplets,
  Radio,
  Zap,
  Router,
  Thermometer,
  Pencil,
  Trash2,
  LayoutGrid,
  List,
  ArrowRight,
} from "lucide-react"

type DeviceStatus = "Online" | "Alert" | "Offline"

interface Device {
  name: string
  icon: React.ReactNode
  type: string
  location: string
  status: DeviceStatus
  lastSeen: string
  lastSeenUrgent?: boolean
}

const devices: Device[] = [
  {
    name: "StreamCore Alpha-1",
    icon: <Droplets className="size-7" />,
    type: "Flow Meter",
    location: "Main Reservoir",
    status: "Online",
    lastSeen: "2 mins ago",
  },
  {
    name: "PressureNode X-4",
    icon: <Radio className="size-7" />,
    type: "Pressure Sensor",
    location: "Sector B-4",
    status: "Alert",
    lastSeen: "14 hours ago",
    lastSeenUrgent: true,
  },
  {
    name: "PowerLink Gateway",
    icon: <Zap className="size-7" />,
    type: "Valve Actuator",
    location: "Sector A-1",
    status: "Online",
    lastSeen: "56 seconds ago",
  },
  {
    name: "MeshHub v2.0",
    icon: <Router className="size-7" />,
    type: "Controller",
    location: "Central Hub",
    status: "Online",
    lastSeen: "Just now",
  },
  {
    name: "TempGuard Pro",
    icon: <Thermometer className="size-7" />,
    type: "Thermal Sensor",
    location: "Cooling Tank",
    status: "Online",
    lastSeen: "5 mins ago",
  },
]

const statusStyles: Record<DeviceStatus, { border: string; bg: string; dot: string; text: string }> = {
  Online: {
    border: "border-b-secondary/20",
    bg: "bg-secondary-container/30",
    dot: "bg-secondary",
    text: "text-on-secondary-container",
  },
  Alert: {
    border: "border-b-tertiary/20",
    bg: "bg-[#ffdbcb]",
    dot: "bg-tertiary",
    text: "text-tertiary",
  },
  Offline: {
    border: "border-b-outline-variant/20",
    bg: "bg-surface-container-high",
    dot: "bg-outline",
    text: "text-on-surface-variant",
  },
}

export default function DeviceManagementView() {
  const [view, setView] = useState<"grid" | "list">("grid")

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
          {/* View Toggle */}
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
          <Button className="bg-primary-container text-white px-6 py-2.5 h-auto rounded-xl font-bold shadow-md hover:opacity-90">
            <Plus className="size-5" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-low rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-6">
        <FilterPill label="Status" defaultValue="all-statuses">
          <SelectItem value="all-statuses">All Statuses</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="offline">Offline</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
        </FilterPill>
        <FilterPill label="Type" defaultValue="all-controllers">
          <SelectItem value="all-controllers">All Controllers</SelectItem>
          <SelectItem value="flow-meter">Flow Meter</SelectItem>
          <SelectItem value="pressure-sensor">Pressure Sensor</SelectItem>
          <SelectItem value="valve-actuator">Valve Actuator</SelectItem>
        </FilterPill>
        <FilterPill label="Location" defaultValue="all-zones">
          <SelectItem value="all-zones">All Zones</SelectItem>
          <SelectItem value="sector-a1">Sector A-1</SelectItem>
          <SelectItem value="sector-b4">Sector B-4</SelectItem>
          <SelectItem value="main-reservoir">Main Reservoir</SelectItem>
        </FilterPill>
        <div className="ml-auto text-sm text-on-surface-variant font-medium">
          Showing <span className="text-primary font-bold">12</span> of 48
          devices
        </div>
      </div>

      {/* Device Grid / List */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {devices.map((device) => (
            <DeviceCard key={device.name} device={device} />
          ))}
          {/* Add Placeholder */}
          <div className="border-2 border-dashed border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-all cursor-pointer group">
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
        <DeviceListView />
      )}

      {/* Ecosystem Health + Network Map */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ecosystem Health */}
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
              System performance across 48 connected devices is operating at 94%
              efficiency. Two sensors require firmware updates.
            </p>
          </div>
          <div className="relative z-10 flex gap-10">
            <div>
              <div className="text-4xl font-heading font-extrabold mb-1">
                46
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Active Nodes
              </div>
            </div>
            <div>
              <div className="text-4xl font-heading font-extrabold mb-1">
                02
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Warnings
              </div>
            </div>
            <div>
              <div className="text-4xl font-heading font-extrabold mb-1">
                99.8%
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Uptime
              </div>
            </div>
          </div>
        </div>

        {/* Network Map */}
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
    </div>
  )
}

function DeviceCard({ device }: { device: Device }) {
  const style = statusStyles[device.status]
  return (
    <Card
      className={`bg-surface-container-lowest border-none rounded-2xl shadow-sm border-b-4 ${style.border} hover:shadow-md transition-all flex flex-col h-full group`}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {device.icon}
          </div>
          <div
            className={`flex items-center gap-2 ${style.bg} px-3 py-1 rounded-full`}
            style={{
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
            <span
              className={`text-[10px] font-bold ${style.text} uppercase`}
            >
              {device.status}
            </span>
          </div>
        </div>
        <h3 className="font-heading font-bold text-xl mb-1 group-hover:text-primary transition-colors">
          {device.name}
        </h3>
        <p className="text-on-surface-variant text-sm font-body mb-4">
          {device.type} &bull; {device.location}
        </p>
        <div className="mt-auto pt-6 border-t border-surface-container-low flex items-center justify-between">
          <div className="text-[10px] text-outline font-medium uppercase tracking-tighter">
            Last seen:{" "}
            <span
              className={
                device.lastSeenUrgent
                  ? "text-destructive font-bold"
                  : "text-on-surface"
              }
            >
              {device.lastSeen}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ffdbcb] text-tertiary hover:bg-tertiary-container hover:text-white transition-colors">
              <Pencil className="size-4" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors">
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DeviceListView() {
  return (
    <Card className="bg-surface-container-lowest border-none rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-container-low/50 border-none hover:bg-surface-container-low/50">
            <TableHead className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
              Device
            </TableHead>
            <TableHead className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
              Type
            </TableHead>
            <TableHead className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
              Location
            </TableHead>
            <TableHead className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
              Status
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
          {devices.map((device) => {
            const style = statusStyles[device.status]
            return (
              <TableRow
                key={device.name}
                className="border-outline-variant/10 hover:bg-surface-container-low/20 group"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {device.icon}
                    </div>
                    <span className="font-heading font-bold text-on-surface group-hover:text-primary transition-colors">
                      {device.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-on-surface-variant">
                  {device.type}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-on-surface-variant">
                  {device.location}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div
                    className={`inline-flex items-center gap-2 ${style.bg} px-3 py-1 rounded-full`}
                    style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)" }}
                  >
                    <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <span className={`text-[10px] font-bold ${style.text} uppercase`}>
                      {device.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span
                    className={`text-xs ${
                      device.lastSeenUrgent
                        ? "text-destructive font-bold"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {device.lastSeen}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="w-9 h-9 rounded-full flex items-center justify-center bg-[#ffdbcb] text-tertiary hover:bg-tertiary-container hover:text-white transition-colors">
                      <Pencil className="size-3.5" />
                    </button>
                    <button className="w-9 h-9 rounded-full flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}

function FilterPill({
  label,
  defaultValue,
  children,
}: {
  label: string
  defaultValue: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm">
      <span className="text-xs font-bold uppercase tracking-wider text-outline">
        {label}:
      </span>
      <Select defaultValue={defaultValue}>
        <SelectTrigger className="border-none bg-transparent shadow-none h-auto p-0 text-sm font-medium min-w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  )
}
