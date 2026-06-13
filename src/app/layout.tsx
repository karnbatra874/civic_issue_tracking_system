import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CivicTrack — Report & Resolve Local Problems",
  description:
    "A transparent, citizen-first civic issue reporting system. Report potholes, broken streetlights, garbage, and more. Track resolution with SLA enforcement and public accountability.",
  keywords: [
    "civic issues",
    "issue tracker",
    "pothole report",
    "municipal complaints",
    "ward officer",
    "public accountability",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
