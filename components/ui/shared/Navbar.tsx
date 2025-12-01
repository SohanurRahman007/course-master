// components/shared/Navbar.tsx - CUSTOMIZED FULL VERSION
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
  ChevronDown,
  Globe,
  Sparkles,
  Trophy,
  Users,
  Video,
  Bookmark,
  HelpCircle,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { toast } from "sonner";

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "",
  role: "student",
  enrolledCourses: 3,
};

// Categories dropdown
const categories = [
  { label: "Web Development", icon: Globe, count: 45 },
  { label: "Data Science", icon: Sparkles, count: 32 },
  { label: "Mobile Development", icon: Video, count: 28 },
  { label: "Business", icon: Users, count: 51 },
  { label: "Design", icon: Trophy, count: 37 },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default false

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
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

  // Handle login/logout
  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully!");
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Navigation items
  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Courses", href: "/courses", icon: BookOpen },
    { label: "My Learning", href: "/my-learning", icon: Bookmark },
  ];

  // Hide navbar on auth pages
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  if (isAuthPage) {
    return null;
  }

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-lg border-b shadow-lg"
          : "bg-background/80 backdrop-blur-md border-b"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex h-14 items-center justify-between border-b">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="hidden md:inline">New: AI-Powered Learning</span>
              <span className="md:hidden">New AI Features</span>
            </div>
            <div className="h-4 w-px bg-border hidden md:block" />
            <Link
              href="/become-instructor"
              className="text-primary hover:underline hidden md:inline"
            >
              Become an Instructor
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/business" className="text-sm hover:text-primary">
              For Business
            </Link>
            <Link
              href="/help"
              className="flex items-center gap-1 text-sm hover:text-primary"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Help</span>
            </Link>
          </div>
        </div>

        {/* Main Navigation */}
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
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 group-hover:scale-105 transition-transform">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CourseMaster
                </h1>
                <p className="text-xs text-muted-foreground">
                  Learn Without Limits
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.label} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={`gap-2 rounded-lg ${
                        isActive ? "font-semibold shadow-sm" : ""
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}

              {/* Categories Dropdown */}
              <DropdownMenu onOpenChange={setIsCategoriesOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 rounded-lg">
                    <span>Categories</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isCategoriesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 p-2">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Browse Categories
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <DropdownMenuItem
                        key={category.label}
                        className="flex items-center justify-between cursor-pointer py-2"
                        onClick={() =>
                          router.push(
                            `/categories/${category.label.toLowerCase()}`
                          )
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-primary" />
                          <span>{category.label}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-primary"
                    onClick={() => router.push("/categories")}
                  >
                    View all categories →
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-xl mx-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="What do you want to learn today?"
                className="pl-12 pr-4 py-6 rounded-full border-2 focus:border-primary shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
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

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hidden md:flex"
              onClick={() => router.push("/wishlist")}
            >
              <Bookmark className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                2
              </Badge>
            </Button>

            {/* Notification */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center bg-red-500">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2 space-y-2 max-h-60 overflow-y-auto">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-sm font-medium">Course Discount</p>
                    <p className="text-xs text-muted-foreground">
                      Web Development Bootcamp is now 50% off!
                    </p>
                  </div>
                  <div className="p-2 rounded-lg">
                    <p className="text-sm font-medium">New Lesson Added</p>
                    <p className="text-xs text-muted-foreground">
                      React Hooks deep dive added to your course
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-center justify-center">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Avatar / Auth Buttons */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 px-2 hover:bg-accent/50 rounded-full"
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                      <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {mockUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {mockUser.name}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {mockUser.role}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden lg:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-4 border-b">
                    <p className="font-medium">{mockUser.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {mockUser.email}
                    </p>
                  </div>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer py-3"
                  >
                    <LayoutDashboard className="mr-3 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer py-3"
                  >
                    <UserCircle className="mr-3 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/my-courses")}
                    className="cursor-pointer py-3"
                  >
                    <BookOpen className="mr-3 h-4 w-4" />
                    My Courses ({mockUser.enrolledCourses})
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer py-3">
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer py-3 text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={handleLogin}
                  className="hidden sm:flex"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => router.push("/register")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMenuOpen && (
          <div className="pb-4 md:hidden border-t mt-2">
            <form onSubmit={handleSearch} className="w-full mt-4">
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

            {/* Mobile Menu Items */}
            <div className="mt-4 space-y-2">
              {navItems.map((item) => {
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
                      className="w-full justify-start gap-3 py-6"
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}

              {/* Categories in Mobile */}
              <div className="p-2">
                <p className="text-sm font-medium mb-2 px-2">Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 4).map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.label}
                        variant="outline"
                        className="justify-start gap-2 py-4"
                        onClick={() => {
                          router.push(
                            `/categories/${category.label.toLowerCase()}`
                          );
                          setIsMenuOpen(false);
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{category.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {!isLoggedIn && (
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogin();
                    }}
                  >
                    Log in
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/register");
                    }}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
