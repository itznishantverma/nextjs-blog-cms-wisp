import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AelVorm - Your Source for News, Knowledge & Insights",
  description: "Stay informed with comprehensive news coverage, expert analysis, interactive quizzes, and engaging content across technology, politics, science, and more.",
  openGraph: {
    title: "AelVorm - Your Source for News, Knowledge & Insights",
    description: "Stay informed with comprehensive news coverage, expert analysis, interactive quizzes, and engaging content across technology, politics, science, and more.",
    images: [
      signOgImageUrl({
        title: "AelVorm",
      }),
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased max-w-6xl m-auto",
          fontSans.variable
        )}
      >
        <Providers>
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
