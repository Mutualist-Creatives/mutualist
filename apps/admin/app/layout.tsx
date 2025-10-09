import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mutualist Admin Dashboard",
  description: "Admin dashboard for managing portfolios",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {session ? (
            <SidebarProvider>
              <AppSidebar user={session.user} />
              <main className="flex-1 w-full">
                <div className="border-b bg-background">
                  <div className="flex h-14 items-center px-4 lg:px-6">
                    <SidebarTrigger />
                  </div>
                </div>
                <div className="flex-1">{children}</div>
              </main>
              <Toaster />
            </SidebarProvider>
          ) : (
            children
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
