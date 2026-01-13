import type { Metadata } from "next";
import { Inter, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { AdminBreadcrumb } from "@/components/admin-breadcrumb";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${instrumentSans.variable} ${instrumentSerif.variable}`}
      >
        <Providers session={session}>
          {session ? (
            <SidebarProvider>
              <AppSidebar user={session.user || { name: "Admin", email: "" }} />
              <main className="flex-1 w-full">
                <header className="flex h-14 items-center gap-2 border-b bg-background/95 px-4 lg:px-6 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-30">
                  <SidebarTrigger />
                  <AdminBreadcrumb />
                </header>
                <div className="flex-1">{children}</div>
              </main>
              <Toaster />
            </SidebarProvider>
          ) : (
            children
          )}
        </Providers>
      </body>
    </html>
  );
}
