import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { site } from "@/lib/site";
import "./globals.css";

// Archivo est variable en largeur : condensée pour les grands titres, normale ailleurs.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
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
    <html lang="fr" data-scroll-behavior="smooth" className={`${archivo.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh bg-canvas text-ink">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
