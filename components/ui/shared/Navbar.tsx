// components/shared/Navbar.tsx - UPDATED WITH REAL AUTH
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  BookOpen,
  Search,
  User,
  Bell,
  ShoppingCart,
  Menu,
  X,
  GraduationCap,
  LogOut,
  Settings,
  UserCircle,
  LayoutDashboard,
  BookMarked,
  Award,
  HelpCircle,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { toast } from "sonner";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  avatar: string;
  enrolledCourses: number;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token expired or invalid
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
      toast.info(`Searching for: ${searchQuery}`);
    }
  };

  // Handle login
  const handleLogin = () => {
    router.push("/login");
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call logout API
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // Clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Clear state
        setUser(null);

        // Show success message
        toast.success("Logged out successfully!");

        // Redirect to home
        router.push("/");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  // Handle dashboard navigation based on role
  const handleDashboard = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    switch (user.role) {
      case "admin":
        router.push("/dashboard/admin");
        break;
      case "instructor":
        router.push("/dashboard/instructor");
        break;
      default:
        router.push("/dashboard/student");
        break;
    }
  };

  // Handle profile
  const handleProfile = () => {
    if (user) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  // Navigation items (different for logged in users)
  const getNavItems = () => {
    const baseItems = [
      { label: "Home", href: "/", icon: Home },
      { label: "Courses", href: "/courses", icon: BookOpen },
    ];

    if (user) {
      baseItems.push(
        { label: "My Learning", href: "/my-learning", icon: BookMarked },
        { label: "Progress", href: "/progress", icon: Award }
      );
    }

    return baseItems;
  };

  // Hide navbar on auth pages
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  if (isAuthPage) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 animate-pulse" />
              <div>
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded mt-1 animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-9 w-20 bg-primary/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-lg border-b shadow-sm"
          : "bg-background border-b"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tight">
                  CourseMaster
                </h1>
                <p className="text-xs text-muted-foreground">
                  Learn Without Limits
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {getNavItems().map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.label} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={`gap-2 ${isActive ? "font-semibold" : ""}`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search courses, instructors..."
                className="pl-10 pr-4 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => toast.info("Search feature on mobile")}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notification Bell */}
            {user && (
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                  3
                </Badge>
              </Button>
            )}

            {/* Cart */}
            {user && (
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                  2
                </Badge>
              </Button>
            )}

            {/* Help Button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={() => router.push("/help")}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>

            {/* User Avatar / Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {user.name.split(" ")[0]} {/* Show first name only */}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {user.role}
                      </span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleDashboard}
                    className="cursor-pointer py-3"
                  >
                    <LayoutDashboard className="mr-3 h-4 w-4" />
                    <div>
                      <p>Dashboard</p>
                      <p className="text-xs text-muted-foreground">
                        {user.role === "admin"
                          ? "Admin Panel"
                          : user.role === "instructor"
                          ? "Instructor Portal"
                          : "My Learning"}
                      </p>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleProfile}
                    className="cursor-pointer py-3"
                  >
                    <UserCircle className="mr-3 h-4 w-4" />
                    <div>
                      <p>My Profile</p>
                      <p className="text-xs text-muted-foreground">
                        Manage account settings
                      </p>
                    </div>
                  </DropdownMenuItem>

                  {user.role === "student" && (
                    <DropdownMenuItem
                      onClick={() => router.push("/my-courses")}
                      className="cursor-pointer py-3"
                    >
                      <BookOpen className="mr-3 h-4 w-4" />
                      <div>
                        <p>My Courses</p>
                        <p className="text-xs text-muted-foreground">
                          {user.enrolledCourses} courses enrolled
                        </p>
                      </div>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                    className="cursor-pointer py-3"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    <div>
                      <p>Settings</p>
                      <p className="text-xs text-muted-foreground">
                        Preferences & notifications
                      </p>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer py-3 text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <div>
                      <p>Logout</p>
                      <p className="text-xs text-muted-foreground">
                        Sign out of your account
                      </p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={handleLogin}>
                  Login
                </Button>
                <Button onClick={() => router.push("/register")}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMenuOpen && (
          <div className="pb-4 md:hidden">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col space-y-2">
              {getNavItems().map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start gap-3"
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}

              {!user ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 mt-4"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogin();
                    }}
                  >
                    <User className="h-5 w-5" />
                    Login
                  </Button>
                  <Button
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/register");
                    }}
                  >
                    <UserCircle className="h-5 w-5" />
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 mt-4"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleDashboard();
                    }}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleProfile();
                    }}
                  >
                    <UserCircle className="h-5 w-5" />
                    My Profile
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
