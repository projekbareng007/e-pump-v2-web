import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Search, Bell, SunMoon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getServerUser } from "@/lib/server-auth"
import { Role } from "@/types"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getServerUser()
  if (!user) redirect("/")
  if (user.role === Role.USER) redirect("/")

  return (
    <SidebarProvider>
      <AppSidebar initialUser={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b-0 bg-surface-container-lowest/80 backdrop-blur-[24px] transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
          </div>
        </header>
        <main className="flex-1 dot-grid">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
