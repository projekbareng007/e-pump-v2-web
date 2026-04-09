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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b-0 bg-surface-container-lowest/80 backdrop-blur-[24px] transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-outline" />
              <Input
                placeholder="Search system resources..."
                className="pl-10 pr-4 py-2 bg-surface-container border-none rounded-lg text-sm h-9 focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 px-4">
            <Button variant="ghost" size="icon">
              <Bell className="size-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon">
              <SunMoon className="size-5 text-muted-foreground" />
            </Button>
          </div>
        </header>
        <main className="flex-1 dot-grid">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
