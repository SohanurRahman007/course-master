// app/(auth)/register/page.tsx - WITH GOOGLE REGISTER
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  Chrome,
  CheckCircle,
  Shield,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
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
  const [googleLoading, setGoogleLoading] = useState(false);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Registration failed");
      }

      toast.success("Registration successful!", {
        description: "Your account has been created successfully",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });

      setTimeout(() => {
        if (data.user.role === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard");
        }
      }, 1000);
    } catch (error: any) {
      toast.error("Registration failed", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    try {
      // Simple Google OAuth redirect
      window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(
        "/dashboard"
      )}`;
    } catch (error) {
      toast.error("Google registration failed", {
        description: "Please try email registration for now",
      });
      setGoogleLoading(false);
    }
  };

  // Benefits list for registration
  const benefits = [
    "Access to 500+ courses",
    "Progress tracking",
    "Certificate of completion",
    "24/7 support",
    "Mobile app access",
    "Community forum",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
        {/* Left Side - Benefits */}
        <div className="lg:w-1/2">
          <Card className="h-full border-0 shadow-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">
                Why Join CourseMaster?
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                Start your learning journey today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                    Secure Registration
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your data is protected with industry-standard encryption. We
                  never share your personal information with third parties.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Registration Form */}
        <div className="lg:w-1/2">
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Join 50,000+ learners worldwide
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Google Register Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full mb-6 py-6 text-base border-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800"
                onClick={handleGoogleRegister}
                disabled={googleLoading || isLoading}
              >
                {googleLoading ? (
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                ) : (
                  <Chrome className="mr-3 h-5 w-5" />
                )}
                Sign up with Google
                <span className="ml-auto text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  Recommended
                </span>
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-3 text-muted-foreground">
                    Or register with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">
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
                    <SelectContent>
                      <SelectItem value="student" className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            🎓
                          </div>
                          <div>
                            <p className="font-medium">Student</p>
                            <p className="text-xs text-gray-500">
                              Learn new skills
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="instructor" className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            👨‍🏫
                          </div>
                          <div>
                            <p className="font-medium">Instructor</p>
                            <p className="text-xs text-gray-500">
                              Share your knowledge
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Minimum 6 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 text-base bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
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

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-3 text-muted-foreground">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 py-6 text-base"
                  onClick={() => router.push("/login")}
                  disabled={isLoading}
                >
                  Sign in to existing account
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-6 border-t">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                By creating an account, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-primary hover:underline font-medium"
                >
                  Terms of Service
                </Link>
                ,{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:underline font-medium"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/cookies"
                  className="text-primary hover:underline font-medium"
                >
                  Cookie Policy
                </Link>
              </p>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span>🔒 SSL Secured</span>
                <span>•</span>
                <span>🌐 Global Access</span>
                <span>•</span>
                <span>⭐ 4.8/5 Rating</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
