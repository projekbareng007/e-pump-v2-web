"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  Search,
  SlidersHorizontal,
  Pencil,
  Trash2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const users = [
  {
    name: "Alex Morgan",
    avatar: "/avatars/alex.jpg",
    initials: "AM",
    joined: "Joined March 2023",
    email: "alex.m@hydrostream.io",
    role: "Super Admin",
    roleColor: "bg-tertiary-container/10 text-tertiary",
    status: "Active",
    inactive: false,
  },
  {
    name: "Sarah Chen",
    avatar: "/avatars/sarah.jpg",
    initials: "SC",
    joined: "Joined Jan 2024",
    email: "s.chen@hydrostream.io",
    role: "Admin",
    roleColor: "bg-primary-container/10 text-primary",
    status: "Active",
    inactive: false,
  },
  {
    name: "James Brown",
    avatar: "/avatars/james.jpg",
    initials: "JB",
    joined: "Joined June 2022",
    email: "j.brown@hydrostream.io",
    role: "Operator",
    roleColor: "bg-primary-container/10 text-primary",
    status: "Inactive",
    inactive: true,
  },
  {
    name: "Lena Peters",
    avatar: "/avatars/lena.jpg",
    initials: "LP",
    joined: "Joined Sept 2023",
    email: "l.peters@hydrostream.io",
    role: "Admin",
    roleColor: "bg-primary-container/10 text-primary",
    status: "Active",
    inactive: false,
  },
]

export default function UserManagementView() {
  return (
    <div className="px-8 py-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-heading font-extrabold text-primary tracking-tight">
            User Management
          </h2>
          <p className="text-on-surface-variant mt-2 font-body text-lg">
            Manage access levels and monitor operator permissions for the
            HydroStream IoT ecosystem.
          </p>
        </div>
        <Button className="bg-primary-container hover:bg-primary text-white px-6 py-3 h-auto rounded-xl font-bold shadow-lg shadow-primary/20">
          <Plus className="size-5" />
          Add New User
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-surface-container-lowest border-none rounded-2xl shadow-sm border border-outline-variant/10">
          <CardContent className="p-6">
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              Total Users
            </span>
            <div className="text-3xl font-bold font-heading text-primary mt-2">
              1,284
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-none rounded-2xl shadow-sm border border-outline-variant/10">
          <CardContent className="p-6">
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              Active Now
            </span>
            <div className="text-3xl font-bold font-heading text-secondary mt-2">
              42
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 bg-gradient-to-br from-primary to-primary-container border-none rounded-2xl shadow-xl overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between text-white">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest opacity-80">
                Security Status
              </span>
              <div className="text-xl font-bold font-heading mt-1">
                Multi-Factor Auth Active
              </div>
              <p className="text-sm opacity-90 mt-1">
                98.2% compliance across all admin accounts.
              </p>
            </div>
            <ShieldCheck className="size-12 opacity-30" />
          </CardContent>
        </Card>
      </div>

      {/* Table Container */}
      <Card className="bg-surface-container-lowest border-none rounded-3xl shadow-xl shadow-surface-dim/50 overflow-hidden border border-outline-variant/10">
        {/* Filter Bar */}
        <div className="p-6 flex flex-col lg:flex-row gap-4 items-center justify-between bg-surface-container-low/30 border-b border-outline-variant/10">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
            <Input
              placeholder="Filter by name, email or role..."
              className="pl-12 pr-4 py-3 h-auto rounded-2xl bg-white border border-outline-variant/30 focus-visible:ring-4 focus-visible:ring-primary/10"
            />
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Select defaultValue="all-roles">
              <SelectTrigger className="bg-white border border-outline-variant/30 rounded-xl px-4 py-3 h-auto flex-1 lg:flex-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-roles">All Roles</SelectItem>
                <SelectItem value="super-admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="operator">Operator</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-status">
              <SelectTrigger className="bg-white border border-outline-variant/30 rounded-xl px-4 py-3 h-auto flex-1 lg:flex-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">Active Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl bg-surface-container-high hover:bg-surface-container-highest size-11"
            >
              <SlidersHorizontal className="size-5 text-on-surface-variant" />
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-container-low/50 border-none hover:bg-surface-container-low/50">
              <TableHead className="px-8 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                User Profile
              </TableHead>
              <TableHead className="px-6 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Email Address
              </TableHead>
              <TableHead className="px-6 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Role
              </TableHead>
              <TableHead className="px-6 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Status
              </TableHead>
              <TableHead className="px-8 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.email}
                className="border-outline-variant/10 hover:bg-surface-container-low/20 group"
              >
                <TableCell className="px-8 py-5">
                  <div
                    className={`flex items-center gap-4 ${user.inactive ? "opacity-60" : ""}`}
                  >
                    <Avatar className="size-12 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                      <AvatarImage
                        src={user.avatar}
                        alt={user.name}
                        className={user.inactive ? "grayscale" : ""}
                      />
                      <AvatarFallback className="bg-surface-container-high text-on-surface-variant font-bold">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-on-surface font-heading">
                        {user.name}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        {user.joined}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  className={`px-6 py-5 text-sm text-on-surface-variant font-body ${user.inactive ? "opacity-60" : ""}`}
                >
                  {user.email}
                </TableCell>
                <TableCell className={`px-6 py-5 ${user.inactive ? "opacity-60" : ""}`}>
                  <Badge
                    variant="outline"
                    className={`border-none px-3 py-1 rounded-full text-xs font-bold ${user.roleColor}`}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-tertiary-container/10 text-tertiary hover:bg-tertiary-container hover:text-white transition-all shadow-sm">
                      <Pencil className="size-4" />
                    </button>
                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="px-8 py-6 flex items-center justify-between bg-surface-container-low/30 border-t border-outline-variant/10">
          <div className="text-sm text-on-surface-variant font-body">
            Showing <span className="font-bold text-on-surface">1</span> to{" "}
            <span className="font-bold text-on-surface">10</span> of{" "}
            <span className="font-bold text-on-surface">124</span> users
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled
              className="rounded-lg text-on-surface-variant"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button className="w-10 h-10 rounded-lg bg-primary text-white font-bold text-sm">
              1
            </Button>
            <Button
              variant="ghost"
              className="w-10 h-10 rounded-lg text-on-surface-variant font-bold text-sm"
            >
              2
            </Button>
            <Button
              variant="ghost"
              className="w-10 h-10 rounded-lg text-on-surface-variant font-bold text-sm"
            >
              3
            </Button>
            <span className="px-2 text-on-surface-variant">...</span>
            <Button
              variant="ghost"
              className="w-10 h-10 rounded-lg text-on-surface-variant font-bold text-sm"
            >
              12
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg text-on-surface-variant"
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active"
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
        isActive
          ? "bg-secondary-container text-secondary"
          : "bg-surface-container-highest text-on-surface-variant"
      }`}
    >
      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
      )}
      {status}
    </span>
  )
}
