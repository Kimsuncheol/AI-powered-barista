import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { AppearanceProvider } from "@/providers/AppearanceProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import ToastProvider from "@/components/notifications/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI-Powered Barista",
  description: "AI-powered coffee ordering experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppRouterCacheProvider options={{ key: "mui" }}>
          <AppearanceProvider>
            <AuthProvider>
              <Header />
              {children}
              {/* TODO: gate ToastProvider with an env flag if we don't want to ship it in production. */}
              <ToastProvider />
            </AuthProvider>
          </AppearanceProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
