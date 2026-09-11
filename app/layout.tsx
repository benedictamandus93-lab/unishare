import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SetupNotice } from "@/components/SetupNotice";
import { SponsorCorner } from "@/components/SponsorCorner";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniShare | University of Auckland student wall",
  description:
    "A student noticeboard for the University of Auckland. Buy, rent and offer services, then contact each other directly.",
};

export const viewport: Viewport = {
  themeColor: "#EBEEE8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NZ">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sheet focus:bg-varsity focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <SetupNotice />
          <Navbar />
          <main id="main" className="mx-auto max-w-wall px-4 py-8 sm:px-6 sm:py-10">
            {children}
          </main>
          <Footer />
          <SponsorCorner />
        </AuthProvider>
      </body>
    </html>
  );
}
