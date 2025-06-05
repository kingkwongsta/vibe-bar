import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { VibeBarProvider } from "./context/vibe-bar-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibe Bar - Craft Your Perfect Cocktail",
  description: "AI-powered cocktail recipes tailored to your taste, ingredients, and mood",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <VibeBarProvider>
          {children}
        </VibeBarProvider>
      </body>
    </html>
  );
}
