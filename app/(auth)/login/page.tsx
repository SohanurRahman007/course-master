// app/(auth)/login/page.tsx - THEME-ALIGNED WITH CORRECT REDIRECT LOGIC
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
// ... (All other imports remain the same)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, Loader2, Chrome } from "lucide-react";
// import { signIn } from "next-auth/react"; // Uncomment if using NextAuth

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ সংশোধিত লজিক: redirect টার্গেট হিসেবে হয় URL প্যারামিটার ব্যবহার করবে,
  // নতুবা ডিফল্টভাবে /dashboard ব্যবহার করবে।
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // --- Handlers ---

  // 1. Manual Login Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call (replace with actual API endpoint)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Login failed");
      }

      toast.success("Login successful!", {
        description: `Welcome back, ${data.user.name || "user"}!`,
      });

      // ✅ রিডাইরেক্ট লজিক (Manual Login):
      setTimeout(() => {
        if (data.user?.role === "admin") {
          router.push("/dashboard/admin");
        } else {
          // যদি redirect প্যারামিটার থাকে, সেখানে যাবে। না থাকলে /dashboard এ যাবে।
          router.push(redirect);
        }
      }, 1000);
    } catch (error: any) {
      toast.error("Login failed", {
        description: error.message || "Please check your credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Google Login Handler
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // ✅ রিডাইরেক্ট লজিক (Google Login): callbackUrl হিসেবে redirect ভ্যালুটি ব্যবহার করবে।
      window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(
        redirect
      )}`;

      // If using NextAuth:
      // await signIn("google", { callbackUrl: redirect, redirect: true });
    } catch (error) {
      toast.error("Google login failed", {
        description: "Please try again later",
      });
      setGoogleLoading(false);
    }
  };

  return (
    // ... (JSX remains the same as previously corrected version) ...
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg dark:shadow-xl border dark:border-border">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-card-foreground">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to continue your learning journey
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6 py-2.5 border-2 hover:bg-muted dark:hover:bg-muted dark:border-border"
            onClick={handleGoogleLogin}
            disabled={isLoading || googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-foreground" />
            ) : (
              <Chrome className="mr-2 h-4 w-4 text-foreground" />
            )}
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="bg-border dark:bg-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 focus:border-primary focus:ring-1 focus:ring-primary focus:ring-offset-0"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 focus:border-primary focus:ring-1 focus:ring-primary focus:ring-offset-0"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/90"
              disabled={isLoading || googleLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t dark:border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  New to CourseMaster?
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 hover:bg-muted dark:hover:bg-muted dark:border-border"
              onClick={() => router.push("/register")}
              disabled={isLoading || googleLoading}
            >
              Create an account
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 pt-6 border-t dark:border-border">
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
