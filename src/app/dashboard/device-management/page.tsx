import type { Metadata } from "next";
import DeviceManagementView from "@/view/dashboard/device/device-management-view";

export const metadata: Metadata = {
  title: "Device Management | EPump",
  description: "Add, update, and monitor all registered IoT pump devices in the system.",
};

export default function DeviceManagementPage() {
  return <DeviceManagementView />;
}
