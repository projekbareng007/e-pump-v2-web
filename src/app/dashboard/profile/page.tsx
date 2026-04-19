import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/server-auth";
import ProfileView from "@/view/dashboard/profile/profile-view";

export default async function ProfilePage() {
  const user = await getServerUser();
  if (!user) redirect("/");

  return <ProfileView initialUser={user} />;
}
