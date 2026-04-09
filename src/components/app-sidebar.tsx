"use client"

import * as React from "react"

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
  SettingsIcon,
  DropletsIcon,
} from "lucide-react"

const data = {
  user: {
    name: "Admin",
    email: "admin@hydrostream.io",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
      isActive: true,
    },
    {
      title: "User Management",
      url: "/dashboard/user-management",
      icon: <UsersIcon />,
      // items: [
      //   { title: "All Users", url: "#" },
      //   { title: "Roles & Permissions", url: "#" },
      // ],
    },
    {
      title: "Device Management",
      url: "#",
      icon: <CpuIcon />,
      // items: [
      //   { title: "All Devices", url: "#" },
      //   { title: "Clusters", url: "#" },
      //   { title: "Firmware", url: "#" },
      // ],
    },
    {
      title: "User Activity",
      url: "#",
      icon: <ActivityIcon />,
      // items: [
      //   { title: "Activity Log", url: "#" },
      //   { title: "Audit Trail", url: "#" },
      // ],
    },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: <SettingsIcon />,
    //   items: [
    //     { title: "General", url: "#" },
    //     { title: "Notifications", url: "#" },
    //     { title: "Integrations", url: "#" },
    //   ],
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
