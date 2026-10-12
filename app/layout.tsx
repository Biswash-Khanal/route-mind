import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RouteMind — smarter routes, less guesswork",
    template: "%s · RouteMind",
  },
  description:
    "Plan your journey across town with the right balance of transit, walking, time and fare.",
  applicationName: "RouteMind",
  openGraph: {
    title: "RouteMind — smarter routes, less guesswork",
    description:
      "Compare transit and walking options side by side: fare, duration, transfers and a leg-by-leg breakdown.",
    type: "website",
    siteName: "RouteMind",
  },
};

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}