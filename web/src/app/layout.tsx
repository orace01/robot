import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Providers } from "@/components/providers";
import { site } from "@/lib/site";
import "./globals.css";

// Duo de marque : Satoshi pour le texte, Cabinet Grotesk pour les titres (en attendant After).
const satoshi = localFont({
  variable: "--font-satoshi",
  display: "swap",
  src: [
    { path: "./fonts/satoshi-400.woff2", weight: "400" },
    { path: "./fonts/satoshi-500.woff2", weight: "500" },
    { path: "./fonts/satoshi-700.woff2", weight: "700" },
  ],
});

const cabinet = localFont({
  variable: "--font-cabinet",
  display: "swap",
  src: [
    { path: "./fonts/cabinet-grotesk-500.woff2", weight: "500" },
    { path: "./fonts/cabinet-grotesk-800.woff2", weight: "800" },
  ],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Robots laveurs de vitres`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: { locale: "fr_FR", type: "website", siteName: site.name },
};

export const viewport: Viewport = {
  themeColor: "#f2f3f5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${satoshi.variable} ${cabinet.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh bg-canvas text-ink">
        {/* Lit le chemin de la page : sous Suspense pour le prérendu (Cache Components). */}
        <Suspense fallback={null}>
          <SmoothScroll />
        </Suspense>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
