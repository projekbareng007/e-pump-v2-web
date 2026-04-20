import type { Metadata } from "next";
import UserManagementView from "@/view/dashboard/user/user-management-view";

export const metadata: Metadata = {
  title: "User Management | EPump",
  description: "Manage user accounts, roles, and access permissions for the platform.",
};

export default function UserManagementPage() {
  return <UserManagementView />;
}
