import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "VAULTA — Premium Bags", template: "%s | VAULTA" },
  description: "Premium bags engineered for extraordinary lives. Lifetime warranty on every product.",
  keywords: ["premium bags", "leather bags", "travel bags", "luxury bags", "VAULTA"],
  openGraph: {
    title: "VAULTA — Premium Bags",
    description: "Premium bags engineered for extraordinary lives.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#B8860B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-page text-primary">{children}</body>
    </html>
  );
}
