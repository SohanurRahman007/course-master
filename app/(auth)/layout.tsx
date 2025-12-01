// app/(auth)/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50`}>
        <div className="min-h-screen">
          {/* Simple header for auth pages only */}
          <header className="py-4 px-6">
            <div className="container mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600"></div>
                  <span className="text-xl font-bold text-gray-800">
                    CourseMaster
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Learn Without Limits
                </div>
              </div>
            </div>
          </header>

          <main>{children}</main>

          {/* Simple footer for auth pages */}
          <footer className="mt-12 py-6 px-4 border-t">
            <div className="container mx-auto text-center text-sm text-gray-500">
              <p>
                © {new Date().getFullYear()} CourseMaster. All rights reserved.
              </p>
              <div className="mt-2 space-x-4">
                <a href="#" className="hover:text-gray-700">
                  Terms
                </a>
                <a href="#" className="hover:text-gray-700">
                  Privacy
                </a>
                <a href="#" className="hover:text-gray-700">
                  Contact
                </a>
                <a href="#" className="hover:text-gray-700">
                  Help
                </a>
              </div>
            </div>
          </footer>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
