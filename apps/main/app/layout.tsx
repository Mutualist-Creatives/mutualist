import type { Metadata } from "next";
import { Parkinsans } from "next/font/google";
import "./globals.css";

import Header from "../components/header";
import Footer from "../components/footer";

const parkinsans = Parkinsans({
  variable: "--font-parkinsans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mutualist Creatives",
  description: "Mutualist Company Profile",
};

import { LifeAtMutuButton } from "../components/life-at-mutu-button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${parkinsans.variable} antialiased`}>
        <Header />
        {children}
        <Footer />
        <LifeAtMutuButton />
      </body>
    </html>
  );
}
