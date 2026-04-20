import type { Metadata } from "next";
import DashboardView from "@/view/dashboard/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard | EPump",
  description: "Real-time overview of system health, device status, and pump activity.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
