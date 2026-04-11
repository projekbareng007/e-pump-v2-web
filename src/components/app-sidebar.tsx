"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  UsersIcon,
  CpuIcon,
  ActivityIcon,
  DropletsIcon,
} from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "User Management",
    url: "/dashboard/user-management",
    icon: <UsersIcon />,
  },
  {
    title: "Device Management",
    url: "/dashboard/device-management",
    icon: <CpuIcon />,
  },
  {
    title: "User Activity",
    url: "/dashboard/user-activity",
    icon: <ActivityIcon />,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const storeUser = useAuthStore((s) => s.user)

  const navItems = navMain.map((item) => ({
    ...item,
    isActive:
      item.url === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.url),
  }))

  const user = {
    name: storeUser?.nama ?? "Guest",
    email: storeUser?.email ?? "",
    avatar: "",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary-container text-on-primary">
                <DropletsIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-heading font-bold text-primary">
                  HydroStream
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  IoT Controller
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
