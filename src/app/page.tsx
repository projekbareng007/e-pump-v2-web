import type { Metadata } from "next";
import LoginPage from "@/components/login-page";

export const metadata: Metadata = {
  title: "Login | EPump",
  description: "Sign in to EPump to monitor and control your IoT water pump devices.",
};

export default function Home() {
  return <LoginPage />;
}
