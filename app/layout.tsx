import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jasznime - Nonton Anime Subtitle Indonesia",
  description: "Streaming anime terbaru subtitle Indonesia dengan kualitas terbaik.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.className} antialiased bg-base-100 text-white min-h-screen flex flex-col`}>
        <Suspense>
          <ProgressBar />
        </Suspense>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
