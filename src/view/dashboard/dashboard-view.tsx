import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  Cpu,
  Radio,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  CircleAlert,
  UserPlus,
  CloudCheck,
} from "lucide-react"

const statCards = [
  {
    label: "Total Users",
    value: "1,284",
    subtitle: "+12% this month",
    subtitleColor: "text-secondary",
    icon: <Users className="size-6" />,
    iconBg: "bg-[#d6e3ff] text-primary",
    trend: <TrendingUp className="size-4 mr-1" />,
  },
  {
    label: "Total Devices",
    value: "5,620",
    subtitle: "Across 42 clusters",
    subtitleColor: "text-on-surface-variant",
    icon: <Cpu className="size-6" />,
    iconBg: "bg-secondary-container text-secondary",
  },
  {
    label: "Online Now",
    value: "5,412",
    subtitle: "96.3% Uptime",
    subtitleColor: "text-on-surface-variant",
    icon: <Radio className="size-6" />,
    iconBg:
      "bg-secondary-container text-secondary shadow-[inset_0_0_8px_rgba(0,128,128,0.2)]",
    live: true,
  },
  {
    label: "Critical Alerts",
    value: "208",
    subtitle: "Requires Maintenance",
    subtitleColor: "text-tertiary",
    icon: <AlertTriangle className="size-6" />,
    iconBg: "bg-[#ffdbcb] text-tertiary",
    borderAccent: true,
  },
]

const devices = [
  {
    id: "HST-9921-X",
    location: "North Basin, Sector A",
    flowRate: "42.5 L/min",
    status: "Active",
  },
  {
    id: "HST-4042-B",
    location: "Central Valve 04",
    flowRate: "0.0 L/min",
    status: "Offline",
  },
  {
    id: "HST-1182-M",
    location: "South Reservoir",
    flowRate: "118.2 L/min",
    status: "Active",
  },
  {
    id: "HST-2290-C",
    location: "East Pump Station",
    flowRate: "12.1 L/min",
    status: "Active",
  },
]

const activities = [
  {
    icon: <RefreshCw className="size-5" />,
    iconBg: "bg-primary-container text-on-primary-container",
    title: "Firmware v2.4 Pushed",
    description: "Deployment started for 1,200 devices in Sector B.",
    time: "10 minutes ago",
  },
  {
    icon: <CircleAlert className="size-5" />,
    iconBg: "bg-tertiary-container text-on-tertiary-container",
    title: "Unusual Pressure Drop",
    description:
      "Device HST-4042-B reported critical failure at Central Valve.",
    time: "2 hours ago",
  },
  {
    icon: <UserPlus className="size-5" />,
    iconBg: "bg-secondary-container text-on-secondary-container",
    title: "New User Registered",
    description: 'Administrator "Sarah Miller" added to North Sector Team.',
    time: "Yesterday",
  },
  {
    icon: <CloudCheck className="size-5" />,
    iconBg: "bg-surface-container-high text-on-surface-variant",
    title: "Daily Sync Complete",
    description: "All 42 data clusters synchronized with cloud storage.",
    time: "Yesterday",
  },
]

export default function DashboardView() {
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
                  {card.value}
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
                {card.trend}
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
            <Button variant="link" className="text-primary text-sm font-bold">
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body">
                <thead>
                  <tr className="bg-surface-container-low text-outline text-xs uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Device ID</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Flow Rate</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {devices.map((device) => (
                    <tr
                      key={device.id}
                      className="hover:bg-surface-container-low transition-colors"
                    >
                      <td className="px-6 py-5 font-medium text-primary">
                        {device.id}
                      </td>
                      <td className="px-6 py-5 text-on-surface-variant">
                        {device.location}
                      </td>
                      <td className="px-6 py-5 text-on-surface-variant">
                        {device.flowRate}
                      </td>
                      <td className="px-6 py-5">
                        <StatusChip status={device.status} />
                      </td>
                    </tr>
                  ))}
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
            {activities.map((activity) => (
              <div key={activity.title} className="flex gap-4">
                <div
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${activity.iconBg}`}
                >
                  {activity.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">
                    {activity.title}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {activity.description}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-outline mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-4 bg-surface-container-low rounded-b-xl">
            <Button
              variant="secondary"
              className="w-full bg-surface-container-highest text-on-surface hover:bg-surface-container-high"
            >
              View Log History
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function StatusChip({ status }: { status: string }) {
  const isActive = status === "Active"
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
        isActive
          ? "bg-secondary-container text-on-secondary-container"
          : "bg-[#ffdbcb] text-tertiary"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          isActive ? "bg-secondary" : "bg-tertiary"
        }`}
      />
      {status}
    </span>
  )
}
