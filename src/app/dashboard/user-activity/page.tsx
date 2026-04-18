import { redirect } from "next/navigation"
import UserActivityView from "@/view/dashboard/activity/user-activity-view"
import { getServerUser } from "@/lib/server-auth"
import { Role } from "@/types"

export default async function UserActivityPage() {
  const user = await getServerUser()
  if (!user) redirect("/")
  if (user.role !== Role.SUPERUSER) redirect("/dashboard")

  return <UserActivityView />
}
