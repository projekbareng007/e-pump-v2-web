"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Dotted Background Pattern */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

      {/* Decorative Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />

      <main className="relative z-10 w-full max-w-[440px] px-6">
        {/* Auth Card */}
        <Card className="bg-surface-container-lowest border-none shadow-[0_32px_64px_-12px_rgba(25,28,30,0.06)] rounded-xl">
          <CardHeader className="flex flex-col items-center pb-0 pt-8 md:pt-12 px-8 md:px-12">
            {/* Brand Icon */}
            <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/10">
              <Droplets className="size-8 text-on-primary" />
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-on-surface tracking-tight">
              Welcome back
            </h1>
            <p className="text-on-surface-variant font-body text-sm mt-2">
              Access your IoT Control Center
            </p>
          </CardHeader>

          <CardContent className="px-8 md:px-12 pt-10 pb-0">
            <form
              className="space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
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
                    className="h-auto pl-12 pr-4 py-3.5 bg-surface-container border-none rounded-lg font-body text-sm text-on-surface placeholder:text-outline focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant"
                  >
                    Password
                  </Label>
                  <a
                    href="#"
                    className="text-[0.75rem] font-bold text-primary hover:text-primary-container transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="size-5 text-outline group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
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
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-3 py-1">
                <Checkbox
                  id="remember"
                  className="size-5 rounded border-outline-variant bg-surface-container data-[state=checked]:bg-primary data-[state=checked]:text-on-primary"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-on-surface-variant font-body font-normal cursor-pointer"
                >
                  Remember this device
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-auto bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-lg font-heading font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all"
              >
                Login to Dashboard
                <ArrowRight className="size-5 group-hover/button:translate-x-1 transition-transform" />
              </Button>
            </form>
          </CardContent>

          {/* Footer Link */}
          <CardFooter className="flex justify-center pt-8 pb-8 md:pb-12 px-8 md:px-12">
            <p className="text-sm text-on-surface-variant">
              New to HydroStream?{" "}
              <a
                href="#"
                className="font-bold text-primary hover:underline underline-offset-4"
              >
                Request Access
              </a>
            </p>
          </CardFooter>
        </Card>

        {/* System Status Indicator */}
        <div className="mt-8 flex justify-center items-center gap-6 px-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(0,106,106,0.5)]" />
            <span className="text-[0.7rem] font-bold uppercase tracking-tighter text-on-surface-variant opacity-70">
              Cloud System Online
            </span>
          </div>
          <div className="w-px h-3 bg-outline-variant/30" />
          <div className="flex items-center gap-2">
            <Shield className="size-3.5 text-outline" />
            <span className="text-[0.7rem] font-bold uppercase tracking-tighter text-on-surface-variant opacity-70">
              AES-256 Encrypted
            </span>
          </div>
        </div>
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
