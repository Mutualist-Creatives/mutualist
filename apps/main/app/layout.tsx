import type { Metadata } from "next";
import { Parkinsans, Instrument_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import Header from "../components/header";
import Footer from "../components/footer";

const parkinsans = Parkinsans({
  variable: "--font-parkinsans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
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
      <body
        className={`${parkinsans.variable} ${instrumentSans.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
        <LifeAtMutuButton />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W68SREFTLM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W68SREFTLM');
            gtag('config', 'AW-17757960833');
          `}
        </Script>
      </body>
    </html>
  );
}
