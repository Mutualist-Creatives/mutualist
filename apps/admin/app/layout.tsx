import type { Metadata } from "next";
import { Inter, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
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
    <html lang="en">
      <body
        className={`${inter.className} ${instrumentSans.variable} ${instrumentSerif.variable}`}
      >
        <Providers session={session}>
          {session ? (
            <SidebarProvider>
              <AppSidebar user={session.user || { name: "Admin", email: "" }} />
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
        </Providers>
      </body>
    </html>
  );
}
