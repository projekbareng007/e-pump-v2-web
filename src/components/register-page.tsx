"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Droplets,
  Shield,
  Loader2,
  User,
} from "lucide-react";

import { authService } from "@/services/auth-service";

const registerSchema = z
  .object({
    nama: z
      .string()
      .min(1, "Full name is required")
      .max(100, "Name must be 100 characters or less"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: ({ nama, email, password }: Omit<RegisterFormValues, "confirmPassword">) =>
      authService.register({ nama, email, password }),
    onSuccess: () => {
      toast.success("Account created", {
        description: "Your account is ready. Please sign in.",
      });
      router.push("/");
    },
    onError: (error: any) => {
      const detail = error?.response?.data?.detail;
      // 422: FastAPI returns an array of ValidationError objects
      const message = Array.isArray(detail)
        ? detail.map((e: { msg: string }) => e.msg).join(", ")
        : typeof detail === "string"
          ? detail
          : "Registration failed. Please try again.";
      toast.error("Registration failed", { description: message });
    },
  });

  const onSubmit = ({ nama, email, password }: RegisterFormValues) => {
    registerMutation.mutate({ nama, email, password });
  };

  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Dotted Background Pattern */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

      {/* Decorative Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />

      <main className="relative z-10 w-full max-w-[440px] px-6 py-10">
        {/* Auth Card */}
        <Card className="bg-surface-container-lowest border-none shadow-[0_32px_64px_-12px_rgba(25,28,30,0.06)] rounded-xl">
          <CardHeader className="flex flex-col items-center pb-0 pt-8 md:pt-12 px-8 md:px-12">
            {/* Brand Icon */}
            <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/10">
              <Droplets className="size-8 text-on-primary" />
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-on-surface tracking-tight">
              Create account
            </h1>
            <p className="text-on-surface-variant font-body text-sm mt-2 text-center">
              Join HydroStream and start monitoring your IoT fleet
            </p>
          </CardHeader>

          <CardContent className="px-8 md:px-12 pt-10 pb-0">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="nama"
                  className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant"
                >
                  Full Name
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="size-5 text-outline group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="nama"
                    type="text"
                    placeholder="Your full name"
                    {...register("nama")}
                    className="h-auto pl-12 pr-4 py-3.5 bg-surface-container border-none rounded-lg font-body text-sm text-on-surface placeholder:text-outline focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </div>
                {errors.nama && (
                  <p className="text-xs text-red-500">{errors.nama.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant"
                >
                  Email Address
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="size-5 text-outline group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    {...register("email")}
                    className="h-auto pl-12 pr-4 py-3.5 bg-surface-container border-none rounded-lg font-body text-sm text-on-surface placeholder:text-outline focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant"
                >
                  Password
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="size-5 text-outline group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    {...register("password")}
                    className="h-auto pl-12 pr-12 py-3.5 bg-surface-container border-none rounded-lg font-body text-sm text-on-surface placeholder:text-outline focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant"
                >
                  Confirm Password
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="size-5 text-outline group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    {...register("confirmPassword")}
                    className="h-auto pl-12 pr-12 py-3.5 bg-surface-container border-none rounded-lg font-body text-sm text-on-surface placeholder:text-outline focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface transition-colors"
                  >
                    {showConfirm ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full h-auto bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-lg font-heading font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="size-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          {/* Footer Link */}
          <CardFooter className="flex justify-center pt-8 pb-8 md:pb-12 px-8 md:px-12">
            <p className="text-sm text-on-surface-variant">
              Already have an account?{" "}
              <a
                href="/"
                className="font-bold text-primary hover:underline underline-offset-4"
              >
                Sign In
              </a>
            </p>
          </CardFooter>
        </Card>
      </main>

      {/* Decorative Illustration (Editorial Voice) */}
      <div className="hidden lg:block absolute bottom-12 left-12 max-w-xs">
        <div className="space-y-4 opacity-40">
          <div className="h-1 w-24 bg-primary-container rounded-full" />
          <p className="font-heading text-lg font-bold text-primary leading-tight">
            Architecting the future of fluid dynamics through intelligent IoT
            solutions.
          </p>
        </div>
      </div>
    </div>
  );
}
