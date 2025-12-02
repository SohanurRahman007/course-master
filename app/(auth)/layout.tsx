// app/(auth)/layout.tsx - MONOCHROME & THEME-ALIGNED
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Authentication - CourseMaster",
  description: "Login or register to access CourseMaster",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Body Background uses theme's background color
    <div
      className={`${inter.className} antialiased min-h-screen bg-background`}
    >
      {/* Header: Uses Card background and Foreground text */}
      <header className="py-4 px-6 border-b dark:border-border bg-card shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo Link */}
            <Link href="/" className="flex items-center gap-3">
              {/* Logo Icon: Uses Primary background and Primary Foreground text */}
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>

              {/* Brand Name: Uses Foreground text */}
              <span className="text-xl font-bold text-foreground">
                CourseMaster
              </span>
            </Link>

            {/* Tagline: Simple muted text */}
            <div className="text-sm text-muted-foreground hidden sm:block">
              Learn Without Limits
            </div>

            {/* Note: No Main Navigation Links are included here */}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="py-10">{children}</main>

      <Toaster position="top-right" />
    </div>
  );
}
