// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/navbar/NavbarWrapper";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TenunKita - Warisan Budaya Nusantara",
  description: "Platform terpercaya untuk membeli dan menjual kain tenun berkualitas dari seluruh Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <LoadingScreen>
          <NavbarWrapper />
          {children}
        </LoadingScreen>
      </body>
    </html>
  );
}