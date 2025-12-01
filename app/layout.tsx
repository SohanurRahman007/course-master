// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/ui/shared/Navbar";
// import Navbar from "@/components/shared/Navbar";
// import ReduxProvider from "@/components/providers/ReduxProvider";

// Use Inter font (Google's most popular font)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CourseMaster - Learn Without Limits",
  description: "A full-featured EdTech platform built with Next.js",
  keywords: ["courses", "education", "learning", "online", "edtech"],
  authors: [{ name: "CourseMaster" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster
            position="top-right"
            richColors
            closeButton
            expand={true}
            duration={4000}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
