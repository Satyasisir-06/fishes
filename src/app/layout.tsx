import type { Metadata, Viewport } from "next";
import { Playfair_Display, Merriweather } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { CartProvider } from "@/components/cart/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import AnimatedBackground from "@/components/layout/AnimatedBackground";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Kicchu | Pet Fish & Accessories",
  description: "Premium mobile-first pet fish and accessories store.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${merriweather.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-primary text-foreground">
        <AnimatedBackground />
        <CartProvider>
          <Navbar />
          <main className="flex-1 flex flex-col relative">{children}</main>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
