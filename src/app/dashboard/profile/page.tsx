import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/server-auth";
import ProfileView from "@/view/dashboard/profile/profile-view";

export const metadata: Metadata = {
  title: "Profile | EPump",
  description: "View and update your account profile and personal information.",
};

export default async function ProfilePage() {
  const user = await getServerUser();
  if (!user) redirect("/");

  return <ProfileView initialUser={user} />;
}
