import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DropAccess (DROPA) | Token-Gated E-Commerce Membership on Solana",
  description:
    "DropAccess is a Solana utility token that unlocks exclusive dropshipping resources, vetted suppliers, tools, and a global entrepreneur community. Hold DROPA to get access.",
  keywords: ["DropAccess", "DROPA", "Solana", "SPL token", "dropshipping", "crypto", "membership", "e-commerce"],
  metadataBase: new URL("https://dropa.dev"),
  openGraph: {
    title: "DropAccess (DROPA) | Token-Gated E-Commerce Membership",
    description: "Hold DROPA to unlock exclusive dropshipping resources and tools on Solana.",
    type: "website",
    url: "https://dropa.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "DropAccess (DROPA)",
    description: "Token-gated e-commerce membership on Solana.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
