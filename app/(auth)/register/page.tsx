// app/(auth)/register/page.tsx - UPDATED (Google OAuth Removed)
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  CheckCircle,
  GraduationCap,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect target from URL or default to /dashboard
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- Handlers ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Valid email is required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Registration failed");
      }

      toast.success("Registration successful!", {
        description: "Your account has been created. Redirecting to login...",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });

      // Redirect to login page after 1 second
      setTimeout(() => {
        router.push(
          `/login?registered=true&email=${encodeURIComponent(formData.email)}`
        );
      }, 1000);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // --- Render ---

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg dark:shadow-xl border dark:border-border bg-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-card-foreground">
            Join CourseMaster
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Create your free account in seconds
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 py-6"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 py-6"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-2">
              <Label htmlFor="role">
                I want to join as <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger className="py-6">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-card dark:border-border">
                  <SelectItem value="student" className="py-3">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-foreground" />
                      <div>
                        <p className="font-medium">Student</p>
                        <p className="text-xs text-muted-foreground">
                          Learn new skills
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="instructor" className="py-3">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-foreground" />
                      <div>
                        <p className="font-medium">Instructor</p>
                        <p className="text-xs text-muted-foreground">
                          Share your knowledge
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 py-6"
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
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 py-6"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-6 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Creating your account...
                </>
              ) : (
                "Create Free Account"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t dark:border-border">
            <p className="text-center text-muted-foreground mb-4">
              Already have an account?
            </p>
            <Button
              variant="outline"
              className="w-full py-6 text-base"
              onClick={() =>
                router.push(
                  `/login${
                    redirect !== "/dashboard"
                      ? `?redirect=${encodeURIComponent(redirect)}`
                      : ""
                  }`
                )
              }
              disabled={isLoading}
            >
              Sign in to existing account
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-6 border-t dark:border-border">
          <p className="text-xs text-center text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
            ,{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/cookies" className="text-primary hover:underline">
              Cookie Policy
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
