import type { Metadata } from "next";
import RegisterPage from "@/components/register-page";

export const metadata: Metadata = {
  title: "Register | EPump",
  description: "Create a new EPump account to manage your IoT water pump devices.",
};

export default function Register() {
  return <RegisterPage />;
}
