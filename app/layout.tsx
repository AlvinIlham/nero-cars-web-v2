import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RealtimeStatus from "@/components/layout/RealtimeStatus";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nero Cars - Your Trusted Car Marketplace",
  description:
    "Find your dream car at the best price. Buy and sell cars with ease on Nero Cars.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RealtimeStatus />
        {children}
      </body>
    </html>
  );
}
