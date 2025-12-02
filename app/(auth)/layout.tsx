// app/(auth)/layout.tsx
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
    <div className={`${inter.className} antialiased min-h-screen bg-gray-50`}>
      <header className="py-4 px-6 border-b bg-white shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">
                CourseMaster
              </span>
            </Link>
            <div className="text-sm text-gray-600 hidden sm:block">
              Learn Without Limits
            </div>
          </div>
        </div>
      </header>

      <main className="py-10">{children}</main>

      <Toaster position="top-right" />
    </div>
  );
}
